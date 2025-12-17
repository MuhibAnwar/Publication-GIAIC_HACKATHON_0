// website/src/models/Exercise.ts
export type ExerciseType = 'multiple_choice' | 'coding' | 'simulation' | 'essay' | 'problem_solving';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string; // unique identifier
  type: ExerciseType; // multiple choice, coding, simulation, essay
  question: string; // exercise prompt
  options?: string[]; // for multiple choice
  correctAnswer?: any; // correct answer (could be string, number, array, etc.)
  explanation: string; // explanation of correct answer
  difficulty: DifficultyLevel; // beginner, intermediate, advanced
  associatedChapter: string; // id of associated chapter
  autoGraded: boolean; // whether exercise can be auto-graded
  points?: number; // point value of the exercise
}

// Validation function for Exercise
export function validateExercise(exercise: Exercise): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!exercise.id || exercise.id.trim() === '') {
    errors.push('Exercise ID is required');
  }

  if (!exercise.question || exercise.question.trim() === '') {
    errors.push('Exercise question is required');
  }

  if (!exercise.associatedChapter || exercise.associatedChapter.trim() === '') {
    errors.push('Associated chapter ID is required');
  }

  // Validate exercise type
  const validExerciseTypes: ExerciseType[] = ['multiple_choice', 'coding', 'simulation', 'essay', 'problem_solving'];
  if (!validExerciseTypes.includes(exercise.type)) {
    errors.push(`Invalid exercise type. Must be one of: ${validExerciseTypes.join(', ')}`);
  }

  // Validate difficulty level
  const validDifficultyLevels: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
  if (!validDifficultyLevels.includes(exercise.difficulty)) {
    errors.push(`Invalid difficulty level. Must be one of: ${validDifficultyLevels.join(', ')}`);
  }

  // For multiple choice exercises, ensure options exist
  if (exercise.type === 'multiple_choice') {
    if (!exercise.options || exercise.options.length < 2) {
      errors.push('Multiple choice exercises must have at least 2 options');
    }
    if (!exercise.correctAnswer) {
      errors.push('Multiple choice exercises must have a correct answer');
    }
  }

  // For auto-graded exercises, correct answer is required
  if (exercise.autoGraded && !exercise.correctAnswer) {
    errors.push('Auto-graded exercises must have a correct answer defined');
  }

  // Validate explanation exists
  if (!exercise.explanation || exercise.explanation.trim() === '') {
    errors.push('Explanation is required for all exercises');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}