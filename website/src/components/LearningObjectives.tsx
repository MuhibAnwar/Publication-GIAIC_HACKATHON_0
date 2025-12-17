// website/src/components/LearningObjectives.tsx
import React from 'react';
import clsx from 'clsx';
import styles from './LearningObjectives.module.css';

interface LearningObjectivesProps {
  objectives: string[];
}

const LearningObjectives: React.FC<LearningObjectivesProps> = ({ objectives }) => {
  return (
    <div className={clsx('learning-objectives', styles.objectivesContainer)}>
      <h3>Learning Objectives</h3>
      <ul>
        {objectives.map((objective, index) => (
          <li key={index}>{objective}</li>
        ))}
      </ul>
    </div>
  );
};

export default LearningObjectives;