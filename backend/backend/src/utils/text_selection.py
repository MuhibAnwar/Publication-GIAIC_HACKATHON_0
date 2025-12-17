import re
from typing import Optional


def validate_text_selection(content: str, context: str = "") -> Optional[str]:
    """
    Validate the text selection based on business rules.
    
    Args:
        content: The selected text content
        context: The surrounding context of the selection
        
    Returns:
        Optional error message if validation fails, None if valid
    """
    # Check content length
    if len(content) > 10000:  # 10,000 characters max
        return "Selected text exceeds maximum length of 10,000 characters"
    
    # Check if content is empty
    if not content or not content.strip():
        return "Selected text cannot be empty"
    
    # Check for potentially problematic content
    # This is a simple example - in a real implementation, 
    # you might check for sensitive information, etc.
    if re.search(r"(password|secret|private)", content, re.IGNORECASE):
        return "Selected text contains sensitive terms"
    
    # All validations passed
    return None


def extract_selection_context(
    full_text: str, 
    selected_text: str, 
    context_length: int = 200
) -> str:
    """
    Extract the context around the selected text.
    
    Args:
        full_text: The full text where the selection was made
        selected_text: The selected text portion
        context_length: Number of characters before and after the selection
        
    Returns:
        Context string containing the selected text with surrounding context
    """
    # Find the position of the selected text in the full text
    pos = full_text.lower().find(selected_text.lower())
    if pos == -1:
        # If exact match not found, return the selected text with minimal context
        return f"...{selected_text[:context_length]}..."
    
    start_pos = max(0, pos - context_length)
    end_pos = min(len(full_text), pos + len(selected_text) + context_length)
    
    # Extract the context
    context = full_text[start_pos:end_pos]
    
    # Add ellipsis if we've truncated
    if start_pos > 0:
        context = "..." + context
    if end_pos < len(full_text):
        context = context + "..."
    
    return context