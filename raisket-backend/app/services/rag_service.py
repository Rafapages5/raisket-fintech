"""
Servicio de RAG (Retrieval-Augmented Generation) usando Pinecone.
Maneja la búsqueda semántica y recuperación de documentos.
"""
import logging
from typing import List, Dict, Any, Optional
from pinecone import Pinecone, ServerlessSpec
from app.core.config import settings
from app.services.llm_service import llm_service

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RAGService:
    """Servicio para búsqueda semántica y RAG usando Pinecone."""

    def __init__(self):
        """Inicializa el cliente de Pinecone y conecta al índice."""
        try:
            self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
            self.index_name = settings.PINECONE_INDEX_NAME

            # Verificar si el índice existe, si no, crear uno
            self._ensure_index_exists()

            # Conectar al índice
            self.index = self.pc.Index(self.index_name)
            logger.info(f"Conectado al índice de Pinecone: {self.index_name}")

        except Exception as e:
            logger.error(f"Error al inicializar Pinecone: {e}")
            raise

    def _ensure_index_exists(self) -> None:
        """Asegura que el índice de Pinecone exista, si no lo crea."""
        try:
            existing_indexes = [index.name for index in self.pc.list_indexes()]

            if self.index_name not in existing_indexes:
                logger.info(f"Creando nuevo índice: {self.index_name}")
                self.pc.create_index(
                    name=self.index_name,
                    dimension=1536,  # Dimensión para text-embedding-3-small
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region=settings.PINECONE_ENVIRONMENT
                    )
                )
                logger.info(f"Índice {self.index_name} creado exitosamente")
            else:
                logger.info(f"Índice {self.index_name} ya existe")

        except Exception as e:
            logger.error(f"Error al verificar/crear índice: {e}")
            raise

    async def upsert_documents(
        self,
        documents: List[Dict[str, Any]],
        namespace: str = "default"
    ) -> Dict[str, Any]:
        """
        Inserta o actualiza documentos en Pinecone.

        Args:
            documents: Lista de documentos con formato:
                [{"id": "doc1", "text": "contenido...", "metadata": {...}}]
            namespace: Namespace de Pinecone (por defecto "default")

        Returns:
            Resultado de la operación de upsert

        Raises:
            Exception: Si hay un error al insertar los documentos
        """
        try:
            logger.info(f"Procesando {len(documents)} documentos para upsert")

            # Extraer textos para generar embeddings
            texts = [doc["text"] for doc in documents]

            # Generar embeddings
            embeddings = await llm_service.generate_embeddings(texts)

            # Preparar vectores para Pinecone
            vectors = []
            for i, doc in enumerate(documents):
                vector = {
                    "id": doc["id"],
                    "values": embeddings[i],
                    "metadata": {
                        "text": doc["text"],
                        **(doc.get("metadata", {}))
                    }
                }
                vectors.append(vector)

            # Hacer upsert a Pinecone
            upsert_response = self.index.upsert(
                vectors=vectors,
                namespace=namespace
            )

            logger.info(f"Upsert completado: {upsert_response.upserted_count} vectores")

            return {
                "success": True,
                "upserted_count": upsert_response.upserted_count,
                "namespace": namespace
            }

        except Exception as e:
            logger.error(f"Error al hacer upsert de documentos: {e}")
            raise Exception(f"Error en upsert: {str(e)}")

    async def search_similar_documents(
        self,
        query: str,
        top_k: Optional[int] = None,
        namespace: str = "default",
        filter_metadata: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Busca documentos similares a una consulta.

        Args:
            query: Texto de consulta
            top_k: Número de resultados a retornar (por defecto settings.TOP_K_RESULTS)
            namespace: Namespace de Pinecone
            filter_metadata: Filtros de metadata opcionales

        Returns:
            Lista de documentos similares con sus scores

        Raises:
            Exception: Si hay un error en la búsqueda
        """
        try:
            top_k = top_k or settings.TOP_K_RESULTS

            logger.info(f"Buscando documentos similares para query: '{query[:50]}...'")

            # Generar embedding de la query
            query_embeddings = await llm_service.generate_embeddings([query])
            query_embedding = query_embeddings[0]

            # Buscar en Pinecone
            search_kwargs: Dict[str, Any] = {
                "vector": query_embedding,
                "top_k": top_k,
                "namespace": namespace,
                "include_metadata": True
            }

            if filter_metadata:
                search_kwargs["filter"] = filter_metadata

            results = self.index.query(**search_kwargs)

            # Filtrar por umbral de similitud y formatear resultados
            similar_docs = []
            for match in results.matches:
                if match.score >= settings.SIMILARITY_THRESHOLD:
                    doc = {
                        "id": match.id,
                        "score": match.score,
                        "text": match.metadata.get("text", ""),
                        "metadata": {
                            k: v for k, v in match.metadata.items()
                            if k != "text"
                        }
                    }
                    similar_docs.append(doc)

            logger.info(f"Encontrados {len(similar_docs)} documentos similares")

            return similar_docs

        except Exception as e:
            logger.error(f"Error al buscar documentos similares: {e}")
            raise Exception(f"Error en búsqueda: {str(e)}")

    async def generate_rag_response(
        self,
        query: str,
        top_k: Optional[int] = None,
        namespace: str = "default",
        system_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Genera una respuesta RAG completa (búsqueda + generación).

        Args:
            query: Consulta del usuario
            top_k: Número de documentos a recuperar
            namespace: Namespace de Pinecone
            system_prompt: Prompt de sistema personalizado

        Returns:
            Diccionario con la respuesta y documentos utilizados

        Raises:
            Exception: Si hay un error al generar la respuesta
        """
        try:
            logger.info(f"Generando respuesta RAG para: '{query[:50]}...'")

            # Buscar documentos relevantes
            similar_docs = await self.search_similar_documents(
                query=query,
                top_k=top_k,
                namespace=namespace
            )

            # Construir contexto a partir de documentos
            context = "\n\n".join([
                f"Documento {i+1} (relevancia: {doc['score']:.2f}):\n{doc['text']}"
                for i, doc in enumerate(similar_docs)
            ])

            # Construir prompt
            if not system_prompt:
                system_prompt = (
                    "Eres un asistente útil de Raisket. "
                    "Responde las preguntas basándote en el contexto proporcionado. "
                    "Si la información no está en el contexto, indícalo claramente."
                )

            user_message = (
                f"Contexto:\n{context}\n\n"
                f"Pregunta: {query}\n\n"
                f"Por favor, responde basándote en el contexto proporcionado."
            )

            messages = [{"role": "user", "content": user_message}]

            # Generar respuesta con LLM
            response = await llm_service.generate_completion_anthropic(
                messages=messages,
                system=system_prompt
            )

            logger.info("Respuesta RAG generada exitosamente")

            return {
                "response": response,
                "sources": similar_docs,
                "query": query,
                "documents_used": len(similar_docs)
            }

        except Exception as e:
            logger.error(f"Error al generar respuesta RAG: {e}")
            raise Exception(f"Error en RAG: {str(e)}")

    def delete_documents(
        self,
        ids: List[str],
        namespace: str = "default"
    ) -> Dict[str, Any]:
        """
        Elimina documentos del índice.

        Args:
            ids: Lista de IDs de documentos a eliminar
            namespace: Namespace de Pinecone

        Returns:
            Resultado de la operación

        Raises:
            Exception: Si hay un error al eliminar
        """
        try:
            logger.info(f"Eliminando {len(ids)} documentos")

            self.index.delete(ids=ids, namespace=namespace)

            logger.info("Documentos eliminados exitosamente")

            return {
                "success": True,
                "deleted_count": len(ids),
                "namespace": namespace
            }

        except Exception as e:
            logger.error(f"Error al eliminar documentos: {e}")
            raise Exception(f"Error en eliminación: {str(e)}")

    def get_index_stats(self) -> Dict[str, Any]:
        """
        Obtiene estadísticas del índice de Pinecone.

        Returns:
            Estadísticas del índice

        Raises:
            Exception: Si hay un error al obtener las estadísticas
        """
        try:
            stats = self.index.describe_index_stats()

            return {
                "total_vector_count": stats.total_vector_count,
                "dimension": stats.dimension,
                "namespaces": stats.namespaces
            }

        except Exception as e:
            logger.error(f"Error al obtener estadísticas: {e}")
            raise Exception(f"Error en estadísticas: {str(e)}")

    def format_context(self, documents: List[Dict[str, Any]]) -> str:
        """
        Formatea una lista de documentos en un string de contexto para el LLM.

        Args:
            documents: Lista de documentos con formato:
                [{"id": "...", "score": 0.9, "text": "...", "metadata": {...}}]

        Returns:
            String formateado con el contexto de los documentos

        Raises:
            Exception: Si hay un error al formatear
        """
        try:
            if not documents:
                return ""

            logger.info(f"Formateando {len(documents)} documentos como contexto")

            context_parts = []
            for i, doc in enumerate(documents, 1):
                score = doc.get("score", 0)
                text = doc.get("text", "")
                metadata = doc.get("metadata", {})

                # Formatear cada documento
                doc_text = f"[Fuente {i} - Relevancia: {score:.2%}]\n{text}"

                # Agregar metadata relevante si existe
                if metadata:
                    metadata_str = ", ".join([f"{k}: {v}" for k, v in metadata.items()])
                    doc_text += f"\nMetadata: {metadata_str}"

                context_parts.append(doc_text)

            context = "\n\n---\n\n".join(context_parts)
            logger.info(f"Contexto formateado: {len(context)} caracteres")

            return context

        except Exception as e:
            logger.error(f"Error al formatear contexto: {e}")
            return ""

    async def search(
        self,
        query: str,
        top_k: int = 5,
        namespace: str = "default"
    ) -> str:
        """
        Método simplificado de búsqueda que retorna contexto formateado.

        Args:
            query: Consulta de búsqueda
            top_k: Número de resultados
            namespace: Namespace de Pinecone

        Returns:
            Contexto formateado como string

        Raises:
            Exception: Si hay un error en la búsqueda
        """
        try:
            logger.info(f"Búsqueda simplificada: '{query[:50]}...'")

            # Buscar documentos similares
            documents = await self.search_similar_documents(
                query=query,
                top_k=top_k,
                namespace=namespace
            )

            # Formatear y retornar contexto
            return self.format_context(documents)

        except Exception as e:
            logger.error(f"Error en búsqueda simplificada: {e}")
            # Retornar string vacío en lugar de fallar
            return ""


# Instancia global del servicio
rag_service = RAGService()
