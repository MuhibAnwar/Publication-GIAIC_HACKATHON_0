import time
from functools import wraps
from typing import Dict, Optional
import logging
from fastapi import HTTPException, Request
from ..core.config import settings


logger = logging.getLogger(__name__)


class RateLimiter:
    def __init__(self, max_requests: int = 100, window_size: int = 60):
        """
        Initialize rate limiter.
        
        Args:
            max_requests: Maximum number of requests per window
            window_size: Time window in seconds
        """
        self.max_requests = max_requests
        self.window_size = window_size  # in seconds
        self.requests = {}  # Dictionary to store request times per IP
    
    def is_allowed(self, identifier: str) -> bool:
        """
        Check if a request from the given identifier is allowed.
        
        Args:
            identifier: Unique identifier for the requester (e.g., IP address)
            
        Returns:
            True if allowed, False if rate limit exceeded
        """
        current_time = time.time()
        
        # Initialize if this is the first request from this identifier
        if identifier not in self.requests:
            self.requests[identifier] = []
        
        # Remove requests that are outside the current window
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if current_time - req_time < self.window_size
        ]
        
        # Check if within limit
        if len(self.requests[identifier]) < self.max_requests:
            # Add current request
            self.requests[identifier].append(current_time)
            return True
        
        return False


# Global rate limiter instance
rate_limiter = RateLimiter(max_requests=100, window_size=60)  # 100 requests per minute


def rate_limit(max_requests: int = 100, window_size: int = 60):
    """
    Decorator for rate limiting API endpoints.
    """
    local_limiter = RateLimiter(max_requests, window_size)
    
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract request from kwargs or args
            request = kwargs.get('request')
            if not request:
                for arg in args:
                    if isinstance(arg, Request):
                        request = arg
                        break
            
            if request:
                client_ip = request.client.host
                if not local_limiter.is_allowed(client_ip):
                    raise HTTPException(
                        status_code=429,
                        detail="Rate limit exceeded"
                    )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


def validate_api_key(api_key: Optional[str]) -> bool:
    """
    Validate the provided API key against the expected value.
    
    Args:
        api_key: API key provided by the client
        
    Returns:
        True if valid, False otherwise
    """
    if not api_key:
        return False
    
    # In a real implementation, you might check against a database of valid keys
    # For now, we'll just check if it matches the Cohere key from config
    expected_key = settings.COHERE_API_KEY
    return api_key == expected_key