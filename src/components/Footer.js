import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="footer-icon">🎲</span>
              Random Selector
            </h3>
            <p className="footer-description">
              Make fair and random selections with ease. Perfect for contests, decisions, and games.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Selection Tools</h4>
            <ul className="footer-links">
              <li><Link to="/wheel">🎡 Spinning Wheel</Link></li>
              <li><Link to="/cards">🃏 Card Selector</Link></li>
              <li><Link to="/dice">🎲 Dice Roller</Link></li>
              <li><Link to="/color">🎨 Color Picker</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Games & Tools</h4>
            <ul className="footer-links">
              <li><Link to="/coin-flip">🪙 Coin Flip</Link></li>
              <li><Link to="/rps">✊ Rock Paper Scissors</Link></li>
              <li><Link to="/matching-game">🎴 Matching Game</Link></li>
              <li><Link to="/team-assignment">👥 Team Assignment</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:randommecon12@gmail.com" aria-label="Email us">
                  📧 randommecon12@gmail.com
                </a>
              </li>
              <li>
                <Link to="/" aria-label="Visit homepage">
                  🌐 Website
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Random Selector. Made with ❤️ for better decisions.
          </p>
          <div className="footer-badges">
            <span className="footer-badge">✨ Free Forever</span>
            <span className="footer-badge">🔒 Privacy First</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;