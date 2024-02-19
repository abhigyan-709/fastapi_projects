import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import './css/LoginForm.css';

const LoginForm = ({ setShowRegistrationForm }) => {
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

      // Extract the access token and username from the response
      const accessToken = response.data.access_token;
      const username = formData.username;

      // Store the access token and username in local storage
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('username', username);

      // Fetch user details using the access token
      const userResponse = await axios.get('http://127.0.0.1:8000/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Store user details in local storage
      localStorage.setItem('user_details', JSON.stringify(userResponse.data));

      console.log(response.data);
      console.log('UserName: ', formData.username);

      setLoginMessage('Login successful!');
      navigate('/dashboard'); // Assuming you have a route named 'dashboard'
      setShowRegistrationForm(false);
    } catch (error) {
      console.error('Login failed', error);
      setLoginMessage('');
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-form p-4 border">
        <h2 className="mb-4">Login</h2>
        <label className="mb-3">
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="form-control"
          />
        </label>

        <label className="mb-3">
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-control"
          />
        </label>

        <button onClick={handleLogin} className="btn btn-primary">
          Login
        </button>
        <button onClick={() => setShowRegistrationForm(true)} className="btn btn-secondary">
        Register
      </button>
      </div>
      {loginMessage && <p className="mt-3">{loginMessage}</p>}
    </div>
  );
};

export default LoginForm;
