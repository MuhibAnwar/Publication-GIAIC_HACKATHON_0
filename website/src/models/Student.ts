// website/src/models/Student.ts
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  notificationSettings: {
    email: boolean;
    push: boolean;
  };
}

export interface Student {
  id: string; // unique identifier
  name: string; // student name
  email: string; // student email
  institution: string; // student's educational institution
  enrolledCourses: string[]; // list of course IDs the student is enrolled in
  progress: string[]; // tracking student progress record IDs
  preferences: UserPreferences; // user preferences like theme, language
  createdAt: Date; // when the student account was created
  lastLogin?: Date; // when the student last logged in
}

// Validation function for Student
export function validateStudent(student: Student): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!student.id || student.id.trim() === '') {
    errors.push('Student ID is required');
  }

  if (!student.name || student.name.trim() === '') {
    errors.push('Student name is required');
  }

  if (!student.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
    errors.push('Valid student email is required');
  }

  if (!student.institution || student.institution.trim() === '') {
    errors.push('Institution is required');
  }

  // Validate preferences
  if (!student.preferences) {
    errors.push('User preferences are required');
  } else {
    const validThemes = ['light', 'dark'];
    if (student.preferences.theme && !validThemes.includes(student.preferences.theme)) {
      errors.push(`Theme must be one of: ${validThemes.join(', ')}`);
    }

    const validFontSizes = ['small', 'medium', 'large'];
    if (student.preferences.fontSize && !validFontSizes.includes(student.preferences.fontSize)) {
      errors.push(`Font size must be one of: ${validFontSizes.join(', ')}`);
    }
  }

  if (!student.createdAt) {
    errors.push('Creation date is required');
  }

  // Validate enrolled courses format
  if (student.enrolledCourses && !Array.isArray(student.enrolledCourses)) {
    errors.push('Enrolled courses must be an array of course IDs');
  }

  // Validate progress records format
  if (student.progress && !Array.isArray(student.progress)) {
    errors.push('Progress records must be an array of record IDs');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}