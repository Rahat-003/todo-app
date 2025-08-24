import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { register } from '../utils/auth';

const Register = ({ onRegister, switchView }) => {
  const [error, setError] = useState('');

  const handleRegister = async (name, email, password) => {
    try {
      const user = register(name, email, password);
      onRegister(user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Create an Account</h1>
      {error && <div className="error-message">{error}</div>}
      <AuthForm onSubmit={handleRegister} isRegister={true} buttonText="Register" />
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