import React, { useState } from 'react';
import './CoinFlip.css';

function CoinFlip({ theme }) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });

  const flipCoin = () => {
    if (isFlipping) return;

    setIsFlipping(true);
    setResult(null);

    // Random result
    const outcome = Math.random() < 0.5 ? 'heads' : 'tails';

    setTimeout(() => {
      setResult(outcome);
      setIsFlipping(false);

      // Update history and stats
      setHistory([outcome, ...history].slice(0, 10));
      setStats(prev => ({
        ...prev,
        [outcome]: prev[outcome] + 1
      }));
    }, 1500);
  };

  const resetStats = () => {
    setStats({ heads: 0, tails: 0 });
    setHistory([]);
    setResult(null);
  };

  const totalFlips = stats.heads + stats.tails;
  const headsPercentage = totalFlips > 0 ? ((stats.heads / totalFlips) * 100).toFixed(1) : 0;
  const tailsPercentage = totalFlips > 0 ? ((stats.tails / totalFlips) * 100).toFixed(1) : 0;

  return (
    <div className={`component-page ${theme}-theme`}>
      <div className="page-header">
        <h1>🪙 Coin Flip</h1>
        <p className="page-description">Flip a virtual coin - Heads or Tails?</p>
      </div>

      {/* Coin - Click/Touch to Flip */}
      <div className="coin-container">
        <div
          className={`coin ${isFlipping ? 'flipping' : ''} ${result ? result : ''}`}
          onClick={flipCoin}
          style={{ cursor: isFlipping ? 'default' : 'pointer' }}
          title={isFlipping ? 'Flipping...' : 'Click or tap to flip!'}
        >
          <div className="coin-side heads">
            <div className="coin-face">
              <div className="coin-text">HEADS</div>
              <div className="coin-symbol">👑</div>
            </div>
          </div>
          <div className="coin-side tails">
            <div className="coin-face">
              <div className="coin-text">TAILS</div>
              <div className="coin-symbol">⭐</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction Text */}
      <div className="coin-instruction">
        <p>{isFlipping ? '🔄 Flipping...' : '👆 Click or tap the coin to flip!'}</p>
      </div>

      {/* Result Display */}
      {result && !isFlipping && (
        <div className="result-display">
          <div className={`result-text ${result}`}>
            {result === 'heads' ? '👑 HEADS!' : '⭐ TAILS!'}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="stats-section">
        <div className="stats-header">
          <h3>📊 Statistics</h3>
          <button onClick={resetStats} className="btn-reset-stats">
            Reset
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card heads-stat">
            <div className="stat-icon">👑</div>
            <div className="stat-label">Heads</div>
            <div className="stat-value">{stats.heads}</div>
            <div className="stat-percentage">{headsPercentage}%</div>
          </div>

          <div className="stat-card tails-stat">
            <div className="stat-icon">⭐</div>
            <div className="stat-label">Tails</div>
            <div className="stat-value">{stats.tails}</div>
            <div className="stat-percentage">{tailsPercentage}%</div>
          </div>

          <div className="stat-card total-stat">
            <div className="stat-icon">🎯</div>
            <div className="stat-label">Total Flips</div>
            <div className="stat-value">{totalFlips}</div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="history-section">
            <h4>Recent Results</h4>
            <div className="history-timeline">
              {history.map((flip, index) => (
                <div key={index} className={`history-item ${flip}`}>
                  {flip === 'heads' ? '👑' : '⭐'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoinFlip;
