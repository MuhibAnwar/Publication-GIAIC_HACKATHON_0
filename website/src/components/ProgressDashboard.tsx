// website/src/components/ProgressDashboard.tsx
import React, { useState, useEffect } from 'react';
import styles from './ProgressDashboard.module.css';

interface ProgressRecord {
  studentId: string;
  chapterId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  exercisesCompleted: string[];
  exerciseScores: { [exerciseId: string]: number };
  timeSpent: number; // in seconds
  updatedAt: string;
}

interface CourseProgress {
  courseId: string;
  title: string;
  progress: {
    completedChapters: string[];
    totalChapters: number;
    exercisesCompleted: number;
    totalExercises: number;
    overallScore: number; // 0-1
  };
  lastAccessed: string;
}

interface StudentProgress {
  studentId: string;
  name: string;
  email: string;
  courses: CourseProgress[];
}

interface ProgressDashboardProps {
  studentId: string;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ studentId }) => {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real implementation, this would fetch data from the API
  useEffect(() => {
    // Simulate API call
    const fetchProgress = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockProgress: StudentProgress = {
          studentId,
          name: 'Student Name',
          email: 'student@example.com',
          courses: [
            {
              courseId: 'physical-ai-101',
              title: 'Physical AI & Humanoid Robotics',
              progress: {
                completedChapters: ['intro', 'module-1-ros2'],
                totalChapters: 5,
                exercisesCompleted: 8,
                totalExercises: 15,
                overallScore: 0.75
              },
              lastAccessed: '2025-12-10T14:30:00Z'
            }
          ]
        };
        
        setProgress(mockProgress);
      } catch (err) {
        setError('Failed to load progress data');
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [studentId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading progress data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>No progress data available</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Learning Progress Dashboard</h2>
      
      <div className={styles.studentInfo}>
        <h3>{progress.name}</h3>
        <p>{progress.email}</p>
      </div>

      <div className={styles.courses}>
        {progress.courses.map((course, index) => (
          <div key={index} className={styles.courseCard}>
            <h4>{course.title}</h4>
            
            <div className={styles.progressSummary}>
              <div className={styles.progressItem}>
                <span className={styles.label}>Chapters Completed:</span>
                <span className={styles.value}>
                  {course.progress.completedChapters.length} / {course.progress.totalChapters}
                </span>
              </div>
              
              <div className={styles.progressItem}>
                <span className={styles.label}>Exercises Completed:</span>
                <span className={styles.value}>
                  {course.progress.exercisesCompleted} / {course.progress.totalExercises}
                </span>
              </div>
              
              <div className={styles.progressItem}>
                <span className={styles.label}>Overall Score:</span>
                <span className={styles.value}>
                  {Math.round(course.progress.overallScore * 100)}%
                </span>
              </div>
            </div>

            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressBar}
                style={{ width: `${course.progress.overallScore * 100}%` }}
              >
                <span className={styles.progressText}>
                  {Math.round(course.progress.overallScore * 100)}%
                </span>
              </div>
            </div>

            <div className={styles.courseDetails}>
              <div className={styles.lastAccessed}>
                Last access: {new Date(course.lastAccessed).toLocaleDateString()}
              </div>
              
              <div className={styles.chaptersList}>
                <h5>Chapters:</h5>
                <ul>
                  {Array.from({ length: course.progress.totalChapters }, (_, i) => {
                    const chapterId = `module-${i + 1}`;
                    const isCompleted = course.progress.completedChapters.includes(chapterId);
                    return (
                      <li key={chapterId} className={isCompleted ? styles.completed : styles.notStarted}>
                        {isCompleted ? '✅' : '⏳'} Chapter {i + 1}: {isCompleted ? 'Completed' : 'Not Started'}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressDashboard;