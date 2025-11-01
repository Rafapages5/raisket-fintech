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


# Instancia global del servicio
llm_service = LLMService()
