// website/src/components/Exercise.tsx
import React, { useState } from 'react';
import styles from './Exercise.module.css';

interface ExerciseOption {
  id: string;
  text: string;
}

interface ExerciseProps {
  id: string;
  type: 'multiple_choice' | 'coding' | 'simulation' | 'essay' | 'problem_solving';
  question: string;
  options?: ExerciseOption[];  // For multiple choice
  initialCode?: string;        // For coding exercises
  onSubmission?: (result: any) => void;
}

const Exercise: React.FC<ExerciseProps> = ({ 
  id, 
  type, 
  question, 
  options, 
  initialCode = '',
  onSubmission 
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [code, setCode] = useState(initialCode);
  const [essayResponse, setEssayResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    let result;
    
    switch (type) {
      case 'multiple_choice':
        result = { id, type, answer: selectedOption };
        break;
      case 'coding':
        result = { id, type, code };
        break;
      case 'essay':
        result = { id, type, response: essayResponse };
        break;
      default:
        result = { id, type, response: 'submitted' };
    }
    
    setSubmitted(true);
    onSubmission && onSubmission(result);
    setFeedback('Response submitted. In a real implementation, this would connect to the grading API.');
  };

  const handleReset = () => {
    setSelectedOption(null);
    setCode(initialCode);
    setEssayResponse('');
    setSubmitted(false);
    setFeedback('');
  };

  return (
    <div className={`${styles.container} exercise-box`}>
      <div className={styles.header}>
        <h3>Exercise {id}</h3>
        <span className={styles.typeBadge}>{type.replace('_', ' ').toUpperCase()}</span>
      </div>
      
      <div className={styles.question}>
        <p>{question}</p>
      </div>

      {type === 'multiple_choice' && options && (
        <div className={styles.options}>
          {options.map((option) => (
            <div key={option.id} className={styles.option}>
              <label className={styles.optionLabel}>
                <input
                  type="radio"
                  name={`exercise-${id}`}
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className={styles.optionInput}
                />
                <span className={styles.optionText}>{option.text}</span>
              </label>
            </div>
          ))}
        </div>
      )}

      {type === 'coding' && (
        <div className={styles.codingSection}>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.codeEditor}
            placeholder="Enter your code here..."
            rows={10}
          />
        </div>
      )}

      {type === 'essay' && (
        <div className={styles.essaySection}>
          <textarea
            value={essayResponse}
            onChange={(e) => setEssayResponse(e.target.value)}
            className={styles.essayEditor}
            placeholder="Type your response here..."
            rows={6}
          />
        </div>
      )}

      {submitted && feedback && (
        <div className={styles.feedback}>
          <h4>Feedback:</h4>
          <p>{feedback}</p>
        </div>
      )}

      <div className={styles.actions}>
        <button 
          className={`${styles.btn} ${styles.submitBtn}`}
          onClick={handleSubmit}
          disabled={submitted}
        >
          {submitted ? 'Submitted' : 'Submit Answer'}
        </button>
        <button 
          className={`${styles.btn} ${styles.resetBtn}`}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Exercise;