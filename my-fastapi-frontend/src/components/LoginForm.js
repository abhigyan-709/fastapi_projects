import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Ensure you are using version 6
import './css/LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate(); // Use useNavigate for version 6

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/token',
        new URLSearchParams(formData),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log(response.data);

      setLoginMessage('Login successful!');
      navigate('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      console.error('Login failed', error);
      setLoginMessage('');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="login-form">
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </label>

        <button onClick={handleLogin}>Login</button>
      </div>
      {loginMessage && <p>{loginMessage}</p>}
    </div>
  );
};

export default LoginForm;
