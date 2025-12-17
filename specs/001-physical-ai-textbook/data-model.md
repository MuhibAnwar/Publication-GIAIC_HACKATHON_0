# Data Model: Physical AI & Humanoid Robotics Textbook

## Entities

### Chapter
- **Fields**:
  - id: string (unique identifier)
  - title: string (chapter title)
  - content: MDXContent (main content with LaTeX support)
  - learningObjectives: string[] (list of learning objectives)
  - keyTerms: string[] (key terms defined in chapter)
  - exercises: Exercise[] (associated exercises)
  - references: Reference[] (bibliography entries)
  - prerequisites: string[] (prerequisite knowledge, e.g., "linear algebra", "Python")
  - nextChapter: string (id of next chapter in sequence)
  - previousChapter: string (id of previous chapter in sequence)

- **Relationships**:
  - One-to-many with Exercise (one chapter has many exercises)
  - One-to-many with Reference (one chapter has many references)

### Exercise
- **Fields**:
  - id: string (unique identifier)
  - type: ExerciseType (multiple choice, coding, simulation, essay)
  - question: string (exercise prompt)
  - options: string[] (for multiple choice)
  - correctAnswer: string | number | any (correct answer)
  - explanation: string (explanation of correct answer)
  - difficulty: DifficultyLevel (beginner, intermediate, advanced)
  - associatedChapter: string (id of associated chapter)
  - autoGraded: boolean (whether exercise can be auto-graded)

- **Relationships**:
  - Many-to-one with Chapter (many exercises belong to one chapter)

### Student
- **Fields**:
  - id: string (unique identifier)
  - name: string (student name)
  - email: string (student email)
  - institution: string (student's educational institution)
  - enrolledCourses: string[] (list of course IDs the student is enrolled in)
  - progress: ProgressRecord[] (tracking student progress)
  - preferences: UserPreferences (user preferences like theme, language)

- **Relationships**:
  - One-to-many with ProgressRecord (one student has many progress records)

### Instructor
- **Fields**:
  - id: string (unique identifier)
  - name: string (instructor name)
  - email: string (instructor email)
  - institution: string (instructor's educational institution)
  - managedCourses: string[] (list of course IDs the instructor manages)
  - permissions: string[] (list of permissions)

- **Relationships**:
  - One-to-many with Course (one instructor can manage many courses)

### ProgressRecord
- **Fields**:
  - id: string (unique identifier)
  - studentId: string (reference to student)
  - chapterId: string (reference to chapter)
  - exercisesCompleted: string[] (ids of exercises completed)
  - exerciseScores: {[exerciseId: string]: number} (scores for each exercise)
  - dateStarted: Date (when student started the chapter)
  - dateCompleted: Date | null (when student completed the chapter)
  - timeSpent: number (time spent on this chapter in seconds)

- **Relationships**:
  - Many-to-one with Student (many progress records for one student)
  - Many-to-one with Chapter (many progress records for one chapter)

### Course
- **Fields**:
  - id: string (unique identifier)
  - title: string (course title)
  - description: string (course description)
  - textbookChapters: string[] (ordered list of chapter IDs in the course)
  - instructors: string[] (instructor IDs)
  - students: string[] (student IDs enrolled in the course)
  - schedule: CourseSchedule (course schedule and timeline)

- **Relationships**:
  - Many-to-many with Student (many courses to many students)
  - Many-to-one with Instructor (many courses to one or many instructors)

### Reference
- **Fields**:
  - id: string (unique identifier)
  - title: string (reference title)
  - authors: string[] (author names)
  - publication: string (publication venue)
  - year: number (publication year)
  - doi: string (digital object identifier)
  - url: string (URL to reference)
  - citationType: CitationType (book, article, conference, etc.)
  - ieeeCitation: string (formatted IEEE citation)

- **Relationships**:
  - Many-to-many with Chapter (many references can be used in many chapters)

## State Transitions

### Student Progress States
- `not_started` → `in_progress` → `completed` (when student progresses through a chapter)
- `in_progress` → `completed` (when student completes all exercises in a chapter)

### Exercise Status States
- `unattempted` → `in_progress` → `submitted` → `graded` (for auto-gradable exercises)
- `unattempted` → `in_progress` → `submitted` → `pending_review` (for exercises requiring instructor review)

## Validation Rules

### Chapter
- Title must not be empty
- Content must contain at least one learning objective
- References must be properly formatted in IEEE style
- Prerequisites must be valid knowledge areas

### Exercise
- Question must not be empty
- For multiple choice: must have at least 2 options and 1 correct answer
- For auto-graded exercises: correct answer must be defined
- Difficulty must be one of: beginner, intermediate, advanced

### Student
- Email must be valid
- Institution must be valid
- Progress records must be consistent with course enrollment

### ProgressRecord
- Date completed must be after date started
- Exercise scores must be between 0 and 1
- Time spent must be non-negative