"""
Configuración de la aplicación usando Pydantic Settings.
Carga variables de entorno y proporciona valores por defecto.
"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator


class Settings(BaseSettings):
    """Configuración de la aplicación."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    # API Keys
    ANTHROPIC_API_KEY: str = Field(..., description="Clave de API de Anthropic")
    OPENAI_API_KEY: str = Field(..., description="Clave de API de OpenAI")
    PINECONE_API_KEY: str = Field(..., description="Clave de API de Pinecone")

    # Supabase Configuration
    SUPABASE_URL: str = Field(..., description="URL del proyecto de Supabase")
    SUPABASE_KEY: str = Field(..., description="Clave anon/public de Supabase")

    # Pinecone Configuration
    PINECONE_ENVIRONMENT: str = Field(default="us-east-1", description="Región de Pinecone")
    PINECONE_INDEX_NAME: str = Field(default="raisket-knowledge-base", description="Nombre del índice de Pinecone")

    # CORS Configuration
    CORS_ORIGINS: str = Field(
        default="https://www.raisket.mx,http://localhost:3000",
        description="Orígenes permitidos para CORS (separados por coma)"
    )

    # Server Configuration
    HOST: str = Field(default="0.0.0.0", description="Host del servidor")
    PORT: int = Field(default=8000, description="Puerto del servidor")
    ENVIRONMENT: str = Field(default="development", description="Ambiente de ejecución")

    # LLM Configuration
    DEFAULT_MODEL: str = Field(
        default="claude-3-5-sonnet-20241022",
        description="Modelo de LLM por defecto"
    )
    MAX_TOKENS: int = Field(default=4096, description="Máximo de tokens por respuesta")
    TEMPERATURE: float = Field(default=0.7, description="Temperatura del modelo")

    # RAG Configuration
    TOP_K_RESULTS: int = Field(default=5, description="Número de resultados a recuperar del RAG")
    SIMILARITY_THRESHOLD: float = Field(
        default=0.7,
        description="Umbral de similitud para resultados del RAG"
    )

    @field_validator("TEMPERATURE")
    @classmethod
    def validate_temperature(cls, v: float) -> float:
        """Valida que la temperatura esté en el rango correcto."""
        if not 0.0 <= v <= 1.0:
            raise ValueError("La temperatura debe estar entre 0.0 y 1.0")
        return v

    @field_validator("SIMILARITY_THRESHOLD")
    @classmethod
    def validate_similarity_threshold(cls, v: float) -> float:
        """Valida que el umbral de similitud esté en el rango correcto."""
        if not 0.0 <= v <= 1.0:
            raise ValueError("El umbral de similitud debe estar entre 0.0 y 1.0")
        return v

    @property
    def cors_origins_list(self) -> List[str]:
        """Retorna los orígenes de CORS como una lista."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        """Retorna True si el ambiente es producción."""
        return self.ENVIRONMENT.lower() == "production"

    @property
    def is_development(self) -> bool:
        """Retorna True si el ambiente es desarrollo."""
        return self.ENVIRONMENT.lower() == "development"


# Instancia global de configuración
settings = Settings()
