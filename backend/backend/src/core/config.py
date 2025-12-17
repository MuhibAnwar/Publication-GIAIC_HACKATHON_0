import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database settings
    NEON_DB_URL: str = os.getenv(
        "NEON_DB_URL", 
        "postgresql://neondb_owner:npg_CHP1DhnYQjU4@ep-young-lab-ad7ezzev-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    )
    
    # Qdrant settings
    QDRANT_URL: str = os.getenv(
        "QDRANT_URL", 
        "https://e2e5d3db-a8c5-4a2c-bf55-ef3d4661f1bc.us-east4-0.gcp.cloud.qdrant.io"
    )
    QDRANT_API_KEY: str = os.getenv(
        "QDRANT_API_KEY", 
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.DHxYWtJPGg37J71N4C5lPVm0KoFVi8EcSWKRYt1GzoE"
    )
    
    # Cohere settings
    COHERE_API_KEY: str = os.getenv(
        "COHERE_API_KEY", 
        "246ctj5d1ATlVxfxCEW7UKOJPMmqKQi5AleSH6Ll"
    )
    
    # OpenAI settings
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    
    # Application settings
    PROJECT_NAME: str = "RAG Chatbot"
    API_V1_STR: str = "/v1"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Performance settings
    MAX_CONCURRENT_USERS: int = 50
    RESPONSE_TIMEOUT_SECONDS: int = 2
    MAX_CHUNK_TOKENS: int = 512
    EMBEDDING_MODEL: str = "large"  # Use Cohere's large model
    
    # Storage limits
    QDRANT_STORAGE_LIMIT: int = 1073741824  # 1 GB in bytes
    NEON_STORAGE_LIMIT: int = 3221225472  # 3 GB in bytes
    MAX_ROWS_LIMIT: int = 10000
    
    # Session settings
    SESSION_TIMEOUT_HOURS: int = 24
    SESSION_CLEANUP_INTERVAL_MINUTES: int = 60


settings = Settings()