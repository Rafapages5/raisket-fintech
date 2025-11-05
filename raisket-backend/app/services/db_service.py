"""
Servicio de base de datos para interactuar con Supabase.
Maneja operaciones CRUD para chats y mensajes.
"""
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from supabase import create_client, Client
from app.core.config import settings

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DatabaseService:
    """Servicio para interactuar con Supabase."""

    def __init__(self):
        """Inicializa el cliente de Supabase."""
        try:
            self.client: Client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_KEY
            )
            logger.info("Cliente de Supabase inicializado correctamente")
        except Exception as e:
            logger.error(f"Error al inicializar cliente de Supabase: {e}")
            raise

    async def create_chat(
        self,
        user_id: Optional[str] = None,
        title: str = "Nueva conversación",
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Crea un nuevo chat en la base de datos.

        Args:
            user_id: ID del usuario (opcional, None para usuarios anónimos)
            title: Título del chat
            metadata: Metadata adicional

        Returns:
            Diccionario con los datos del chat creado

        Raises:
            Exception: Si hay un error al crear el chat
        """
        try:
            data = {
                "title": title,
                "metadata": metadata or {}
            }

            if user_id:
                data["user_id"] = user_id

            response = self.client.table("chats").insert(data).execute()

            chat = response.data[0] if response.data else None

            if chat:
                logger.info(f"Chat creado: {chat['id']}")
                return chat
            else:
                raise Exception("No se recibieron datos del chat creado")

        except Exception as e:
            logger.error(f"Error al crear chat: {e}")
            raise Exception(f"Error al crear chat: {str(e)}")

    async def get_chat(self, chat_id: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un chat por su ID.

        Args:
            chat_id: ID del chat

        Returns:
            Diccionario con los datos del chat o None si no existe

        Raises:
            Exception: Si hay un error al obtener el chat
        """
        try:
            response = self.client.table("chats").select("*").eq("id", chat_id).execute()

            chat = response.data[0] if response.data else None

            if chat:
                logger.info(f"Chat obtenido: {chat_id}")
            else:
                logger.warning(f"Chat no encontrado: {chat_id}")

            return chat

        except Exception as e:
            logger.error(f"Error al obtener chat: {e}")
            raise Exception(f"Error al obtener chat: {str(e)}")

    async def get_user_chats(
        self,
        user_id: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Obtiene los chats de un usuario.

        Args:
            user_id: ID del usuario (None para todos los chats anónimos)
            limit: Límite de resultados

        Returns:
            Lista de chats

        Raises:
            Exception: Si hay un error al obtener los chats
        """
        try:
            query = self.client.table("chats").select("*")

            if user_id:
                query = query.eq("user_id", user_id)
            else:
                query = query.is_("user_id", "null")

            response = query.order("updated_at", desc=True).limit(limit).execute()

            chats = response.data or []
            logger.info(f"Chats obtenidos: {len(chats)}")

            return chats

        except Exception as e:
            logger.error(f"Error al obtener chats del usuario: {e}")
            raise Exception(f"Error al obtener chats: {str(e)}")

    async def save_message(
        self,
        chat_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Guarda un mensaje en la base de datos.

        Args:
            chat_id: ID del chat
            role: Rol del mensaje ('user', 'assistant', 'system')
            content: Contenido del mensaje
            metadata: Metadata adicional (modelo, tokens, etc.)

        Returns:
            Diccionario con los datos del mensaje guardado

        Raises:
            Exception: Si hay un error al guardar el mensaje
        """
        try:
            data = {
                "chat_id": chat_id,
                "role": role,
                "content": content,
                "metadata": metadata or {}
            }

            response = self.client.table("messages").insert(data).execute()

            message = response.data[0] if response.data else None

            if message:
                logger.info(f"Mensaje guardado en chat {chat_id}: {role}")
                return message
            else:
                raise Exception("No se recibieron datos del mensaje guardado")

        except Exception as e:
            logger.error(f"Error al guardar mensaje: {e}")
            raise Exception(f"Error al guardar mensaje: {str(e)}")

    async def get_chat_messages(
        self,
        chat_id: str,
        limit: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Obtiene todos los mensajes de un chat.

        Args:
            chat_id: ID del chat
            limit: Límite de mensajes (opcional)

        Returns:
            Lista de mensajes ordenados cronológicamente

        Raises:
            Exception: Si hay un error al obtener los mensajes
        """
        try:
            query = self.client.table("messages").select("*").eq("chat_id", chat_id).order("created_at", desc=False)

            if limit:
                query = query.limit(limit)

            response = query.execute()

            messages = response.data or []
            logger.info(f"Mensajes obtenidos del chat {chat_id}: {len(messages)}")

            return messages

        except Exception as e:
            logger.error(f"Error al obtener mensajes: {e}")
            raise Exception(f"Error al obtener mensajes: {str(e)}")

    async def get_chat_history(self, chat_id: str) -> List[Dict[str, str]]:
        """
        Obtiene el historial de mensajes formateado para el LLM.

        Args:
            chat_id: ID del chat

        Returns:
            Lista de mensajes en formato [{"role": "user", "content": "..."}]

        Raises:
            Exception: Si hay un error al obtener el historial
        """
        try:
            messages = await self.get_chat_messages(chat_id)

            # Formatear para el LLM (solo role y content, sin metadata)
            history = [
                {"role": msg["role"], "content": msg["content"]}
                for msg in messages
                if msg["role"] in ["user", "assistant"]  # Excluir mensajes de sistema
            ]

            logger.info(f"Historial formateado del chat {chat_id}: {len(history)} mensajes")
            return history

        except Exception as e:
            logger.error(f"Error al obtener historial: {e}")
            raise Exception(f"Error al obtener historial: {str(e)}")

    async def update_chat_title(self, chat_id: str, title: str) -> Dict[str, Any]:
        """
        Actualiza el título de un chat.

        Args:
            chat_id: ID del chat
            title: Nuevo título

        Returns:
            Chat actualizado

        Raises:
            Exception: Si hay un error al actualizar
        """
        try:
            response = self.client.table("chats").update({"title": title}).eq("id", chat_id).execute()

            chat = response.data[0] if response.data else None

            if chat:
                logger.info(f"Chat actualizado: {chat_id}")
                return chat
            else:
                raise Exception("No se pudo actualizar el chat")

        except Exception as e:
            logger.error(f"Error al actualizar chat: {e}")
            raise Exception(f"Error al actualizar chat: {str(e)}")

    async def delete_chat(self, chat_id: str) -> bool:
        """
        Elimina un chat y todos sus mensajes (CASCADE).

        Args:
            chat_id: ID del chat

        Returns:
            True si se eliminó correctamente

        Raises:
            Exception: Si hay un error al eliminar
        """
        try:
            response = self.client.table("chats").delete().eq("id", chat_id).execute()

            logger.info(f"Chat eliminado: {chat_id}")
            return True

        except Exception as e:
            logger.error(f"Error al eliminar chat: {e}")
            raise Exception(f"Error al eliminar chat: {str(e)}")


# Instancia global del servicio
db_service = DatabaseService()
