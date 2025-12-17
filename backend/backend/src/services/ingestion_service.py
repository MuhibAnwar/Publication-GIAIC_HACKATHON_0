import asyncio
from typing import List, Dict, Any
from ..core.cohere_client import cohere_client
from ..core.qdrant_client import qdrant_manager
from ..services.embedding_service import EmbeddingService
from ..utils.chunking import semantic_chunk
from ..utils.text_selection import validate_text_selection
import logging


logger = logging.getLogger(__name__)


class IngestionService:
    def __init__(self):
        self.embedding_service = EmbeddingService()
        self.qdrant_manager = qdrant_manager
    
    async def ingest_book_content(
        self,
        book_id: str,
        title: str,
        content: str,
        chunk_overlap: int = 50,
        max_chunk_size: int = 512
    ) -> Dict[str, Any]:
        """
        Ingest and process book content for retrieval.
        
        Args:
            book_id: Unique identifier for the book
            title: Title of the book
            content: Full text content of the book
            chunk_overlap: Number of tokens to overlap between chunks
            max_chunk_size: Maximum size of each chunk in tokens
            
        Returns:
            Dictionary with ingestion results
        """
        try:
            # 1. Chunk the content using semantic chunking
            logger.info(f"Starting ingestion for book: {title} (ID: {book_id})")
            
            chunks = semantic_chunk(
                content, 
                max_chunk_size=max_chunk_size, 
                overlap=chunk_overlap
            )
            
            if not chunks:
                return {
                    "message": "No content was found to process",
                    "chunks_processed": 0,
                    "status": "failed"
                }
            
            # 2. Prepare texts and payloads for embedding
            texts = []
            payloads = []
            
            for i, chunk_text in enumerate(chunks):
                chunk_id = f"{book_id}_chunk_{i}"
                
                # Create payload with metadata
                payload = {
                    "id": chunk_id,
                    "text_content": chunk_text,
                    "metadata": {
                        "book_id": book_id,
                        "book_title": title,
                        "chunk_index": i,
                        "total_chunks": len(chunks)
                    },
                    "book_id": book_id  # For Qdrant filtering
                }
                
                texts.append(chunk_text)
                payloads.append(payload)
            
            # 3. Generate and store embeddings
            success = self.embedding_service.generate_and_store_embeddings(texts, payloads)
            
            if success:
                logger.info(f"Successfully ingested {len(chunks)} chunks for book {book_id}")
                return {
                    "message": "Book content successfully processed",
                    "chunks_processed": len(chunks),
                    "status": "success"
                }
            else:
                logger.error(f"Failed to process embeddings for book {book_id}")
                return {
                    "message": "Failed to process book content",
                    "chunks_processed": len([p for p in payloads if p.get("id") in self.get_existing_chunks(book_id)]),
                    "status": "partial"
                }
                
        except Exception as e:
            logger.error(f"Error ingesting book content: {e}")
            return {
                "message": f"Error processing book content: {str(e)}",
                "chunks_processed": 0,
                "status": "failed"
            }
    
    def get_existing_chunks(self, book_id: str) -> List[str]:
        """
        Get existing chunk IDs for a book (for partial updates).
        
        Args:
            book_id: ID of the book to check
            
        Returns:
            List of existing chunk IDs
        """
        # This is a simplified implementation - in a real system,
        # we'd query the vector database or a metadata store
        return []
    
    async def validate_content(self, content: str) -> List[str]:
        """
        Validate book content before ingestion.
        
        Args:
            content: Content to validate
            
        Returns:
            List of validation errors
        """
        errors = []
        
        if not content or len(content.strip()) == 0:
            errors.append("Content cannot be empty")
        
        if len(content) < 100:  # Arbitrary minimum length
            errors.append("Content is too short to be a meaningful book")
        
        # Additional validation could be added here
        # e.g., check for copyrighted content, etc.
        
        return errors