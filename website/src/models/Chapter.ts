// website/src/models/Chapter.ts
export interface Chapter {
  id: string; // unique identifier
  title: string; // chapter title
  content: string; // main content with LaTeX support
  learningObjectives: string[]; // list of learning objectives
  keyTerms: string[]; // key terms defined in chapter
  exercises: string[]; // associated exercises IDs
  references: string[]; // bibliography entry IDs
  prerequisites: string[]; // prerequisite knowledge, e.g., "linear algebra", "Python"
  nextChapter?: string; // id of next chapter in sequence
  previousChapter?: string; // id of previous chapter in sequence
}

// Validation function for Chapter
export function validateChapter(chapter: Chapter): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!chapter.id || chapter.id.trim() === '') {
    errors.push('Chapter ID is required');
  }

  if (!chapter.title || chapter.title.trim() === '') {
    errors.push('Chapter title is required');
  }

  if (!chapter.content || chapter.content.trim() === '') {
    errors.push('Chapter content is required');
  }

  if (!chapter.learningObjectives || chapter.learningObjectives.length === 0) {
    errors.push('At least one learning objective is required');
  }

  if (!chapter.references || chapter.references.length === 0) {
    errors.push('At least one reference is required');
  }

  // Prerequisites should be valid knowledge areas
  if (chapter.prerequisites && chapter.prerequisites.length > 0) {
    const validPrerequisites = ['linear algebra', 'calculus', 'Python', 'ROS2', 'physics', 'control systems'];
    const invalidPrerequisites = chapter.prerequisites.filter(
      prereq => !validPrerequisites.includes(prereq.toLowerCase())
    );
    if (invalidPrerequisites.length > 0) {
      errors.push(`Invalid prerequisites: ${invalidPrerequisites.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}