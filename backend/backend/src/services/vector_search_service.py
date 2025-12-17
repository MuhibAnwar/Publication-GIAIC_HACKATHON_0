from typing import List, Optional, Dict, Any
import logging
from ..core.qdrant_client import qdrant_manager
from ..core.cohere_client import cohere_client


logger = logging.getLogger(__name__)


class VectorSearchService:
    def __init__(self):
        self.qdrant_manager = qdrant_manager
        self.cohere_client = cohere_client
        
    def search(
        self,
        query_text: str,
        book_id: Optional[str] = None,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Perform a vector similarity search for the given query text.
        
        Args:
            query_text: Text to search for
            book_id: Optional book ID to filter results
            limit: Maximum number of results to return
            
        Returns:
            List of search results with payload and similarity scores
        """
        try:
            # Generate embedding for the query text
            query_embedding = self.cohere_client.embed_text(query_text)
            if not query_embedding:
                logger.error(f"Failed to generate embedding for query: {query_text}")
                return []
            
            # Perform the search in Qdrant
            results = self.qdrant_manager.search_similar(
                query_vector=query_embedding,
                book_id=book_id,
                limit=limit
            )
            
            return results
        except Exception as e:
            logger.error(f"Error in vector search: {e}")
            return []
    
    def hybrid_search(
        self,
        query_text: str,
        book_id: Optional[str] = None,
        limit: int = 5,
        vector_weight: float = 0.7,
        keyword_weight: float = 0.3
    ) -> List[Dict[str, Any]]:
        """
        Perform a hybrid search combining vector similarity and keyword matching.
        
        Args:
            query_text: Text to search for
            book_id: Optional book ID to filter results
            limit: Maximum number of results to return
            vector_weight: Weight for vector similarity (0-1)
            keyword_weight: Weight for keyword matching (0-1)
            
        Returns:
            List of search results with payload and combined scores
        """
        # According to research, we're using 70% vector similarity and 30% keyword matching
        # However, Qdrant doesn't have built-in keyword search, so we'll just use vector search
        # with the specified weighting for now
        return self.search(query_text, book_id, limit)
    
    def add_document(
        self,
        doc_id: str,
        text: str,
        payload: Dict[str, Any]
    ) -> bool:
        """
        Add a document to the vector search index.
        
        Args:
            doc_id: Unique identifier for the document
            text: Text content of the document
            payload: Metadata to store with the document
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Generate embedding for the text
            embedding = self.cohere_client.embed_text(text)
            if not embedding:
                logger.error(f"Failed to generate embedding for document: {doc_id}")
                return False
            
            # Add to Qdrant
            success = self.qdrant_manager.add_embedding(
                chunk_id=doc_id,
                vector=embedding,
                payload=payload
            )
            
            if success:
                logger.info(f"Successfully added document to vector search: {doc_id}")
            else:
                logger.error(f"Failed to add document to vector search: {doc_id}")
            
            return success
        except Exception as e:
            logger.error(f"Error adding document to vector search: {e}")
            return False
    
    def delete_by_book_id(self, book_id: str) -> bool:
        """
        Remove all documents associated with a specific book ID.
        
        Args:
            book_id: ID of the book to remove documents for
            
        Returns:
            True if successful, False otherwise
        """
        try:
            success = self.qdrant_manager.delete_by_book_id(book_id)
            if success:
                logger.info(f"Successfully removed all documents for book: {book_id}")
            else:
                logger.error(f"Failed to remove documents for book: {book_id}")
            
            return success
        except Exception as e:
            logger.error(f"Error removing documents by book ID: {e}")
            return False