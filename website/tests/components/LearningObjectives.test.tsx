// website/tests/components/LearningObjectives.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LearningObjectives from '../../src/components/LearningObjectives';

describe('LearningObjectives Component', () => {
  const mockObjectives = [
    'Understand the concept of Physical AI and embodied intelligence',
    'Recognize the challenges in bridging digital AI with physical systems',
    'Identify the applications and societal impact of humanoid robotics'
  ];

  test('renders learning objectives correctly', () => {
    render(<LearningObjectives objectives={mockObjectives} />);
    
    expect(screen.getByText('Learning Objectives')).toBeInTheDocument();
    
    mockObjectives.forEach(objective => {
      expect(screen.getByText(objective)).toBeInTheDocument();
    });
  });

  test('handles empty objectives array', () => {
    render(<LearningObjectives objectives={[]} />);
    
    expect(screen.getByText('Learning Objectives')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  test('renders correct number of objectives', () => {
    render(<LearningObjectives objectives={mockObjectives} />);
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(mockObjectives.length);
  });
});