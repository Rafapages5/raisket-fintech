"""
Aplicación principal de FastAPI.
Configura CORS, middlewares, routers y endpoints globales.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api import chat, workflows

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gestiona el ciclo de vida de la aplicación.
    Se ejecuta al iniciar y al cerrar la aplicación.
    """
    # Startup
    logger.info("Iniciando aplicación Raisket Backend API")
    logger.info(f"Ambiente: {settings.ENVIRONMENT}")
    logger.info(f"CORS Origins: {settings.CORS_ORIGINS}")

    # Verificar configuración
    try:
        logger.info("Verificando configuración de API keys...")
        if settings.ANTHROPIC_API_KEY:
            logger.info("✓ Anthropic API Key configurada")
        if settings.OPENAI_API_KEY:
            logger.info("✓ OpenAI API Key configurada")


        logger.info("Aplicación iniciada correctamente")
    except Exception as e:
        logger.error(f"Error al verificar configuración: {e}")

    yield

    # Shutdown
    logger.info("Cerrando aplicación...")


# Crear aplicación FastAPI
app = FastAPI(
    title="Raisket Backend API",
    description="API Backend para funcionalidades de IA de Raisket",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)


# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


# Middleware para logging de requests
@app.middleware("http")
async def log_requests(request, call_next):
    """Middleware para loggear todas las requests."""
    logger.info(f"{request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Status: {response.status_code}")
    return response


# Manejador global de excepciones
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Manejador global de excepciones no capturadas."""
    logger.error(f"Error no manejado: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.is_development else "An error occurred"
        }
    )


# Endpoints raíz
@app.get("/", status_code=status.HTTP_200_OK)
async def root():
    """Endpoint raíz con información de la API."""
    return {
        "message": "Raisket Backend API",
        "version": "1.0.0",
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
        "endpoints": {
            "health": "/health",
            "chat": "/chat",
            "workflows": "/workflows"
        }
    }


@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Health check endpoint.
    Verifica que la API esté funcionando correctamente.
    """
    try:
        return {
            "status": "healthy",
            "environment": settings.ENVIRONMENT,
            "version": "1.0.0",
            "services": {
                "api": "operational",
                "llm": "operational",
                "rag": "operational"
            }
        }
    except Exception as e:
        logger.error(f"Error en health check: {e}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "error": str(e)
            }
        )


# Incluir routers
app.include_router(chat.router)
app.include_router(workflows.router)


# Endpoint de información de configuración (solo en desarrollo)
if settings.is_development:
    @app.get("/config/info", status_code=status.HTTP_200_OK)
    async def config_info():
        """
        Endpoint de información de configuración (solo en desarrollo).
        """
        return {
            "environment": settings.ENVIRONMENT,
            "host": settings.HOST,
            "port": settings.PORT,
            "default_model": settings.DEFAULT_MODEL,
            "max_tokens": settings.MAX_TOKENS,
            "temperature": settings.TEMPERATURE,
            "top_k_results": settings.TOP_K_RESULTS,
            "similarity_threshold": settings.SIMILARITY_THRESHOLD,

        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.is_development,
        log_level="info"
    )
