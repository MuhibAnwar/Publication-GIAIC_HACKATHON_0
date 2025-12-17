// website/src/components/LTIIntegration.tsx
import React, { useState, useEffect } from 'react';
import styles from './LTIIntegration.module.css';

interface LTIIntegrationProps {
  children?: React.ReactNode;
  className?: string;
}

const LTIIntegration: React.FC<LTIIntegrationProps> = ({ 
  children, 
  className = '' 
}) => {
  const [isLTISession, setIsLTISession] = useState(false);
  const [ltiData, setLtiData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking for LTI launch parameters
  useEffect(() => {
    // In a real implementation, this would parse the actual POST data from LTI launch
    // For this example, we'll check for a mock LTI parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const ltiUser = urlParams.get('lti_user');
    
    if (ltiUser) {
      setIsLTISession(true);
      setLtiData({
        'lti_version': 'LTI-1p0',
        'lti_message_type': 'basic-lti-launch-request',
        'user_id': ltiUser,
        'roles': urlParams.get('lti_roles') || 'Student',
        'context_id': urlParams.get('context_id') || 'default-course',
        'resource_link_id': urlParams.get('resource_link_id') || 'default-resource'
      });
    }
    
    setIsLoading(false);
  }, []);

  // Simulate LTI launch
  const handleLTILaunch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would make an actual LTI launch request
    // For this example, we'll simulate the launch and set LTI session data
    setIsLTISession(true);
    setLtiData({
      'lti_version': 'LTI-1p0',
      'lti_message_type': 'basic-lti-launch-request',
      'user_id': 'demo_user_12345',
      'roles': 'Student',
      'context_id': 'course_123',
      'resource_link_id': 'resource_456'
    });
    
    alert('LTI launch simulated. In a real implementation, this would connect to your LMS.');
  };

  // Render content based on LTI status
  if (isLoading) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.loader}>Initializing LTI integration...</div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <h3>LTI Integration for Learning Management Systems</h3>
      
      {isLTISession ? (
        <div className={styles.ltiSession}>
          <h4>LTI Session Active</h4>
          <p>You have been launched from an LMS (Learning Management System).</p>
          
          <div className={styles.sessionInfo}>
            <h5>Session Information:</h5>
            <ul>
              {Object.entries(ltiData).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
          
          <div className={styles.content}>
            <h5>Content for LTI Session:</h5>
            {children || (
              <p>This content is being displayed within the LTI frame from your LMS.</p>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.noLtiSession}>
          <p>
            Not currently running in an LTI session. In a Learning Management System like 
            Canvas or Moodle, this component would receive user and course context information.
          </p>
          
          <form onSubmit={handleLTILaunch} className={styles.ltiForm}>
            <h4>Simulate LTI Launch:</h4>
            <div className={styles.formGroup}>
              <label htmlFor="userId">User ID:</label>
              <input 
                type="text" 
                id="userId" 
                defaultValue="demo_user_12345"
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="courseId">Course ID:</label>
              <input 
                type="text" 
                id="courseId" 
                defaultValue="course_123"
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className={styles.checkbox}
                /> Student Role
              </label>
            </div>
            
            <button type="submit" className={`${styles.btn} ${styles.launchBtn}`}>
              Launch as LTI Tool
            </button>
          </form>
        </div>
      )}

      <div className={styles.infoSection}>
        <h4>About LTI Integration</h4>
        <p>
          Learning Tools Interoperability (LTI) allows this textbook to integrate seamlessly 
          with popular Learning Management Systems (LMS) like Canvas and Moodle. When launched 
          from an LMS, the system receives contextual information about the user, course, 
          and assignment, enabling features like grade passback and personalized content.
        </p>
        
        <div className={styles.features}>
          <h5>Supported LTI Features:</h5>
          <ul>
            <li>User identity and role information</li>
            <li>Course and assignment context</li>
            <li>Grade passback to LMS</li>
            <li>Secure communication channels</li>
            <li>Automatic authentication</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LTIIntegration;