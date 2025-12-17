// website/tests/components/Exercise.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Exercise from '../../src/components/Exercise';

describe('Exercise Component', () => {
  const mockProps = {
    id: 'ex-001',
    type: 'multiple_choice' as const,
    question: 'What is the primary advantage of ROS2 over ROS1?',
    options: [
      { id: 'a', text: 'Better real-time support' },
      { id: 'b', text: 'Improved security features' },
      { id: 'c', text: 'All of the above' }
    ]
  };

  test('renders multiple choice exercise correctly', () => {
    render(<Exercise {...mockProps} />);
    
    expect(screen.getByText('Exercise ex-001')).toBeInTheDocument();
    expect(screen.getByText('MULTIPLE_CHOICE')).toBeInTheDocument();
    expect(screen.getByText(mockProps.question)).toBeInTheDocument();
    
    mockProps.options?.forEach(option => {
      expect(screen.getByText(option.text)).toBeInTheDocument();
    });
  });

  test('allows selection of multiple choice option', () => {
    render(<Exercise {...mockProps} />);
    
    const option = screen.getByLabelText(mockProps.options![0].text);
    fireEvent.click(option);
    
    expect(option).toBeChecked();
  });

  test('renders coding exercise with textarea', () => {
    render(
      <Exercise 
        id="ex-002" 
        type="coding" 
        question="Write a ROS2 node implementation" 
        initialCode="import rclpy"
      />
    );
    
    expect(screen.getByText('Exercise ex-002')).toBeInTheDocument();
    expect(screen.getByText('CODING')).toBeInTheDocument();
    expect(screen.getByText('Write a ROS2 node implementation')).toBeInTheDocument();
    
    const textarea = screen.getByPlaceholderText('Enter your code here...');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('import rclpy');
  });

  test('handles essay exercise correctly', () => {
    render(
      <Exercise 
        id="ex-003" 
        type="essay" 
        question="Explain the differences between various SLAM algorithms" 
      />
    );
    
    expect(screen.getByText('Exercise ex-003')).toBeInTheDocument();
    expect(screen.getByText('ESSAY')).toBeInTheDocument();
    expect(screen.getByText('Explain the differences between various SLAM algorithms')).toBeInTheDocument();
    
    const textarea = screen.getByPlaceholderText('Type your response here...');
    expect(textarea).toBeInTheDocument();
  });

  test('submits answer and shows feedback', () => {
    render(<Exercise {...mockProps} />);
    
    const option = screen.getByLabelText(mockProps.options![0].text);
    fireEvent.click(option);
    
    const submitBtn = screen.getByText('Submit Answer');
    fireEvent.click(submitBtn);
    
    expect(submitBtn).toBeDisabled();
    expect(screen.getByText('Submitted')).toBeInTheDocument();
    expect(screen.getByText('Response submitted. In a real implementation, this would connect to the grading API.')).toBeInTheDocument();
  });

  test('resets the exercise', () => {
    render(<Exercise {...mockProps} />);
    
    const option = screen.getByLabelText(mockProps.options![0].text);
    fireEvent.click(option);
    
    const submitBtn = screen.getByText('Submit Answer');
    fireEvent.click(submitBtn);
    
    expect(submitBtn).toBeDisabled();
    
    const resetBtn = screen.getByText('Reset');
    fireEvent.click(resetBtn);
    
    expect(submitBtn).not.toBeDisabled();
    expect(screen.queryByText('Response submitted. In a real implementation, this would connect to the grading API.')).not.toBeInTheDocument();
  });
});