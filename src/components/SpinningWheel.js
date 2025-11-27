// SpinningWheel.js - Complete Spinning Wheel Component
// Place this in: src/components/SpinningWheel.js

import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { validateWheelData, checkRateLimit } from '../utils/validation';
import './SpinningWheel.css';

function SpinningWheel() {
  const { user, userId } = useAuth();
  const [options, setOptions] = useState(['Option 1', 'Option 2', 'Option 3', 'Option 4']);
  const [newOption, setNewOption] = useState('');
  const [wheelName, setWheelName] = useState('My Wheel');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [savedWheels, setSavedWheels] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState('');
  const wheelRef = useRef(null);

  // Load saved wheels on mount
  useEffect(() => {
    loadSavedWheels();
  }, [userId]);

  // Load saved wheels from Firestore
  const loadSavedWheels = async () => {
    if (!userId) return;
    
    try {
      const q = query(
        collection(db, 'wheels'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const wheels = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedWheels(wheels);
    } catch (error) {
      console.error('Error loading wheels:', error);
      setError('Failed to load saved wheels');
    }
  };

  // Add new option
  const handleAddOption = () => {
    if (!newOption.trim()) {
      setError('Please enter an option');
      return;
    }

    if (options.length >= 100) {
      setError('Maximum 100 options allowed');
      return;
    }

    const trimmed = newOption.trim();
    if (trimmed.length > 100) {
      setError('Option too long (max 100 characters)');
      return;
    }

    setOptions([...options, trimmed]);
    setNewOption('');
    setError('');
  };

  // Remove option
  const handleRemoveOption = (index) => {
    if (options.length <= 2) {
      setError('Minimum 2 options required');
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
    setError('');
  };

  // Spin the wheel
  const handleSpin = () => {
    // Rate limiting check
    const rateCheck = checkRateLimit('wheelSpin', 2000); // 1 spin per 2 seconds
    if (!rateCheck.allowed) {
      setError(rateCheck.error);
      return;
    }

    if (options.length < 2) {
      setError('Need at least 2 options to spin');
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    setError('');

    // Calculate random winner
    const winnerIndex = Math.floor(Math.random() * options.length);
    
    // Calculate rotation (multiple spins + land on winner)
    const spins = 5; // Number of full rotations
    const degreePerOption = 360 / options.length;
    const winnerDegree = degreePerOption * winnerIndex;
    const totalRotation = (360 * spins) + (360 - winnerDegree);

    setRotation(rotation + totalRotation);

    // Show winner after animation
    setTimeout(() => {
      setWinner(options[winnerIndex]);
      setIsSpinning(false);
    }, 4000);
  };

  // Save wheel to Firestore
  const handleSaveWheel = async () => {
    if (!userId) {
      setError('Please sign in to save wheels');
      return;
    }

    // Validate wheel data
    const validation = validateWheelData({
      name: wheelName,
      options: options
    });

    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      await addDoc(collection(db, 'wheels'), {
        userId: userId,
        name: validation.data.name,
        options: validation.data.options,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setError('');
      alert('Wheel saved successfully! ✅');
      loadSavedWheels();
    } catch (error) {
      console.error('Error saving wheel:', error);
      setError('Failed to save wheel. Please try again.');
    }
  };

  // Load a saved wheel
  const handleLoadWheel = (wheel) => {
    setWheelName(wheel.name);
    setOptions(wheel.options);
    setShowSaved(false);
    setWinner(null);
    setError('');
  };

  // Delete a saved wheel
  const handleDeleteWheel = async (wheelId) => {
    if (!window.confirm('Delete this wheel?')) return;

    try {
      await deleteDoc(doc(db, 'wheels', wheelId));
      loadSavedWheels();
      alert('Wheel deleted');
    } catch (error) {
      console.error('Error deleting wheel:', error);
      setError('Failed to delete wheel');
    }
  };

  // Reset wheel
  const handleReset = () => {
    setOptions(['Option 1', 'Option 2', 'Option 3', 'Option 4']);
    setWheelName('My Wheel');
    setWinner(null);
    setRotation(0);
    setError('');
  };

  // Colors for wheel segments
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52B788', '#F06292', '#64B5F6'
  ];

  return (
    <div className="component-page">
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

      {/* Main Content Grid */}
      <div className="component-grid">
        {/* Left Panel - Controls */}
        <div className="control-panel card">
          <h2 className="panel-title">Wheel Configuration</h2>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Wheel Name */}
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

          {/* Add Option */}
          <div className="input-section">
            <label className="input-label">Add Options ({options.length}/100)</label>
            <div className="input-group">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                className="input-field"
                placeholder="Enter option..."
                maxLength={100}
              />
              <button onClick={handleAddOption} className="btn btn-primary">
                Add
              </button>
            </div>
          </div>

          {/* Options List */}
          <div className="options-list">
            {options.map((option, index) => (
              <div key={index} className="option-item">
                <div className="option-color" style={{ background: colors[index % colors.length] }}></div>
                <span className="option-text">{option}</span>
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="btn-icon-danger"
                  title="Remove option"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button
              onClick={handleSpin}
              disabled={isSpinning || options.length < 2}
              className="btn btn-primary btn-large"
            >
              {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
              <span className="btn-icon">🎯</span>
            </button>

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
          </div>

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

        {/* Right Panel - Wheel Display */}
        <div className="display-panel card">
          <div className="wheel-container">
            <div className="wheel-pointer">▼</div>
            
            <svg
              ref={wheelRef}
              className="wheel-svg"
              viewBox="0 0 400 400"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
              }}
            >
              {/* Draw wheel segments */}
              {options.map((option, index) => {
                const angle = (360 / options.length) * index;
                const nextAngle = (360 / options.length) * (index + 1);
                const startAngle = (angle - 90) * (Math.PI / 180);
                const endAngle = (nextAngle - 90) * (Math.PI / 180);
                
                const x1 = 200 + 180 * Math.cos(startAngle);
                const y1 = 200 + 180 * Math.sin(startAngle);
                const x2 = 200 + 180 * Math.cos(endAngle);
                const y2 = 200 + 180 * Math.sin(endAngle);

                const largeArc = (nextAngle - angle) > 180 ? 1 : 0;

                return (
                  <g key={index}>
                    <path
                      d={`M 200 200 L ${x1} ${y1} A 180 180 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={colors[index % colors.length]}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x="200"
                      y="200"
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                      transform={`rotate(${angle + (360 / options.length) / 2}, 200, 200) translate(0, -120)`}
                    >
                      {option.length > 15 ? option.substring(0, 15) + '...' : option}
                    </text>
                  </g>
                );
              })}
              
              {/* Center circle */}
              <circle cx="200" cy="200" r="30" fill="#ffffff" stroke="#333" strokeWidth="3" />
              <circle cx="200" cy="200" r="20" fill="#333" />
            </svg>
          </div>

          {/* Result Display */}
          {winner && (
            <div className="result-card animate-in">
              <div className="result-confetti">🎉</div>
              <h3 className="result-title">Winner!</h3>
              <div className="result-value">{winner}</div>
              <button onClick={() => setWinner(null)} className="btn btn-secondary btn-small">
                Clear Result
              </button>
            </div>
          )}

          {/* Instructions */}
          {!winner && !isSpinning && (
            <div className="instructions">
              <p>👆 Add options and click "Spin the Wheel" to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpinningWheel;