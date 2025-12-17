// website/tests/components/StudentModel.test.tsx
// Unit test for Student model validation per data-model.md requirements

import { Student, validateStudent } from '@src/models/Student';

describe('Student Model', () => {
  describe('validateStudent', () => {
    it('should return valid for a properly formatted Student', () => {
      const validStudent: Student = {
        id: 'student-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        institution: 'Example University',
        enrolledCourses: ['course-1', 'course-2'],
        progress: ['progress-1', 'progress-2'],
        preferences: {
          theme: 'light',
          language: 'en',
          fontSize: 'medium',
          notificationSettings: {
            email: true,
            push: false
          }
        },
        createdAt: new Date(),
      };

      const result = validateStudent(validStudent);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid if student ID is missing', () => {
      const invalidStudent: Partial<Student> = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        institution: 'Example University',
        enrolledCourses: ['course-1', 'course-2'],
        progress: ['progress-1', 'progress-2'],
        preferences: {
          theme: 'light',
          language: 'en',
          fontSize: 'medium',
          notificationSettings: {
            email: true,
            push: false
          }
        },
        createdAt: new Date(),
      };

      // @ts-ignore - intentionally missing required fields for testing
      const result = validateStudent(invalidStudent);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Student ID is required');
    });

    it('should return invalid if student name is missing', () => {
      const invalidStudent: Student = {
        id: 'student-123',
        name: '', // Invalid: empty name
        email: 'john.doe@example.com',
        institution: 'Example University',
        enrolledCourses: ['course-1', 'course-2'],
        progress: ['progress-1', 'progress-2'],
        preferences: {
          theme: 'light',
          language: 'en',
          fontSize: 'medium',
          notificationSettings: {
            email: true,
            push: false
          }
        },
        createdAt: new Date(),
      };

      const result = validateStudent(invalidStudent);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Student name is required');
    });

    it('should return invalid if email is invalid', () => {
      const invalidStudent: Student = {
        id: 'student-123',
        name: 'John Doe',
        email: 'invalid-email', // Invalid: not a properly formatted email
        institution: 'Example University',
        enrolledCourses: ['course-1', 'course-2'],
        progress: ['progress-1', 'progress-2'],
        preferences: {
          theme: 'light',
          language: 'en',
          fontSize: 'medium',
          notificationSettings: {
            email: true,
            push: false
          }
        },
        createdAt: new Date(),
      };

      const result = validateStudent(invalidStudent);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid student email is required');
    });

    it('should return invalid if institution is missing', () => {
      const invalidStudent: Student = {
        id: 'student-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        institution: '', // Invalid: empty institution
        enrolledCourses: ['course-1', 'course-2'],
        progress: ['progress-1', 'progress-2'],
        preferences: {
          theme: 'light',
          language: 'en',
          fontSize: 'medium',
          notificationSettings: {
            email: true,
            push: false
          }
        },
        createdAt: new Date(),
      };

      const result = validateStudent(invalidStudent);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Institution is required');
    });

    it('should return invalid if preferences are missing', () => {
      const invalidStudent: Student = {
        id: 'student-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        institution: 'Example University',
        enrolledCourses: ['course-1', 'course-2'],
        progress: ['progress-1', 'progress-2'],
        // Missing preferences - invalid
        createdAt: new Date(),
      };

      // @ts-ignore - intentionally missing preferences for testing
      const result = validateStudent(invalidStudent);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('User preferences are required');
    });

    it('should return invalid if creation date is missing', () => {
      const invalidStudent: Partial<Student> = {
        id: 'student-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        institution: 'Example University',
        enrolledCourses: ['course-1', 'course-2'],
        progress: ['progress-1', 'progress-2'],
        preferences: {
          theme: 'light',
          language: 'en',
          fontSize: 'medium',
          notificationSettings: {
            email: true,
            push: false
          }
        },
        // Missing createdAt - invalid
      };

      // @ts-ignore - intentionally missing required fields for testing
      const result = validateStudent(invalidStudent);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Creation date is required');
    });
  });
});