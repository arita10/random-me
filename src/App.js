import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { initGA, logPageView } from './utils/analytics';
import './App.css';

// Import components
import SpinningWheel from './components/SpinningWheel';
import DiceRoller from './components/DiceRoller';
import CardSelector from './components/CardSelector';
import TeamAssignment from './components/TeamAssignment';
import ColorPicker from './components/ColorPicker';
import CoinFlip from './components/CoinFlip';
import RockPaperScissors from './components/RockPaperScissors';
import MatchingGame from './components/MatchingGame';

// UI Components
import LandingPage from './components/LandingPage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Google Analytics page tracking component
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  // Track user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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

  const theme = darkMode ? 'dark' : 'light';

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <AnalyticsTracker />
      <div className={`app-container ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
        <Navigation
          darkMode={darkMode}
          user={user}
          toggleDarkMode={toggleDarkMode}
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Selection Tools */}
            <Route path="/wheel" element={<SpinningWheel theme={theme} />} />
            <Route path="/cards" element={<CardSelector theme={theme} />} />
            <Route path="/dice" element={<DiceRoller theme={theme} />} />
            <Route path="/color" element={<ColorPicker theme={theme} />} />
            {/* Games */}
            <Route path="/coin-flip" element={<CoinFlip theme={theme} />} />
            <Route path="/rps" element={<RockPaperScissors theme={theme} />} />
            <Route path="/matching-game" element={<MatchingGame theme={theme} />} />
            {/* Team Tools */}
            <Route path="/team-assignment" element={<TeamAssignment theme={theme} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;