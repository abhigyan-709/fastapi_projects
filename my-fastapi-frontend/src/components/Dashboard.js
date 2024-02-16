import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ handleLogout }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch industrial categories data after authentication
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Assuming you store the token in localStorage
        const apiUrl = "http://localhost:8000"; // Update with your FastAPI server URL
        const response = await axios.get(`${apiUrl}/industrial_categories/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array to run the effect only once on component mount

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the Dashboard!</p>
      <button onClick={handleLogout}>Logout</button>

      <h3>Industrial Categories:</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <strong>{category.name}</strong>
            <p>{category.description}</p>
            {/* Display other category details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
