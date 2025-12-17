import re
from typing import List


def semantic_chunk(
    text: str, 
    max_chunk_size: int = 512, 
    overlap: int = 50
) -> List[str]:
    """
    Split text into semantically coherent chunks.
    
    Args:
        text: The text to be chunked
        max_chunk_size: Maximum size of each chunk (in words)
        overlap: Number of words to overlap between chunks
        
    Returns:
        List of text chunks
    """
    # Split the text into sentences
    sentences = re.split(r'(?<=[.!?]) +', text)
    
    chunks = []
    current_chunk = ""
    current_size = 0
    
    for sentence in sentences:
        sentence_word_count = len(sentence.split())
        
        # If adding this sentence would exceed the max chunk size
        if current_size + sentence_word_count > max_chunk_size:
            if current_chunk.strip():
                chunks.append(current_chunk.strip())
            
            # Start a new chunk with potential overlap
            # For now, we'll implement simple overlap by including words from the end of the previous chunk
            if overlap > 0 and chunks:
                last_chunk_words = current_chunk.split()
                overlap_words = last_chunk_words[-overlap:] if len(last_chunk_words) >= overlap else last_chunk_words
                current_chunk = " ".join(overlap_words) + " " + sentence
            else:
                current_chunk = sentence
            current_size = len(current_chunk.split())
        else:
            current_chunk += " " + sentence if current_chunk else sentence
            current_size += sentence_word_count
    
    # Add the last chunk if it has content
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    
    return chunks


def fixed_size_chunk(
    text: str, 
    chunk_size: int = 512, 
    overlap: int = 50
) -> List[str]:
    """
    Split text into fixed-size chunks with overlap.
    
    Args:
        text: The text to be chunked
        chunk_size: Size of each chunk (in words)
        overlap: Number of words to overlap between chunks
        
    Returns:
        List of text chunks
    """
    words = text.split()
    chunks = []
    
    start_idx = 0
    while start_idx < len(words):
        end_idx = start_idx + chunk_size
        chunk = " ".join(words[start_idx:end_idx])
        chunks.append(chunk)
        
        # Move the start index by chunk_size minus overlap
        start_idx = end_idx - overlap if end_idx < len(words) else len(words)
        
    return chunks