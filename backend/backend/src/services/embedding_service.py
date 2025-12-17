from typing import List, Optional
import logging
from ..core.cohere_client import cohere_client
from ..core.qdrant_client import qdrant_manager


logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self):
        self.cohere_client = cohere_client
        self.qdrant_manager = qdrant_manager
    
    def generate_and_store_embeddings(
        self, 
        texts: List[str], 
        payloads: List[dict]
    ) -> bool:
        """
        Generate embeddings for texts using Cohere and store in Qdrant.
        
        Args:
            texts: List of texts to generate embeddings for
            payloads: List of metadata payloads corresponding to each text
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Generate embeddings using Cohere
            embeddings = self.cohere_client.generate_embeddings(texts)
            if not embeddings or len(embeddings) != len(texts):
                logger.error("Failed to generate embeddings for all texts")
                return False
            
            # Store each embedding in Qdrant
            success_count = 0
            for i, (text, embedding, payload) in enumerate(zip(texts, embeddings, payloads)):
                # Use a unique ID for each chunk (in a real implementation, 
                # this would likely be the chunk's UUID)
                chunk_id = payload.get("id", f"chunk_{i}")
                
                success = self.qdrant_manager.add_embedding(
                    chunk_id=chunk_id,
                    vector=embedding,
                    payload=payload
                )
                
                if success:
                    success_count += 1
                else:
                    logger.error(f"Failed to store embedding for chunk {chunk_id}")
            
            logger.info(f"Successfully stored {success_count}/{len(texts)} embeddings in Qdrant")
            return success_count == len(texts)
            
        except Exception as e:
            logger.error(f"Error in generate_and_store_embeddings: {e}")
            return False
    
    def embed_text(self, text: str) -> Optional[List[float]]:
        """
        Generate embedding for a single text.
        
        Args:
            text: Text to generate embedding for
            
        Returns:
            Embedding vector, or None if failed
        """
        return self.cohere_client.embed_text(text)
    
    def search_similar(
        self, 
        query_text: str, 
        book_id: Optional[str] = None,
        limit: int = 5
    ) -> List[dict]:
        """
        Search for similar text chunks based on a query.
        
        Args:
            query_text: Text to search for similarity
            book_id: Optional filter to search within a specific book
            limit: Number of results to return
            
        Returns:
            List of similar chunks with their payload data
        """
        try:
            # Generate embedding for the query text
            query_embedding = self.embed_text(query_text)
            if not query_embedding:
                logger.error("Failed to generate embedding for query text")
                return []
            
            # Search in Qdrant
            results = self.qdrant_manager.search_similar(
                query_vector=query_embedding,
                book_id=book_id,
                limit=limit
            )
            
            return results
        except Exception as e:
            logger.error(f"Error in search_similar: {e}")
            return []