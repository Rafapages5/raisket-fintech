"""
Servicio de LLM para interactuar con modelos de lenguaje.
Soporta Anthropic Claude y OpenAI GPT.
"""
import logging
from typing import List, Dict, Any, Optional, AsyncIterator
from anthropic import AsyncAnthropic
from openai import AsyncOpenAI
from app.core.config import settings

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LLMService:
    """Servicio para interactuar con modelos de lenguaje."""

    def __init__(self):
        """Inicializa los clientes de Anthropic y OpenAI."""
        try:
            self.anthropic_client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            logger.info("Clientes de LLM inicializados correctamente")
        except Exception as e:
            logger.error(f"Error al inicializar clientes de LLM: {e}")
            raise

    async def generate_completion_anthropic(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        system: Optional[str] = None,
    ) -> str:
        """
        Genera una respuesta usando Claude de Anthropic.

        Args:
            messages: Lista de mensajes en formato [{"role": "user", "content": "..."}]
            model: Modelo a usar (por defecto usa settings.DEFAULT_MODEL)
            max_tokens: Máximo de tokens (por defecto usa settings.MAX_TOKENS)
            temperature: Temperatura del modelo (por defecto usa settings.TEMPERATURE)
            system: Mensaje de sistema opcional

        Returns:
            Respuesta generada por el modelo

        Raises:
            Exception: Si hay un error al generar la respuesta
        """
        try:
            model = model or settings.DEFAULT_MODEL
            max_tokens = max_tokens or settings.MAX_TOKENS
            temperature = temperature or settings.TEMPERATURE

            logger.info(f"Generando respuesta con Claude ({model})")

            kwargs: Dict[str, Any] = {
                "model": model,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": messages,
            }

            if system:
                kwargs["system"] = system

            response = await self.anthropic_client.messages.create(**kwargs)

            content = response.content[0].text
            logger.info(f"Respuesta generada exitosamente ({len(content)} caracteres)")

            return content

        except Exception as e:
            logger.error(f"Error al generar respuesta con Anthropic: {e}")
            raise Exception(f"Error en LLM Anthropic: {str(e)}")

    async def stream_completion_anthropic(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        system: Optional[str] = None,
    ) -> AsyncIterator[str]:
        """
        Genera una respuesta en streaming usando Claude de Anthropic.

        Args:
            messages: Lista de mensajes
            model: Modelo a usar
            max_tokens: Máximo de tokens
            temperature: Temperatura del modelo
            system: Mensaje de sistema opcional

        Yields:
            Fragmentos de texto a medida que se generan

        Raises:
            Exception: Si hay un error al generar la respuesta
        """
        try:
            model = model or settings.DEFAULT_MODEL
            max_tokens = max_tokens or settings.MAX_TOKENS
            temperature = temperature or settings.TEMPERATURE

            logger.info(f"Iniciando streaming con Claude ({model})")

            kwargs: Dict[str, Any] = {
                "model": model,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": messages,
            }

            if system:
                kwargs["system"] = system

            async with self.anthropic_client.messages.stream(**kwargs) as stream:
                async for text in stream.text_stream:
                    yield text

            logger.info("Streaming completado exitosamente")

        except Exception as e:
            logger.error(f"Error en streaming con Anthropic: {e}")
            raise Exception(f"Error en streaming Anthropic: {str(e)}")

    async def generate_completion_openai(
        self,
        messages: List[Dict[str, str]],
        model: str = "gpt-4-turbo-preview",
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
    ) -> str:
        """
        Genera una respuesta usando GPT de OpenAI.

        Args:
            messages: Lista de mensajes en formato OpenAI
            model: Modelo a usar
            max_tokens: Máximo de tokens
            temperature: Temperatura del modelo

        Returns:
            Respuesta generada por el modelo

        Raises:
            Exception: Si hay un error al generar la respuesta
        """
        try:
            max_tokens = max_tokens or settings.MAX_TOKENS
            temperature = temperature or settings.TEMPERATURE

            logger.info(f"Generando respuesta con OpenAI ({model})")

            response = await self.openai_client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
            )

            content = response.choices[0].message.content or ""
            logger.info(f"Respuesta generada exitosamente ({len(content)} caracteres)")

            return content

        except Exception as e:
            logger.error(f"Error al generar respuesta con OpenAI: {e}")
            raise Exception(f"Error en LLM OpenAI: {str(e)}")

    async def stream_completion_openai(
        self,
        messages: List[Dict[str, str]],
        model: str = "gpt-4-turbo-preview",
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
    ) -> AsyncIterator[str]:
        """
        Genera una respuesta en streaming usando GPT de OpenAI.

        Args:
            messages: Lista de mensajes
            model: Modelo a usar
            max_tokens: Máximo de tokens
            temperature: Temperatura del modelo

        Yields:
            Fragmentos de texto a medida que se generan

        Raises:
            Exception: Si hay un error al generar la respuesta
        """
        try:
            max_tokens = max_tokens or settings.MAX_TOKENS
            temperature = temperature or settings.TEMPERATURE

            logger.info(f"Iniciando streaming con OpenAI ({model})")

            stream = await self.openai_client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
                stream=True,
            )

            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

            logger.info("Streaming completado exitosamente")

        except Exception as e:
            logger.error(f"Error en streaming con OpenAI: {e}")
            raise Exception(f"Error en streaming OpenAI: {str(e)}")

    async def generate_embeddings(
        self,
        texts: List[str],
        model: str = "text-embedding-3-small"
    ) -> List[List[float]]:
        """
        Genera embeddings usando OpenAI.

        Args:
            texts: Lista de textos para generar embeddings
            model: Modelo de embeddings a usar

        Returns:
            Lista de vectores de embeddings

        Raises:
            Exception: Si hay un error al generar los embeddings
        """
        try:
            logger.info(f"Generando embeddings para {len(texts)} textos")

            response = await self.openai_client.embeddings.create(
                model=model,
                input=texts,
            )

            embeddings = [data.embedding for data in response.data]
            logger.info(f"Embeddings generados exitosamente")

            return embeddings

        except Exception as e:
            logger.error(f"Error al generar embeddings: {e}")
            raise Exception(f"Error en generación de embeddings: {str(e)}")

    async def chat(
        self,
        message: str,
        context: str = "",
        chat_history: List[Dict[str, str]] = None
    ) -> str:
        """
        Método de chat conversacional para Raisket con system prompt personalizado.

        Args:
            message: Mensaje del usuario
            context: Contexto adicional de RAG (opcional)
            chat_history: Historial de conversación previo

        Returns:
            Respuesta del asistente

        Raises:
            Exception: Si hay un error al generar la respuesta
        """
        try:
            if chat_history is None:
                chat_history = []

            logger.info(f"Chat request: {message[:100]}...")

            # System prompt personalizado para Raisket
            system_prompt = """Eres Raisket, un asesor financiero inteligente especializado en finanzas personales para el mercado mexicano.

Tu misión es ayudar a las personas a tomar mejores decisiones financieras de manera amigable, clara y accesible.

Características de tu personalidad:
- Eres amigable, empático y profesional
- Hablas de manera clara, evitando jerga técnica innecesaria
- Proporcionas consejos prácticos y accionables
- Estás actualizado en el contexto financiero mexicano (tasas, productos, regulaciones)
- Eres objetivo y no promocionas productos específicos
- Priorizas la educación financiera

Cuando respondas:
1. Sé conciso pero completo
2. Usa ejemplos con pesos mexicanos (MXN)
3. Si mencionas porcentajes o tasas, explica su significado
4. Ofrece pasos concretos que el usuario pueda seguir
5. Si no tienes información suficiente, pide más detalles
6. Si el usuario necesita asesoría legal o fiscal compleja, recomienda consultar un profesional

Temas en los que puedes ayudar:
- Presupuestos y ahorro
- Manejo de deudas
- Inversiones básicas (CETES, fondos, etc.)
- Créditos (tarjetas, hipotecarios, personales)
- Educación financiera general
- Planificación financiera personal"""

            # Construir mensajes
            messages = []

            # Agregar historial de conversación
            for hist_msg in chat_history:
                messages.append(hist_msg)

            # Construir mensaje del usuario con contexto si existe
            user_content = message
            if context:
                user_content = f"Contexto relevante:\n{context}\n\nPregunta del usuario: {message}"

            messages.append({"role": "user", "content": user_content})

            # Generar respuesta
            response = await self.generate_completion_anthropic(
                messages=messages,
                system=system_prompt
            )

            logger.info("Respuesta de chat generada exitosamente")
            return response

        except Exception as e:
            logger.error(f"Error en método chat: {e}")
            raise Exception(f"Error en chat: {str(e)}")

    async def chat_with_rag(self, message: str) -> Dict[str, Any]:
        """
        Chat que automáticamente busca contexto relevante en RAG.

        Args:
            message: Mensaje del usuario

        Returns:
            Diccionario con respuesta y fuentes utilizadas

        Raises:
            Exception: Si hay un error al generar la respuesta
        """
        try:
            logger.info(f"Chat con RAG request: {message[:100]}...")

            # Importar RAGService aquí para evitar dependencias circulares
            from app.services.rag_service import rag_service

            # Buscar contexto relevante
            similar_docs = await rag_service.search_similar_documents(
                query=message,
                top_k=3
            )

            # Formatear contexto
            context = rag_service.format_context(similar_docs)

            # Generar respuesta con contexto
            response = await self.chat(
                message=message,
                context=context
            )

            return {
                "response": response,
                "sources": similar_docs,
                "context_used": len(similar_docs) > 0
            }

        except Exception as e:
            logger.error(f"Error en chat_with_rag: {e}")
            # Si falla RAG, intentar responder sin contexto
            logger.info("Fallback: respondiendo sin RAG")
            response = await self.chat(message=message)
            return {
                "response": response,
                "sources": [],
                "context_used": False
            }

    async def chat_stream(
        self,
        message: str,
        context: str = "",
        chat_history: List[Dict[str, str]] = None
    ) -> AsyncIterator[str]:
        """
        Versión streaming del método chat.

        Args:
            message: Mensaje del usuario
            context: Contexto adicional de RAG (opcional)
            chat_history: Historial de conversación previo

        Yields:
            Fragmentos de la respuesta en tiempo real

        Raises:
            Exception: Si hay un error al generar la respuesta
        """
        try:
            if chat_history is None:
                chat_history = []

            logger.info(f"Chat stream request: {message[:100]}...")

            # System prompt de Raisket (mismo que en chat())
            system_prompt = """Eres Raisket, un asesor financiero inteligente especializado en finanzas personales para el mercado mexicano.

Tu misión es ayudar a las personas a tomar mejores decisiones financieras de manera amigable, clara y accesible.

Características de tu personalidad:
- Eres amigable, empático y profesional
- Hablas de manera clara, evitando jerga técnica innecesaria
- Proporcionas consejos prácticos y accionables
- Estás actualizado en el contexto financiero mexicano (tasas, productos, regulaciones)
- Eres objetivo y no promocionas productos específicos
- Priorizas la educación financiera

Cuando respondas:
1. Sé conciso pero completo
2. Usa ejemplos con pesos mexicanos (MXN)
3. Si mencionas porcentajes o tasas, explica su significado
4. Ofrece pasos concretos que el usuario pueda seguir
5. Si no tienes información suficiente, pide más detalles
6. Si el usuario necesita asesoría legal o fiscal compleja, recomienda consultar un profesional

Temas en los que puedes ayudar:
- Presupuestos y ahorro
- Manejo de deudas
- Inversiones básicas (CETES, fondos, etc.)
- Créditos (tarjetas, hipotecarios, personales)
- Educación financiera general
- Planificación financiera personal"""

            # Construir mensajes
            messages = []
            for hist_msg in chat_history:
                messages.append(hist_msg)

            user_content = message
            if context:
                user_content = f"Contexto relevante:\n{context}\n\nPregunta del usuario: {message}"

            messages.append({"role": "user", "content": user_content})

            # Stream respuesta
            async for chunk in self.stream_completion_anthropic(
                messages=messages,
                system=system_prompt
            ):
                yield chunk

            logger.info("Streaming completado exitosamente")

        except Exception as e:
            logger.error(f"Error en chat_stream: {e}")
            raise Exception(f"Error en streaming: {str(e)}")


# Instancia global del servicio
llm_service = LLMService()
