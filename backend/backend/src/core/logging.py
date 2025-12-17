import logging
from datetime import datetime
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from typing import Dict, Any
import traceback
import sys
from pydantic import BaseModel


class ErrorDetails(BaseModel):
    error: str
    message: str
    details: Dict[str, Any] = {}


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)


def setup_logging(app: FastAPI):
    """
    Configure logging for the application.
    """
    # Add logging middleware
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        start_time = datetime.utcnow()
        response = await call_next(request)
        process_time = (datetime.utcnow() - start_time).total_seconds()
        
        logger.info(f"{request.method} {request.url} - {response.status_code} - {process_time}s")
        return response


def setup_error_handlers(app: FastAPI):
    """
    Configure global error handlers for the application.
    """
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorDetails(
                error="HTTP_ERROR",
                message=str(exc.detail),
                details={"status_code": exc.status_code}
            )
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled Exception: {exc}\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content=ErrorDetails(
                error="INTERNAL_ERROR",
                message="An internal server error occurred",
                details={
                    "error_type": type(exc).__name__,
                    "error_message": str(exc),
                } if hasattr(exc, '__name__') else {}
            )
        )


def add_middleware(app: FastAPI):
    """
    Add necessary middleware to the application.
    """
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, specify exact origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Trusted host middleware
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])