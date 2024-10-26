// src/components/Auth/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message

    // Basic validation
    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    try {
      // Call API for login
      const userData = await api.login(email, password);
      if (userData) {
        login(userData);
        navigate('/inventory'); // Navigate to dashboard after login
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Login</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="form-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="form-input"
        />
        <button type="submit" className="submit-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
