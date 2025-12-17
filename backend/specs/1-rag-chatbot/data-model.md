# Data Model: RAG Chatbot

**Feature**: RAG Chatbot with Text Selection
**Date**: 2025-12-16

## Overview

This document defines the data models for the RAG (Retrieval-Augmented Generation) chatbot system, including entities, relationships, and validation rules.

## Entities

### Chunk
- **ID**: UUID (Primary Key)
- **Text Content**: Text (max 512 tokens)
- **Metadata**: JSONB (contains chapter, page, paragraph, book_id, etc.)
- **Embedding Reference**: String (ID in Qdrant)
- **Book ID**: UUID
- **Created At**: Timestamp
- **Updated At**: Timestamp

**Validation Rules**:
- Text content must be less than 512 tokens
- Metadata must contain chapter, page, and paragraph information
- Book ID must reference a valid book

### Query
- **ID**: UUID (Primary Key)
- **Question**: Text
- **Response**: Text
- **Session ID**: UUID (Foreign Key to Session)
- **Source Citations**: JSONB (contains chapter/page references)
- **Timestamp**: Timestamp
- **Accuracy Metric**: Decimal (0-1)
- **Query Type**: Enum ('general', 'selection')

**Validation Rules**:
- Question must be non-empty
- Response must be non-empty
- Session ID must reference a valid session
- Accuracy metric must be between 0 and 1
- Query type must be either 'general' or 'selection'

### Text Selection
- **ID**: UUID (Primary Key)
- **Content**: Text (user-selected passage)
- **Context**: Text (surrounding context of selection)
- **Query ID**: UUID (Foreign Key to Query, nullable)
- **Created At**: Timestamp

**Validation Rules**:
- Content must not exceed 10,000 characters
- Context must provide sufficient surrounding text (min 200 chars before/after if available)
- Query ID must reference a valid query if provided

### Session
- **ID**: UUID (Primary Key)
- **Started At**: Timestamp
- **Last Activity**: Timestamp
- **User Agent**: Text (nullable)
- **IP Address**: Text (nullable)
- **Ended At**: Timestamp (nullable)

**Validation Rules**:
- Started At must be before Last Activity
- Ended At must be after Last Activity if provided
- IP Address must be a valid IP format
- Session should expire after 24 hours of inactivity

## Relationships

```
Session (1) ←→ (N) Query
Query (1) ←→ (1) Text Selection (optional)
Chunk (N) ←→ (1) Book (not directly modeled as Book entity is external)
Query (N) ←→ (1) Chunk (via source citations)
```

## State Transitions

### Session States:
1. **Active**: Session has started but no timeout
2. **Inactive**: Session exists but no activity for >15 mins
3. **Expired**: Session has timed out after 24 hours

### Query States:
1. **Pending**: Query received, processing
2. **Completed**: Response generated
3. **Failed**: Error during processing

## Indexes

### Database Indexes:
- Index on `chunks.book_id` for efficient book-based lookups
- Index on `queries.session_id` for session-based query retrieval
- Index on `queries.timestamp` for chronological query access
- Index on `sessions.last_activity` for timeout management

### Vector Database Indexes:
- Vector index on embeddings in Qdrant
- Payload index on book_id, chapter, and page for metadata filtering

## Constraints

1. **Referential Integrity**: All foreign key relationships must reference valid entities
2. **Uniqueness**: Each entity has a unique UUID identifier
3. **Data Volume**: Designed to handle up to 10,000 chunks per book with Qdrant Free Tier optimization
4. **Size Limits**: Text fields have appropriate size constraints to optimize database performance