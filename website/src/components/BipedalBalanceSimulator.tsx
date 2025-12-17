// website/src/components/BipedalBalanceSimulator.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './BipedalBalanceSimulator.module.css';

interface BipedalBalanceSimulatorProps {
  width?: string;
  height?: string;
}

const BipedalBalanceSimulator: React.FC<BipedalBalanceSimulatorProps> = ({ 
  width = '100%', 
  height = '500px' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState({
    mass: 70, // kg
    length: 1.0, // meters
    controlGain: 10,
    disturbance: 0,
  });
  const [timeData, setTimeData] = useState<number[]>([]);
  const [angleData, setAngleData] = useState<number[]>([]);
  const [controlData, setControlData] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0.1); // small initial disturbance
  const [currentControl, setCurrentControl] = useState(0);

  // Simulation constants
  const gravity = 9.81; // m/s^2
  const dt = 0.01; // time step in seconds
  const maxDataPoints = 500; // limit stored data points

  useEffect(() => {
    if (!isRunning) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const simulate = (timestamp: number) => {
      if (!canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      // Calculate time delta
      const delta = (timestamp - lastTime) / 1000; // convert to seconds
      lastTime = timestamp;

      // Calculate dynamics (simplified inverted pendulum)
      // d²θ/dt² = (g/L) * sin(θ) - (u/mL²) * θ
      // Where θ is angle, g is gravity, L is pendulum length, u is control input
      const acceleration = (gravity / params.length) * Math.sin(currentAngle) 
                          - (currentControl / (params.mass * params.length * params.length)) * currentAngle
                          + params.disturbance; // Add disturbance

      // Update state using Euler integration
      const newAngularVelocity = currentAngle + acceleration * dt;
      const newAngle = currentAngle + newAngularVelocity * dt;

      // Calculate control input (simple PD controller)
      // u = Kp * θ + Kd * (dθ/dt)
      const control = params.controlGain * newAngle + 2 * Math.sqrt(params.controlGain) * newAngularVelocity;
      const newControl = Math.max(-100, Math.min(100, control)); // Limit control input

      // Update state
      setCurrentAngle(newAngle);
      setCurrentControl(newControl);

      // Update data arrays for plotting
      setTimeData(prev => {
        const newTime = [...prev, performance.now()];
        return newTime.length > maxDataPoints ? newTime.slice(1) : newTime;
      });

      setAngleData(prev => {
        const newAngles = [...prev, newAngle];
        return newAngles.length > maxDataPoints ? newAngles.slice(1) : newAngles;
      });

      setControlData(prev => {
        const newControls = [...prev, newControl];
        return newControls.length > maxDataPoints ? newControls.slice(1) : newControls;
      });

      // Clear canvas and draw pendulum
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw cart
      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;
      
      // Draw pendulum line
      const endX = centerX + Math.sin(newAngle) * params.length * 50;
      const endY = centerY - Math.cos(newAngle) * params.length * 50;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#007bff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw mass at end
      ctx.beginPath();
      ctx.arc(endX, endY, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#dc3545';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw pivot point
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#28a745';
      ctx.fill();

      animationFrameId = requestAnimationFrame(simulate);
    };

    animationFrameId = requestAnimationFrame(simulate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, currentAngle, currentControl, params]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setCurrentAngle(0.1);
    setCurrentControl(0);
    setTimeData([]);
    setAngleData([]);
    setControlData([]);
  };

  const handleParamChange = (param: string, value: number) => {
    setParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  return (
    <div className={styles.container}>
      <h3>Interactive Bipedal Balance Simulator</h3>
      
      <div className={styles.simulationArea} style={{ width, height }}>
        <canvas 
          ref={canvasRef} 
          width={parseInt(width) || 600} 
          height={parseInt(height) || 500}
          className={styles.canvas}
        />
      </div>
      
      <div className={styles.controls}>
        <div className={styles.paramControls}>
          <div className={styles.paramControl}>
            <label>Mass (kg): {params.mass}</label>
            <input
              type="range"
              min="10"
              max="200"
              step="1"
              value={params.mass}
              onChange={(e) => handleParamChange('mass', Number(e.target.value))}
            />
          </div>
          
          <div className={styles.paramControl}>
            <label>Length (m): {params.length.toFixed(2)}</label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.01"
              value={params.length}
              onChange={(e) => handleParamChange('length', Number(e.target.value))}
            />
          </div>
          
          <div className={styles.paramControl}>
            <label>Control Gain: {params.controlGain}</label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={params.controlGain}
              onChange={(e) => handleParamChange('controlGain', Number(e.target.value))}
            />
          </div>
          
          <div className={styles.paramControl}>
            <label>Disturbance: {params.disturbance.toFixed(2)}</label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={params.disturbance}
              onChange={(e) => handleParamChange('disturbance', Number(e.target.value))}
            />
          </div>
        </div>
        
        <div className={styles.simulationControls}>
          <button onClick={handleStart} disabled={isRunning} className={styles.btn}>
            ▶️ Start
          </button>
          <button onClick={handleStop} disabled={!isRunning} className={styles.btn}>
            ⏹️ Stop
          </button>
          <button onClick={handleReset} className={styles.btn}>
            🔄 Reset
          </button>
        </div>
      </div>
      
      <div className={styles.explanation}>
        <h4>Physics Explanation</h4>
        <p>
          This simulator demonstrates the inverted pendulum model used to represent bipedal balance.
          The human body is approximated as a point mass on top of a massless rod.
          The control system applies torque to maintain balance by counteracting disturbances.
        </p>
        
        <div className={styles.equations}>
          <h5>Key Equations:</h5>
          <p>θ'' = (g/L) * sin(θ) - (u/mL²) * θ + d</p>
          <p>u = Kp * θ + Kd * θ'</p>
          <p>Where θ is angle, g is gravity, L is length, u is control, m is mass, d is disturbance</p>
        </div>
      </div>
    </div>
  );
};

export default BipedalBalanceSimulator;