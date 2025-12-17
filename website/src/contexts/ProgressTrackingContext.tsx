// website/src/contexts/ProgressTrackingContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
interface ProgressRecord {
  studentId: string;
  chapterId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  exercisesCompleted: string[];
  exerciseScores: { [exerciseId: string]: number };
  timeSpent: number; // in seconds
  updatedAt: string;
}

interface ProgressTrackingContextType {
  progress: ProgressRecord | null;
  updateProgress: (chapterId: string, updates: Partial<Omit<ProgressRecord, 'studentId'>>) => void;
  submitExercise: (exerciseId: string, score: number) => void;
  setTimeSpent: (seconds: number) => void;
  isReady: boolean;
}

// Create context
const ProgressTrackingContext = createContext<ProgressTrackingContextType | undefined>(undefined);

interface ProgressTrackingProviderProps {
  children: ReactNode;
  studentId: string;
  initialChapterId?: string;
}

export const ProgressTrackingProvider: React.FC<ProgressTrackingProviderProps> = ({ 
  children, 
  studentId, 
  initialChapterId = 'introduction' 
}) => {
  const [progress, setProgress] = useState<ProgressRecord | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize progress when component mounts
  useEffect(() => {
    // In a real app, we would fetch initial progress from storage or server
    const initialProgress: ProgressRecord = {
      studentId,
      chapterId: initialChapterId,
      status: 'in_progress',
      exercisesCompleted: [],
      exerciseScores: {},
      timeSpent: 0,
      updatedAt: new Date().toISOString()
    };

    setProgress(initialProgress);
    setIsReady(true);
  }, [studentId, initialChapterId]);

  // Update progress function
  const updateProgress = (chapterId: string, updates: Partial<Omit<ProgressRecord, 'studentId'>>) => {
    if (!progress) return;

    const updatedProgress = {
      ...progress,
      ...updates,
      chapterId,
      updatedAt: new Date().toISOString(),
    } as ProgressRecord;

    setProgress(updatedProgress);

    // In a real implementation, we would save to server or localStorage
    localStorage.setItem('progress-' + studentId, JSON.stringify(updatedProgress));
  };

  // Submit exercise function
  const submitExercise = (exerciseId: string, score: number) => {
    if (!progress) return;

    const updatedExercises = [...progress.exercisesCompleted];
    if (!updatedExercises.includes(exerciseId)) {
      updatedExercises.push(exerciseId);
    }

    const updatedScores = {
      ...progress.exerciseScores,
      [exerciseId]: score
    };

    // Calculate status based on completed exercises
    const exerciseCount = Object.keys(updatedScores).length;
    const completedCount = updatedExercises.length;
    const status = exerciseCount > 0 && completedCount >= exerciseCount ? 'completed' : 'in_progress';

    updateProgress(progress.chapterId, {
      exercisesCompleted: updatedExercises,
      exerciseScores: updatedScores,
      status
    });
  };

  // Set time spent function
  const setTimeSpent = (seconds: number) => {
    if (!progress) return;

    updateProgress(progress.chapterId, {
      timeSpent: progress.timeSpent + seconds
    });
  };

  // Listen for updates to progress from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'progress-' + studentId && e.newValue) {
        try {
          setProgress(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Error parsing progress from storage:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [studentId]);

  return (
    <ProgressTrackingContext.Provider value={{ 
      progress, 
      updateProgress, 
      submitExercise,
      setTimeSpent,
      isReady
    }}>
      {children}
    </ProgressTrackingContext.Provider>
  );
};

export const useProgressTracking = (): ProgressTrackingContextType => {
  const context = useContext(ProgressTrackingContext);
  if (context === undefined) {
    throw new Error('useProgressTracking must be used within a ProgressTrackingProvider');
  }
  return context;
};