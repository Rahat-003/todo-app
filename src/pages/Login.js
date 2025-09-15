import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';


// const apiEndpoint = 'http://localhost:15009/api/auth/login';
const apiEndpoint = 'http://localhost:15000/api/v1/auth/login';

const Login = ({ onLogin, switchView }) => {
  const [error, setError] = useState('');

const handleLogin = async (credentials) => {
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (response.ok) {
      const user = await response.json();
      onLogin(user);
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Invalid email or password');
    }
  } catch (err) {
    setError('Network error. Please try again.');
  }
};

  return (
    <div className="auth-container">
      <h1>Login to Your Todo App</h1>
      <AuthForm onSubmit={handleLogin} buttonText="Login" error={error} />
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