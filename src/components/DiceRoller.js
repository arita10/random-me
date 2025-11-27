// DiceRoller.js - Complete Dice Roller Component
// Place this in: src/components/DiceRoller.js

import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { validateDiceRoll, checkRateLimit } from '../utils/validation';
import './DiceRoller.css';

function DiceRoller() {
  const { userId } = useAuth();
  const [diceCount, setDiceCount] = useState(1);
  const [diceSides, setDiceSides] = useState(6);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');

  // Common dice types
  const diceTypes = [
    { sides: 4, name: 'D4', emoji: '🎲' },
    { sides: 6, name: 'D6', emoji: '🎲' },
    { sides: 8, name: 'D8', emoji: '🎲' },
    { sides: 10, name: 'D10', emoji: '🎲' },
    { sides: 12, name: 'D12', emoji: '🎲' },
    { sides: 20, name: 'D20', emoji: '🎲' },
    { sides: 100, name: 'D100', emoji: '🎲' }
  ];

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [userId]);

  // Load roll history from Firestore
  const loadHistory = async () => {
    if (!userId) return;

    try {
      const q = query(
        collection(db, 'diceRolls'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      const rolls = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setHistory(rolls);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  // Roll dice
  const handleRoll = async () => {
    // Validate input
    const validation = validateDiceRoll(diceSides, diceCount);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    // Rate limiting
    const rateCheck = checkRateLimit('diceRoll', 500); // 1 roll per 0.5 seconds
    if (!rateCheck.allowed) {
      setError(rateCheck.error);
      return;
    }

    setIsRolling(true);
    setError('');

    // Simulate rolling animation
    const rollInterval = setInterval(() => {
      const tempResults = Array.from({ length: diceCount }, () => 
        Math.floor(Math.random() * diceSides) + 1
      );
      setResults(tempResults);
    }, 100);

    // Final result after animation
    setTimeout(async () => {
      clearInterval(rollInterval);
      
      const finalResults = Array.from({ length: diceCount }, () => 
        Math.floor(Math.random() * diceSides) + 1
      );
      const finalTotal = finalResults.reduce((sum, val) => sum + val, 0);

      setResults(finalResults);
      setTotal(finalTotal);
      setIsRolling(false);

      // Save to Firestore if user is logged in
      if (userId) {
        try {
          await addDoc(collection(db, 'diceRolls'), {
            userId: userId,
            diceCount: diceCount,
            diceSides: diceSides,
            results: finalResults,
            total: finalTotal,
            timestamp: new Date()
          });
          loadHistory();
        } catch (error) {
          console.error('Error saving roll:', error);
        }
      }
    }, 1000);
  };

  // Clear results
  const handleClear = () => {
    setResults([]);
    setTotal(0);
    setError('');
  };

  // Delete history item
  const handleDeleteHistory = async (rollId) => {
    try {
      await deleteDoc(doc(db, 'diceRolls', rollId));
      loadHistory();
    } catch (error) {
      console.error('Error deleting roll:', error);
    }
  };

  // Clear all history
  const handleClearHistory = async () => {
    if (!window.confirm('Clear all roll history?')) return;

    try {
      const q = query(
        collection(db, 'diceRolls'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      
      const deletePromises = snapshot.docs.map(doc => 
        deleteDoc(doc.ref)
      );
      
      await Promise.all(deletePromises);
      setHistory([]);
      alert('History cleared');
    } catch (error) {
      console.error('Error clearing history:', error);
      setError('Failed to clear history');
    }
  };

  // Get dice face display
  const getDiceFace = (value, sides) => {
    // For D6, show actual dice faces
    if (sides === 6) {
      const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
      return faces[value - 1] || value;
    }
    return value;
  };

  return (
    <div className="component-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-icon">🎲</span>
          Dice Roller
        </h1>
        <p className="page-description">
          Roll dice with any number of sides for games, decisions, or randomization
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="component-grid">
        {/* Left Panel - Controls */}
        <div className="control-panel card">
          <h2 className="panel-title">Dice Configuration</h2>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Quick Select Dice Types */}
          <div className="input-section">
            <label className="input-label">Quick Select</label>
            <div className="dice-types-grid">
              {diceTypes.map((dice) => (
                <button
                  key={dice.sides}
                  onClick={() => setDiceSides(dice.sides)}
                  className={`dice-type-btn ${diceSides === dice.sides ? 'active' : ''}`}
                >
                  <span className="dice-emoji">{dice.emoji}</span>
                  <span className="dice-name">{dice.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Sides */}
          <div className="input-section">
            <label className="input-label">Number of Sides (2-100)</label>
            <input
              type="number"
              value={diceSides}
              onChange={(e) => setDiceSides(Math.max(2, Math.min(100, parseInt(e.target.value) || 2)))}
              className="input-field"
              min="2"
              max="100"
            />
          </div>

          {/* Dice Count */}
          <div className="input-section">
            <label className="input-label">Number of Dice (1-10)</label>
            <div className="slider-container">
              <input
                type="range"
                value={diceCount}
                onChange={(e) => setDiceCount(parseInt(e.target.value))}
                className="slider"
                min="1"
                max="10"
              />
              <span className="slider-value">{diceCount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button
              onClick={handleRoll}
              disabled={isRolling}
              className="btn btn-primary btn-large"
            >
              {isRolling ? 'Rolling...' : 'Roll Dice'}
              <span className="btn-icon">🎲</span>
            </button>

            <div className="button-row">
              <button onClick={handleClear} className="btn btn-secondary">
                🔄 Clear
              </button>
              <button onClick={() => setShowHistory(!showHistory)} className="btn btn-secondary">
                📜 History
              </button>
            </div>
          </div>

          {/* Statistics */}
          {results.length > 0 && (
            <div className="stats-panel">
              <h3 className="stats-title">Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total</span>
                  <span className="stat-value">{total}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average</span>
                  <span className="stat-value">{(total / results.length).toFixed(1)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Min</span>
                  <span className="stat-value">{Math.min(...results)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Max</span>
                  <span className="stat-value">{Math.max(...results)}</span>
                </div>
              </div>
            </div>
          )}

          {/* History */}
          {showHistory && (
            <div className="history-panel">
              <div className="history-header">
                <h3 className="history-title">Roll History ({history.length})</h3>
                {history.length > 0 && (
                  <button onClick={handleClearHistory} className="btn-text-danger">
                    Clear All
                  </button>
                )}
              </div>
              
              {history.length === 0 ? (
                <p className="empty-message">No roll history yet</p>
              ) : (
                <div className="history-list">
                  {history.map((roll) => (
                    <div key={roll.id} className="history-item">
                      <div className="history-info">
                        <span className="history-dice">
                          {roll.diceCount}d{roll.diceSides}
                        </span>
                        <span className="history-result">= {roll.total}</span>
                        <span className="history-time">
                          {roll.timestamp?.toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteHistory(roll.id)}
                        className="btn-icon-danger"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Dice Display */}
        <div className="display-panel card">
          <div className="dice-display">
            {results.length === 0 ? (
              <div className="empty-dice">
                <div className="empty-dice-icon">🎲</div>
                <p className="empty-dice-text">Roll dice to see results</p>
              </div>
            ) : (
              <>
                <div className="dice-grid">
                  {results.map((value, index) => (
                    <div
                      key={index}
                      className={`dice ${isRolling ? 'rolling' : 'result'}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="dice-value">
                        {getDiceFace(value, diceSides)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="total-display">
                  <div className="total-label">Total</div>
                  <div className="total-value">{total}</div>
                  <div className="total-formula">
                    {diceCount}d{diceSides} = {results.join(' + ')}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiceRoller;