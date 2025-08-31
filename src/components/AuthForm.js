import React, { useState } from 'react';

const AuthForm = ({ onSubmit, isRegister = false, buttonText, error }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      onSubmit({ name, email, password });
    } else {
      onSubmit({ email, password });
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      {isRegister && (
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default AuthForm;