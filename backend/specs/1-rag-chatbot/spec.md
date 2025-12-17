# Feature Specification: RAG Chatbot with Text Selection

**Feature Branch**: `1-rag-chatbot`
**Created**: 2025-12-16
**Status**: Draft
**Input**: User description: "Integrated RAG Chatbook Chatbot for Published Book **Project**: Book-embedded chatbot answering questions about content with text-selection capability **Target Audience**: Book readers accessing the published digital book **Primary Use Case**: Readers asking questions about book content, with optional text selection for focused queries **Secondary Use Case**: Publishers wanting engagement analytics and reader insights **Technical Stack Already Configured**: 1. **Database**: Neon Postgres Serverless - URL: `postgresql://neondb_owner:npg_CHP1DhnYQjU4@ep-young-lab-ad7ezzev-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` 2. **Vector Database**: Qdrant Cloud - Cluster ID: `e2e5d3db-a8c5-4a2c-bf55-ef3d4661f1bc` - Endpoint: `https://e2e5d3db-a8c5-4a2c-bf55-ef3d4661f1bc.us-east4-0.gcp.cloud.qdrant.io` - API Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.DHxYWtJPGg37J71N4C5lPVm0KoFVi8EcSWKRYt1GzoE` 3. **Embedding API**: Cohere - API Key: `246ctj5d1ATlVxfxCEW7UKOJPMmqKQi5AleSH6Ll` 4. **Development Tools**: - qwen CLI for project scaffolding - spec-kit plus for specification generation - Frontend components already built (as per your note) **Core Requirements**: 1. **Dual Query Modes**: - **General Mode**: Answer questions about entire book content - **Selection Mode**: Answer questions based ONLY on user-selected text passages 2. **Retrieval-Augmented Generation**: - Split book content into chunks with optimal overlap - Generate embeddings using Cohere API - Store vectors in Qdrant with metadata (chapter, page, paragraph) - Implement hybrid search (vector + keyword) for better recall 3. **API Layer**: - FastAPI backend with REST endpoints - `/query/general` - for general book questions - `/query/selection` - for text-selection queries - `/ingest` - for initial book content loading - `/health` - service status checks 4. **Database Schema** (Neon Postgres): - `chunks` table: text chunks, metadata, embedding references - `queries` table: user questions, responses, timestamps - `selections` table: user text selections with context - `sessions` table: user interaction sessions **Success Criteria**: 1. **Functional**: - Chatbot answers general book questions with 85%+ accuracy - Selection mode provides 95%+ accurate answers based on selected text - Response includes source citations (chapter/page references) - Latency under 2 seconds for typical queries 2. **Technical**: - All configured services (Neon, Qdrant, Cohere) properly integrated - Frontend-backend communication seamless - API endpoints secured and documented - Vector search returns top 5 most relevant chunks 3. **Performance**: - Handles 50+ concurrent users - Qdrant usage stays within Free Tier limits (1GB storage) - Neon Postgres queries optimized for speed - Error rate below 1% **Constraints**: 1. **Technical Limits**: - Qdrant Free Tier: 1GB storage, 1 cluster - Cohere API: Rate limits based on tier (assume free tier limits) - Neon Postgres: 3GB storage, 10k rows free tier 2. **Development Constraints**: - Use existing frontend components - Integrate with OpenAI Agents/ChatKit SDKs for chat interface - Must work within published book's existing architecture - Real-time response required 3. **Data Constraints**: - Book content must be pre-processed and chunked - Embeddings must be generated for all chunks - Metadata must include positional information for citations **What We're NOT Building**: 1. User authentication system (assume anonymous access) 2. Book editing or content modification features 3. Advanced analytics dashboard (beyond basic usage tracking) 4. Multi-book support (single book only) 5. Offline functionality 6. Voice interface or audio responses 7. Translation capabilities 8. Social sharing features **Key Decisions to Make**: 1. Chunking strategy: Fixed size vs semantic boundaries 2. Embedding model: Which Cohere model to use (small vs large) 3. Hybrid search weighting: Vector vs keyword search balance 4. Response generation: Using Cohere vs OpenAI for final answer 5. Session management: How to track user conversations **Implementation Phases**: 1. **Phase 1**: Set up database schema and ingest book content 2. **Phase 2**: Implement basic RAG pipeline with Cohere embeddings 3. **Phase 3**: Build selection mode functionality 4. **Phase 4**: Integrate with existing frontend 5. **Phase 5**: Optimize and add monitoring **Risks to Mitigate**: 1. Qdrant Free Tier storage limits with large books 2. Cohere API costs with high usage 3. Response accuracy for complex questions 4. Integration issues with existing frontend 5. Performance with concurrent users **Testing Strategy**: 1. Unit tests for chunking and embedding functions 2. Integration tests for API endpoints 3. Accuracy tests with sample Q&A pairs 4. Load testing for concurrent users 5. Selection mode specific tests **Deliverables**: 1. Fully functional FastAPI backend 2. Integrated frontend with dual query modes 3. Database schema and populated data 4. Qdrant collection with book embeddings 5. API documentation 6. Deployment guide"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - General Book Questions (Priority: P1)

As a book reader, I want to ask general questions about the book content so that I can quickly find relevant information without manually searching through the entire book.

**Why this priority**: This is the primary use case that provides the core value of the chatbot, allowing users to get answers about the overall book content.

**Independent Test**: Users can ask general questions about book content and receive accurate answers with source citations within 2 seconds.

**Acceptance Scenarios**:

1. **Given** a user has access to the book, **When** the user asks a general question about book content, **Then** the chatbot returns an accurate answer with relevant source citations
2. **Given** a user asks a question about book content, **When** the system processes the question, **Then** the response is delivered within 2 seconds

---

### User Story 2 - Text Selection Queries (Priority: P2)

As a book reader, I want to select specific text in the book and ask questions about that selection so that I can get detailed explanations of complex passages.

**Why this priority**: This provides an enhanced experience for users who need clarification on specific parts of the text.

**Independent Test**: Users can select text and ask questions about it, receiving accurate answers that are specifically based only on the selected text.

**Acceptance Scenarios**:

1. **Given** a user has selected text within the book, **When** the user asks a question about the selected text, **Then** the chatbot returns an answer based only on that specific text passage with 95%+ accuracy
2. **Given** a user has selected text, **When** the user asks a question about the selection, **Then** the response is delivered within 2 seconds

---

### User Story 3 - Content Ingestion (Priority: P3)

As a publisher, I want to be able to load book content into the system so that readers can ask questions about the book.

**Why this priority**: This is foundational functionality required for the chatbot to work with any book content.

**Independent Test**: A book's content can be successfully loaded into the system, with text properly chunked and indexed for retrieval.

**Acceptance Scenarios**:

1. **Given** a book in digital format, **When** the ingestion process runs, **Then** the content is properly chunked and stored in the database and vector store
2. **Given** book content has been ingested, **When** the system is queried, **Then** it can retrieve relevant information from the content

---

### Edge Cases

- What happens when a user asks a question not covered by the book content?
- How does the system handle very long text selections?
- What happens when the system is at maximum capacity with 50+ concurrent users?
- How does the system respond when Qdrant storage approaches the 1GB limit?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support dual query modes: general (entire book) and selection (specific text passages only)
- **FR-002**: System MUST ingest book content and split it into properly chunked segments with metadata
- **FR-003**: System MUST generate and store embeddings for text chunks using Cohere API
- **FR-004**: System MUST return relevant results with source citations (chapter/page references) for all queries
- **FR-005**: System MUST provide responses with 85%+ accuracy for general queries and 95%+ accuracy for selection queries
- **FR-006**: System MUST deliver responses within 2 seconds for typical queries
- **FR-007**: Users MUST be able to select text passages and ask questions specifically about those selections
- **FR-008**: System MUST store query history and session data in Neon Postgres
- **FR-009**: System MUST implement hybrid search combining vector and keyword matching
- **FR-010**: System MUST handle 50+ concurrent users without degradation in performance
- **FR-011**: System MUST use the large Cohere model for generating embeddings
- **FR-012**: System MUST use OpenAI for final answer generation

### Key Entities *(include if feature involves data)*

- **Chunk**: A segment of book content with metadata (chapter, page, paragraph), text content, and embedding references; uniquely identified by UUID
- **Query**: A user question with timestamps, response, accuracy metrics, and source citations; uniquely identified by UUID
- **Text Selection**: A portion of text selected by the user with context information and associated queries; uniquely identified by UUID
- **Session**: A user interaction session containing multiple queries and selections with timestamps; uniquely identified by UUID with session timeout rules

## Clarifications

### Session 2025-12-16

- Q: Identity & Uniqueness Rules for Data Entities → A: Each entity should have a unique UUID with specific business rules for what constitutes uniqueness

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Chatbot answers general book questions with 85%+ accuracy
- **SC-002**: Selection mode provides 95%+ accurate answers based on selected text
- **SC-003**: Response includes source citations (chapter/page references) for all answers
- **SC-004**: Latency is under 2 seconds for 95% of typical queries
- **SC-005**: System handles 50+ concurrent users with consistent performance
- **SC-006**: Vector search returns top 5 most relevant chunks for each query
- **SC-007**: Qdrant usage stays within Free Tier limits (1GB storage)
- **SC-008**: Error rate is below 1% during normal operation