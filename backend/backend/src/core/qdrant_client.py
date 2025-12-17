from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List, Optional, Dict, Any
from uuid import UUID
import logging
from ..core.config import settings


logger = logging.getLogger(__name__)


class QdrantManager:
    def __init__(self):
        self.client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY,
            prefer_grpc=False  # Using REST API for better compatibility
        )
        self.collection_name = "book_chunks"
        
    def initialize_collection(self):
        """
        Initialize the Qdrant collection for storing book chunks with vector embeddings.
        """
        try:
            # Check if collection already exists
            collections = self.client.get_collections()
            collection_exists = any(col.name == self.collection_name for col in collections.collections)
            
            if not collection_exists:
                # Create the collection
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=1024,  # Cohere's embedding dimension
                        distance=models.Distance.COSINE
                    )
                )
                logger.info(f"Created Qdrant collection: {self.collection_name}")
            else:
                logger.info(f"Qdrant collection already exists: {self.collection_name}")
            
            # Create payload index for efficient filtering
            self.client.create_payload_index(
                collection_name=self.collection_name,
                field_name="book_id",
                field_schema=models.PayloadSchemaType.KEYWORD
            )
            
            logger.info("Qdrant collection initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing Qdrant collection: {e}")
            raise
    
    def add_embedding(self, 
                     chunk_id: str, 
                     vector: List[float], 
                     payload: Dict[str, Any]) -> bool:
        """
        Add a vector embedding to the Qdrant collection.
        
        Args:
            chunk_id: Unique identifier for the chunk
            vector: Embedding vector
            payload: Metadata associated with the chunk
        
        Returns:
            True if successful, False otherwise
        """
        try:
            self.client.upsert(
                collection_name=self.collection_name,
                points=[
                    models.PointStruct(
                        id=chunk_id,
                        vector=vector,
                        payload=payload
                    )
                ]
            )
            return True
        except Exception as e:
            logger.error(f"Error adding embedding to Qdrant: {e}")
            return False
    
    def search_similar(self, 
                      query_vector: List[float], 
                      book_id: Optional[str] = None,
                      limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search for similar vectors in the collection.
        
        Args:
            query_vector: Vector to search for similarity
            book_id: Optional filter to search within a specific book
            limit: Number of results to return
        
        Returns:
            List of similar chunks with their payload data
        """
        try:
            # Prepare filters
            filters = None
            if book_id:
                filters = models.Filter(
                    must=[
                        models.FieldCondition(
                            key="book_id",
                            match=models.MatchValue(value=book_id)
                        )
                    ]
                )
            
            search_results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                query_filter=filters,
                limit=limit
            )
            
            results = []
            for result in search_results:
                results.append({
                    "id": result.id,
                    "payload": result.payload,
                    "score": result.score
                })
            
            return results
        except Exception as e:
            logger.error(f"Error searching in Qdrant: {e}")
            return []
    
    def delete_by_book_id(self, book_id: str) -> bool:
        """
        Delete all vectors associated with a specific book ID.
        
        Args:
            book_id: ID of the book to delete vectors for
        
        Returns:
            True if successful, False otherwise
        """
        try:
            # Find points with the specific book_id
            filter_condition = models.Filter(
                must=[
                    models.FieldCondition(
                        key="book_id",
                        match=models.MatchValue(value=book_id)
                    )
                ]
            )
            
            # This is a workaround since Qdrant doesn't have a direct delete_by_filter method
            # We need to first retrieve the IDs, then delete them
            search_results = self.client.search(
                collection_name=self.collection_name,
                query_filter=filter_condition,
                limit=10000  # Adjust limit based on expected number of chunks
            )
            
            point_ids = [result.id for result in search_results]
            
            if point_ids:
                self.client.delete(
                    collection_name=self.collection_name,
                    points_selector=models.PointIdsList(
                        points=point_ids
                    )
                )
            
            return True
        except Exception as e:
            logger.error(f"Error deleting vectors by book ID in Qdrant: {e}")
            return False


# Global instance
qdrant_manager = QdrantManager()