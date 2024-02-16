import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard'; // Import the Dashboard component
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Update the import

const HomePage = ({ showRegistrationForm, setShowRegistrationForm }) => {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Routes>
            <Route
              path="/"
              element={showRegistrationForm ? <RegistrationForm /> : <LoginForm />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </header>
      </Router>
    </div>
  );
};

function App() {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  return (
    <HomePage
      showRegistrationForm={showRegistrationForm}
      setShowRegistrationForm={setShowRegistrationForm}
    />
  );
}

export default App;
