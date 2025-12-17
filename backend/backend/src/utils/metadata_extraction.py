import re
from typing import List, Dict, Any, Optional


def extract_chapter_info(text: str) -> List[Dict[str, Any]]:
    """
    Extract chapter information from book content.
    
    Args:
        text: The book content to analyze
        
    Returns:
        List of dictionaries containing chapter information
    """
    chapters = []
    
    # Look for common chapter patterns
    chapter_patterns = [
        r'(?:^|\n)Chapter\s+(\d+)[\s\n]+([^\n]+)',
        r'(?:^|\n)CHAPTER\s+(\d+)[\s\n]+([^\n]+)',
        r'(?:^|\n)(\d+)\.\s*([^\n]+)',
        r'(?:^|\n)Part\s+(\d+)[\s\n]+([^\n]+)',
    ]
    
    for pattern in chapter_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            chapter_info = {
                'number': match.group(1),
                'title': match.group(2).strip(),
                'position': match.start()
            }
            chapters.append(chapter_info)
    
    # Sort chapters by position in the text
    chapters.sort(key=lambda x: x['position'])
    
    # Add chapter index
    for i, chapter in enumerate(chapters):
        chapter['index'] = i + 1
    
    return chapters


def extract_page_numbers(text: str) -> List[Dict[str, Any]]:
    """
    Extract potential page numbers from text.
    
    Args:
        text: The book content to analyze
        
    Returns:
        List of dictionaries containing page information
    """
    # This is a simplified implementation
    # In a real implementation, we might extract page numbers from document metadata
    page_pattern = r'\b(?:Page |p\.? |p |Pg )(\d+)\b'
    matches = re.finditer(page_pattern, text, re.IGNORECASE)
    
    pages = []
    for match in matches:
        page_info = {
            'number': int(match.group(1)),
            'position': match.start()
        }
        pages.append(page_info)
    
    return pages


def extract_paragraphs(text: str, min_length: int = 20) -> List[Dict[str, Any]]:
    """
    Extract paragraphs from text.
    
    Args:
        text: The book content to analyze
        min_length: Minimum length for a paragraph
        
    Returns:
        List of dictionaries containing paragraph information
    """
    # Split by double newlines which typically indicate paragraph breaks
    potential_paragraphs = re.split(r'\n\s*\n', text)
    
    paragraphs = []
    position = 0
    
    for i, para in enumerate(potential_paragraphs):
        if len(para.strip()) >= min_length:
            para_info = {
                'index': i + 1,
                'content': para.strip(),
                'position': position,
                'length': len(para)
            }
            paragraphs.append(para_info)
        
        position += len(para) + 2  # Add 2 for the double newline
    
    return paragraphs


def extract_book_metadata(text: str) -> Dict[str, Any]:
    """
    Extract various metadata from book content.
    
    Args:
        text: The book content to analyze
        
    Returns:
        Dictionary containing extracted metadata
    """
    metadata = {}
    
    # Extract title (first line if it looks like a title)
    lines = text.split('\n')
    if lines and len(lines[0].strip()) < 50:  # If first line is reasonably short
        metadata['title'] = lines[0].strip()
    
    # Extract chapters
    chapters = extract_chapter_info(text)
    if chapters:
        metadata['chapters'] = chapters
        metadata['total_chapters'] = len(chapters)
    
    # Extract paragraphs
    paragraphs = extract_paragraphs(text)
    metadata['total_paragraphs'] = len(paragraphs)
    
    # Basic content metrics
    metadata['total_characters'] = len(text)
    metadata['total_words'] = len(text.split())
    metadata['total_lines'] = len(lines)
    
    return metadata