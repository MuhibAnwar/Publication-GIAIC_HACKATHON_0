---
id: 5
title: generate-textbook-tasks
stage: tasks
date: 2025-12-15
surface: agent
model: claude-sonnet-4
feature: physical-ai-textbook
branch: 001-physical-ai-textbook
user: Muhib Anwar
command: /sp.tasks
labels: ["tasks", "implementation", "planning", "education", "textbook"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-physical-ai-textbook/tasks.md
tests:
 - none
---

## Prompt

---
description: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Setup**: Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load design documents**: Read from FEATURE_DIR:
   - **Required**: plan.md (tech stack, libraries, structure), spec.md (user stories with priorities)
   - **Optional**: data-model.md (entities), contracts/ (API endpoints), research.md (decisions), quickstart.md (test scenarios)
   - Note: Not all projects have all documents. Generate tasks based on what's available.

3. **Execute task generation workflow**:
   - Load plan.md and extract tech stack, libraries, project structure
   - Load spec.md and extract user stories with their priorities (P1, P2, P3, etc.)
   - If data-model.md exists: Extract entities and map to user stories
   - If contracts/ exists: Map endpoints to user stories
   - If research.md exists: Extract decisions for setup tasks
   - Generate tasks organized by user story (see Task Generation Rules below)
   - Generate dependency graph showing user story completion order
   - Create parallel execution examples per user story
   - Validate task completeness (each user story has all needed tasks, independently testable)

4. **Generate tasks.md**: Use `.specify.specify/templates/tasks-template.md` as structure, fill with:
   - Correct feature name from plan.md
   - Phase 1: Setup tasks (project initialization)
   - Phase 2: Foundational tasks (blocking prerequisites for all user stories)
   - Phase 3+: One phase per user story (in priority order from spec.md)
   - Each phase includes: story goal, independent test criteria, tests (if requested), implementation tasks
   - Final Phase: Polish & cross-cutting concerns
   - All tasks must follow the strict checklist format (see Task Generation Rules below)
   - Clear file paths for each task
   - Dependencies section showing story completion order
   - Parallel execution examples per story
   - Implementation strategy section (MVP first, incremental delivery)

5. **Report**: Output path to generated tasks.md and summary:
   - Total task count
   - Task count per user story
   - Parallel opportunities identified
   - Independent test criteria for each story
   - Suggested MVP scope (typically just User Story 1)
   - Format validation: Confirm ALL tasks follow the checklist format (checkbox, ID, labels, file paths)

Context for task generation: 1.1 Clone Spec-Kit Plus template 1.2 Initialize Docusaurus with TypeScript 1.3 Configure GitHub repository with branch protection 1.4 Set up GitHub Actions workflow for deployment 1.5 Configure domain (if using custom domain) 1.6 Set up analytics (Plausible/Google Analytics) 1.7 Create basic README and contribution guidelines PER-CHAPTER TASKS: 2.1 Create chapter directory structure 2.2 Write learning objectives and outcomes 2.3 Develop chapter outline with sections 2.4 Draft content with AI assistance 2.5 Add mathematical notation with LaTeX 2.6 Create diagrams/figures (Mermaid.js/SVG) 2.7 Develop code examples with explanations 2.8 Write exercises with varying difficulty 2.9 Compile reference list (BibTeX) 2.10 Create knowledge check questions 3.1 ROS2 visualization component 3.2 3D model viewer (Three.js integration) 3.3 Interactive equation solver 3.4 Code execution sandbox (WASM-based) 3.5 Quiz and assessment widgets 3.6 Progress tracking dashboard 3.7 Simulation controls interface 3.8 Collaborative annotation system 4.1 Automated link checker implementation 4.2 Code example validator 4.3 Citation verification script 4.4 Accessibility audit (axe-core integration) 4.5 Performance testing suite 4.6 Cross-browser compatibility tests 4.7 Mobile responsiveness validation 4.8 SEO audit and optimization

The tasks.md should be immediately executable - each task must be specific enough that an LLM can complete it without additional context.

## Task Generation Rules

**CRITICAL**: Tasks MUST be organized by user story to enable independent implementation and testing.

**Tests are OPTIONAL**: Only generate test tasks if explicitly requested in the feature specification or if user requests TDD approach.

### Checklist Format (REQUIRED)

Every task MUST strictly follow this format:

```text
- [ ] [TaskID] [P?] [Story?] Description with file path
```

**Format Components**:

1. **Checkbox**: ALWAYS start with `- [ ]` (markdown checkbox)
2. **Task ID**: Sequential number (T001, T002, T003...) in execution order
3. **[P] marker**: Include ONLY if task is parallelizable (different files, no dependencies on incomplete tasks)
4. **[Story] label**: REQUIRED for user story phase tasks only
   - Format: [US1], [US2], [US3], etc. (maps to user stories from spec.md)
   - Setup phase: NO story label
   - Foundational phase: NO story label  
   - User Story phases: MUST have story label
   - Polish phase: NO story label
5. **Description**: Clear action with exact file path

**Examples**:

- ✅ CORRECT: `- [ ] T001 Create project structure per implementation plan`
- ✅ CORRECT: `- [ ] T005 [P] Implement authentication middleware in src/middleware/auth.py`
- ✅ CORRECT: `- [ ] T012 [P] [US1] Create User model in src/models/user.py`
- ✅ CORRECT: `- [ ] T014 [US1] Implement UserService in src/services/user_service.py`
- ❌ WRONG: `- [ ] Create User model` (missing ID and Story label)
- ❌ WRONG: `T001 [US1] Create model` (missing checkbox)
- ❌ WRONG: `- [ ] [US1] Create model` (missing Task ID)
- ❌ WRONG: `- [ ] T001 [US1] Create model` (missing file path)

### Task Organization

1. **From User Stories (spec.md)** - PRIMARY ORGANIZATION:
   - Each user story (P1, P2, P3...) gets its own phase
   - Map all related components to their story:
     - Models needed for that story
     - Services needed for that story
     - Endpoints/UI needed for that story
     - If tests requested: Tests specific to that story
   - Mark story dependencies (most stories should be independent)

2. **From Contracts**:
   - Map each contract/endpoint → to the user story it serves
   - If tests requested: Each contract → contract test task [P] before implementation in that story's phase

3. **From Data Model**:
   - Map each entity to the user story(ies) that need it
   - If entity serves multiple stories: Put in earliest story or Setup phase
   - Relationships → service layer tasks in appropriate story phase

4. **From Setup/Infrastructure**:
   - Shared infrastructure → Setup phase (Phase 1)
   - Foundational/blocking tasks → Foundational phase (Phase 2)
   - Story-specific setup → within that story's phase

### Phase Structure

- **Phase 1**: Setup (project initialization)
- **Phase 2**: Foundational (blocking prerequisites - MUST complete before user stories)
- **Phase 3+**: User Stories in priority order (P1, P2, P3...)
  - Within each story: Tests (if requested) → Models → Services → Endpoints → Integration
  - Each phase should be a complete, independently testable increment
- **Final Phase**: Polish & Cross-Cutting Concerns

---

## Response snapshot

I have successfully generated a comprehensive tasks.md file for the Physical AI & Humanoid Robotics Textbook implementation. Here's what was accomplished:

1. **Loaded Design Documents**: 
   - Parsed plan.md to extract technology stack (Docusaurus 3.x, TypeScript, Python 3.11, etc.)
   - Extracted user stories with priorities from spec.md (P1, P2, P3)
   - Used data-model.md to understand entities (Chapter, Exercise, Student, etc.)
   - Referenced the API contracts from assessment-api.yaml

2. **Structured Task Organization**:
   - Created 5 phases: Setup, Foundational, US1 (Access Content), US2 (Interactive Experience), US3 (Assessment & Tracking)
   - Added a final phase for polish and cross-cutting concerns

3. **Generated 51 Specific Tasks**:
   - Phase 1 (Setup): 7 tasks for project initialization
   - Phase 2 (Foundational): 8 tasks for blocking prerequisites
   - Phase 3 (US1): 11 tasks for content access functionality
   - Phase 4 (US2): 8 tasks for interactive elements
   - Phase 5 (US3): 12 tasks for assessment and tracking
   - Phase N (Polish): 5 tasks for final improvements

4. **Followed Required Format**:
   - Every task follows the checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
   - Parallel tasks marked with [P] where appropriate
   - User story tasks labeled with [US1], [US2], [US3]
   - Clear file paths specified for each implementation task

5. **Mapped Requirements to Implementation**:
   - Tasks address all specified functional requirements (FR-001 through FR-025)
   - Includes implementation of all key entities from the data model
   - Covers API endpoints from the contract specification
   - Addresses success criteria (SC-001 through SC-012)

The generated tasks.md file is now ready for implementation and follows all specified guidelines for task organization and format.

## Outcome

- ✅ Impact: Comprehensive, actionable task list generated with proper dependencies
- 🧪 Tests: Tests included where relevant as optional tasks
- 📁 Files: Created tasks.md with 51 specific, executable tasks
- 🔁 Next prompts: Ready for implementation following the structured task list
- 🧠 Reflection: The task list enables parallel development with clear dependencies and independent testing of each user story.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): not applicable
- Prompt variant (if applicable): not applicable
- Next experiment (smallest change to try): not applicable