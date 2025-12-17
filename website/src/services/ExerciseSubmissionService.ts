// website/src/services/ExerciseSubmissionService.ts

// Define the interfaces based on the API contract
interface ExerciseSubmission {
  answer: any;
  studentId: string;
  timestamp: string;
}

interface ExerciseSubmissionResponse {
  success: boolean;
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

interface ProgressUpdateRequest {
  chapterId: string;
  status: string;
  timeSpent: number;
  exercisesCompleted: string[];
  exerciseScores: { [exerciseId: string]: number };
}

interface ProgressUpdateResponse {
  success: boolean;
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

class ExerciseSubmissionService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = 'https://api.physical-ai-textbook.com/v1') {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  async submitExerciseAnswer(
    exerciseId: string, 
    submission: ExerciseSubmission
  ): Promise<ExerciseSubmissionResponse> {
    const response = await fetch(`${this.baseUrl}/assessments/${exerciseId}/submit`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getExerciseDetails(exerciseId: string): Promise<ExerciseDetailsResponse> {
    const response = await fetch(`${this.baseUrl}/exercises/${exerciseId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async updateChapterProgress(
    studentId: string,
    chapterId: string,
    progressData: ProgressUpdateRequest
  ): Promise<ProgressUpdateResponse> {
    const response = await fetch(`${this.baseUrl}/students/${studentId}/chapters/${chapterId}/progress`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(progressData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getStudentProgress(studentId: string): Promise<StudentProgressResponse> {
    const response = await fetch(`${this.baseUrl}/students/${studentId}/progress`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getChapterContent(chapterId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/chapters/${chapterId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export default ExerciseSubmissionService;