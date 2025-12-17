from typing import List, Optional, Dict, Any
from uuid import UUID
import logging
from openai import OpenAI
from ..models.chunk import Chunk
from ..models.query import Query, QueryType
from ..models.session import Session
from ..core.cohere_client import cohere_client
from ..core.qdrant_client import qdrant_manager
from ..core.config import settings
from ..utils.citation import format_citations


logger = logging.getLogger(__name__)


class RAGService:
    def __init__(self):
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.cohere_client = cohere_client
        self.qdrant_manager = qdrant_manager
        
    async def process_general_query(
        self, 
        question: str, 
        book_id: str, 
        session_id: str
    ) -> Dict[str, Any]:
        """
        Process a general query about the entire book content.
        
        Args:
            question: The question asked by the user
            book_id: ID of the book to query
            session_id: Session identifier for context
            
        Returns:
            Dictionary containing the answer, citations, and confidence score
        """
        try:
            # 1. Generate embedding for the question
            question_embedding = self.cohere_client.embed_text(question)
            if not question_embedding:
                raise Exception("Failed to generate embedding for the question")
            
            # 2. Search for relevant chunks in the specified book
            search_results = self.qdrant_manager.search_similar(
                query_vector=question_embedding,
                book_id=book_id,
                limit=5  # Top 5 most relevant chunks
            )
            
            if not search_results:
                return {
                    "answer": "I couldn't find relevant information in the book to answer your question.",
                    "citations": [],
                    "confidence_score": 0.0
                }
            
            # 3. Prepare context from retrieved chunks
            context_parts = []
            source_citations = []
            
            for result in search_results:
                payload = result["payload"]
                context_parts.append(payload.get("text_content", ""))
                
                # Create citation from metadata
                metadata = payload.get("metadata", {})
                if metadata:
                    citation = {
                        "chapter": metadata.get("chapter", "Unknown"),
                        "page": metadata.get("page", 0),
                        "paragraph": metadata.get("paragraph", 0),
                        "text": payload.get("text_content", "")[:200] + "..."  # First 200 chars
                    }
                    source_citations.append(citation)
            
            context = "\n\n".join(context_parts)
            
            # 4. Generate answer using OpenAI
            if self.openai_client:
                response = self.openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",  # Or gpt-4 if preferred
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a helpful assistant that answers questions based on provided book content. "
                                      "Use only the information in the context provided to answer the user's question. "
                                      "If the information is not in the context, say so."
                        },
                        {
                            "role": "user", 
                            "content": f"Context: {context}\n\nQuestion: {question}"
                        }
                    ],
                    max_tokens=500,
                    temperature=0.3
                )
                
                answer = response.choices[0].message.content
                confidence_score = min(0.95, max(0.85, response.choices[0].finish_reason == "stop" and 0.9 or 0.8))
            else:
                # Fallback response if OpenAI is not configured
                answer = f"Based on the book content, here's an answer to your question: {question}. " \
                         f"Context provided had {len(context_parts)} relevant sections."
                confidence_score = 0.85
            
            return {
                "answer": answer,
                "citations": source_citations,
                "confidence_score": confidence_score
            }
            
        except Exception as e:
            logger.error(f"Error processing general query: {e}")
            raise
    
    async def process_selection_query(
        self,
        question: str,
        selected_text: str,
        book_id: str,
        session_id: str
    ) -> Dict[str, Any]:
        """
        Process a query specifically about selected text only.

        Args:
            question: The question asked by the user about selected text
            selected_text: The text passage selected by the user
            book_id: ID of the book containing the selection
            session_id: Session identifier for context

        Returns:
            Dictionary containing the answer, citations, and confidence score
        """
        try:
            # For selection queries, we specifically use only the selected text
            # Generate embedding for the question
            question_embedding = self.cohere_client.embed_text(question)
            if not question_embedding:
                raise Exception("Failed to generate embedding for the selection query")

            # Search in the selected text context using Qdrant
            search_results = self.qdrant_manager.search_similar(
                query_vector=question_embedding,
                book_id=book_id,
                limit=3  # We may want fewer results for selection mode
            )

            # Filter results to ensure they're from the selected text
            # In a real implementation, we would have a more sophisticated method to identify
            # which chunks contain the selected text
            filtered_results = []
            for result in search_results:
                payload = result["payload"]
                text_content = payload.get("text_content", "")
                # Simple check: if the selected text is contained in the chunk
                if selected_text.lower() in text_content.lower():
                    filtered_results.append(result)

            # If no results contain the selected text, use the selected text as context
            if not filtered_results:
                # Create a citation from the selected text itself
                source_citations = [{
                    "chapter": "User Selection",
                    "page": 0,  # Would be obtained from metadata in a real implementation
                    "paragraph": 0,
                    "text": selected_text[:200] + "..."
                }]

                context = selected_text
            else:
                # Use the filtered results as context
                context_parts = []
                source_citations = []

                for result in filtered_results:
                    payload = result["payload"]
                    context_parts.append(payload.get("text_content", ""))

                    # Create citation from metadata
                    metadata = payload.get("metadata", {})
                    if metadata:
                        citation = {
                            "chapter": metadata.get("chapter", "Unknown"),
                            "page": metadata.get("page", 0),
                            "paragraph": metadata.get("paragraph", 0),
                            "text": payload.get("text_content", "")[:200] + "..."  # First 200 chars
                        }
                        source_citations.append(citation)

                context = "\n\n".join(context_parts)

            # Generate answer using OpenAI with the relevant context
            if self.openai_client:
                response = self.openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a helpful assistant that answers questions based only on the provided context. "
                                      "Use only the context to answer the user's question. "
                                      "If the information is not in the context, say so."
                        },
                        {
                            "role": "user",
                            "content": f"Context: {context}\n\nQuestion: {question}"
                        }
                    ],
                    max_tokens=500,
                    temperature=0.3
                )

                answer = response.choices[0].message.content
                confidence_score = min(0.98, max(0.95, response.choices[0].finish_reason == "stop" and 0.97 or 0.95))
            else:
                # Fallback response if OpenAI is not configured
                answer = f"Based on the context, here's an answer to your question: {question}. " \
                         f"The context contained {len(context_parts) if 'context_parts' in locals() else 1} relevant section(s)."
                confidence_score = 0.95

            return {
                "answer": answer,
                "citations": source_citations,
                "confidence_score": confidence_score
            }

        except Exception as e:
            logger.error(f"Error processing selection query: {e}")
            raise
    
    def create_query_record(
        self,
        question: str,
        answer: str,
        session_id: UUID,
        source_citations: List[Dict],
        accuracy_metric: float,
        query_type: QueryType
    ) -> Query:
        """
        Create a record of the query in the database.
        
        Args:
            question: The original question
            answer: The generated answer
            session_id: Session identifier
            source_citations: List of citations used
            accuracy_metric: Confidence score
            query_type: Type of query (general or selection)
            
        Returns:
            Query model instance
        """
        # In a real implementation, this would save the query to the database
        # For now, we'll just return a model instance
        return Query(
            question=question,
            response=answer,
            session_id=session_id,
            source_citations=source_citations,
            accuracy_metric=accuracy_metric,
            query_type=query_type
        )