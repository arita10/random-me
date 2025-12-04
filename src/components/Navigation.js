import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signInWithGoogle, signOutUser } from '../firebase';
import './Navigation.css';

function Navigation({ darkMode, user, toggleDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert("Error signing in: " + error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      alert("Error signing out: " + error.message);
    }
  };

  const menuItems = [
    {
      title: 'Selection Tools',
      icon: '🎯',
      items: [
        { path: '/wheel', icon: '🎲', label: 'Spinning Wheel' },
        { path: '/fortune-sticks', icon: '🥢', label: 'Fortune Sticks' },
        { path: '/cards', icon: '🃏', label: 'Card Selector' },
        { path: '/dice', icon: '🎲', label: 'Dice Roller' },
        { path: '/color', icon: '🎨', label: 'Color Picker' }
      ]
    },
    {
      title: 'Games',
      icon: '🎮',
      items: [
        { path: '/coin-flip', icon: '🪙', label: 'Coin Flip' },
        { path: '/rps', icon: '✊', label: 'Rock Paper Scissors' },
        { path: '/matching-game', icon: '🃏', label: 'Matching Game' }
      ]
    },
    {
      title: 'Team Tools',
      icon: '👥',
      items: [
        { path: '/team-assignment', icon: '📋', label: 'Team Assignment' }
      ]
    }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🎡</span>
          <span className="logo-text">Random Me</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links desktop-menu">
          {menuItems.map((menu, menuIndex) => (
            <div
              key={menuIndex}
              className="nav-dropdown"
              onMouseEnter={() => setDropdown(menuIndex)}
              onMouseLeave={() => setDropdown(null)}
            >
              <button className="nav-link dropdown-toggle">
                <span className="nav-icon">{menu.icon}</span>
                {menu.title}
                <span className="dropdown-arrow">▼</span>
              </button>

              <div className={`dropdown-menu ${dropdown === menuIndex ? 'show' : ''}`}>
                {menu.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    to={item.path}
                    className={`dropdown-item ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <span className="item-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="nav-actions">
          <button
            onClick={toggleDarkMode}
            className="theme-toggle-btn"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {!user ? (
            <button onClick={handleSignIn} className="google-signin-button">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: '6px' }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
              Sign in
            </button>
          ) : (
            <div className="user-info">
              {user.photoURL && <img src={user.photoURL} alt="Profile" className="user-avatar" />}
              <span className="user-name">{user.displayName}</span>
              <button onClick={handleSignOut} className="signout-button">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
              </button>
            </div>
          )}

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
        {menuItems.map((menu, menuIndex) => (
          <div key={menuIndex} className="mobile-menu-section">
            <div className="mobile-section-title">
              <span className="nav-icon">{menu.icon}</span>
              {menu.title}
            </div>
            {menu.items.map((item, itemIndex) => (
              <Link
                key={itemIndex}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        ))}

        {!user ? (
          <button onClick={handleSignIn} className="google-signin-button mobile">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: '6px' }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            Sign in
          </button>
        ) : (
          <div className="user-info mobile">
            {user.photoURL && <img src={user.photoURL} alt="Profile" className="user-avatar" />}
            <span className="user-name">{user.displayName}</span>
            <button onClick={handleSignOut} className="signout-button mobile">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
