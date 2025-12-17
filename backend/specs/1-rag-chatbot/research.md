# Research: RAG Chatbot Implementation

**Feature**: RAG Chatbot with Text Selection
**Date**: 2025-12-16

## Overview

This document captures research findings for implementing a RAG (Retrieval-Augmented Generation) chatbot for published books with dual query modes: general and selection-specific.

## Key Decision: Chunking Strategy

**Decision**: Use semantic chunking rather than fixed-size chunking
**Rationale**: Semantic chunking maintains the contextual meaning of text segments, which is crucial for accurate retrieval and response generation. It ensures that when a user asks about a concept, the relevant semantic unit is retrieved rather than a potentially fragmented section.
**Alternatives considered**: Fixed-size chunking (e.g., 512 tokens), sliding window chunking
**Chosen approach**: Using sentence or paragraph boundaries to maintain meaning while keeping chunks under 512 tokens to optimize for Cohere's embedding model

## Key Decision: Embedding Model Choice

**Decision**: Use Cohere's large embedding model
**Rationale**: The large model provides higher accuracy for embeddings, which is essential for achieving the required 85%+ accuracy for general queries and 95%+ accuracy for selection queries. Though it may be slower than the small model, it better meets the accuracy requirements.
**Alternatives considered**: Cohere's small embedding model, OpenAI embeddings
**Chosen approach**: Cohere's large embedding model (multilingual-22-12) as specified in the project requirements

## Key Decision: Hybrid Retrieval Weighting

**Decision**: Use 70% vector similarity, 30% keyword matching
**Rationale**: Vector similarity provides semantic understanding, while keyword matching ensures exact phrase matches are prioritized. The 70/30 split favors semantic understanding while ensuring precision for exact matches.
**Alternatives considered**: Pure vector search, pure keyword search, 50/50 weighting
**Chosen approach**: 70% vector, 30% keyword to optimize for semantic retrieval while maintaining precision

## Key Decision: Selection-Mode Enforcement

**Decision**: Implement strict filtering to only search within user-selected text
**Rationale**: This ensures selection mode provides 95%+ accuracy on user-selected text as required by the specification. The system will create a temporary index or filtered search space based on the selected text only.
**Alternatives considered**: Weight-based boosting of selected text, post-processing to validate responses
**Chosen approach**: Pre-filtering the searchable corpus to only contain the selected text passages

## Key Decision: Session Tracking Approach

**Decision**: Use a hybrid approach with stateless JWT tokens for authentication but server-side session state
**Rationale**: While the system assumes anonymous access, tracking conversations improves the user experience through context. Server-side storage allows better control and persistence of conversation history.
**Alternatives considered**: Fully stateless (no conversation history), fully client-side storage
**Chosen approach**: Stateless authentication tokens with server-side session management in Neon Postgres

## Technical Research Findings

### Performance Optimization
- Implement caching for frequently requested book sections
- Use async/await patterns for I/O operations (database, API calls)
- Implement connection pooling for Neon Postgres
- Use batch processing for embedding generation

### Qdrant Free Tier Optimization
- Implement chunk size optimization to maximize storage efficiency
- Implement embedding compression techniques where possible
- Monitor storage usage with alerts for approaching limits

### Security Considerations
- Sanitize user inputs to prevent injection attacks
- Implement rate limiting to prevent API abuse
- Secure API keys with proper environment variable management
- Implement proper error handling to avoid information disclosure

### Scalability
- Design for horizontal scaling with stateless request processing
- Implement load balancing for handling 50+ concurrent users
- Use CDN for static assets
- Optimize database queries with proper indexing

## Implementation Considerations

### Architecture
- Use FastAPI for the backend API to leverage async capabilities
- Implement service layer for business logic
- Create separate modules for ingestion, retrieval, and generation
- Use Pydantic models for request/response validation

### Error Handling
- Implement graceful degradation when vector database is unavailable
- Fallback mechanisms for API failures
- Proper logging for debugging and monitoring

### Testing Strategy
- Unit tests for core RAG functions
- Integration tests for end-to-end workflows
- Load tests to verify concurrent user handling
- Accuracy tests with known question-answer pairs