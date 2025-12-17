// website/tests/components/Chapter.test.tsx
// Unit test for Chapter model validation per data-model.md requirements

import { Chapter, validateChapter } from '@src/models/Chapter';

describe('Chapter Model', () => {
  describe('validateChapter', () => {
    it('should return valid for a properly formatted Chapter', () => {
      const validChapter: Chapter = {
        id: 'chapter-1',
        title: 'Introduction to Physical AI',
        content: '# Introduction to Physical AI\nThis chapter covers the basics...',
        learningObjectives: [
          'Understand the fundamentals of Physical AI',
          'Identify key components of humanoid robotics'
        ],
        keyTerms: ['Physical AI', 'Humanoid Robotics', 'Embodiment'],
        exercises: ['ex-1', 'ex-2'],
        references: ['ref-1', 'ref-2'],
        prerequisites: ['linear algebra', 'Python'],
      };

      const result = validateChapter(validChapter);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid if chapter ID is missing', () => {
      const invalidChapter: Partial<Chapter> = {
        title: 'Introduction to Physical AI',
        content: '# Introduction to Physical AI\nThis chapter covers the basics...',
        learningObjectives: [
          'Understand the fundamentals of Physical AI',
          'Identify key components of humanoid robotics'
        ],
        keyTerms: ['Physical AI', 'Humanoid Robotics', 'Embodiment'],
        exercises: ['ex-1', 'ex-2'],
        references: ['ref-1', 'ref-2'],
        prerequisites: ['linear algebra', 'Python'],
      };

      // @ts-ignore - intentionally missing required fields for testing
      const result = validateChapter(invalidChapter);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Chapter ID is required');
    });

    it('should return invalid if chapter title is missing', () => {
      const invalidChapter: Chapter = {
        id: 'chapter-1',
        title: '', // Invalid: empty title
        content: '# Introduction to Physical AI\nThis chapter covers the basics...',
        learningObjectives: [
          'Understand the fundamentals of Physical AI',
          'Identify key components of humanoid robotics'
        ],
        keyTerms: ['Physical AI', 'Humanoid Robotics', 'Embodiment'],
        exercises: ['ex-1', 'ex-2'],
        references: ['ref-1', 'ref-2'],
        prerequisites: ['linear algebra', 'Python'],
      };

      const result = validateChapter(invalidChapter);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Chapter title is required');
    });

    it('should return invalid if chapter content is missing', () => {
      const invalidChapter: Chapter = {
        id: 'chapter-1',
        title: 'Introduction to Physical AI',
        content: '', // Invalid: empty content
        learningObjectives: [
          'Understand the fundamentals of Physical AI',
          'Identify key components of humanoid robotics'
        ],
        keyTerms: ['Physical AI', 'Humanoid Robotics', 'Embodiment'],
        exercises: ['ex-1', 'ex-2'],
        references: ['ref-1', 'ref-2'],
        prerequisites: ['linear algebra', 'Python'],
      };

      const result = validateChapter(invalidChapter);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Chapter content is required');
    });

    it('should return invalid if no learning objectives are provided', () => {
      const invalidChapter: Chapter = {
        id: 'chapter-1',
        title: 'Introduction to Physical AI',
        content: '# Introduction to Physical AI\nThis chapter covers the basics...',
        learningObjectives: [], // Invalid: no learning objectives
        keyTerms: ['Physical AI', 'Humanoid Robotics', 'Embodiment'],
        exercises: ['ex-1', 'ex-2'],
        references: ['ref-1', 'ref-2'],
        prerequisites: ['linear algebra', 'Python'],
      };

      const result = validateChapter(invalidChapter);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one learning objective is required');
    });

    it('should return invalid if no references are provided', () => {
      const invalidChapter: Chapter = {
        id: 'chapter-1',
        title: 'Introduction to Physical AI',
        content: '# Introduction to Physical AI\nThis chapter covers the basics...',
        learningObjectives: [
          'Understand the fundamentals of Physical AI',
          'Identify key components of humanoid robotics'
        ],
        keyTerms: ['Physical AI', 'Humanoid Robotics', 'Embodiment'],
        exercises: ['ex-1', 'ex-2'],
        references: [], // Invalid: no references
        prerequisites: ['linear algebra', 'Python'],
      };

      const result = validateChapter(invalidChapter);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one reference is required');
    });

    it('should return invalid if invalid prerequisites are provided', () => {
      const invalidChapter: Chapter = {
        id: 'chapter-1',
        title: 'Introduction to Physical AI',
        content: '# Introduction to Physical AI\nThis chapter covers the basics...',
        learningObjectives: [
          'Understand the fundamentals of Physical AI',
          'Identify key components of humanoid robotics'
        ],
        keyTerms: ['Physical AI', 'Humanoid Robotics', 'Embodiment'],
        exercises: ['ex-1', 'ex-2'],
        references: ['ref-1', 'ref-2'],
        prerequisites: ['quantum physics', 'astrophysics'], // Invalid: not in valid list
      };

      const result = validateChapter(invalidChapter);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid prerequisites: quantum physics, astrophysics');
    });
  });
});