"""
Endpoints de API para funcionalidad de chat.
Incluye chat simple, streaming y chat con RAG.
"""
import logging
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from app.services.llm_service import llm_service
from app.services.rag_service import rag_service

# Configurar logging
logger = logging.getLogger(__name__)

# Crear router
router = APIRouter(prefix="/chat", tags=["Chat"])


# Modelos de request/response
class Message(BaseModel):
    """Modelo para un mensaje de chat."""
    role: str = Field(..., description="Rol del mensaje: 'user' o 'assistant'")
    content: str = Field(..., description="Contenido del mensaje")


class ChatRequest(BaseModel):
    """Request para chat simple."""
    messages: List[Message] = Field(..., description="Lista de mensajes de la conversación")
    model: Optional[str] = Field(None, description="Modelo a usar (opcional)")
    temperature: Optional[float] = Field(None, description="Temperatura del modelo (0.0-1.0)")
    max_tokens: Optional[int] = Field(None, description="Máximo de tokens")
    system: Optional[str] = Field(None, description="Mensaje de sistema")
    provider: str = Field(default="anthropic", description="Proveedor: 'anthropic' o 'openai'")


class ChatResponse(BaseModel):
    """Response para chat simple."""
    response: str = Field(..., description="Respuesta generada")
    model: str = Field(..., description="Modelo utilizado")
    message_count: int = Field(..., description="Número de mensajes en la conversación")


class RAGChatRequest(BaseModel):
    """Request para chat con RAG."""
    query: str = Field(..., description="Consulta del usuario")
    top_k: Optional[int] = Field(None, description="Número de documentos a recuperar")
    namespace: str = Field(default="default", description="Namespace de Pinecone")
    system_prompt: Optional[str] = Field(None, description="Prompt de sistema personalizado")


class RAGChatResponse(BaseModel):
    """Response para chat con RAG."""
    response: str = Field(..., description="Respuesta generada")
    query: str = Field(..., description="Consulta original")
    documents_used: int = Field(..., description="Número de documentos utilizados")
    sources: List[dict] = Field(..., description="Documentos fuente utilizados")


# Endpoints
@router.post("/", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Endpoint de chat simple sin RAG.

    Soporta tanto Anthropic Claude como OpenAI GPT.
    """
    try:
        logger.info(f"Request de chat recibido con {len(request.messages)} mensajes")

        # Convertir mensajes a formato dict
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]

        # Generar respuesta según el proveedor
        if request.provider.lower() == "anthropic":
            response_text = await llm_service.generate_completion_anthropic(
                messages=messages,
                model=request.model,
                max_tokens=request.max_tokens,
                temperature=request.temperature,
                system=request.system
            )
            model_used = request.model or "claude-3-5-sonnet-20241022"
        elif request.provider.lower() == "openai":
            response_text = await llm_service.generate_completion_openai(
                messages=messages,
                model=request.model or "gpt-4-turbo-preview",
                max_tokens=request.max_tokens,
                temperature=request.temperature
            )
            model_used = request.model or "gpt-4-turbo-preview"
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Proveedor no soportado: {request.provider}"
            )

        return ChatResponse(
            response=response_text,
            model=model_used,
            message_count=len(request.messages)
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en endpoint de chat: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar el chat: {str(e)}"
        )


@router.post("/stream", status_code=status.HTTP_200_OK)
async def chat_stream(request: ChatRequest):
    """
    Endpoint de chat con streaming.

    Retorna la respuesta en tiempo real a medida que se genera.
    """
    try:
        logger.info(f"Request de chat streaming recibido")

        # Convertir mensajes a formato dict
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]

        async def generate():
            try:
                if request.provider.lower() == "anthropic":
                    async for chunk in llm_service.stream_completion_anthropic(
                        messages=messages,
                        model=request.model,
                        max_tokens=request.max_tokens,
                        temperature=request.temperature,
                        system=request.system
                    ):
                        yield chunk
                elif request.provider.lower() == "openai":
                    async for chunk in llm_service.stream_completion_openai(
                        messages=messages,
                        model=request.model or "gpt-4-turbo-preview",
                        max_tokens=request.max_tokens,
                        temperature=request.temperature
                    ):
                        yield chunk
                else:
                    yield f"Error: Proveedor no soportado: {request.provider}"
            except Exception as e:
                logger.error(f"Error en streaming: {e}")
                yield f"Error: {str(e)}"

        return StreamingResponse(
            generate(),
            media_type="text/plain"
        )

    except Exception as e:
        logger.error(f"Error en endpoint de streaming: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al iniciar streaming: {str(e)}"
        )


@router.post("/rag", response_model=RAGChatResponse, status_code=status.HTTP_200_OK)
async def chat_with_rag(request: RAGChatRequest) -> RAGChatResponse:
    """
    Endpoint de chat con RAG (Retrieval-Augmented Generation).

    Busca documentos relevantes en Pinecone y genera una respuesta basada en ellos.
    """
    try:
        logger.info(f"Request de chat RAG recibido: '{request.query[:50]}...'")

        # Generar respuesta RAG
        rag_result = await rag_service.generate_rag_response(
            query=request.query,
            top_k=request.top_k,
            namespace=request.namespace,
            system_prompt=request.system_prompt
        )

        return RAGChatResponse(
            response=rag_result["response"],
            query=rag_result["query"],
            documents_used=rag_result["documents_used"],
            sources=rag_result["sources"]
        )

    except Exception as e:
        logger.error(f"Error en endpoint de RAG: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar chat con RAG: {str(e)}"
        )


class MessageRequest(BaseModel):
    """Request para endpoint /message simplificado."""
    message: str = Field(..., description="Mensaje del usuario", min_length=1)
    chat_id: Optional[str] = Field(None, description="ID del chat (para mantener contexto)")
    use_rag: bool = Field(default=True, description="Usar RAG para contexto adicional")
    chat_history: Optional[List[Message]] = Field(default=None, description="Historial de conversación")


class MessageResponse(BaseModel):
    """Response para endpoint /message."""
    response: str = Field(..., description="Respuesta del asistente")
    chat_id: str = Field(..., description="ID del chat")
    sources: Optional[List[dict]] = Field(default=None, description="Fuentes usadas (si se usó RAG)")
    context_used: bool = Field(..., description="Si se utilizó contexto de RAG")


@router.post("/message", response_model=MessageResponse, status_code=status.HTTP_200_OK)
async def send_message(request: MessageRequest) -> MessageResponse:
    """
    Endpoint simplificado para enviar mensajes al asistente Raisket.

    Automáticamente usa RAG si use_rag=True. Maneja historial de conversación.
    """
    try:
        logger.info(f"Request de mensaje recibido: '{request.message[:100]}...'")

        # Generar chat_id si no existe
        import uuid
        chat_id = request.chat_id or str(uuid.uuid4())

        # Convertir historial a formato dict si existe
        history = []
        if request.chat_history:
            history = [{"role": msg.role, "content": msg.content} for msg in request.chat_history]

        # Decidir si usar RAG o no
        if request.use_rag:
            try:
                # Intentar con RAG
                result = await llm_service.chat_with_rag(message=request.message)

                return MessageResponse(
                    response=result["response"],
                    chat_id=chat_id,
                    sources=result.get("sources"),
                    context_used=result.get("context_used", False)
                )
            except Exception as e:
                logger.warning(f"RAG falló, usando chat sin contexto: {e}")
                # Fallback a chat normal
                response = await llm_service.chat(
                    message=request.message,
                    chat_history=history
                )

                return MessageResponse(
                    response=response,
                    chat_id=chat_id,
                    sources=None,
                    context_used=False
                )
        else:
            # Chat sin RAG
            response = await llm_service.chat(
                message=request.message,
                chat_history=history
            )

            return MessageResponse(
                response=response,
                chat_id=chat_id,
                sources=None,
                context_used=False
            )

    except Exception as e:
        logger.error(f"Error en endpoint /message: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar el mensaje: {str(e)}"
        )


@router.post("/message/stream", status_code=status.HTTP_200_OK)
async def send_message_stream(request: MessageRequest):
    """
    Endpoint simplificado de streaming para enviar mensajes.

    Retorna la respuesta en tiempo real. Si use_rag=True, busca contexto primero.
    """
    try:
        logger.info(f"Request de mensaje streaming recibido")

        # Convertir historial a formato dict si existe
        history = []
        if request.chat_history:
            history = [{"role": msg.role, "content": msg.content} for msg in request.chat_history]

        async def generate():
            try:
                context = ""

                # Buscar contexto si se solicita RAG
                if request.use_rag:
                    try:
                        from app.services.rag_service import rag_service
                        similar_docs = await rag_service.search_similar_documents(
                            query=request.message,
                            top_k=3
                        )
                        context = rag_service.format_context(similar_docs)
                    except Exception as e:
                        logger.warning(f"No se pudo obtener contexto RAG: {e}")

                # Stream la respuesta
                async for chunk in llm_service.chat_stream(
                    message=request.message,
                    context=context,
                    chat_history=history
                ):
                    yield chunk

            except Exception as e:
                logger.error(f"Error en streaming de mensaje: {e}")
                yield f"\n\n[Error: {str(e)}]"

        return StreamingResponse(
            generate(),
            media_type="text/plain"
        )

    except Exception as e:
        logger.error(f"Error en endpoint /message/stream: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al iniciar streaming: {str(e)}"
        )


@router.get("/health", status_code=status.HTTP_200_OK)
async def chat_health_check():
    """Health check específico para el módulo de chat."""
    return {
        "status": "healthy",
        "module": "chat",
        "endpoints": ["/chat", "/chat/stream", "/chat/rag", "/chat/message", "/chat/message/stream"]
    }
