---
id: 1
title: update-project-constitution
stage: constitution
date: 2025-12-15
surface: agent
model: claude-sonnet-4
feature: none
branch: master
user: Muhib Anwar
command: /sp.constitution
labels: ["constitution", "governance", "policy"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - .specify/templates/plan-template.md
 - .specify/templates/spec-template.md
 - .specify/templates/tasks-template.md
tests:
 - none
---

## Prompt

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3–7 words (slug for filename)
   - Route is automatically determined by stage:
     - `constitution` → `history/prompts/constitution/`
     - Feature stages → `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` → `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.

/sp.constitution 
Project: "Physical AI & Humanoid Robotics" Textbook
Primary Tools: Docusaurus, GitHub Pages, Spec-Kit Plus, Claude Code
Author: Muhib Anwar
Target Audience: Undergraduate/Graduate Engineering Students
License: MA GIAIC-PK 1.0

CONSTITUTION RULES:

1. **Content Standards**
   - All technical content must be peer-review quality with proper citations
   - Use IEEE citation format throughout
   - Maintain academic rigor while being accessible to students
   - Each chapter must include learning objectives, key terms, exercises, and references

2. **Technical Implementation**
   - Book structure follows Docusaurus best practices
   - All code examples in Python with ROS2 integration
   - Simulations use Gazebo/Isaac Sim where applicable
   - Mathematical notation with LaTeX in Markdown
   - All diagrams as SVG with textual descriptions

3. **Collaboration Rules**
   - AI generates content, human validates accuracy
   - Human provides domain expertise, AI handles formatting/structure
   - All generated code must be tested in simulation environment
   - Regular commits with meaningful messages
   - PR reviews for major content additions

4. **Quality Gates**
   - Each chapter reviewed for technical accuracy
   - All external references verified and accessible
   - Exercises must have solution guides (separate instructor manual)
   - Accessibility: All images have alt text, proper heading hierarchy

5. **Style Guidelines**
   - Tone: Professional academic, but engaging for students
   - Use active voice where possible
   - American English spelling
   - Code snippets include explanatory comments
   - Complex concepts include analogies and real-world examples

6.Tech Stack & Rules
1.  **Framework:** Docusaurus 3.x (Latest Stable).
2.  **Language:** TypeScript (for configuration), MDX (for content).
3.  **Styling:** Custom CSS for a clean, academic, "textbook" aesthetic.
4.  **Math Support:** MUST configure `remark-math` and `rehype-katex` to render LaTeX equations (essential for robotics kinematics/dynamics).
5.  **Diagrams:** MUST configure `@docusaurus/theme-mermaid` for system architecture diagrams.
6.  **Deployment:** GitHub Actions for automated deployment to GitHub Pages.

7. Coding & Writing Standards
* **Atomic Changes:** Make small, testable changes.
* **Documentation:** Every code block in the book must be commented.
* **Tone:** Academic yet accessible. Use "we" for guided learning.
* **Structure:** Use "Admonitions" (Notes, Tips, Dangers) frequently to highlight key robotics concepts.

## Response snapshot

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. Content Standards
All technical content must be peer-review quality with proper citations; Use IEEE citation format throughout; Maintain academic rigor while being accessible to students; Each chapter must include learning objectives, key terms, exercises, and references.

### II. Technical Implementation
Book structure follows Docusaurus best practices; All code examples in Python with ROS2 integration; Simulations use Gazebo/Isaac Sim where applicable; Mathematical notation with LaTeX in Markdown; All diagrams as SVG with textual descriptions.

### III. Collaboration Rules
AI generates content, human validates accuracy; Human provides domain expertise, AI handles formatting/structure; All generated code must be tested in simulation environment; Regular commits with meaningful messages; PR reviews for major content additions.

### IV. Quality Gates
Each chapter reviewed for technical accuracy; All external references verified and accessible; Exercises must have solution guides (separate instructor manual); Accessibility: All images have alt text, proper heading hierarchy.

### V. Style Guidelines
Tone: Professional academic, but engaging for students; Use active voice where possible; American English spelling; Code snippets include explanatory comments; Complex concepts include analogies and real-world examples.

### VI. Tech Stack & Rules
1. Framework: Docusaurus 3.x (Latest Stable).
2. Language: TypeScript (for configuration), MDX (for content).
3. Styling: Custom CSS for a clean, academic, "textbook" aesthetic.
4. Math Support: MUST configure `remark-math` and `rehype-katex` to render LaTeX equations (essential for robotics kinematics/dynamics).
5. Diagrams: MUST configure `@docusaurus/theme-mermaid` for system architecture diagrams.
6. Deployment: GitHub Actions for automated deployment to GitHub Pages.

### VII. Coding & Writing Standards
* Atomic Changes: Make small, testable changes.
* Documentation: Every code block in the book must be commented.
* Tone: Academic yet accessible. Use "we" for guided learning.
* Structure: Use "Admonitions" (Notes, Tips, Dangers) frequently to highlight key robotics concepts.

## Development Workflow

The development process follows a collaborative AI-human workflow where AI assists with content creation, formatting, and technical implementation while human experts provide domain knowledge, validate accuracy, and guide the pedagogical approach. All contributions must undergo peer review before merging.

## Quality Assurance

All technical content must undergo rigorous validation through simulation testing where applicable. Code examples must be executable and properly documented. Each chapter must include learning objectives, key terms, and exercises with solution guides. All external references must be verified and accessible to readers.

## Governance

This constitution governs all aspects of the Physical AI & Humanoid Robotics textbook development. All contributors must comply with these principles. Amendments to this constitution require approval from the project maintainers and must be documented with clear justification. All pull requests and code reviews must verify compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2025-12-15 | **Last Amended**: 2025-12-15

## Outcome

- ✅ Impact: Created project constitution for Physical AI & Humanoid Robotics textbook with all specified principles and guidelines
- 🧪 Tests: none
- 📁 Files: Updated constitution.md and aligned templates (plan-template.md, spec-template.md, tasks-template.md)
- 🔁 Next prompts: none
- 🧠 Reflection: The constitution now properly reflects the academic nature of the textbook project with appropriate content standards, tech stack requirements, and collaboration guidelines

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): not applicable
- Prompt variant (if applicable): not applicable
- Next experiment (smallest change to try): not applicable