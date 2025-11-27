import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation({ darkMode, toggleDarkMode, user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🎲</span>
          <span className="logo-text">Random Selector</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links desktop-menu">
          <Link 
            to="/wheel" 
            className={`nav-link ${isActive('/wheel') ? 'active' : ''}`}
          >
            <span className="nav-icon">🎡</span>
            Wheel
          </Link>
          <Link 
            to="/dice" 
            className={`nav-link ${isActive('/dice') ? 'active' : ''}`}
          >
            <span className="nav-icon">🎲</span>
            Dice
          </Link>
          <Link 
            to="/cards" 
            className={`nav-link ${isActive('/cards') ? 'active' : ''}`}
          >
            <span className="nav-icon">🃏</span>
            Cards
          </Link>
        </div>

        <div className="nav-actions">
          <button 
            className="theme-toggle" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Mobile menu button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <Link 
          to="/wheel" 
          className={`nav-link ${isActive('/wheel') ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="nav-icon">🎡</span>
          Wheel
        </Link>
        <Link 
          to="/dice" 
          className={`nav-link ${isActive('/dice') ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="nav-icon">🎲</span>
          Dice
        </Link>
        <Link 
          to="/cards" 
          className={`nav-link ${isActive('/cards') ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="nav-icon">🃏</span>
          Cards
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;