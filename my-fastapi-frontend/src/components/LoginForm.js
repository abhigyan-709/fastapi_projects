import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

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

      // Extract the access token from the response
      const accessToken = response.data.access_token;

      // Store the access token in local storage
      localStorage.setItem('access_token', accessToken);

      // Fetch user details using the access token
      const userResponse = await axios.get('http://127.0.0.1:8000/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Store user details in local storage
      localStorage.setItem('user_details', JSON.stringify(userResponse.data));

      console.log(response.data);

      setLoginMessage('Login successful!');
      navigate('/dashboard');
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
