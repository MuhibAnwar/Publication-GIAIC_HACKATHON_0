// website/src/components/EquationSolver.tsx
import React, { useState } from 'react';
import styles from './EquationSolver.module.css';

interface EquationSolverProps {
  equation?: string;
  explanation?: string;
}

const EquationSolver: React.FC<EquationSolverProps> = ({ 
  equation = '$\\tau = I \\alpha$ (Torque = Moment of Inertia × Angular Acceleration)', 
  explanation = 'This equation describes the relationship between torque (τ), moment of inertia (I), and angular acceleration (α) in rotational motion.'
}) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  // For this example, we'll handle a simple torque calculation
  const handleCalculate = () => {
    const inertia = parseFloat(inputValues.inertia || '0');
    const alpha = parseFloat(inputValues.alpha || '0');
    
    if (isNaN(inertia) || isNaN(alpha)) {
      setResult('Please enter valid numbers for all values');
      return;
    }
    
    const torque = inertia * alpha;
    setResult(`Torque (τ) = ${inertia} × ${alpha} = ${torque.toFixed(4)} N·m`);
  };

  const handleInputChange = (param: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const handleReset = () => {
    setInputValues({});
    setResult(null);
  };

  return (
    <div className={`${styles.container} ${styles.equationBox}`}>
      <h3>Interactive Equation Solver</h3>
      
      <div className={styles.equation}>
        <p>Equation: {equation}</p>
      </div>
      
      <div className={styles.explanation}>
        <p>{explanation}</p>
      </div>
      
      <div className={styles.parameters}>
        <div className={styles.paramInput}>
          <label htmlFor="inertia">Moment of Inertia (I) in kg·m²:</label>
          <input
            id="inertia"
            type="number"
            value={inputValues.inertia || ''}
            onChange={(e) => handleInputChange('inertia', e.target.value)}
            className={styles.input}
            placeholder="Enter value"
          />
        </div>
        
        <div className={styles.paramInput}>
          <label htmlFor="alpha">Angular Acceleration (α) in rad/s²:</label>
          <input
            id="alpha"
            type="number"
            value={inputValues.alpha || ''}
            onChange={(e) => handleInputChange('alpha', e.target.value)}
            className={styles.input}
            placeholder="Enter value"
          />
        </div>
      </div>
      
      <div className={styles.actions}>
        <button 
          className={`${styles.btn} ${styles.calculateBtn}`}
          onClick={handleCalculate}
        >
          Calculate
        </button>
        <button 
          className={`${styles.btn} ${styles.resetBtn}`}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      
      {result && (
        <div className={styles.result}>
          <h4>Result:</h4>
          <p>{result}</p>
        </div>
      )}
      
      <div className={styles.example}>
        <h4>Example:</h4>
        <p>If I = 5 kg·m² and α = 2 rad/s², then τ = 5 × 2 = 10 N·m</p>
      </div>
    </div>
  );
};

export default EquationSolver;