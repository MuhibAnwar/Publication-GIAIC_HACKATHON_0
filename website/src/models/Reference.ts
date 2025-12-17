// website/src/models/Reference.ts
export type CitationType = 'book' | 'article' | 'conference' | 'thesis' | 'techreport' | 'misc';

export interface Reference {
  id: string; // unique identifier
  title: string; // reference title
  authors: string[]; // author names
  publication: string; // publication venue
  year: number; // publication year
  doi?: string; // digital object identifier
  url?: string; // URL to reference
  citationType: CitationType; // book, article, conference, etc.
  ieeeCitation: string; // formatted IEEE citation
}

// Validation function for Reference
export function validateReference(reference: Reference): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!reference.id || reference.id.trim() === '') {
    errors.push('Reference ID is required');
  }

  if (!reference.title || reference.title.trim() === '') {
    errors.push('Reference title is required');
  }

  if (!reference.authors || reference.authors.length === 0) {
    errors.push('At least one author is required');
  }

  if (!reference.publication || reference.publication.trim() === '') {
    errors.push('Publication venue is required');
  }

  if (!reference.year || reference.year < 1900 || reference.year > new Date().getFullYear() + 1) {
    errors.push('Publication year must be a valid year');
  }

  if (!reference.ieeeCitation || reference.ieeeCitation.trim() === '') {
    errors.push('IEEE citation is required');
  }

  // Validate citation type
  const validCitationTypes: CitationType[] = ['book', 'article', 'conference', 'thesis', 'techreport', 'misc'];
  if (!validCitationTypes.includes(reference.citationType)) {
    errors.push(`Invalid citation type. Must be one of: ${validCitationTypes.join(', ')}`);
  }

  // Validate DOI format if provided
  if (reference.doi && !/^(doi:)?10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i.test(reference.doi)) {
    errors.push('DOI format is invalid');
  }

  // Validate URL format if provided
  if (reference.url && !/^https?:\/\/.+/i.test(reference.url)) {
    errors.push('URL format is invalid');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}