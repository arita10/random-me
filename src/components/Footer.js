import React from 'react';
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
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/wheel">Spinning Wheel</a></li>
              <li><a href="/dice">Dice Roller</a></li>
              <li><a href="/cards">Card Selector</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><a href="#how-to-use">How to Use</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Connect</h4>
            <ul className="footer-links">
              <li><a href="#feedback">Send Feedback</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="#contact">Contact</a></li>
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