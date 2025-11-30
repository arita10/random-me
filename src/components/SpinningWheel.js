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

    const availableOptions = options.filter(opt => opt.timesSelected < opt.maxSelections);
    if (availableOptions.length === 0) {
      alert('All options have been used up! Please reset or add new options.');
      return;
    }

    setIsSpinning(true);
    setSelectedOption(null);

    const minSpins = 5;
    const maxSpins = 10;
    const randomSpins = minSpins + Math.random() * (maxSpins - minSpins);
    const randomDegrees = randomSpins * 360;
    const extraRotation = Math.random() * 360;
    const totalRotation = rotation + randomDegrees + extraRotation;

    setRotation(totalRotation);

    setTimeout(() => {
      // Normalize rotation to 0-360 range
      let normalizedRotation = totalRotation % 360;
      if (normalizedRotation < 0) normalizedRotation += 360;

      // Calculate angle per segment
      const anglePerOption = 360 / options.length;

      // Calculate which segment is at the pointer (top, 0 degrees)
      // The pointer is at top (0°). When wheel rotates clockwise by normalizedRotation,
      // the segment at position normalizedRotation is now at the pointer.
      let selectedIndex = Math.floor(normalizedRotation / anglePerOption) % options.length;

      let selectedOpt = options[selectedIndex];

      let attempts = 0;
      while (selectedOpt.timesSelected >= selectedOpt.maxSelections && attempts < options.length) {
        selectedIndex = (selectedIndex + 1) % options.length;
        selectedOpt = options[selectedIndex];
        attempts++;
      }

      const updatedOptions = options.map((opt, idx) => {
        if (idx === selectedIndex && opt.timesSelected < opt.maxSelections) {
          return {
            ...opt,
            timesSelected: opt.timesSelected + 1
          };
        }
        return opt;
      });

      setOptions(updatedOptions);
      setSelectedOption(selectedOpt.name);
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

  const handleDeleteWheel = async (wheelId) => {
    if (!window.confirm('Delete this wheel?')) return;

    try {
      await deleteWheel(wheelId);
      if (user) {
        loadUserWheels(user.uid);
      }
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
                        onClick={() => handleDeleteWheel(wheel.id)}
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
