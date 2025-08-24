import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { login } from '../utils/auth';

const Login = ({ onLogin, switchView }) => {
  const [error, setError] = useState('');

  const handleLogin = async (email, password) => {
    try {
      const user = login(email, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Login to Your Todo App</h1>
      {error && <div className="error-message">{error}</div>}
      <AuthForm onSubmit={handleLogin} buttonText="Login" />
      <p>
        Don't have an account?{' '}
        <span className="auth-link" onClick={() => switchView('register')}>
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;