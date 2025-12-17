# Documentation and Validation

## Physical AI & Humanoid Robotics Textbook

### Overview

The Physical AI & Humanoid Robotics textbook is an interactive educational platform built with Docusaurus 3.x. It bridges the gap between digital AI and physical robotics, focusing on how large language models (LLMs) and vision-language-action (VLA) models can be integrated with humanoid robotics systems.

The textbook provides comprehensive coverage of:
- ROS2 fundamentals and architecture
- Simulation environments (Isaac Sim, Gazebo)
- Vision-Language-Action (VLA) models integration
- Real-world humanoid robotics applications
- Assessment and progress tracking systems

### Technology Stack

- **Framework**: Docusaurus 3.x (React-based static site generator)
- **Languages**: TypeScript, Python (for ROS2 integration)
- **Math Rendering**: LaTeX via remark-math and rehype-katex
- **3D Visualization**: Three.js for interactive models
- **ROS2 Integration**: rosbridge_suite for real-time visualization
- **Authentication**: LTI integration for Canvas/Moodle
- **PWA**: Offline capabilities with service workers

### Directory Structure

```
website/                 # Docusaurus-based textbook website
├── docusaurus.config.js    # Docusaurus configuration with LaTeX, search, PWA, etc.
├── package.json            # Dependencies: Docusaurus, remark-math, rehype-katex, etc.
├── sidebars.js             # Navigation structure for textbook chapters
├── static/                 # Static assets (images, simulations, code examples)
│   ├── img/                # Book illustrations and diagrams
│   ├── simulations/        # Gazebo/Isaac Sim files
│   └── code/               # Python/ROS2 code examples
├── src/
│   ├── components/         # Custom React components (ROS2 visualizer, 3D models)
│   ├── pages/              # Additional pages (dashboard, profile, etc.)
│   ├── css/                # Custom styling for textbook aesthetic
│   └── theme/              # Custom theme components
├── docs/                   # Textbook content organized by chapters
│   ├── intro/              # Introduction module
│   ├── module-1/           # Module 1 content (ROS2)
│   ├── module-2/           # Module 2 content (Simulation)
│   ├── module-3/           # Module 3 content (Isaac)
│   ├── module-4/           # Module 4 content (VLA)
│   └── capstone/           # Capstone project
└── tests/                  # Frontend and integration tests
    ├── components/         # Component tests
    ├── e2e/                # End-to-end tests for student workflows
    └── utils/              # Test utilities
```

### Chapter Structure

Each chapter follows a consistent structure:

```
chapter-name/
├── index.mdx           # Main content with learning objectives and text
├── exercises.mdx       # Chapter exercises and projects
└── references.bib      # BibTeX references
```

### Models

The application uses several key data models:

#### Chapter Model
```typescript
interface Chapter {
  id: string;
  title: string;
  content: string;
  learningObjectives: string[];
  keyTerms: string[];
  exercises: string[];
  references: string[];
  prerequisites: string[];
  nextChapter?: string;
  previousChapter?: string;
}
```

#### Exercise Model
```typescript
interface Exercise {
  id: string;
  type: ExerciseType; // multiple_choice | coding | simulation | essay | problem_solving
  question: string;
  options?: string[];
  correctAnswer?: any;
  explanation: string;
  difficulty: DifficultyLevel; // beginner | intermediate | advanced
  associatedChapter: string;
  autoGraded: boolean;
}
```

#### ProgressRecord Model
```typescript
interface ProgressRecord {
  id: string;
  studentId: string;
  chapterId: string;
  status: ProgressStatus; // not_started | in_progress | completed
  exercisesCompleted: string[];
  exerciseScores: {[exerciseId: string]: number};
  dateStarted: Date;
  dateCompleted?: Date;
  timeSpent: number;
}
```

### Interactive Components

#### ROS2 Visualizer
Interactive visualization of ROS2 concepts with real-time data from ROS2 systems.

#### 3D Model Viewer
Three.js-based component for viewing and interacting with 3D models of robotic systems.

#### Equation Solver
Interactive component for solving physics and robotics equations step by step.

### Assessment System

The assessment system provides auto-graded exercises with immediate feedback:

- Multiple choice questions
- Coding exercises with automated grading
- Simulation-based assessments
- Essay questions with instructor review

### LTI Integration

The platform supports LTI integration with learning management systems like Canvas and Moodle, allowing seamless integration into existing academic workflows.

### API Endpoints

The assessment system uses the following API endpoints:

```
POST /assessments/{exerciseId}/submit   # Submit exercise answers
GET  /exercises/{exerciseId}            # Get exercise details
GET  /students/{studentId}/progress     # Get student progress
POST /students/{studentId}/chapters/{chapterId}/progress  # Update chapter progress
POST /lti/launch                        # LTI launch endpoint
GET  /chapters/{chapterId}              # Get chapter content
```

### Validation

#### Unit Tests
- Chapter model validation
- Exercise model validation
- ProgressRecord model validation
- Student model validation

#### Component Tests
- LaTeX equation rendering
- ROS2 visualization component
- 3D model viewer component
- Exercise component functionality

#### Integration Tests
- Chapter content loading and display
- Browser-based simulation demo
- Assessment API contract testing