// website/src/components/JupyterIntegration.tsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './JupyterIntegration.module.css';

interface JupyterNotebook {
  id: string;
  title: string;
  description: string;
  code: string;
  outputs: string[];
}

interface JupyterIntegrationProps {
  notebook?: JupyterNotebook;
  width?: string;
  height?: string;
}

const JupyterIntegration: React.FC<JupyterIntegrationProps> = ({ 
  notebook = {
    id: 'basic-ros2-node',
    title: 'Basic ROS2 Node Implementation',
    description: 'Learn how to implement a basic ROS2 node in Python that publishes joint commands',
    code: `import rclpy
from rclpy.node import Node
from std_msgs.msg import String
from sensor_msgs.msg import JointState

class HumanoidController(Node):
    def __init__(self):
        super().__init__('humanoid_controller')
        
        # Create publisher for joint commands
        self.publisher = self.create_publisher(JointState, 'joint_commands', 10)
        
        # Create timer to send commands periodically
        self.timer = self.create_timer(0.1, self.publish_joint_commands)
        self.i = 0
        
    def publish_joint_commands(self):
        msg = JointState()
        msg.position = [self.i * 0.1] * 28  # Example: 28 DOF humanoid
        self.publisher.publish(msg)
        self.get_logger().info(f'Published joint commands: {self.i}')
        self.i += 1

def main():
    rclpy.init()
    controller = HumanoidController()
    rclpy.spin(controller)
    controller.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()`,
    outputs: ['Published joint commands: 0', 'Published joint commands: 1', 'Published joint commands: 2']
  },
  width = '100%',
  height = '600px'
}) => {
  const [code, setCode] = useState(notebook.code);
  const [outputs, setOutputs] = useState<string[]>(notebook.outputs);
  const [isRunning, setIsRunning] = useState(false);
  const [executionCount, setExecutionCount] = useState(0);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Simulate running the code
  const handleRunCode = () => {
    setIsRunning(true);
    
    // In a real implementation, this would send the code to a Jupyter kernel
    // For this demo, we'll simulate execution
    
    setTimeout(() => {
      // Generate some output based on the code
      const simulatedOutput = [
        `[Cell ${executionCount + 1}] Node initialized`,
        `[Cell ${executionCount + 1}] Publishers and subscribers created`,
        `[Cell ${executionCount + 1}] Execution completed successfully`
      ];
      
      setOutputs(prev => [...prev, ...simulatedOutput]);
      setExecutionCount(prev => prev + 1);
      setIsRunning(false);
    }, 1500);
  };

  const handleClear = () => {
    setOutputs([]);
    setExecutionCount(0);
  };

  const handleReset = () => {
    setCode(notebook.code);
    setOutputs(notebook.outputs);
    setExecutionCount(0);
  };

  // Update code when notebook prop changes
  useEffect(() => {
    if (notebook) {
      setCode(notebook.code);
      setOutputs(notebook.outputs);
    }
  }, [notebook]);

  return (
    <div className={styles.container} style={{ width, height }}>
      <div className={styles.header}>
        <h3>{notebook.title}</h3>
        <p>{notebook.description}</p>
      </div>
      
      <div className={styles.jupyterContainer}>
        <div className={styles.toolbar}>
          <button 
            className={`${styles.btn} ${styles.runBtn}`}
            onClick={handleRunCode}
            disabled={isRunning}
          >
            {isRunning ? '🏃‍♂️ Running...' : '▶️ Run Cell'}
          </button>
          <button 
            className={`${styles.btn} ${styles.clearBtn}`}
            onClick={handleClear}
          >
            🧹 Clear Output
          </button>
          <button 
            className={`${styles.btn} ${styles.resetBtn}`}
            onClick={handleReset}
          >
            🔄 Reset
          </button>
          <div className={styles.cellIndicator}>
            Cell [{executionCount}]
          </div>
        </div>
        
        <div className={styles.editor}>
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.codeEditor}
            spellCheck={false}
          />
        </div>
        
        <div className={styles.output}>
          <div className={styles.outputHeader}>
            <h4>Output:</h4>
          </div>
          
          <div className={styles.outputContent}>
            {outputs.length === 0 ? (
              <div className={styles.emptyOutput}>
                <p>Run the code to see output here...</p>
              </div>
            ) : (
              outputs.map((output, index) => (
                <div key={index} className={styles.outputLine}>
                  <span className={styles.prompt}>Out[{index + 1}]:</span>
                  <pre>{output}</pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.explanation}>
        <h4>About This Notebook</h4>
        <p>
          This Jupyter notebook integration allows you to write, run, and experiment with Python code 
          directly in the textbook. It's particularly useful for understanding ROS2 concepts, 
          developing control algorithms, and prototyping robotic applications. The simulated execution
          environment allows you to test code snippets related to humanoid robotics without requiring
          a physical robot or ROS2 installation.
        </p>
      </div>
    </div>
  );
};

export default JupyterIntegration;