// website/src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './LoginForm.module.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const { login, register, user, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const success = await login(email, password);
      if (!success) {
        alert('Login failed. Please try again.');
      }
    } else {
      const success = await register(name, email, password, role);
      if (!success) {
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
        {user ? (
          <div className={styles.userInfo}>
            <p>Welcome, {user.name}!</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <button onClick={logout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <div className={styles.inputGroup}>
                <label htmlFor="name">Full Name:</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className={styles.input}
                />
              </div>
            )}
            
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            
            {!isLogin && (
              <div className={styles.inputGroup}>
                <label htmlFor="role">Role:</label>
                <select 
                  id="role" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as 'student' | 'instructor')}
                  className={styles.select}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
            )}
            
            <button type="submit" className={styles.submitBtn}>
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
        )}
        
        <div className={styles.toggle}>
          <button onClick={() => setIsLogin(!isLogin)} className={styles.toggleBtn}>
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;