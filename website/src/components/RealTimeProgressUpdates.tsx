// website/src/components/RealTimeProgressUpdates.tsx
import React, { useState, useEffect } from 'react';
import { useProgressTracking } from '../contexts/ProgressTrackingContext';
import styles from './RealTimeProgressUpdates.module.css';

interface RealTimeProgressUpdatesProps {
  studentId: string;
  chapterId: string;
}

const RealTimeProgressUpdates: React.FC<RealTimeProgressUpdatesProps> = ({ 
  studentId, 
  chapterId 
}) => {
  const { 
    progress, 
    updateProgress, 
    submitExercise, 
    setTimeSpent, 
    isReady 
  } = useProgressTracking();
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentExercise, setCurrentExercise] = useState('');
  const [exerciseScore, setExerciseScore] = useState(0);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Simulate passage of time to track engagement
  useEffect(() => {
    if (!isReady) return;

    const interval = setInterval(() => {
      setTimeElapsed(prev => {
        const newValue = prev + 1;
        // Update time spent every 5 seconds
        if (newValue % 5 === 0) {
          setTimeSpent(5);
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady, setTimeSpent]);

  // Show notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle exercise submission
  const handleExerciseSubmit = () => {
    if (!currentExercise) {
      setNotification({ type: 'error', message: 'Please enter an exercise ID' });
      return;
    }

    if (exerciseScore < 0 || exerciseScore > 1) {
      setNotification({ type: 'error', message: 'Score must be between 0 and 1' });
      return;
    }

    submitExercise(currentExercise, exerciseScore);
    setNotification({ 
      type: 'success', 
      message: `Exercise ${currentExercise} submitted with score ${exerciseScore}` 
    });
    setCurrentExercise('');
    setExerciseScore(0);
  };

  // Format time in HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isReady) {
    return (
      <div className={styles.container}>
        <p>Loading progress tracking...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3>Real-Time Progress Tracking</h3>
      
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <div className={styles.progressInfo}>
        <h4>Current Progress:</h4>
        {progress ? (
          <div>
            <p><strong>Chapter:</strong> {progress.chapterId}</p>
            <p><strong>Status:</strong> <span className={styles.status}>{progress.status}</span></p>
            <p><strong>Time Spent:</strong> {formatTime(progress.timeSpent)}</p>
            <p><strong>Exercises Completed:</strong> {progress.exercisesCompleted.length}</p>
            {progress.exercisesCompleted.length > 0 && (
              <div>
                <h5>Completed Exercises:</h5>
                <ul>
                  {progress.exercisesCompleted.map((exId, idx) => (
                    <li key={idx}>
                      {exId}: {progress.exerciseScores[exId]?.toFixed(2) || 'N/A'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p>No progress data available</p>
        )}
      </div>

      <div className={styles.engagementTracking}>
        <h4>Engagement Tracking:</h4>
        <p>Time on page: <strong>{formatTime(timeElapsed)}</strong></p>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${Math.min(100, (timeElapsed / 3600) * 100)}%` }} // Cap at 1 hour display
          >
            <span className={styles.progressText}>
              {Math.min(100, Math.round((timeElapsed / 3600) * 100))}%
            </span>
          </div>
        </div>
      </div>

      <div className={styles.exerciseSubmission}>
        <h4>Submit Exercise Result:</h4>
        <div className={styles.formRow}>
          <label htmlFor="exerciseId">Exercise ID:</label>
          <input
            id="exerciseId"
            type="text"
            value={currentExercise}
            onChange={(e) => setCurrentExercise(e.target.value)}
            placeholder="e.g., ex_101"
            className={styles.input}
          />
        </div>

        <div className={styles.formRow}>
          <label htmlFor="exerciseScore">Score (0-1):</label>
          <input
            id="exerciseScore"
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={exerciseScore}
            onChange={(e) => setExerciseScore(parseFloat(e.target.value) || 0)}
            className={styles.input}
          />
        </div>

        <button onClick={handleExerciseSubmit} className={`${styles.btn} ${styles.submitBtn}`}>
          Submit Exercise
        </button>
      </div>

      <div className={styles.updateProgress}>
        <h4>Update Chapter Status:</h4>
        <p>Current status: <strong>{progress?.status || 'unknown'}</strong></p>
        <div className={styles.buttonGroup}>
          <button 
            onClick={() => updateProgress(chapterId, { status: 'in_progress' })}
            className={`${styles.btn} ${styles.statusBtn} ${progress?.status === 'in_progress' ? styles.active : ''}`}
          >
            Mark In Progress
          </button>
          <button 
            onClick={() => updateProgress(chapterId, { status: 'completed' })}
            className={`${styles.btn} ${styles.statusBtn} ${progress?.status === 'completed' ? styles.active : ''}`}
          >
            Mark Completed
          </button>
        </div>
      </div>

      <div className={styles.updateNotice}>
        <p><small>Updates to progress are saved in real-time and synchronized across tabs.</small></p>
      </div>
    </div>
  );
};

export default RealTimeProgressUpdates;