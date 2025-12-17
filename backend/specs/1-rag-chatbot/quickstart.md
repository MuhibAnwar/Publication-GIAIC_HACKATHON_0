# Quickstart Guide: RAG Chatbot

**Feature**: RAG Chatbot with Text Selection
**Date**: 2025-12-16

## Overview

This guide provides a quick introduction to setting up and using the RAG (Retrieval-Augmented Generation) Chatbot for published books with text selection capability.

## Prerequisites

- Python 3.11+
- Access to Neon Postgres Serverless database
- Access to Qdrant Cloud cluster
- Cohere API key
- FastAPI-compatible environment

## Environment Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   export NEON_DB_URL='postgresql://neondb_owner:npg_CHP1DhnYQjU4@ep-young-lab-ad7ezzev-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
   export QDRANT_URL='https://e2e5d3db-a8c5-4a2c-bf55-ef3d4661f1bc.us-east4-0.gcp.cloud.qdrant.io'
   export QDRANT_API_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.DHxYWtJPGg37J71N4C5lPVm0KoFVi8EcSWKRYt1GzoE'
   export COHERE_API_KEY='246ctj5d1ATlVxfxCEW7UKOJPMmqKQi5AleSH6Ll'
   ```

## Running the Service

1. Start the backend server:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

2. Verify the service is running:
   ```bash
   curl http://localhost:8000/health
   ```

## Ingesting Book Content

To make a book available for querying:

```bash
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: multipart/form-data" \
  -F "book_id=123e4567-e89b-12d3-a456-426614174000" \
  -F "title=A Sample Book" \
  -F "content=Full text content of the book goes here..."
```

## Making Queries

### General Query (Entire Book)

```bash
curl -X POST http://localhost:8000/query/general \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the main theme of this book?",
    "book_id": "123e4567-e89b-12d3-a456-426614174000",
    "session_id": "123e4567-e89b-12d3-a456-426614174001"
  }'
```

### Selection Query (Specific Text)

```bash
curl -X POST http://localhost:8000/query/selection \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Can you explain this concept in simpler terms?",
    "selected_text": "The concept of relativity states that...",
    "book_id": "123e4567-e89b-12d3-a456-426614174000",
    "session_id": "123e4567-e89b-12d3-a456-426614174001"
  }'
```

## Key Architecture Components

### Service Layer
- `RAGService`: Orchestrates the RAG pipeline
- `EmbeddingService`: Handles text embedding using Cohere
- `VectorSearchService`: Interfaces with Qdrant for vector search
- `GenerationService`: Generates responses using OpenAI

### API Layer
- `/query/general`: Handles general book queries
- `/query/selection`: Handles text selection queries
- `/ingest`: Ingests and processes book content
- `/health`: Health check endpoint

### Data Layer
- Neon Postgres for structured data (queries, sessions, etc.)
- Qdrant Cloud for vector storage and similarity search

## Quality Gates

- Response time: <2 seconds for 95% of queries
- Accuracy: 85%+ for general mode, 95%+ for selection mode
- Concurrency: Support 50+ concurrent users
- Storage: Stay within Qdrant Free Tier limits (1GB)
- Error rate: <1% during normal operation

## Testing

Run the full test suite:
```bash
pytest
```

Run integration tests specifically:
```bash
pytest tests/integration/
```

Run performance tests:
```bash
# Load test for concurrent users
python scripts/load_test.py --concurrency 50
```

## Deployment

For production deployment:

1. Use a WSGI/ASGI server like Gunicorn
2. Set up a reverse proxy (nginx)
3. Configure SSL certificates
4. Set up monitoring and logging
5. Implement circuit breakers for external API calls

Example deployment command:
```bash
gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```