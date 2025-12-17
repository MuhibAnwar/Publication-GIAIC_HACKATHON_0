// website/tests/components/ProgressRecordModel.test.tsx
// Unit test for ProgressRecord model validation per data-model.md requirements

import { ProgressRecord, validateProgressRecord, ProgressStatus } from '@src/models/ProgressRecord';

describe('ProgressRecord Model', () => {
  describe('validateProgressRecord', () => {
    it('should return valid for a properly formatted ProgressRecord', () => {
      const validProgressRecord: ProgressRecord = {
        id: 'progress-1',
        studentId: 'student-123',
        chapterId: 'chapter-1',
        status: 'completed',
        exercisesCompleted: ['ex-1', 'ex-2'],
        exerciseScores: {
          'ex-1': 1.0,
          'ex-2': 0.8
        },
        dateStarted: new Date('2023-01-01'),
        dateCompleted: new Date('2023-01-02'),
        timeSpent: 3600 // 1 hour in seconds
      };

      const result = validateProgressRecord(validProgressRecord);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid if progress record ID is missing', () => {
      const invalidProgressRecord: Partial<ProgressRecord> = {
        studentId: 'student-123',
        chapterId: 'chapter-1',
        status: 'completed',
        exercisesCompleted: ['ex-1', 'ex-2'],
        exerciseScores: {
          'ex-1': 1.0,
          'ex-2': 0.8
        },
        dateStarted: new Date('2023-01-01'),
        dateCompleted: new Date('2023-01-02'),
        timeSpent: 3600
      };

      // @ts-ignore - intentionally missing required fields for testing
      const result = validateProgressRecord(invalidProgressRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Progress record ID is required');
    });

    it('should return invalid if student ID is missing', () => {
      const invalidProgressRecord: ProgressRecord = {
        id: 'progress-1',
        studentId: '', // Invalid: empty student ID
        chapterId: 'chapter-1',
        status: 'completed',
        exercisesCompleted: ['ex-1', 'ex-2'],
        exerciseScores: {
          'ex-1': 1.0,
          'ex-2': 0.8
        },
        dateStarted: new Date('2023-01-01'),
        dateCompleted: new Date('2023-01-02'),
        timeSpent: 3600
      };

      const result = validateProgressRecord(invalidProgressRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Student ID is required');
    });

    it('should return invalid if chapter ID is missing', () => {
      const invalidProgressRecord: ProgressRecord = {
        id: 'progress-1',
        studentId: 'student-123',
        chapterId: '', // Invalid: empty chapter ID
        status: 'completed',
        exercisesCompleted: ['ex-1', 'ex-2'],
        exerciseScores: {
          'ex-1': 1.0,
          'ex-2': 0.8
        },
        dateStarted: new Date('2023-01-01'),
        dateCompleted: new Date('2023-01-02'),
        timeSpent: 3600
      };

      const result = validateProgressRecord(invalidProgressRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Chapter ID is required');
    });

    it('should return invalid for invalid status', () => {
      const invalidProgressRecord: ProgressRecord = {
        id: 'progress-1',
        studentId: 'student-123',
        chapterId: 'chapter-1',
        status: 'invalid_status' as ProgressStatus, // Invalid status
        exercisesCompleted: ['ex-1', 'ex-2'],
        exerciseScores: {
          'ex-1': 1.0,
          'ex-2': 0.8
        },
        dateStarted: new Date('2023-01-01'),
        dateCompleted: new Date('2023-01-02'),
        timeSpent: 3600
      };

      const result = validateProgressRecord(invalidProgressRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Status must be one of: not_started, in_progress, completed');
    });

    it('should return invalid if date started is missing', () => {
      const invalidProgressRecord: ProgressRecord = {
        id: 'progress-1',
        studentId: 'student-123',
        chapterId: 'chapter-1',
        status: 'completed',
        exercisesCompleted: ['ex-1', 'ex-2'],
        exerciseScores: {
          'ex-1': 1.0,
          'ex-2': 0.8
        },
        dateStarted: undefined as any, // Invalid: no date started
        dateCompleted: new Date('2023-01-02'),
        timeSpent: 3600
      };

      const result = validateProgressRecord(invalidProgressRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Date started is required');
    });

    it('should return invalid if date completed is before date started', () => {
      const invalidProgressRecord: ProgressRecord = {
        id: 'progress-1',
        studentId: 'student-123',
        chapterId: 'chapter-1',
        status: 'completed',
        exercisesCompleted: ['ex-1', 'ex-2'],
        exerciseScores: {
          'ex-1': 1.0,
          'ex-2': 0.8
        },
        dateStarted: new Date('2023-01-02'), // Later date
        dateCompleted: new Date('2023-01-01'), // Earlier date - invalid
        timeSpent: 3600
      };

      const result = validateProgressRecord(invalidProgressRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Date completed must be after date started');
    });

    it('should return invalid if time spent is negative', () => {
      const invalidProgressRecord: ProgressRecord = {
        id: 'progress-1',
        studentId: 'student-123',
        chapterId: 'chapter-1',
        status: 'completed',
        exercisesCompleted: ['ex-1', 'ex-2'],
        exerciseScores: {
          'ex-1': 1.0,
          'ex-2': 0.8
        },
        dateStarted: new Date('2023-01-01'),
        dateCompleted: new Date('2023-01-02'),
        timeSpent: -100 // Invalid: negative time
      };

      const result = validateProgressRecord(invalidProgressRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Time spent must be non-negative');
    });

    it('should return invalid if status is completed but date completed is missing', () => {
      const invalidProgressRecord: ProgressRecord = {
        id: 'progress-1',
        studentId: 'student-123',
        chapterId: 'chapter-1',
        status: 'completed', // Completed status
        exercisesCompleted: ['ex-1', 'ex-2'],
        exerciseScores: {
          'ex-1': 1.0,
          'ex-2': 0.8
        },
        dateStarted: new Date('2023-01-01'),
        dateCompleted: undefined, // Missing date completed with completed status - invalid
        timeSpent: 3600
      };

      const result = validateProgressRecord(invalidProgressRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Date completed is required when status is completed');
    });

    it('should return valid if status is not completed and date completed is missing', () => {
      // Valid case: status is in_progress, dateCompleted is appropriately undefined
      const validProgressRecord: ProgressRecord = {
        id: 'progress-1',
        studentId: 'student-123',
        chapterId: 'chapter-1',
        status: 'in_progress', // In-progress status
        exercisesCompleted: ['ex-1'],
        exerciseScores: {
          'ex-1': 1.0
        },
        dateStarted: new Date('2023-01-01'),
        // dateCompleted is undefined, which is appropriate for in_progress status
        timeSpent: 1800
      };

      const result = validateProgressRecord(validProgressRecord);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid if exercise scores are out of range', () => {
      const invalidProgressRecord: ProgressRecord = {
        id: 'progress-1',
        studentId: 'student-123',
        chapterId: 'chapter-1',
        status: 'in_progress',
        exercisesCompleted: ['ex-1'],
        exerciseScores: {
          'ex-1': 1.5 // Invalid: score > 1
        },
        dateStarted: new Date('2023-01-01'),
        timeSpent: 1800
      };

      const result = validateProgressRecord(invalidProgressRecord);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Exercise score for ex-1 must be between 0 and 1');
    });
  });
});