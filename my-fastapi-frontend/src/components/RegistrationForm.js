import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    city: '',
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate(); // Hook to navigate between routes

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistration = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/register/', formData);
      console.log(response.data); // Handle the response as needed

      // If registration is successful, navigate back to the home page
      if (response.status === 201) {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div className="registration-container container mt-5">
      <h2 className="mb-4">Registration</h2>
      <div className="registration-form">
        <div className="row mb-3">
          <label htmlFor="first_name" className="col-sm-2 col-form-label">
            First Name:
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="last_name" className="col-sm-2 col-form-label">
            Last Name:
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="city" className="col-sm-2 col-form-label">
            City:
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="username" className="col-sm-2 col-form-label">
            Username:
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="email" className="col-sm-2 col-form-label">
            Email:
          </label>
          <div className="col-sm-10">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="password" className="col-sm-2 col-form-label">
            Password:
          </label>
          <div className="col-sm-10">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <button onClick={handleRegistration} className="btn btn-primary">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
