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
        { path: '/wheel', icon: '🎡', label: 'Spinning Wheel' },
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
        { path: '/rps', icon: '✊', label: 'Rock Paper Scissors' }
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
          <span className="logo-icon">🎲</span>
          <span className="logo-text">Random Selector</span>
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
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
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
