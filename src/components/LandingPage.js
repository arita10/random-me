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
      color: '#6366f1',
      category: 'Selection Tools'
    },
    {
      icon: '🃏',
      title: 'Card Selector',
      description: 'Pick random cards from custom decks with various selection modes',
      path: '/cards',
      color: '#8b5cf6',
      category: 'Selection Tools'
    },
    {
      icon: '🎲',
      title: 'Dice Roller',
      description: 'Roll multiple dice with customizable sides and quantities',
      path: '/dice',
      color: '#ec4899',
      category: 'Selection Tools'
    },
    {
      icon: '🎨',
      title: 'Color Picker',
      description: 'Spin the wheel or randomly select colors from your palette',
      path: '/color',
      color: '#f43f5e',
      category: 'Selection Tools'
    },
    {
      icon: '👥',
      title: 'Team Assignment',
      description: 'Randomly assign people to teams with Excel import support',
      path: '/team-assignment',
      color: '#10b981',
      category: 'Team Tools'
    },
    {
      icon: '🪙',
      title: 'Coin Flip',
      description: 'Flip a virtual coin with beautiful 3D animation and statistics',
      path: '/coin-flip',
      color: '#f59e0b',
      category: 'Games'
    },
    {
      icon: '✊',
      title: 'Rock Paper Scissors',
      description: 'Play against the computer and track your wins and losses',
      path: '/rps',
      color: '#3b82f6',
      category: 'Games'
    },
    {
      icon: '🎴',
      title: 'Matching Game',
      description: 'Test your memory with this fun card matching game',
      path: '/matching-game',
      color: '#14b8a6',
      category: 'Games'
    }
  ];

  return (
    <main className="landing-page" role="main">
      {/* Hero Section */}
      <section className="hero" aria-label="Welcome to Random Selector">
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
          <div className="floating-card card-2">🎨</div>
          <div className="floating-card card-3">🪙</div>
          <div className="floating-card card-4">✊</div>
          <div className="visual-circle"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features" aria-label="Random selection tools and features">
        <header className="section-header">
          <h2 className="section-title">All Random Tools in One Place</h2>
          <p className="section-subtitle">
            Eight powerful tools to help you make fair and random decisions
          </p>
        </header>

        <div className="features-grid">
          {features.map((feature, index) => (
            <article
              key={index}
              className="feature-card"
              style={{'--feature-color': feature.color}}
            >
              <Link to={feature.path} aria-label={`Go to ${feature.title}`}>
              <div className="feature-category">{feature.category}</div>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-link">
                Try it now
                <span className="link-arrow">→</span>
              </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits" aria-label="Key benefits and features">
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Get instant results without any delays or loading times</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🔒</div>
            <h3>Private & Secure</h3>
            <p>Enterprise-grade security with input validation and XSS protection</p>
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
          <div className="benefit-item">
            <div className="benefit-icon">📤</div>
            <h3>Excel Import</h3>
            <p>Bulk import names from Excel files for team assignments</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">📊</div>
            <h3>Track Statistics</h3>
            <p>View detailed stats and history for games and selections</p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases" aria-label="Common use cases">
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
          <div className="use-case">
            <span className="use-case-emoji">🎨</span>
            <p>Design palettes</p>
          </div>
          <div className="use-case">
            <span className="use-case-emoji">⚽</span>
            <p>Sports teams</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" aria-label="Call to action">
        <div className="cta-content">
          <h2 className="cta-title">Ready to make your choice?</h2>
          <p className="cta-subtitle">Start using Random Selector now - no signup required</p>
          <Link to="/wheel" className="btn btn-primary btn-large">
            Start Selecting
            <span className="btn-icon">🚀</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;