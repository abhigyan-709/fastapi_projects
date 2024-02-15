import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const Dashboard = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleLogout = () => {
    // Perform any logout logic here
    // For example, clear user data from local storage

    // Redirect to the login page
    navigate('/');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the Dashboard!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
