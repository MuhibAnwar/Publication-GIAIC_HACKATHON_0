// website/src/components/SimulationControls.tsx
import React, { useState } from 'react';
import styles from './SimulationControls.module.css';

interface SimulationControlsProps {
  onPlay?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onSpeedChange?: (speed: number) => void;
  onParameterChange?: (param: string, value: number) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({ 
  onPlay, 
  onPause, 
  onReset, 
  onSpeedChange,
  onParameterChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [gravity, setGravity] = useState(-9.81);
  const [friction, setFriction] = useState(0.5);
  const [timeStep, setTimeStep] = useState(0.01);

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay && onPlay();
  };

  const handlePause = () => {
    setIsPlaying(false);
    onPause && onPause();
  };

  const handleReset = () => {
    setIsPlaying(false);
    onReset && onReset();
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    onSpeedChange && onSpeedChange(newSpeed);
  };

  const handleGravityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGravity = parseFloat(e.target.value);
    setGravity(newGravity);
    onParameterChange && onParameterChange('gravity', newGravity);
  };

  const handleFrictionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFriction = parseFloat(e.target.value);
    setFriction(newFriction);
    onParameterChange && onParameterChange('friction', newFriction);
  };

  const handleTimeStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeStep = parseFloat(e.target.value);
    setTimeStep(newTimeStep);
    onParameterChange && onParameterChange('timeStep', newTimeStep);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controlsRow}>
        <button 
          className={`${styles.btn} ${styles.playBtn}`}
          onClick={isPlaying ? handlePause : handlePlay}
          aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button 
          className={`${styles.btn} ${styles.resetBtn}`}
          onClick={handleReset}
          aria-label="Reset simulation"
        >
          🔄 Reset
        </button>
      </div>

      <div className={styles.controlsRow}>
        <label className={styles.label}>
          Speed: {speed.toFixed(1)}x
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={speed}
            onChange={handleSpeedChange}
            className={styles.slider}
            aria-label="Simulation speed control"
          />
        </label>
      </div>

      <div className={styles.parameters}>
        <h4>Physics Parameters</h4>
        <div className={styles.paramRow}>
          <label className={styles.label}>
            Gravity: {gravity.toFixed(2)}
            <input
              type="range"
              min="-20"
              max="0"
              step="0.1"
              value={gravity}
              onChange={handleGravityChange}
              className={styles.slider}
              aria-label="Gravity control"
            />
          </label>
        </div>

        <div className={styles.paramRow}>
          <label className={styles.label}>
            Friction: {friction.toFixed(2)}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={friction}
              onChange={handleFrictionChange}
              className={styles.slider}
              aria-label="Friction control"
            />
          </label>
        </div>

        <div className={styles.paramRow}>
          <label className={styles.label}>
            Time Step: {timeStep.toFixed(3)}
            <input
              type="range"
              min="0.001"
              max="0.1"
              step="0.001"
              value={timeStep}
              onChange={handleTimeStepChange}
              className={styles.slider}
              aria-label="Time step control"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;