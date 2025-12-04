import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const tools = [
    { icon: '🎲', title: 'Spinning Wheel', path: '/wheel', color: '#6366f1' },
    { icon: '🥢', title: 'Fortune Sticks', path: '/fortune-sticks', color: '#8b5cf6' },
    { icon: '🃏', title: 'Card Selector', path: '/cards', color: '#ec4899' },
    { icon: '🎨', title: 'Color Picker', path: '/color', color: '#f43f5e' },
    { icon: '🎲', title: 'Dice Roller', path: '/dice', color: '#f59e0b' },
    { icon: '🪙', title: 'Coin Flip', path: '/coin-flip', color: '#3b82f6' },
    { icon: '🤔', title: 'Yes or No', path: '/yes-no', color: '#8b5cf6' },
    { icon: '✊', title: 'Rock Paper Scissors', path: '/rps', color: '#14b8a6' },
    { icon: '🎴', title: 'Matching Game', path: '/matching-game', color: '#10b981' },
    { icon: '👥', title: 'Team Assignment', path: '/team-assignment', color: '#6366f1' }
  ];

  return (
    <main className="landing-page">
      {/* Floating Decorations */}
      <div className="floating-decorations">
        <div className="floating-emoji emoji-1">🎲</div>
        <div className="floating-emoji emoji-2">🎨</div>
        <div className="floating-emoji emoji-3">🃏</div>
        <div className="floating-emoji emoji-4">🪙</div>
        <div className="floating-emoji emoji-5">✊</div>
        <div className="floating-emoji emoji-6">🥢</div>
      </div>

      {/* Simple Hero */}
      <section className="hero">
        <h1 className="hero-title">
          Random Me 🎡
        </h1>
        <p className="hero-subtitle">
          Can't decide? <span className="highlight">Let luck decide for you!</span> 🍀
        </p>
        <p className="hero-description">
          From choosing what to eat for lunch to picking contest winners, Random Me makes decisions fun and fair.
          Spin the wheel, shake the fortune sticks, or flip a coin - your perfect random selector is just a click away!
        </p>
      </section>

      {/* Tools Grid */}
      <section className="tools">
        <div className="tools-grid">
          {tools.map((tool, index) => (
            <Link
              key={index}
              to={tool.path}
              className="tool-card"
              style={{ '--tool-color': tool.color }}
            >
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-title">{tool.title}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Tags */}
      <section className="features">
        <div className="feature-tags">
          <div className="feature-tag">✨ No Ads</div>
          <div className="feature-tag">🚀 Super Fast</div>
          <div className="feature-tag">🎨 Beautiful Design</div>
          <div className="feature-tag">💾 Save Your Favorites</div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="use-cases">
        <h2 className="use-cases-title">Perfect for...</h2>
        <div className="use-cases-grid">
          <div className="use-case-item">🎉 Contest & Giveaways</div>
          <div className="use-case-item">🍕 Where to Eat Tonight</div>
          <div className="use-case-item">🎬 Movie Night Picks</div>
          <div className="use-case-item">👥 Team Assignments</div>
          <div className="use-case-item">🎮 Game Decisions</div>
          <div className="use-case-item">📚 Study Topic Selector</div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="info">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-emoji">⚡</span>
            <span>Quick & Easy</span>
          </div>
          <div className="info-item">
            <span className="info-emoji">🎮</span>
            <span>Fun to Use</span>
          </div>
          <div className="info-item">
            <span className="info-emoji">📱</span>
            <span>Works on Mobile</span>
          </div>
          <div className="info-item">
            <span className="info-emoji">🆓</span>
            <span>Free Forever</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;