from typing import List, Dict, Any
from ..models.query import Citation


def format_citations(citation_data: List[Dict[str, Any]]) -> List[Citation]:
    """
    Format raw citation data into Citation model instances.
    
    Args:
        citation_data: List of raw citation dictionaries
        
    Returns:
        List of Citation model instances
    """
    citations = []
    for data in citation_data:
        citation = Citation(
            chapter=data.get("chapter", "Unknown"),
            page=data.get("page", 0),
            paragraph=data.get("paragraph", 0),
            text=data.get("text", "")
        )
        citations.append(citation)
    
    return citations


def create_citation_from_chunk(chunk_data: Dict[str, Any]) -> Citation:
    """
    Create a citation from chunk data.
    
    Args:
        chunk_data: Dictionary containing chunk information
        
    Returns:
        Citation model instance
    """
    metadata = chunk_data.get("metadata", {})
    
    return Citation(
        chapter=metadata.get("chapter", "Unknown"),
        page=metadata.get("page", 0),
        paragraph=metadata.get("paragraph", 0),
        text=chunk_data.get("text_content", "")[:200] + "..."  # First 200 chars
    )