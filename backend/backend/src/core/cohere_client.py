import cohere
from typing import List, Optional
import logging
from ..core.config import settings


logger = logging.getLogger(__name__)


class CohereClient:
    def __init__(self):
        self.client = cohere.Client(settings.COHERE_API_KEY)
        self.model = settings.EMBEDDING_MODEL  # This will be "large" as per research
        
    def generate_embeddings(self, texts: List[str]) -> Optional[List[List[float]]]:
        """
        Generate embeddings for a list of texts using Cohere.
        
        Args:
            texts: List of texts to generate embeddings for
            
        Returns:
            List of embedding vectors, or None if failed
        """
        try:
            response = self.client.embed(
                texts=texts,
                model="multilingual-22-12" if self.model == "large" else "small"
            )
            return response.embeddings
        except Exception as e:
            logger.error(f"Error generating embeddings with Cohere: {e}")
            return None
    
    def embed_text(self, text: str) -> Optional[List[float]]:
        """
        Generate embedding for a single text.
        
        Args:
            text: Text to generate embedding for
            
        Returns:
            Embedding vector, or None if failed
        """
        embeddings = self.generate_embeddings([text])
        if embeddings and len(embeddings) > 0:
            return embeddings[0]
        return None


# Global instance
cohere_client = CohereClient()