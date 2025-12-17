// website/src/components/SimulationDemo.tsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './SimulationDemo.module.css';

interface SimulationState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  rotation: number;
  angularVelocity: number;
  sensors: {
    imu: { roll: number; pitch: number; yaw: number };
    lidar: number[]; // distances at different angles
    camera: string; // image data or placeholder
  };
}

interface SimulationDemoProps {
  width?: string;
  height?: string;
}

const SimulationDemo: React.FC<SimulationDemoProps> = ({ width = '100%', height = '500px' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [state, setState] = useState<SimulationState>({
    position: { x: 250, y: 200 },
    velocity: { x: 0, y: 0 },
    rotation: 0,
    angularVelocity: 0,
    sensors: {
      imu: { roll: 0, pitch: 0, yaw: 0 },
      lidar: Array(36).fill(100), // 36 readings around 360 degrees
      camera: 'simulated-camera-data'
    }
  });
  const [controls, setControls] = useState({
    thrust: 0,
    torque: 0,
    left: false,
    right: false,
    up: false,
    down: false
  });
  const [environmentObjects, setEnvironmentObjects] = useState([
    { x: 100, y: 100, w: 20, h: 20, type: 'obstacle' },
    { x: 400, y: 300, w: 30, h: 30, type: 'target' },
    { x: 300, y: 150, w: 15, h: 15, type: 'landmark' }
  ]);

  // Physics constants
  const gravity = 0.2;
  const damping = 0.98;
  const robotSize = { w: 40, h: 20 };

  // Main simulation loop
  useEffect(() => {
    if (!isRunning || isPaused) return;

    let animationFrameId: number;
    const lastTimestamp = { current: performance.now() };

    const simulate = (timestamp: number) => {
      const deltaTime = (timestamp - lastTimestamp.current) / 16; // Normalize to 60fps
      lastTimestamp.current = timestamp;

      setState(prev => {
        // Calculate forces based on controls
        const thrustForce = controls.thrust * 0.5;
        const torqueForce = controls.torque * 0.1;

        // Update velocities
        const newVelocity = {
          x: (prev.velocity.x + Math.sin(prev.rotation) * thrustForce) * damping,
          y: (prev.velocity.y - Math.cos(prev.rotation) * thrustForce + gravity) * damping
        };

        // Update angular velocity
        const newAngularVelocity = (prev.angularVelocity + torqueForce) * 0.98;

        // Update position
        const newPosition = {
          x: prev.position.x + newVelocity.x,
          y: prev.position.y + newVelocity.y
        };

        // Update rotation
        const newRotation = prev.rotation + newAngularVelocity;

        // Check for collisions with environment objects
        let adjustedPosition = { ...newPosition };
        for (const obj of environmentObjects) {
          // Simplified collision detection
          if (
            newPosition.x < obj.x + obj.w &&
            newPosition.x + robotSize.w > obj.x &&
            newPosition.y < obj.y + obj.h &&
            newPosition.y + robotSize.h > obj.y
          ) {
            // For simplicity, just bounce back
            adjustedPosition.x = prev.position.x;
            adjustedPosition.y = prev.position.y;
          }
        }

        // Boundary checks
        const boundedPosition = {
          x: Math.max(robotSize.w / 2, Math.min(600 - robotSize.w / 2, adjustedPosition.x)),
          y: Math.max(robotSize.h / 2, Math.min(400 - robotSize.h / 2, adjustedPosition.y))
        };

        // Update sensor readings
        const newSensors = { ...prev.sensors };
        
        // IMU simulation - based on movement and external forces
        newSensors.imu.roll = Math.sin(timestamp * 0.001) * 0.1;
        newSensors.imu.pitch = Math.cos(timestamp * 0.0015) * 0.1;
        newSensors.imu.yaw = (newRotation * 180 / Math.PI) % 360;

        // LIDAR simulation - simplified distance measurements
        const newLidar = [...prev.sensors.lidar];
        for (let i = 0; i < newLidar.length; i++) {
          // Calculate distance to nearest obstacle in this direction
          const angle = (i * 10 * Math.PI) / 180; // 10-degree increments
          let distance = 100; // Max range
          
          // Simplified ray casting to environment objects
          for (const obj of environmentObjects) {
            // Calculate distance to object in this direction
            const dx = obj.x - boundedPosition.x;
            const dy = obj.y - boundedPosition.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < distance) {
              distance = dist;
            }
          }
          
          // Apply noise to measurement
          newLidar[i] = Math.max(5, Math.min(100, distance + (Math.random() * 4 - 2)));
        }
        
        newSensors.lidar = newLidar;

        return {
          position: boundedPosition,
          velocity: newVelocity,
          rotation: newRotation,
          angularVelocity: newAngularVelocity,
          sensors: newSensors
        };
      });

      animationFrameId = requestAnimationFrame(simulate);
    };

    animationFrameId = requestAnimationFrame(simulate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isRunning, isPaused, controls, environmentObjects]);

  // Draw the simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw environment
    environmentObjects.forEach(obj => {
      if (obj.type === 'obstacle') {
        ctx.fillStyle = '#e74c3c'; // Red for obstacles
      } else if (obj.type === 'target') {
        ctx.fillStyle = '#2ecc71'; // Green for targets
      } else {
        ctx.fillStyle = '#3498db'; // Blue for landmarks
      }
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
    });

    // Draw robot
    ctx.save();
    ctx.translate(state.position.x, state.position.y);
    ctx.rotate(state.rotation);

    // Robot body
    ctx.fillStyle = '#3498db';
    ctx.fillRect(-robotSize.w / 2, -robotSize.h / 2, robotSize.w, robotSize.h);

    // Robot "head" indicator
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(robotSize.w / 2 - 5, -5, 10, 10);

    // Wheels/actuators
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(-robotSize.w / 2, -robotSize.h / 2 - 5, robotSize.w / 3, 5); // Left wheel
    ctx.fillRect(robotSize.w / 6, -robotSize.h / 2 - 5, robotSize.w / 3, 5); // Right wheel

    ctx.restore();

    // Draw velocity vector
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(state.position.x, state.position.y);
    ctx.lineTo(
      state.position.x + state.velocity.x * 10,
      state.position.y + state.velocity.y * 10
    );
    ctx.stroke();

    // Draw rotation indicator
    ctx.strokeStyle = '#9b59b6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      state.position.x,
      state.position.y,
      30,
      state.rotation - 0.2,
      state.rotation + 0.2
    );
    ctx.stroke();
  }, [state, environmentObjects]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setState({
      position: { x: 250, y: 200 },
      velocity: { x: 0, y: 0 },
      rotation: 0,
      angularVelocity: 0,
      sensors: {
        imu: { roll: 0, pitch: 0, yaw: 0 },
        lidar: Array(36).fill(100),
        camera: 'simulated-camera-data'
      }
    });
  };

  const handleControlChange = (control: string, value: number | boolean) => {
    setControls(prev => ({
      ...prev,
      [control]: value
    }));
  };

  return (
    <div className={styles.container} style={{ width, height }}>
      <h3>Browser-Based Robotics Simulation Demo</h3>
      
      <div className={styles.simulationArea}>
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400}
          className={styles.canvas}
        />
      </div>
      
      <div className={styles.controls}>
        <div className={styles.simulationControls}>
          <button onClick={handleStart} disabled={isRunning && !isPaused} className={`${styles.btn} ${styles.startBtn}`}>
            ▶️ Start
          </button>
          <button onClick={handlePauseResume} disabled={!isRunning} className={`${styles.btn} ${styles.pauseBtn}`}>
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button onClick={handleStop} disabled={!isRunning} className={`${styles.btn} ${styles.stopBtn}`}>
            ⏹️ Stop
          </button>
          <button onClick={handleReset} className={`${styles.btn} ${styles.resetBtn}`}>
            🔄 Reset
          </button>
        </div>
        
        <div className={styles.manualControls}>
          <h4>Manual Controls:</h4>
          <div className={styles.controlGroup}>
            <label>
              Thrust: {controls.thrust.toFixed(2)}
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={controls.thrust}
                onChange={(e) => handleControlChange('thrust', parseFloat(e.target.value))}
                className={styles.slider}
              />
            </label>
            
            <label>
              Torque: {controls.torque.toFixed(2)}
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={controls.torque}
                onChange={(e) => handleControlChange('torque', parseFloat(e.target.value))}
                className={styles.slider}
              />
            </label>
          </div>
          
          <div className={styles.buttonControls}>
            <button 
              onMouseDown={() => handleControlChange('up', true)} 
              onMouseUp={() => handleControlChange('up', false)}
              onTouchStart={() => handleControlChange('up', true)} 
              onTouchEnd={() => handleControlChange('up', false)}
              className={`${styles.directionalBtn} ${styles.upBtn}`}
            >
              ↑
            </button>
            
            <div>
              <button 
                onMouseDown={() => handleControlChange('left', true)} 
                onMouseUp={() => handleControlChange('left', false)}
                onTouchStart={() => handleControlChange('left', true)} 
                onTouchEnd={() => handleControlChange('left', false)}
                className={`${styles.directionalBtn} ${styles.leftBtn}`}
              >
                ←
              </button>
              
              <button 
                onMouseDown={() => handleControlChange('right', true)} 
                onMouseUp={() => handleControlChange('right', false)}
                onTouchStart={() => handleControlChange('right', true)} 
                onTouchEnd={() => handleControlChange('right', false)}
                className={`${styles.directionalBtn} ${styles.rightBtn}`}
              >
                →
              </button>
            </div>
            
            <button 
              onMouseDown={() => handleControlChange('down', true)} 
              onMouseUp={() => handleControlChange('down', false)}
              onTouchStart={() => handleControlChange('down', true)} 
              onTouchEnd={() => handleControlChange('down', false)}
              className={`${styles.directionalBtn} ${styles.downBtn}`}
            >
              ↓
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.sensorData}>
        <h4>Sensor Data:</h4>
        <div className={styles.dataGrid}>
          <div className={styles.dataItem}>
            <strong>Position:</strong> ({state.position.x.toFixed(2)}, {state.position.y.toFixed(2)})
          </div>
          <div className={styles.dataItem}>
            <strong>Velocity:</strong> ({state.velocity.x.toFixed(2)}, {state.velocity.y.toFixed(2)})
          </div>
          <div className={styles.dataItem}>
            <strong>Rotation:</strong> {state.rotation.toFixed(2)} rad ({(state.rotation * 180 / Math.PI).toFixed(1)}°)
          </div>
          <div className={styles.dataItem}>
            <strong>IMU:</strong> R:{state.sensors.imu.roll.toFixed(3)}, P:{state.sensors.imu.pitch.toFixed(3)}, Y:{state.sensors.imu.yaw.toFixed(1)}
          </div>
          <div className={styles.dataItem}>
            <strong>LIDAR:</strong> Min:{Math.min(...state.sensors.lidar).toFixed(1)}, Avg:{(state.sensors.lidar.reduce((a, b) => a + b, 0) / state.sensors.lidar.length).toFixed(1)}, Max:{Math.max(...state.sensors.lidar).toFixed(1)}
          </div>
        </div>
      </div>
      
      <div className={styles.explanation}>
        <h4>About This Simulation</h4>
        <p>
          This browser-based simulation demonstrates core concepts in humanoid robotics and autonomous navigation. 
          The simulated robot responds to physical forces like gravity and user input, showing how control algorithms 
          can be applied in a realistic environment. Sensors provide feedback similar to real robots, allowing 
          students to experiment with perception and control algorithms without requiring physical hardware.
        </p>
      </div>
    </div>
  );
};

export default SimulationDemo;