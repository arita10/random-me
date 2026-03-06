// Import React and the useState hook
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './DiceRoller.css';

function DiceRoller({ theme = 'dark' }) {
  // ============================================
  // USER AUTHENTICATION STATE
  // ============================================

  const [user, setUser] = useState(null);

  // ============================================
  // DICE STATE
  // ============================================

  const [diceOptions, setDiceOptions] = useState([
    { name: '1️⃣', maxSelections: 3, timesSelected: 0 },
    { name: '2️⃣', maxSelections: 3, timesSelected: 0 },
    { name: '3️⃣', maxSelections: 3, timesSelected: 0 },
    { name: '4️⃣', maxSelections: 3, timesSelected: 0 },
    { name: '5️⃣', maxSelections: 3, timesSelected: 0 },
    { name: '6️⃣', maxSelections: 3, timesSelected: 0 }
  ]);

  const [newDiceOption, setNewDiceOption] = useState('');
  const [diceMaxSelections, setDiceMaxSelections] = useState('');
  const [isDiceLimitEnabled, setIsDiceLimitEnabled] = useState(true);
  const [showDiceList, setShowDiceList] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory] = useState(false);
  const [, setError] = useState('');

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadHistory(currentUser.uid);
      } else {
        setHistory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // ============================================
  // DICE FUNCTIONS
  // ============================================

  const loadHistory = async (userId) => {
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

  const handleDeleteAllDiceOptions = () => {
    const confirmDelete = window.confirm('Are you sure you want to DELETE ALL dice options? This cannot be undone!');
    if (!confirmDelete) return;

    setDiceOptions([]);
    setDiceResult(null);
  };

  const handleAddDiceOption = () => {
    if (newDiceOption.trim() !== '') {
      const newDiceOptionObj = {
        name: newDiceOption,
        maxSelections: isDiceLimitEnabled ? (diceMaxSelections || 1) : Infinity,
        timesSelected: 0
      };
      setDiceOptions([...diceOptions, newDiceOptionObj]);
      setNewDiceOption('');
    }
  };

  const handleRemoveDiceOption = (indexToRemove) => {
    const updatedOptions = diceOptions.filter((_, index) => index !== indexToRemove);
    setDiceOptions(updatedOptions);
  };

  const handleResetDiceCounts = () => {
    const resetOptions = diceOptions.map(opt => ({
      ...opt,
      timesSelected: 0
    }));
    setDiceOptions(resetOptions);
    setDiceResult(null);
  };

  const rollDice = () => {
    if (isRolling || diceOptions.length === 0) return;

    const availableOptions = diceOptions.filter(opt => opt.timesSelected < opt.maxSelections);
    if (availableOptions.length === 0) {
      alert('All dice options have been used up! Please reset or add new options.');
      return;
    }

    setIsRolling(true);
    setDiceResult(null);

    let rollCount = 0;
    const rollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableOptions.length);
      setDiceResult(availableOptions[randomIndex].name);
      rollCount++;

      if (rollCount >= 15) {
        clearInterval(rollInterval);

        const randomIndex = Math.floor(Math.random() * availableOptions.length);
        let selectedOpt = availableOptions[randomIndex];

        const selectedIndex = diceOptions.findIndex(opt => opt.name === selectedOpt.name);

        const updatedOptions = diceOptions.map((opt, idx) => {
          if (idx === selectedIndex && opt.timesSelected < opt.maxSelections) {
            return {
              ...opt,
              timesSelected: opt.timesSelected + 1
            };
          }
          return opt;
        });

        setDiceOptions(updatedOptions);
        setDiceResult(selectedOpt.name);
        setIsRolling(false);
      }
    }, 100);
  };

  const handleClearHistory = async () => {
    if (!user) return;
    if (!window.confirm('Clear all roll history?')) return;

    try {
      const q = query(
        collection(db, 'diceRolls'),
        where('userId', '==', user.uid)
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

  const handleDeleteHistory = async (rollId) => {
    try {
      await deleteDoc(doc(db, 'diceRolls', rollId));
      if (user) {
        loadHistory(user.uid);
      }
    } catch (error) {
      console.error('Error deleting roll:', error);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`component-page ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
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

      {/* Main Content */}
      <div className="dice-container">
        <div className={`dice ${isRolling ? 'rolling' : ''}`}>
          {diceResult || '🎲'}
        </div>
      </div>

      <button
        onClick={rollDice}
        disabled={isRolling || diceOptions.length === 0}
        className="spin-button"
      >
        {isRolling ? 'Rolling...' : 'ROLL THE DICE!'}
      </button>

      {diceResult && !isRolling && (
        <div className="result">
          <h2>🎉 Result: {diceResult}</h2>
        </div>
      )}

      <div className="options-manager">
        <div className="options-header">
          <h3>Manage Dice Options</h3>
          <button
            onClick={() => setShowDiceList(!showDiceList)}
            className="toggle-list-button"
          >
            {showDiceList ? '🔼 Hide List' : '🔽 Show List'}
          </button>
        </div>

        {showDiceList && (
          <>
            <div className="add-option-container">
              <div className="add-option">
                <input
                  type="text"
                  placeholder="Enter new dice option..."
                  value={newDiceOption}
                  onChange={(e) => setNewDiceOption(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDiceOption()}
                />
                <div className="number-input-wrapper">
                  <button
                    className="number-btn"
                    onClick={() => setDiceMaxSelections(Math.max(1, (diceMaxSelections || 1) - 1))}
                    disabled={!isDiceLimitEnabled || diceMaxSelections <= 1}
                    type="button"
                  >
                    ▼
                  </button>
                  <input
                    type="number"
                    placeholder="Max uses"
                    value={diceMaxSelections}
                    max="99"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || val === null) {
                        setDiceMaxSelections('');
                      } else {
                        const num = parseInt(val);
                        if (!isNaN(num) && num >= 0 && num <= 99) {
                          setDiceMaxSelections(num);
                        }
                      }
                    }}
                    className="max-selections-input"
                    disabled={!isDiceLimitEnabled}
                    inputMode="numeric"
                  />
                  <button
                    className="number-btn"
                    onClick={() => setDiceMaxSelections(Math.min(99, (diceMaxSelections || 0) + 1))}
                    disabled={!isDiceLimitEnabled || diceMaxSelections >= 99}
                    type="button"
                  >
                    ▲
                  </button>
                </div>
                <button onClick={handleAddDiceOption}>Add Option</button>
              </div>

              <div className="limit-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={isDiceLimitEnabled}
                    onChange={(e) => setIsDiceLimitEnabled(e.target.checked)}
                  />
                  <span>Set selection limit (uncheck for unlimited)</span>
                </label>
              </div>
            </div>

            <button onClick={handleResetDiceCounts} className="reset-button">
              🔄 Reset All Counts
            </button>

            <button onClick={handleDeleteAllDiceOptions} className="delete-all-button">
              🗑️ Delete All Choices
            </button>

            <div className="options-list">
              {diceOptions.map((option, index) => {
                const isUnlimited = option.maxSelections === Infinity;
                return (
                  <div key={index} className="option-item">
                    <div className="option-info">
                      <span className="option-name">{option.name}</span>
                      <span className="option-counter">
                        ({isUnlimited ? `${option.timesSelected}/∞` : `${option.timesSelected}/${option.maxSelections}`})
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveDiceOption(index)}
                      className="delete-button"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* History Section */}
      {user && showHistory && (
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
  );
}

export default DiceRoller;
