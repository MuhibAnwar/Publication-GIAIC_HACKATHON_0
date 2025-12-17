// website/src/components/ROS2Visualizer.tsx
import React, { useEffect, useRef } from 'react';
import styles from './ROS2Visualizer.module.css';

interface ROS2VisualizerProps {
  nodeId: string;
  topicName?: string;
  width?: string;
  height?: string;
}

const ROS2Visualizer: React.FC<ROS2VisualizerProps> = ({ 
  nodeId, 
  topicName = '/rosout', 
  width = '100%', 
  height = '400px' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This would connect to a ROS2 system via rosbridge in a real implementation
    // For the demo, we'll just show a placeholder with simulated data

    if (containerRef.current) {
      // Create a simple visualization placeholder
      const placeholder = document.createElement('div');
      placeholder.className = styles.placeholder;
      placeholder.innerHTML = `
        <div class="${styles.header}">
          <h4>ROS2 Visualizer: ${nodeId}</h4>
          <p>Topic: ${topicName}</p>
        </div>
        <div class="${styles.visualization}">
          <div class="${styles.node}">Node: ${nodeId}</div>
          <div class="${styles.topic}">Listening to: ${topicName}</div>
          <div class="${styles.message}">Status: Simulated Connection</div>
        </div>
        <div class="${styles.controls}">
          <button class="${styles.btn} ${styles.connect}">Connect</button>
          <button class="${styles.btn} ${styles.disconnect}">Disconnect</button>
        </div>
      `;
      
      // Clear previous content and add new placeholder
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(placeholder);
      
      // Add event listeners for the buttons
      const connectBtn = placeholder.querySelector(`.${styles.connect}`);
      const disconnectBtn = placeholder.querySelector(`.${styles.disconnect}`);
      
      if (connectBtn) {
        connectBtn.addEventListener('click', () => {
          console.log('Connecting to ROS2 node:', nodeId);
          // In a real implementation, this would connect to rosbridge
        });
      }
      
      if (disconnectBtn) {
        disconnectBtn.addEventListener('click', () => {
          console.log('Disconnecting from ROS2 node:', nodeId);
          // In a real implementation, this would disconnect from rosbridge
        });
      }
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [nodeId, topicName]);

  return (
    <div 
      ref={containerRef} 
      className={styles.container}
      style={{ width, height }}
    />
  );
};

export default ROS2Visualizer;