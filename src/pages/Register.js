import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';


const apiEndpoint = 'http://localhost:8080/api/auth/register';

const Register = ({ onRegister, switchView }) => {
  const [error, setError] = useState('');

  const handleRegister = async (userData) => {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        const user = await response.json();
        onRegister(user);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h1>Create an Account</h1>
      <AuthForm onSubmit={handleRegister} isRegister={true} buttonText="Register" error={error} />
      <p>
        Already have an account?{' '}
        <span className="auth-link" onClick={() => switchView('login')}>
          Login here
        </span>
      </p>
    </div>
  );
};

export default Register;