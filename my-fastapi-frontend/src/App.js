import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import Response from './components/Response';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={handleLogout}>
          Your App Name
        </Link>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-dark">
      <div className="container text-center">
        <span className="text-muted">Your App Footer</span>
      </div>
    </footer>
  );
};

const HomePage = ({ showRegistrationForm, setShowRegistrationForm }) => {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <Router>
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route
              path="/"
              element={
                showRegistrationForm ? (
                  <RegistrationForm setShowRegistrationForm={setShowRegistrationForm} />
                ) : (
                  <LoginForm setShowRegistrationForm={setShowRegistrationForm} />
                )
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/response" element={<Response />} />
          </Routes>
        </main>
        <Footer />
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
