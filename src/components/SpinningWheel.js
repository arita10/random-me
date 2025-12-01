// Import React and the useState hook
import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle, signOutUser, saveWheel, loadWheel, getUserWheels, deleteWheel } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './SpinningWheel.css';

function SpinningWheel({ theme = 'dark' }) {
  // ============================================
  // USER AUTHENTICATION STATE
  // ============================================

  const [user, setUser] = useState(null);

  // ============================================
  // WHEEL STATE
  // ============================================

  const [options, setOptions] = useState([
    { name: 'Pizza 🍕', maxSelections: 3, timesSelected: 0 },
    { name: 'Burger 🍔', maxSelections: 3, timesSelected: 0 },
    { name: 'Sushi 🍣', maxSelections: 3, timesSelected: 0 },
    { name: 'Pasta 🍝', maxSelections: 3, timesSelected: 0 },
    { name: 'Salad 🥗', maxSelections: 3, timesSelected: 0 },
    { name: 'Tacos 🌮', maxSelections: 3, timesSelected: 0 },
    { name: 'Ramen 🍜', maxSelections: 3, timesSelected: 0 },
    { name: 'Steak 🥩', maxSelections: 3, timesSelected: 0 }
  ]);

  const [newOption, setNewOption] = useState('');
  const [maxSelections, setMaxSelections] = useState(1);
  const [isLimitEnabled, setIsLimitEnabled] = useState(true);
  const [showOptionsOnWheel, setShowOptionsOnWheel] = useState(true);
  const [showOptionsList, setShowOptionsList] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [wheelName, setWheelName] = useState('My Wheel');
  const [savedWheels, setSavedWheels] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState('');

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserWheels(currentUser.uid);
      } else {
        setSavedWheels([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // ============================================
  // WHEEL FUNCTIONS
  // ============================================

  const loadUserWheels = async (userId) => {
    try {
      const wheels = await getUserWheels(userId);
      setSavedWheels(wheels);
    } catch (error) {
      console.error("Error loading wheels:", error);
    }
  };

  const handleDeleteAllOptions = () => {
    const confirmDelete = window.confirm('Are you sure you want to DELETE ALL options? This cannot be undone!');
    if (!confirmDelete) return;

    setOptions([]);
    setSelectedOption(null);
  };

  const handleAddOption = () => {
    if (newOption.trim() !== '') {
      const newOptionObj = {
        name: newOption,
        maxSelections: isLimitEnabled ? maxSelections : Infinity,
        timesSelected: 0
      };
      setOptions([...options, newOptionObj]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (indexToRemove) => {
    const updatedOptions = options.filter((_, index) => index !== indexToRemove);
    setOptions(updatedOptions);
  };

  const handleResetCounts = () => {
    const resetOptions = options.map(opt => ({
      ...opt,
      timesSelected: 0
    }));
    setOptions(resetOptions);
    setSelectedOption(null);
  };

  const spinWheel = () => {
    if (isSpinning || options.length === 0) return;

    const availableOptions = options
      .map((option, index) => ({ ...option, index }))
      .filter(opt => opt.timesSelected < opt.maxSelections);

    if (availableOptions.length === 0) {
      alert('All options have been used up! Please reset or add new options.');
      return;
    }

    setIsSpinning(true);
    setSelectedOption(null);

    // 1. First, decide who the winner is from the available options
    const winner = availableOptions[Math.floor(Math.random() * availableOptions.length)];
    const winningIndex = winner.index;

    // 2. Then, calculate the rotation to land on the winner
    const anglePerOption = 360 / options.length;

    // Calculate the target angle. The pointer is at 12 o'clock.
    // We add a small random offset so it doesn't stop at the exact same spot every time.
    const randomOffset = (Math.random() - 0.5) * anglePerOption * 0.8;
    const targetSegmentCenter = winningIndex * anglePerOption;
    const targetAngle = targetSegmentCenter + randomOffset;

    // This is the final angle (0-360) we want the wheel to be rotated to.
    const finalRotationAngle = (360 - targetAngle) % 360;

    // Add multiple spins for visual effect
    const minSpins = 5;
    const maxSpins = 10;
    const randomSpins = Math.floor(minSpins + Math.random() * (maxSpins - minSpins));
    
    // Calculate a total rotation that will result in `finalRotationAngle` after the modulo.
    // This ensures the wheel always spins forward and completes full spins before landing.
    const currentVisualRotation = rotation % 360;
    const totalRotation = rotation - currentVisualRotation + (randomSpins * 360) + finalRotationAngle;
    
    setRotation(totalRotation);

    // 3. After the animation, update the state with the pre-determined winner
    setTimeout(() => {
      const updatedOptions = options.map((opt, idx) => {
        if (idx === winningIndex) {
          return {
            ...opt,
            timesSelected: opt.timesSelected + 1
          };
        }
        return opt;
      });

      setOptions(updatedOptions);
      setSelectedOption(options[winningIndex].name);
      setIsSpinning(false);
    }, 4000);
  };

  const handleSaveWheel = async () => {
    if (!user) {
      setError('Please sign in to save wheels');
      return;
    }

    if (!wheelName.trim()) {
      setError('Please enter a wheel name');
      return;
    }

    try {
      await saveWheel(user.uid, wheelName, options);
      setError('');
      alert('Wheel saved successfully! ✅');
      loadUserWheels(user.uid);
    } catch (error) {
      console.error('Error saving wheel:', error);
      setError('Failed to save wheel. Please try again.');
    }
  };

  const handleLoadWheel = (wheel) => {
    setWheelName(wheel.name);
    setOptions(wheel.options);
    setShowSaved(false);
    setSelectedOption(null);
    setError('');
  };

  const handleDeleteWheel = async (wheel) => {
    if (!user) {
      setError('You must be logged in to delete wheels');
      return;
    }

    if (!window.confirm('Delete this wheel?')) return;

    try {
      await deleteWheel(wheel.id);
      loadUserWheels(user.uid);
      alert('Wheel deleted');
    } catch (error) {
      console.error('Error deleting wheel:', error);
      setError('Failed to delete wheel');
    }
  };

  const handleReset = () => {
    setOptions([
      { name: 'Pizza 🍕', maxSelections: 3, timesSelected: 0 },
      { name: 'Burger 🍔', maxSelections: 3, timesSelected: 0 },
      { name: 'Sushi 🍣', maxSelections: 3, timesSelected: 0 },
      { name: 'Pasta 🍝', maxSelections: 3, timesSelected: 0 },
      { name: 'Salad 🥗', maxSelections: 3, timesSelected: 0 },
      { name: 'Tacos 🌮', maxSelections: 3, timesSelected: 0 },
      { name: 'Ramen 🍜', maxSelections: 3, timesSelected: 0 },
      { name: 'Steak 🥩', maxSelections: 3, timesSelected: 0 }
    ]);
    setWheelName('My Wheel');
    setSelectedOption(null);
    setRotation(0);
    setError('');
  };

  // ============================================
  // RENDER
  // ============================================

  const rainbowColors = [
    'linear-gradient(135deg, #FF0080 0%, #FF0000 100%)',
    'linear-gradient(135deg, #FF4500 0%, #FF8C00 100%)',
    'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    'linear-gradient(135deg, #00FF00 0%, #32CD32 100%)',
    'linear-gradient(135deg, #00CED1 0%, #1E90FF 100%)',
    'linear-gradient(135deg, #4169E1 0%, #0000FF 100%)',
    'linear-gradient(135deg, #8A2BE2 0%, #9400D3 100%)',
    'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
  ];

  return (
    <div className={`component-page ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-icon">🎡</span>
          Spinning Wheel
        </h1>
        <p className="page-description">
          Add your options and spin to make a random selection
        </p>
      </div>

      {/* Main Content */}
      <div className="wheel-container">
        <div className="pointer-container">
          <div className="pointer-arrow">▼</div>
          <div className="pointer-line"></div>
        </div>

        <div
          className="wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
          }}
        >
          {options.map((option, index) => {
            const angle = (360 / options.length) * index;
            const background = rainbowColors[index % rainbowColors.length];
            const segmentAngle = 360 / options.length;

            // Calculate clip-path for the segment
            const halfAngle = segmentAngle / 2;
            const halfAngleRad = (halfAngle * Math.PI) / 180;
            const x1 = 50 + 50 * Math.sin(-halfAngleRad);
            const y1 = 50 - 50 * Math.cos(-halfAngleRad);
            const x2 = 50 + 50 * Math.sin(halfAngleRad);
            const y2 = 50 - 50 * Math.cos(halfAngleRad);

            const clipPath = `polygon(50% 50%, ${x1}% ${y1}%, ${x2}% ${y2}%)`;

            return (
              <div
                key={index}
                className="wheel-segment"
                style={{
                  transform: `rotate(${angle}deg)`,
                  background: background,
                  opacity: 1,
                  clipPath: clipPath
                }}
              >
                {showOptionsOnWheel && (
                  <div className="wheel-text">
                    <span className="option-text">{option.name}</span>
                  </div>
                )}
              </div>
            );
          })}

          <div className="wheel-center">
            <span>SPIN</span>
          </div>
        </div>
      </div>

      <button
        onClick={spinWheel}
        disabled={isSpinning || options.length === 0}
        className="spin-button"
      >
        {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL!'}
      </button>

      {selectedOption && !isSpinning && (
        <div className="result">
          <h2>🎉 Result: {selectedOption}</h2>
        </div>
      )}

      <div className="options-manager">
        <div className="options-header">
          <h3>Manage Options</h3>
          <button
            onClick={() => setShowOptionsList(!showOptionsList)}
            className="toggle-list-button"
          >
            {showOptionsList ? '🔼 Hide List' : '🔽 Show List'}
          </button>
        </div>

        {showOptionsList && (
          <>
            <div className="add-option-container">
              <div className="add-option">
                <input
                  type="text"
                  placeholder="Enter new option..."
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                />
                <div className="number-input-wrapper">
                  <button
                    className="number-btn"
                    onClick={() => setMaxSelections(Math.max(1, maxSelections - 1))}
                    disabled={!isLimitEnabled || maxSelections <= 1}
                    type="button"
                  >
                    ▼
                  </button>
                  <input
                    type="number"
                    placeholder="Max uses"
                    value={maxSelections}
                    min="1"
                    max="99"
                    onChange={(e) => setMaxSelections(parseInt(e.target.value) || 1)}
                    onInput={(e) => setMaxSelections(parseInt(e.target.value) || 1)}
                    className="max-selections-input"
                    disabled={!isLimitEnabled}
                    inputMode="numeric"
                  />
                  <button
                    className="number-btn"
                    onClick={() => setMaxSelections(Math.min(99, maxSelections + 1))}
                    disabled={!isLimitEnabled || maxSelections >= 99}
                    type="button"
                  >
                    ▲
                  </button>
                </div>
                <button onClick={handleAddOption}>Add Option</button>
              </div>

              <div className="limit-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={isLimitEnabled}
                    onChange={(e) => setIsLimitEnabled(e.target.checked)}
                  />
                  <span>Set selection limit (uncheck for unlimited)</span>
                </label>
              </div>
            </div>

            <button onClick={handleResetCounts} className="reset-button">
              🔄 Reset All Counts
            </button>

            <button onClick={handleDeleteAllOptions} className="delete-all-button">
              🗑️ Delete All Choices
            </button>

            <div className="options-list">
              {options.map((option, index) => {
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
                      onClick={() => handleRemoveOption(index)}
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

      {/* Save/Load Section */}
      {user && (
        <div className="save-section">
          <div className="input-section">
            <label className="input-label">Wheel Name</label>
            <input
              type="text"
              value={wheelName}
              onChange={(e) => setWheelName(e.target.value)}
              className="input-field"
              placeholder="Enter wheel name..."
              maxLength={100}
            />
          </div>

          <div className="button-row">
            <button onClick={handleSaveWheel} className="btn btn-secondary">
              💾 Save
            </button>
            <button onClick={() => setShowSaved(!showSaved)} className="btn btn-secondary">
              📂 Load
            </button>
            <button onClick={handleReset} className="btn btn-secondary">
              🔄 Reset
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Saved Wheels */}
          {showSaved && (
            <div className="saved-wheels">
              <h3 className="saved-title">Saved Wheels ({savedWheels.length})</h3>
              {savedWheels.length === 0 ? (
                <p className="empty-message">No saved wheels yet</p>
              ) : (
                <div className="saved-list">
                  {savedWheels.map((wheel) => (
                    <div key={wheel.id} className="saved-item">
                      <div onClick={() => handleLoadWheel(wheel)} className="saved-info">
                        <span className="saved-name">{wheel.name}</span>
                        <span className="saved-count">{wheel.options.length} options</span>
                      </div>
                      <button
                        onClick={() => handleDeleteWheel(wheel)}
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
      )}
    </div>
  );
}

export default SpinningWheel;
