from typing import List, Tuple
import re


def validate_book_content(content: str) -> Tuple[bool, List[str]]:
    """
    Validate book content against business rules.
    
    Args:
        content: The book content to validate
        
    Returns:
        Tuple of (is_valid, list_of_errors)
    """
    errors = []
    
    # Check minimum length
    if len(content.strip()) < 100:
        errors.append("Content is too short to be a meaningful book (minimum 100 characters)")
    
    # Check for excessive repetition which might indicate poor quality
    if has_excessive_repetition(content):
        errors.append("Content appears to have excessive repetition")
    
    # Check for potential non-text elements (too many special characters)
    special_char_ratio = calculate_special_character_ratio(content)
    if special_char_ratio > 0.3:  # More than 30% special characters
        errors.append("Content contains too many special characters, possibly non-text data")
    
    # Check for balanced use of punctuation
    if not has_balanced_punctuation(content):
        errors.append("Content may have unbalanced or unusual punctuation patterns")
    
    return len(errors) == 0, errors


def has_excessive_repetition(content: str, threshold: float = 0.3) -> bool:
    """
    Check if the content has excessive repetition.
    
    Args:
        content: The content to check
        threshold: The ratio threshold for repetition (default 30%)
        
    Returns:
        True if excessive repetition is detected
    """
    words = content.lower().split()
    if len(words) < 10:  # Too short to analyze
        return False
    
    # Count unique words
    unique_words = set(words)
    repetition_ratio = 1 - (len(unique_words) / len(words))
    
    return repetition_ratio > threshold


def calculate_special_character_ratio(content: str) -> float:
    """
    Calculate the ratio of special characters to total characters.
    
    Args:
        content: The content to analyze
        
    Returns:
        The ratio of special characters to total characters
    """
    if not content:
        return 0.0
    
    special_chars = sum(1 for c in content if not c.isalnum() and not c.isspace())
    return special_chars / len(content)


def has_balanced_punctuation(content: str) -> bool:
    """
    Check if the content has balanced punctuation.
    
    Args:
        content: The content to analyze
        
    Returns:
        True if punctuation appears balanced
    """
    # Count different punctuation marks
    question_marks = content.count('?')
    exclamation_marks = content.count('!')
    periods = content.count('.')
    
    # Check for unusual patterns (too many of one type)
    total_punct = question_marks + exclamation_marks + periods
    
    if total_punct == 0:
        # It's acceptable to have content with no punctuation
        return True
    
    # Check if one type dominates too much (more than 80%)
    if total_punct > 0:
        if (question_marks / total_punct > 0.8 or 
            exclamation_marks / total_punct > 0.8 or
            periods / total_punct < 0.1):  # Require at least some periods
            return False
    
    return True


def validate_text_selection_content(content: str) -> Tuple[bool, List[str]]:
    """
    Validate text selection content specifically.
    
    Args:
        content: The selected text content to validate
        
    Returns:
        Tuple of (is_valid, list_of_errors)
    """
    errors = []
    
    # Check length constraints
    if len(content) > 10000:  # 10,000 characters max
        errors.append("Selected text exceeds maximum length of 10,000 characters")
    
    if len(content) < 5:  # Too short to be meaningful
        errors.append("Selected text is too short to form a meaningful query context")
    
    # Check for sensitive information
    sensitive_patterns = [
        r'\b(password|secret|token|key|credential|auth|pwd|pass)\b',
        r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',  # Credit card pattern
        r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'  # Email pattern
    ]
    
    for pattern in sensitive_patterns:
        if re.search(pattern, content, re.IGNORECASE):
            errors.append("Selected text contains potentially sensitive information")
            break
    
    return len(errors) == 0, errors