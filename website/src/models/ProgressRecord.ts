// website/src/models/ProgressRecord.ts
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface ProgressRecord {
  id: string; // unique identifier
  studentId: string; // reference to student
  chapterId: string; // reference to chapter
  status: ProgressStatus; // not_started, in_progress, completed
  exercisesCompleted: string[]; // ids of exercises completed
  exerciseScores: { [exerciseId: string]: number }; // scores for each exercise (0-1)
  dateStarted: Date; // when student started the chapter
  dateCompleted?: Date; // when student completed the chapter
  timeSpent: number; // time spent on this chapter in seconds
  notes?: string; // any additional notes about progress
}

// Validation function for ProgressRecord
export function validateProgressRecord(progressRecord: ProgressRecord): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!progressRecord.id || progressRecord.id.trim() === '') {
    errors.push('Progress record ID is required');
  }

  if (!progressRecord.studentId || progressRecord.studentId.trim() === '') {
    errors.push('Student ID is required');
  }

  if (!progressRecord.chapterId || progressRecord.chapterId.trim() === '') {
    errors.push('Chapter ID is required');
  }

  // Validate status
  const validStatuses: ProgressStatus[] = ['not_started', 'in_progress', 'completed'];
  if (!progressRecord.status || !validStatuses.includes(progressRecord.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  // Validate exercises completed
  if (progressRecord.exercisesCompleted && !Array.isArray(progressRecord.exercisesCompleted)) {
    errors.push('Exercises completed must be an array of exercise IDs');
  }

  // Validate exercise scores
  if (progressRecord.exerciseScores) {
    const scores = progressRecord.exerciseScores;
    for (const [exerciseId, score] of Object.entries(scores)) {
      if (typeof score !== 'number' || score < 0 || score > 1) {
        errors.push(`Exercise score for ${exerciseId} must be between 0 and 1`);
      }
    }
  }

  if (!progressRecord.dateStarted) {
    errors.push('Date started is required');
  }

  if (progressRecord.dateCompleted && progressRecord.dateStarted > progressRecord.dateCompleted) {
    errors.push('Date completed must be after date started');
  }

  if (progressRecord.timeSpent !== undefined && progressRecord.timeSpent < 0) {
    errors.push('Time spent must be non-negative');
  }

  // Validate status transitions
  if (progressRecord.status === 'completed' && !progressRecord.dateCompleted) {
    errors.push('Date completed is required when status is completed');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}