// RegistrationForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './css/RegistrationForm.css';  // Import your CSS file for styling

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    city: '',
    username: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistration = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/register/', formData);
      console.log(response.data); // Handle the response as needed
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div className="registration-container">
      <h2>Registration</h2>
      <div className="registration-form">
        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
          />
        </label>

        <label>
          City:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
        </label>

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
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
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

        <button onClick={handleRegistration}>Register</button>
      </div>
    </div>
  );
};

export default RegistrationForm;
