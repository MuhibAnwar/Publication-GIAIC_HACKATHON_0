---

description: "Task list template for feature implementation"
---

# Tasks: RAG Chatbot with Text Selection

**Input**: Design documents from `/specs/1-rag-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /sp.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan in backend/
- [X] T002 Initialize Python 3.11 project with FastAPI dependencies in backend/requirements.txt
- [X] T003 [P] Configure linting and formatting tools (black, flake8) in backend/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [X] T004 Setup database schema and migrations framework for Neon Postgres
- [X] T005 [P] Implement configuration management for external services (Neon, Qdrant, Cohere)
- [X] T006 [P] Setup API routing and middleware structure in backend/src/api/
- [X] T007 Create base models/entities that all stories depend on
- [X] T008 Configure error handling and logging infrastructure
- [X] T009 Setup environment configuration management
- [X] T010 Create Qdrant client and connection management
- [X] T011 Create Cohere client and embedding service base
- [X] T012 Implement rate limiting and API key management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - General Book Questions (Priority: P1) 🎯 MVP

**Goal**: Enable users to ask general questions about book content and receive accurate answers with source citations within 2 seconds

**Independent Test**: Users can ask general questions about book content and receive accurate answers with source citations within 2 seconds.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T013 [P] [US1] Contract test for /query/general endpoint in backend/tests/contract/test_general_query.py
- [ ] T014 [P] [US1] Integration test for general user journey in backend/tests/integration/test_general_query.py

### Implementation for User Story 1

- [X] T015 [P] [US1] Create Chunk model in backend/src/models/chunk.py
- [X] T016 [P] [US1] Create Query model in backend/src/models/query.py
- [X] T017 [P] [US1] Create Session model in backend/src/models/session.py
- [X] T018 [US1] Implement RAGService in backend/src/services/rag_service.py (depends on T015, T016)
- [X] T019 [US1] Implement EmbeddingService in backend/src/services/embedding_service.py
- [X] T020 [US1] Implement VectorSearchService in backend/src/services/vector_search_service.py
- [X] T021 [US1] Implement GeneralQuery endpoint in backend/src/api/query.py
- [X] T022 [US1] Add validation and error handling for general queries
- [X] T023 [US1] Add logging for user story 1 operations
- [X] T024 [US1] Create citation formatting utility in backend/src/utils/citation.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Text Selection Queries (Priority: P2)

**Goal**: Enable users to select specific text in the book and ask questions about that selection to receive detailed explanations of complex passages

**Independent Test**: Users can select text and ask questions about it, receiving accurate answers that are specifically based only on the selected text.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T025 [P] [US2] Contract test for /query/selection endpoint in backend/tests/contract/test_selection_query.py
- [ ] T026 [P] [US2] Integration test for text selection user journey in backend/tests/integration/test_selection_query.py

### Implementation for User Story 2

- [X] T027 [P] [US2] Create TextSelection model in backend/src/models/text_selection.py
- [ ] T028 [US2] Modify Query model to support selection queries (T016)
- [X] T029 [US2] Enhance RAGService with selection-only filtering in backend/src/services/rag_service.py
- [ ] T030 [US2] Implement SelectionQuery endpoint in backend/src/api/query.py
- [ ] T031 [US2] Add validation and error handling for selection queries
- [ ] T032 [US2] Implement strict selection-only text search functionality
- [X] T033 [US2] Create text selection validation utility in backend/src/utils/text_selection.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Content Ingestion (Priority: P3)

**Goal**: Enable publishers to load book content into the system so that readers can ask questions about the book

**Independent Test**: A book's content can be successfully loaded into the system, with text properly chunked and indexed for retrieval.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T034 [P] [US3] Contract test for /ingest endpoint in backend/tests/contract/test_ingest.py
- [ ] T035 [P] [US3] Integration test for book ingestion journey in backend/tests/integration/test_ingest.py

### Implementation for User Story 3

- [X] T036 [P] [US3] Create ingestion service in backend/src/services/ingestion_service.py
- [X] T037 [US3] Implement semantic chunking algorithm in backend/src/utils/chunking.py
- [X] T038 [US3] Implement Ingest endpoint in backend/src/api/ingest.py
- [X] T039 [US3] Implement embedding generation and storage in backend/src/services/embedding_service.py
- [ ] T040 [US3] Add file upload handling and validation
- [X] T041 [US3] Create metadata extraction utility for chapter/page references
- [X] T042 [US3] Add validation for book content constraints
- [X] T043 [US3] Implement content validation and error reporting

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T044 [P] Documentation updates in backend/docs/
- [ ] T045 Code cleanup and refactoring
- [ ] T046 Performance optimization across all stories
- [ ] T047 [P] Additional unit tests (if requested) in backend/tests/unit/
- [ ] T048 Security hardening
- [ ] T049 [P] Health check endpoint implementation in backend/src/api/health.py
- [ ] T050 Rate limiting and monitoring setup
- [ ] T051 Session timeout and cleanup mechanism

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for /query/general endpoint in backend/tests/contract/test_general_query.py"
Task: "Integration test for general user journey in backend/tests/integration/test_general_query.py"

# Launch all models for User Story 1 together:
Task: "Create Chunk model in backend/src/models/chunk.py"
Task: "Create Query model in backend/src/models/query.py"
Task: "Create Session model in backend/src/models/session.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence