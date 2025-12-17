// website/tests/components/ExerciseModel.test.tsx
// Unit test for Exercise model validation per data-model.md requirements

import { Exercise, validateExercise, ExerciseType, DifficultyLevel } from '@src/models/Exercise';

describe('Exercise Model', () => {
  describe('validateExercise', () => {
    it('should return valid for a properly formatted Exercise', () => {
      const validExercise: Exercise = {
        id: 'ex-1',
        type: 'multiple_choice',
        question: 'What is the primary advantage of ROS2 over ROS1?',
        options: [
          'Better real-time support',
          'Improved security features',
          'More programming language options',
          'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'ROS2 was designed with improved security and real-time support.',
        difficulty: 'intermediate',
        associatedChapter: 'module-1-ros2-fundamentals',
        autoGraded: true
      };

      const result = validateExercise(validExercise);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid if exercise ID is missing', () => {
      const invalidExercise: Partial<Exercise> = {
        type: 'multiple_choice',
        question: 'What is the primary advantage of ROS2 over ROS1?',
        options: [
          'Better real-time support',
          'Improved security features',
          'More programming language options',
          'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'ROS2 was designed with improved security and real-time support.',
        difficulty: 'intermediate',
        associatedChapter: 'module-1-ros2-fundamentals',
        autoGraded: true
      };

      // @ts-ignore - intentionally missing required fields for testing
      const result = validateExercise(invalidExercise);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Exercise ID is required');
    });

    it('should return invalid if question is missing', () => {
      const invalidExercise: Exercise = {
        id: 'ex-1',
        type: 'multiple_choice',
        question: '', // Invalid: empty question
        options: [
          'Better real-time support',
          'Improved security features',
          'More programming language options',
          'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'ROS2 was designed with improved security and real-time support.',
        difficulty: 'intermediate',
        associatedChapter: 'module-1-ros2-fundamentals',
        autoGraded: true
      };

      const result = validateExercise(invalidExercise);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Exercise question is required');
    });

    it('should return invalid if associated chapter is missing', () => {
      const invalidExercise: Exercise = {
        id: 'ex-1',
        type: 'multiple_choice',
        question: 'What is the primary advantage of ROS2 over ROS1?',
        options: [
          'Better real-time support',
          'Improved security features',
          'More programming language options',
          'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'ROS2 was designed with improved security and real-time support.',
        difficulty: 'intermediate',
        associatedChapter: '', // Invalid: empty chapter ID
        autoGraded: true
      };

      const result = validateExercise(invalidExercise);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Associated chapter ID is required');
    });

    it('should return invalid for invalid exercise type', () => {
      // @ts-ignore - intentionally using invalid type for testing
      const invalidExercise: Exercise = {
        id: 'ex-1',
        type: 'invalid_type' as ExerciseType,
        question: 'What is the primary advantage of ROS2 over ROS1?',
        options: [
          'Better real-time support',
          'Improved security features',
          'More programming language options',
          'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'ROS2 was designed with improved security and real-time support.',
        difficulty: 'intermediate',
        associatedChapter: 'module-1-ros2-fundamentals',
        autoGraded: true
      };

      const result = validateExercise(invalidExercise);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid exercise type. Must be one of: multiple_choice, coding, simulation, essay, problem_solving');
    });

    it('should return invalid for invalid difficulty level', () => {
      // @ts-ignore - intentionally using invalid difficulty for testing
      const invalidExercise: Exercise = {
        id: 'ex-1',
        type: 'multiple_choice',
        question: 'What is the primary advantage of ROS2 over ROS1?',
        options: [
          'Better real-time support',
          'Improved security features',
          'More programming language options',
          'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: 'ROS2 was designed with improved security and real-time support.',
        difficulty: 'extreme' as DifficultyLevel,
        associatedChapter: 'module-1-ros2-fundamentals',
        autoGraded: true
      };

      const result = validateExercise(invalidExercise);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid difficulty level. Must be one of: beginner, intermediate, advanced');
    });

    it('should return invalid for multiple choice without options', () => {
      const invalidExercise: Exercise = {
        id: 'ex-1',
        type: 'multiple_choice',
        question: 'What is the primary advantage of ROS2 over ROS1?',
        options: [], // Invalid: no options for multiple choice
        correctAnswer: 'All of the above',
        explanation: 'ROS2 was designed with improved security and real-time support.',
        difficulty: 'intermediate',
        associatedChapter: 'module-1-ros2-fundamentals',
        autoGraded: true
      };

      const result = validateExercise(invalidExercise);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Multiple choice exercises must have at least 2 options');
    });

    it('should return invalid for multiple choice without correct answer', () => {
      const invalidExercise: Exercise = {
        id: 'ex-1',
        type: 'multiple_choice',
        question: 'What is the primary advantage of ROS2 over ROS1?',
        options: [
          'Better real-time support',
          'Improved security features',
          'More programming language options',
          'All of the above'
        ],
        correctAnswer: undefined, // Invalid: no correct answer for multiple choice
        explanation: 'ROS2 was designed with improved security and real-time support.',
        difficulty: 'intermediate',
        associatedChapter: 'module-1-ros2-fundamentals',
        autoGraded: true
      };

      const result = validateExercise(invalidExercise);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Multiple choice exercises must have a correct answer');
    });

    it('should return invalid for auto-graded exercise without correct answer', () => {
      const invalidExercise: Exercise = {
        id: 'ex-1',
        type: 'coding',
        question: 'Implement a basic ROS2 publisher node',
        explanation: 'A publisher node sends messages to a topic.',
        difficulty: 'intermediate',
        associatedChapter: 'module-1-ros2-fundamentals',
        autoGraded: true // Invalid: auto-graded but no correct answer
      };

      const result = validateExercise(invalidExercise);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Auto-graded exercises must have a correct answer defined');
    });

    it('should return invalid for exercise without explanation', () => {
      const invalidExercise: Exercise = {
        id: 'ex-1',
        type: 'coding',
        question: 'Implement a basic ROS2 publisher node',
        difficulty: 'intermediate',
        associatedChapter: 'module-1-ros2-fundamentals',
        autoGraded: false,
        explanation: '' // Invalid: no explanation
      };

      const result = validateExercise(invalidExercise);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Explanation is required for all exercises');
    });
  });
});