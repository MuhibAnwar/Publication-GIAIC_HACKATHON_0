from fastapi import FastAPI
from .api.health import router as health_router
from .api.query import router as query_router
from .api.ingest import router as ingest_router
from .core.config import settings
from .core.logging import setup_logging, setup_error_handlers, add_middleware
from .core.qdrant_client import qdrant_manager


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for the RAG (Retrieval-Augmented Generation) Chatbot with Text Selection Capability",
    version="1.0.0"
)

# Setup logging
setup_logging(app)

# Setup error handlers
setup_error_handlers(app)

# Add middleware
add_middleware(app)

# Initialize Qdrant collection on startup
@app.on_event("startup")
async def startup_event():
    qdrant_manager.initialize_collection()

# Include routers
app.include_router(health_router, prefix="", tags=["health"])
app.include_router(query_router, prefix="/query", tags=["query"])
app.include_router(ingest_router, prefix="/ingest", tags=["ingest"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)