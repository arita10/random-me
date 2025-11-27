import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const features = [
    {
      icon: '🎡',
      title: 'Spinning Wheel',
      description: 'Create custom wheels for random selection with weighted options',
      path: '/wheel',
      color: '#FF6B6B'
    },
    {
      icon: '🎲',
      title: 'Dice Roller',
      description: 'Roll multiple dice with customizable sides and quantities',
      path: '/dice',
      color: '#4ECDC4'
    },
    {
      icon: '🃏',
      title: 'Card Selector',
      description: 'Pick random cards from custom decks with various selection modes',
      path: '/cards',
      color: '#95E1D3'
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">✨ Free & Easy to Use</span>
          </div>
          <h1 className="hero-title">
            Make Random Decisions
            <span className="gradient-text"> Effortlessly</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate random selection toolkit for choosing winners, making decisions, 
            and adding fun to your daily choices. No signup required.
          </p>
          <div className="hero-actions">
            <Link to="/wheel" className="btn btn-primary">
              Get Started
              <span className="btn-icon">→</span>
            </Link>
            <a href="#features" className="btn btn-secondary">
              Explore Features
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card card-1">🎡</div>
          <div className="floating-card card-2">🎲</div>
          <div className="floating-card card-3">🃏</div>
          <div className="visual-circle"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <h2 className="section-title">Choose Your Selector</h2>
          <p className="section-subtitle">
            Three powerful tools to help you make fair and random selections
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <Link 
              to={feature.path} 
              key={index} 
              className="feature-card"
              style={{'--feature-color': feature.color}}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-link">
                Try it now
                <span className="link-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Get instant results without any delays or loading times</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🔒</div>
            <h3>Private & Secure</h3>
            <p>Your data stays on your device with optional cloud sync</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">📱</div>
            <h3>Works Everywhere</h3>
            <p>Fully responsive design works on all your devices</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🎨</div>
            <h3>Customizable</h3>
            <p>Personalize colors, options, and weights to your needs</p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases">
        <h2 className="section-title">Perfect For...</h2>
        <div className="use-cases-grid">
          <div className="use-case">
            <span className="use-case-emoji">🎉</span>
            <p>Contest winners</p>
          </div>
          <div className="use-case">
            <span className="use-case-emoji">🍕</span>
            <p>Where to eat</p>
          </div>
          <div className="use-case">
            <span className="use-case-emoji">👥</span>
            <p>Team assignments</p>
          </div>
          <div className="use-case">
            <span className="use-case-emoji">🎮</span>
            <p>Game decisions</p>
          </div>
          <div className="use-case">
            <span className="use-case-emoji">🎬</span>
            <p>Movie nights</p>
          </div>
          <div className="use-case">
            <span className="use-case-emoji">📚</span>
            <p>Study topics</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to make your choice?</h2>
          <p className="cta-subtitle">Start using Random Selector now - no signup required</p>
          <Link to="/wheel" className="btn btn-primary btn-large">
            Start Selecting
            <span className="btn-icon">🚀</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;