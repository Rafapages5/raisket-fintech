"""
Endpoints de API para workflows de IA y gestión de documentos.
Incluye operaciones de RAG, gestión de vectores y análisis de documentos.
"""
import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.services.rag_service import rag_service

# Configurar logging
logger = logging.getLogger(__name__)

# Crear router
router = APIRouter(prefix="/workflows", tags=["Workflows"])


# Modelos de request/response
class Document(BaseModel):
    """Modelo para un documento."""
    id: str = Field(..., description="ID único del documento")
    text: str = Field(..., description="Contenido del documento")
    metadata: Optional[Dict[str, Any]] = Field(default={}, description="Metadata adicional")


class UpsertDocumentsRequest(BaseModel):
    """Request para insertar/actualizar documentos."""
    documents: List[Document] = Field(..., description="Lista de documentos a insertar")
    namespace: str = Field(default="default", description="Namespace de Pinecone")


class UpsertDocumentsResponse(BaseModel):
    """Response para insertar/actualizar documentos."""
    success: bool = Field(..., description="Si la operación fue exitosa")
    upserted_count: int = Field(..., description="Número de documentos insertados")
    namespace: str = Field(..., description="Namespace utilizado")


class SearchDocumentsRequest(BaseModel):
    """Request para buscar documentos similares."""
    query: str = Field(..., description="Texto de búsqueda")
    top_k: Optional[int] = Field(None, description="Número de resultados")
    namespace: str = Field(default="default", description="Namespace de Pinecone")
    filter_metadata: Optional[Dict[str, Any]] = Field(None, description="Filtros de metadata")


class SearchDocumentsResponse(BaseModel):
    """Response para búsqueda de documentos."""
    query: str = Field(..., description="Query original")
    results_count: int = Field(..., description="Número de resultados encontrados")
    documents: List[Dict[str, Any]] = Field(..., description="Documentos encontrados")


class DeleteDocumentsRequest(BaseModel):
    """Request para eliminar documentos."""
    ids: List[str] = Field(..., description="IDs de documentos a eliminar")
    namespace: str = Field(default="default", description="Namespace de Pinecone")


class DeleteDocumentsResponse(BaseModel):
    """Response para eliminación de documentos."""
    success: bool = Field(..., description="Si la operación fue exitosa")
    deleted_count: int = Field(..., description="Número de documentos eliminados")
    namespace: str = Field(..., description="Namespace utilizado")


class IndexStatsResponse(BaseModel):
    """Response para estadísticas del índice."""
    total_vector_count: int = Field(..., description="Total de vectores en el índice")
    dimension: int = Field(..., description="Dimensión de los vectores")
    namespaces: Dict[str, Any] = Field(..., description="Estadísticas por namespace")


# Endpoints
@router.post("/documents/upsert", response_model=UpsertDocumentsResponse, status_code=status.HTTP_201_CREATED)
async def upsert_documents(request: UpsertDocumentsRequest) -> UpsertDocumentsResponse:
    """
    Inserta o actualiza documentos en el índice de Pinecone.

    Genera embeddings automáticamente para cada documento.
    """
    try:
        logger.info(f"Request para insertar {len(request.documents)} documentos")

        # Convertir documentos a formato dict
        docs = [
            {
                "id": doc.id,
                "text": doc.text,
                "metadata": doc.metadata or {}
            }
            for doc in request.documents
        ]

        # Hacer upsert
        result = await rag_service.upsert_documents(
            documents=docs,
            namespace=request.namespace
        )

        return UpsertDocumentsResponse(
            success=result["success"],
            upserted_count=result["upserted_count"],
            namespace=result["namespace"]
        )

    except Exception as e:
        logger.error(f"Error en endpoint de upsert: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al insertar documentos: {str(e)}"
        )


@router.post("/documents/search", response_model=SearchDocumentsResponse, status_code=status.HTTP_200_OK)
async def search_documents(request: SearchDocumentsRequest) -> SearchDocumentsResponse:
    """
    Busca documentos similares en el índice de Pinecone.

    Utiliza búsqueda semántica basada en embeddings.
    """
    try:
        logger.info(f"Request de búsqueda: '{request.query[:50]}...'")

        # Buscar documentos
        results = await rag_service.search_similar_documents(
            query=request.query,
            top_k=request.top_k,
            namespace=request.namespace,
            filter_metadata=request.filter_metadata
        )

        return SearchDocumentsResponse(
            query=request.query,
            results_count=len(results),
            documents=results
        )

    except Exception as e:
        logger.error(f"Error en endpoint de búsqueda: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al buscar documentos: {str(e)}"
        )


@router.post("/documents/delete", response_model=DeleteDocumentsResponse, status_code=status.HTTP_200_OK)
async def delete_documents(request: DeleteDocumentsRequest) -> DeleteDocumentsResponse:
    """
    Elimina documentos del índice de Pinecone.

    Elimina documentos por sus IDs.
    """
    try:
        logger.info(f"Request para eliminar {len(request.ids)} documentos")

        # Eliminar documentos
        result = rag_service.delete_documents(
            ids=request.ids,
            namespace=request.namespace
        )

        return DeleteDocumentsResponse(
            success=result["success"],
            deleted_count=result["deleted_count"],
            namespace=result["namespace"]
        )

    except Exception as e:
        logger.error(f"Error en endpoint de eliminación: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar documentos: {str(e)}"
        )


@router.get("/index/stats", response_model=IndexStatsResponse, status_code=status.HTTP_200_OK)
async def get_index_stats() -> IndexStatsResponse:
    """
    Obtiene estadísticas del índice de Pinecone.

    Incluye número total de vectores, dimensión y estadísticas por namespace.
    """
    try:
        logger.info("Request de estadísticas del índice")

        # Obtener estadísticas
        stats = rag_service.get_index_stats()

        return IndexStatsResponse(
            total_vector_count=stats["total_vector_count"],
            dimension=stats["dimension"],
            namespaces=stats["namespaces"]
        )

    except Exception as e:
        logger.error(f"Error en endpoint de estadísticas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener estadísticas: {str(e)}"
        )


@router.get("/health", status_code=status.HTTP_200_OK)
async def workflows_health_check():
    """Health check específico para el módulo de workflows."""
    try:
        # Verificar conexión con Pinecone obteniendo stats
        stats = rag_service.get_index_stats()

        return {
            "status": "healthy",
            "module": "workflows",
            "pinecone_connected": True,
            "total_vectors": stats["total_vector_count"],
            "endpoints": [
                "/workflows/documents/upsert",
                "/workflows/documents/search",
                "/workflows/documents/delete",
                "/workflows/index/stats"
            ]
        }
    except Exception as e:
        logger.error(f"Error en health check de workflows: {e}")
        return {
            "status": "unhealthy",
            "module": "workflows",
            "pinecone_connected": False,
            "error": str(e)
        }
