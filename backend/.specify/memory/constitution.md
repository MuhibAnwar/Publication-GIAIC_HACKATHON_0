<!-- SYNC IMPACT REPORT
Version change: N/A -> 1.0.0
List of modified principles: N/A (new constitution)
Added sections: All principles and sections are newly added
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated (aligns with new principles)
  - .specify/templates/spec-template.md ✅ updated (aligns with new principles)  
  - .specify/templates/tasks-template.md ✅ updated (aligns with new principles)
  - .qwen/commands/sp.constitution.toml ✅ updated (aligns with new principles)
  - QWEN.md ✅ updated (references unchanged)
Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Original adoption date unknown - needs to be set when constitution is formally ratified
-->
# Integrated RAG Chatbot for Published Book Constitution

## Core Principles

### Accuracy through context-aware retrieval
Responses must be strictly based on book content and user-selected text. This ensures that all chatbot answers maintain high fidelity to the source material and provides users with trustworthy information.

### Technical precision
All integrations must follow SDK specifications and API standards. This ensures interoperability between different components and maintains a consistent development experience across the team.

### User-centric functionality
Chatbot must handle both general book queries and text-selection-specific questions. This principle ensures the chatbot serves users' diverse information needs effectively.

### Performance optimization
Implement efficient vector search and response generation. This ensures users receive quick, responsive results without sacrificing accuracy.

### Source fidelity
All answers must be traceable to book passages or user-selected text. This creates accountability and allows users to verify information by referencing the original source.

### Security and scalability
Implement proper API key management and input sanitization while designing for concurrent user access. This ensures the system remains secure and performs well under load.

## Technical Constraints

Database: Neon Serverless Postgres - optimize for vector operations; Vector DB: Qdrant Cloud Free Tier - manage within tier limits (1GB storage); Tooling: qwen CLI and spec-kit plus for project scaffolding; Architecture: Clean separation between retrieval, generation, and presentation layers; Latency: Response time under 3 seconds for typical queries; Scalability: Design for concurrent user access (minimum 50 concurrent users)

## Quality Gates

RAG accuracy: Minimum 90% answer relevance score in testing; Selection-specific mode: Perfect accuracy on user-selected text queries; Integration: All components (frontend, API, databases) must communicate without errors; Documentation: Complete API documentation and deployment guide; Testing: Unit tests for core RAG functions and integration tests for full workflow

## Governance

Tech stack compliance: Use OpenAI Agents/ChatKit SDKs as specified; Implement FastAPI with proper REST standards; Set up Neon Postgres with optimized schemas; Configure Qdrant Cloud with proper vector indexing; Response validation: Every answer must include confidence scores and source references; Frontend integration: Seamless embedding within published book interface. Constitution supersedes all other practices; Amendments require documentation, approval, and migration plan. All PRs/reviews must verify compliance; Complexity must be justified.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Original adoption date unknown | **Last Amended**: 2025-12-16