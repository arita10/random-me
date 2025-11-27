import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';  // ← ADD THIS!
import './App.css';

// Import components
import SpinningWheel from './components/SpinningWheel';
import DiceRoller from './components/DiceRoller';
import CardSelector from './components/CardSelector';

// UI Components
import LandingPage from './components/LandingPage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthProvider>  {/* ← WRAP EVERYTHING IN AuthProvider! */}
      <Router>
        <div className="app-container">
          <Navigation 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
          />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/wheel" element={<SpinningWheel />} />
              <Route path="/dice" element={<DiceRoller />} />
              <Route path="/cards" element={<CardSelector />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>  
  );
}

export default App;