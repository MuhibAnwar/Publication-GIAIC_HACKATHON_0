// website/src/api/exerciseSubmissionApi.ts

// Mock API implementation for exercise submission
// In a real implementation, this would connect to backend services

// Define interfaces matching the API contract from assessment-api.yaml
interface ExerciseSubmissionRequest {
  answer: string;
  studentId: string;
  timestamp: string;
}

interface ExerciseSubmissionResponse {
  success: true;
  result: {
    exerciseId: string;
    isCorrect: boolean;
    feedback: string;
    score: number;
    completedAt: string;
  };
}

interface ExerciseDetailsResponse {
  id: string;
  type: string;
  question: string;
  options?: string[];
  associatedChapter: string;
  difficulty: string;
}

interface ChapterProgressUpdateRequest {
  chapterId: string;
  status: string;
  timeSpent: number;
  exercisesCompleted: string[];
  exerciseScores: { [exerciseId: string]: number };
}

interface ChapterProgressUpdateResponse {
  success: true;
  progressRecord: {
    studentId: string;
    chapterId: string;
    status: string;
    timeSpent: number;
    updatedAt: string;
  };
}

interface StudentProgressResponse {
  studentId: string;
  courses: Array<{
    courseId: string;
    progress: {
      completedChapters: string[];
      totalChapters: number;
      exercisesCompleted: number;
      totalExercises: number;
      overallScore: number;
    };
    lastAccessed: string;
  }>;
}

interface ChapterContentResponse {
  id: string;
  title: string;
  content: string;
  learningObjectives: string[];
  keyTerms: string[];
  prerequisites: string[];
  exercises: Array<{
    id: string;
    title: string;
    type: string;
  }>;
  references: Array<{
    id: string;
    ieeeCitation: string;
  }>;
}

// Error response interface
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      issue: string;
    }>;
  };
}

// Mock API service class
class ExerciseSubmissionApi {
  private baseUrl: string;
  private delay: number; // Simulated network delay in ms

  constructor(baseUrl: string = 'https://api.physical-ai-textbook.com/v1', delay: number = 500) {
    this.baseUrl = baseUrl;
    this.delay = delay;
  }

  // Mock submit exercise answer
  async submitExerciseAnswer(
    exerciseId: string,
    submission: ExerciseSubmissionRequest
  ): Promise<ExerciseSubmissionResponse | ErrorResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.delay));

    // Validate submission
    if (!submission.answer) {
      return {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'The request body contains invalid data',
          details: [{
            field: 'answer',
            issue: 'Answer must be provided'
          }]
        }
      };
    }

    // Simulate processing
    const isCorrect = Math.random() > 0.3; // 70% chance of being correct
    const score = isCorrect ? 1.0 : 0.0;
    const feedback = isCorrect 
      ? "Correct! Well done understanding the concept." 
      : "Incorrect. Review the related material and try again.";

    return {
      success: true,
      result: {
        exerciseId,
        isCorrect,
        feedback,
        score,
        completedAt: new Date().toISOString()
      }
    };
  }

  // Mock get exercise details
  async getExerciseDetails(exerciseId: string): Promise<ExerciseDetailsResponse | ErrorResponse> {
    await new Promise(resolve => setTimeout(resolve, this.delay));

    return {
      id: exerciseId,
      type: 'multiple_choice',
      question: 'Which of the following is NOT a key component of ROS2?',
      options: [
        'Nodes',
        'Topics',
        'Services',
        'Classes'
      ],
      associatedChapter: 'module-1-ros2',
      difficulty: 'intermediate'
    };
  }

  // Mock update chapter progress
  async updateChapterProgress(
    studentId: string,
    chapterId: string,
    progressData: ChapterProgressUpdateRequest
  ): Promise<ChapterProgressUpdateResponse | ErrorResponse> {
    await new Promise(resolve => setTimeout(resolve, this.delay));

    // Validate required fields
    if (!progressData.status) {
      return {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Status is required in progress data',
        }
      };
    }

    return {
      success: true,
      progressRecord: {
        studentId,
        chapterId,
        status: progressData.status,
        timeSpent: progressData.timeSpent || 0,
        updatedAt: new Date().toISOString()
      }
    };
  }

  // Mock get student progress
  async getStudentProgress(studentId: string): Promise<StudentProgressResponse | ErrorResponse> {
    await new Promise(resolve => setTimeout(resolve, this.delay));

    return {
      studentId,
      courses: [
        {
          courseId: 'physical-ai-101',
          progress: {
            completedChapters: ['intro', 'module-1-ros2', 'module-2-simulation'],
            totalChapters: 8,
            exercisesCompleted: 15,
            totalExercises: 25,
            overallScore: 0.76
          },
          lastAccessed: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ]
    };
  }

  // Mock get chapter content
  async getChapterContent(chapterId: string): Promise<ChapterContentResponse | ErrorResponse> {
    await new Promise(resolve => setTimeout(resolve, this.delay));

    return {
      id: chapterId,
      title: 'ROS2 Fundamentals',
      content: '# ROS2 Architecture\n\nROS2 (Robot Operating System 2) provides ...',
      learningObjectives: [
        'Understand ROS2 architecture and core concepts',
        'Implement ROS2 packages with Python',
        'Configure launch files and parameters'
      ],
      keyTerms: ['ROS2', 'Nodes', 'Topics', 'Services', 'Actions'],
      prerequisites: ['basic linear algebra', 'Python programming'],
      exercises: [
        {
          id: 'ex_101',
          title: 'ROS2 Node Communication',
          type: 'coding'
        }
      ],
      references: [
        {
          id: 'ref_001',
          ieeeCitation: 'Shibata, C., Ito, S., Osa, T., & Sugiyama, M. (2021). Overview of Robot Operating System 2 for robotics engineers. Advanced Robotics, 35(1), 1-20.'
        }
      ]
    };
  }

  // Mock for LTI launch (not implemented in detail here)
  async ltiLaunch(ltiParameters: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    
    return {
      success: true,
      redirectUrl: `/lti/module?studentId=${ltiParameters.user_id}`
    };
  }
}

// Export a singleton instance with default configuration
export const exerciseSubmissionApi = new ExerciseSubmissionApi();

// Export interfaces and types for use in components
export type {
  ExerciseSubmissionRequest,
  ExerciseSubmissionResponse,
  ExerciseDetailsResponse,
  ChapterProgressUpdateRequest,
  ChapterProgressUpdateResponse,
  StudentProgressResponse,
  ChapterContentResponse,
  ErrorResponse
};