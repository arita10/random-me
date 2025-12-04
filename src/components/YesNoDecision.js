import React, { useState } from 'react';
import './YesNoDecision.css';

function YesNoDecision({ theme }) {
  const [isDeciding, setIsDeciding] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [choice1, setChoice1] = useState('YES');
  const [choice2, setChoice2] = useState('NO');
  const [showCustomize, setShowCustomize] = useState(false);

  const makeDecision = () => {
    if (isDeciding) return;

    setIsDeciding(true);
    setResult(null);

    // Random result: true = choice1, false = choice2
    const outcome = Math.random() < 0.5 ? 'choice1' : 'choice2';

    // Simulate decision time
    setTimeout(() => {
      setResult(outcome);
      setIsDeciding(false);

      // Update history
      setHistory([{ outcome, choice1, choice2 }, ...history].slice(0, 10));
    }, 1500);
  };

  const resetHistory = () => {
    setHistory([]);
    setResult(null);
  };

  const choice1Count = history.filter(h => h.outcome === 'choice1').length;
  const choice2Count = history.filter(h => h.outcome === 'choice2').length;

  return (
    <div className={`component-page ${theme}-theme`}>
      <div className="page-header">
        <h1>🤔 Yes or No?</h1>
        <p className="page-description">Can't decide? Let fate choose for you!</p>
      </div>

      {/* Decision Display */}
      <div className="decision-container">
        <div
          className={`decision-circle ${isDeciding ? 'deciding' : ''} ${result ? result : ''}`}
          onClick={makeDecision}
          style={{ cursor: isDeciding ? 'default' : 'pointer' }}
          title={isDeciding ? 'Deciding...' : 'Click or tap to decide!'}
        >
          {!isDeciding && !result && (
            <div className="decision-prompt">
              <div className="question-mark">?</div>
              <div className="decision-text">Tap to Decide</div>
            </div>
          )}
          {isDeciding && (
            <div className="decision-loading">
              <div className="spinner"></div>
              <div className="decision-text">Thinking...</div>
            </div>
          )}
          {result && !isDeciding && (
            <div className={`decision-result ${result}`}>
              <div className="result-icon">
                {result === 'choice1' ? '✓' : '✗'}
              </div>
              <div className="result-text">
                {result === 'choice1' ? choice1 : choice2}!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instruction Text */}
      <div className="decision-instruction">
        <p>{isDeciding ? '🤔 Making decision...' : '👆 Click the circle to get your answer!'}</p>
      </div>

      {/* Customize Choices */}
      <div className="customize-section">
        <button
          onClick={() => setShowCustomize(!showCustomize)}
          className="customize-toggle-btn"
        >
          ⚙️ {showCustomize ? 'Hide' : 'Customize Choices'}
        </button>

        {showCustomize && (
          <div className="customize-panel">
            <h3>Edit Your Choices</h3>
            <div className="choice-inputs">
              <div className="choice-input-group">
                <label>Choice 1:</label>
                <input
                  type="text"
                  value={choice1}
                  onChange={(e) => setChoice1(e.target.value.toUpperCase())}
                  maxLength={15}
                  placeholder="e.g., YES, GO, PIZZA"
                />
              </div>
              <div className="choice-input-group">
                <label>Choice 2:</label>
                <input
                  type="text"
                  value={choice2}
                  onChange={(e) => setChoice2(e.target.value.toUpperCase())}
                  maxLength={15}
                  placeholder="e.g., NO, STAY, BURGER"
                />
              </div>
            </div>
            <div className="preset-buttons">
              <button onClick={() => { setChoice1('YES'); setChoice2('NO'); }} className="preset-btn">
                Yes/No
              </button>
              <button onClick={() => { setChoice1('GO'); setChoice2('STAY'); }} className="preset-btn">
                Go/Stay
              </button>
              <button onClick={() => { setChoice1('BUY'); setChoice2('SAVE'); }} className="preset-btn">
                Buy/Save
              </button>
              <button onClick={() => { setChoice1('DO IT'); setChoice2('WAIT'); }} className="preset-btn">
                Do It/Wait
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      {history.length > 0 && (
        <div className="stats-section">
          <div className="stats-header">
            <h3>📊 Decision History</h3>
            <button onClick={resetHistory} className="btn-reset-stats">
              Clear History
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card yes-stat">
              <div className="stat-icon">✓</div>
              <div className="stat-label">{choice1}</div>
              <div className="stat-value">{choice1Count}</div>
              <div className="stat-percentage">
                {history.length > 0 ? ((choice1Count / history.length) * 100).toFixed(0) : 0}%
              </div>
            </div>

            <div className="stat-card no-stat">
              <div className="stat-icon">✗</div>
              <div className="stat-label">{choice2}</div>
              <div className="stat-value">{choice2Count}</div>
              <div className="stat-percentage">
                {history.length > 0 ? ((choice2Count / history.length) * 100).toFixed(0) : 0}%
              </div>
            </div>

            <div className="stat-card total-stat">
              <div className="stat-icon">📝</div>
              <div className="stat-label">Total Decisions</div>
              <div className="stat-value">{history.length}</div>
            </div>
          </div>

          {/* History Timeline */}
          <div className="history-section">
            <h4>Recent Decisions</h4>
            <div className="history-timeline">
              {history.map((decision, index) => (
                <div
                  key={index}
                  className={`history-item ${decision.outcome}`}
                  title={decision.outcome === 'choice1' ? decision.choice1 : decision.choice2}
                >
                  {decision.outcome === 'choice1' ? '✓' : '✗'}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YesNoDecision;
