// website/src/components/ThreeDModelViewer.tsx
import React, { useEffect, useRef } from 'react';
import styles from './ThreeDModelViewer.module.css';

interface ThreeDModelViewerProps {
  modelPath?: string;
  modelType?: 'humanoid' | 'robot' | 'environment' | 'custom';
  width?: string;
  height?: string;
  showControls?: boolean;
}

const ThreeDModelViewer: React.FC<ThreeDModelViewerProps> = ({ 
  modelPath, 
  modelType = 'humanoid', 
  width = '100%', 
  height = '400px',
  showControls = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // For a real implementation, we would use Three.js here
      // This is a placeholder that simulates the 3D viewer
      
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      // Create the visualization container
      const viewerContainer = document.createElement('div');
      viewerContainer.className = styles.viewerContainer;
      viewerContainer.style.width = width;
      viewerContainer.style.height = height;
      
      // Add model-specific content
      let modelTitle, modelDesc;
      switch(modelType) {
        case 'humanoid':
          modelTitle = 'Humanoid Robot Model';
          modelDesc = 'Bipedal robot with human-like structure and degrees of freedom';
          break;
        case 'robot':
          modelTitle = 'Robot Model';
          modelDesc = 'Generic robot model with configurable joints and sensors';
          break;
        case 'environment':
          modelTitle = 'Environment Model';
          modelDesc = '3D representation of simulation environment';
          break;
        default:
          modelTitle = '3D Model';
          modelDesc = 'Custom 3D model visualization';
      }
      
      viewerContainer.innerHTML = `
        <div class="${styles.viewerHeader}">
          <h4>${modelTitle}</h4>
        </div>
        <div class="${styles.viewerContent}">
          <div class="${styles.viewerPlaceholder}">
            <div class="${styles.modelIcon}">🤖</div>
            <p>${modelDesc}</p>
            <p class="${styles.modelPath}">${modelPath ? `Model: ${modelPath}` : 'No model loaded'}</p>
          </div>
        </div>
        ${showControls ? 
          `<div class="${styles.viewerControls}">
            <button class="${styles.controlBtn} ${styles.rotate}">Rotate</button>
            <button class="${styles.controlBtn} ${styles.zoomIn}">Zoom In</button>
            <button class="${styles.controlBtn} ${styles.zoomOut}">Zoom Out</button>
            <button class="${styles.controlBtn} ${styles.reset}">Reset View</button>
          </div>` : ''}
      `;
      
      containerRef.current.appendChild(viewerContainer);
      
      // Add event listeners for controls
      if (showControls) {
        const rotateBtn = viewerContainer.querySelector(`.${styles.rotate}`);
        const zoomInBtn = viewerContainer.querySelector(`.${styles.zoomIn}`);
        const zoomOutBtn = viewerContainer.querySelector(`.${styles.zoomOut}`);
        const resetBtn = viewerContainer.querySelector(`.${styles.reset}`);
        
        if (rotateBtn) rotateBtn.addEventListener('click', () => console.log('Rotate model'));
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => console.log('Zoom in'));
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => console.log('Zoom out'));
        if (resetBtn) resetBtn.addEventListener('click', () => console.log('Reset view'));
      }
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [modelPath, modelType, width, height, showControls]);

  return (
    <div 
      ref={containerRef} 
      className={styles.container}
    />
  );
};

export default ThreeDModelViewer;