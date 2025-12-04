import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './FortuneSticks.css';

function FortuneSticks() {
  const [user, setUser] = useState(null);
  const [sticks, setSticks] = useState([]);
  const [newStick, setNewStick] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [selectedStick, setSelectedStick] = useState(null);
  const [fallingStick, setFallingStick] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [bottleName, setBottleName] = useState('Fortune Sticks');
  const [savedBottles, setSavedBottles] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareUrl, setShowShareUrl] = useState(false);

  // Track user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadSavedBottles(currentUser.uid);
      } else {
        setSavedBottles([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load sticks from localStorage on mount
  useEffect(() => {
    const savedSticks = localStorage.getItem('fortuneSticks');
    const savedBottleName = localStorage.getItem('bottleName');
    if (savedSticks) {
      try {
        setSticks(JSON.parse(savedSticks));
      } catch (error) {
        console.error('Error loading saved sticks:', error);
      }
    }
    if (savedBottleName) {
      setBottleName(savedBottleName);
    }
  }, []);

  // Save sticks to localStorage whenever they change
  useEffect(() => {
    if (sticks.length > 0) {
      localStorage.setItem('fortuneSticks', JSON.stringify(sticks));
    }
  }, [sticks]);

  // Save bottle name to localStorage
  useEffect(() => {
    localStorage.setItem('bottleName', bottleName);
  }, [bottleName]);

  const loadSavedBottles = async (userId) => {
    if (!userId) return;

    try {
      const q = query(
        collection(db, 'fortuneBottles'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const bottles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedBottles(bottles);
    } catch (error) {
      console.error('Error loading bottles:', error);
    }
  };

  const handleAddStick = (e) => {
    e.preventDefault();
    if (newStick.trim() === '') return;

    setSticks([...sticks, { id: Date.now(), text: newStick.trim() }]);
    setNewStick('');
  };

  const handleDeleteStick = (id) => {
    setSticks(sticks.filter(stick => stick.id !== id));
  };

  const playShakeSound = () => {
    if (isMuted) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 200;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const playSelectSound = () => {
    if (isMuted) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 600;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const shakeBottle = () => {
    if (sticks.length === 0) {
      alert('Please add choices first');
      return;
    }

    if (isShaking) return;

    setIsShaking(true);
    setSelectedStick(null);
    setFallingStick(null);

    // Play shake sound multiple times
    const shakeInterval = setInterval(() => {
      playShakeSound();
    }, 200);

    // After 2 seconds, select a random stick
    setTimeout(() => {
      clearInterval(shakeInterval);
      setIsShaking(false);

      const randomIndex = Math.floor(Math.random() * sticks.length);
      const selected = sticks[randomIndex];

      setFallingStick(selected);

      // After falling animation (1 second), show result
      setTimeout(() => {
        setFallingStick(null);
        setSelectedStick(selected);
        playSelectSound();
      }, 1000);
    }, 2000);
  };

  const resetSelection = () => {
    setSelectedStick(null);
    setFallingStick(null);
  };

  const clearAllSticks = () => {
    if (window.confirm('Clear all choices?')) {
      setSticks([]);
      setSelectedStick(null);
      setFallingStick(null);
      localStorage.removeItem('fortuneSticks');
    }
  };

  const handleSaveBottle = async () => {
    if (!user) {
      setError('Please sign in to save bottles');
      return;
    }

    if (!bottleName.trim()) {
      setError('Please enter a bottle name');
      return;
    }

    if (sticks.length === 0) {
      setError('Please add some choices before saving');
      return;
    }

    try {
      await addDoc(collection(db, 'fortuneBottles'), {
        userId: user.uid,
        name: bottleName,
        sticks: sticks,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setError('');
      alert('Bottle saved successfully! ✅');
      loadSavedBottles(user.uid);
    } catch (error) {
      console.error('Error saving bottle:', error);
      setError('Failed to save bottle');
    }
  };

  const handleLoadBottle = (bottle) => {
    setBottleName(bottle.name);
    setSticks(bottle.sticks);
    setSelectedStick(null);
    setFallingStick(null);
    setShowSaved(false);
    setError('');
  };

  const handleDeleteBottle = async (bottleId) => {
    if (!window.confirm('Delete this bottle?')) return;

    try {
      await deleteDoc(doc(db, 'fortuneBottles', bottleId));
      if (user) {
        loadSavedBottles(user.uid);
      }
      alert('Bottle deleted');
    } catch (error) {
      console.error('Error deleting bottle:', error);
      setError('Failed to delete bottle');
    }
  };

  const handleReset = () => {
    setSticks([]);
    setBottleName('Fortune Sticks');
    setSelectedStick(null);
    setFallingStick(null);
    setError('');
    localStorage.removeItem('fortuneSticks');
  };

  const handleBulkAdd = () => {
    if (bulkInput.trim() === '') return;

    const items = bulkInput
      .split(/[\n,;]+/)
      .map(item => item.trim())
      .filter(item => item !== '');

    const newSticks = items.map(item => ({
      id: Date.now() + Math.random(),
      text: item
    }));

    setSticks([...sticks, ...newSticks]);
    setBulkInput('');
    setShowBulkInput(false);
  };

  const loadPreset = (presetName) => {
    const presets = {
      zodiac: [
        'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋',
        'Leo ♌', 'Virgo ♍', 'Libra ♎', 'Scorpio ♏',
        'Sagittarius ♐', 'Capricorn ♑', 'Aquarius ♒', 'Pisces ♓'
      ],
      yesNo: [
        'Yes ✅', 'No ❌', 'Maybe 🤔', 'Definitely 💯',
        'Probably 👍', 'Unlikely 👎', 'Ask Again 🔄', 'Not Sure 🤷'
      ],
      lucky: [
        'Very Lucky 🍀', 'Lucky ✨', 'Neutral ⭐',
        'Unlucky 🌧️', 'Very Unlucky ⚠️', 'Super Lucky 🎉',
        'Good Fortune 🎊', 'Bad Fortune 💔'
      ],
      numbers: Array.from({ length: 20 }, (_, i) => `Number ${i + 1}`)
    };

    const preset = presets[presetName];
    if (preset) {
      const newSticks = preset.map(item => ({
        id: Date.now() + Math.random(),
        text: item
      }));
      setSticks(newSticks);
      setBottleName(
        presetName === 'zodiac' ? 'Zodiac Signs ♈' :
        presetName === 'yesNo' ? 'Yes or No ❓' :
        presetName === 'lucky' ? 'Fortune Telling 🔮' :
        'Number Sticks 🔢'
      );
    }
  };

  const generateShareUrl = () => {
    const stickTexts = sticks.map(stick => stick.text).join(',');
    const encodedList = encodeURIComponent(stickTexts);
    const baseUrl = window.location.origin + window.location.pathname;
    const url = `${baseUrl}?list=${encodedList}`;
    setShareUrl(url);
    setShowShareUrl(true);
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('✅ Link copied to clipboard! Share it with your friends.');
    }).catch(() => {
      alert('❌ Failed to copy link. Please copy it manually.');
    });
  };

  return (
    <div className="fortune-sticks-container">
      <div className="fortune-sticks-header">
        <h1>🥢 Fortune Sticks</h1>
        <p>Add choices and shake to select randomly</p>
      </div>

      <div className="fortune-content">
        {/* Bottle Container */}
        <div className="bottle-section">
          <div className={`bottle ${isShaking ? 'shaking' : ''}`}>
            <div className="bottle-top"></div>
            <div className="bottle-body">
              {sticks.map((stick, index) => (
                <div
                  key={stick.id}
                  className={`stick ${fallingStick?.id === stick.id ? 'falling' : ''}`}
                  style={{
                    left: `${20 + (index % 3) * 25}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {stick.text.substring(0, 1)}
                </div>
              ))}
            </div>
            {sticks.length === 0 && (
              <div className="bottle-empty">Empty</div>
            )}
          </div>

          {fallingStick && (
            <div className="falling-stick-display">
              <div className="falling-stick-animation">
                {fallingStick.text}
              </div>
            </div>
          )}

          <div className="shake-controls">
            <button
              onClick={shakeBottle}
              disabled={isShaking || sticks.length === 0}
              className="shake-button"
            >
              {isShaking ? '🔄 Shaking...' : '🥢 Shake!'}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="mute-button"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>

          {selectedStick && (
            <div className="result-display">
              <div className="result-card">
                <div className="result-label">🎉 Result:</div>
                <div className="result-text">{selectedStick.text}</div>
                <button onClick={resetSelection} className="reset-button">
                  Shake Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          <div className="add-stick-form">
            <h3>➕ Add Choices</h3>
            <form onSubmit={handleAddStick}>
              <input
                type="text"
                value={newStick}
                onChange={(e) => setNewStick(e.target.value)}
                placeholder="Type choice..."
                className="stick-input"
              />
              <button type="submit" className="add-button">
                Add
              </button>
            </form>
          </div>

          {/* Bulk Input Section */}
          <button
            onClick={() => setShowBulkInput(!showBulkInput)}
            className="bulk-input-toggle"
          >
            📋 Bulk Add
          </button>

          {showBulkInput && (
            <div className="bulk-input-container">
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="Paste your list here (one per line, or comma/semicolon separated)"
                className="bulk-input-textarea"
                rows="6"
              />
              <div className="bulk-input-actions">
                <button onClick={handleBulkAdd} className="btn-primary">
                  ✅ Add All
                </button>
                <button onClick={() => setShowBulkInput(false)} className="btn-secondary">
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}

          {/* Presets Section */}
          <div className="presets-section">
            <h4 className="presets-title">⚡ Quick Start</h4>
            <div className="presets-grid">
              <button onClick={() => loadPreset('zodiac')} className="preset-btn">
                ♈ Zodiac Signs
              </button>
              <button onClick={() => loadPreset('yesNo')} className="preset-btn">
                ❓ Yes or No
              </button>
              <button onClick={() => loadPreset('lucky')} className="preset-btn">
                🔮 Fortune
              </button>
              <button onClick={() => loadPreset('numbers')} className="preset-btn">
                🔢 Numbers
              </button>
            </div>
          </div>

          {/* Share Button */}
          <button onClick={generateShareUrl} className="share-button">
            🔗 Share This Bottle
          </button>

          {showShareUrl && (
            <div className="share-url-container">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="share-url-input"
              />
              <button onClick={copyShareUrl} className="copy-btn">
                📋 Copy Link
              </button>
            </div>
          )}

          <div className="sticks-list">
            <div className="sticks-list-header">
              <h3>📋 Choices List ({sticks.length})</h3>
              {sticks.length > 0 && (
                <button onClick={clearAllSticks} className="clear-all-button">
                  🗑️ Clear All
                </button>
              )}
            </div>

            {sticks.length === 0 ? (
              <div className="empty-state">
                <p>No choices yet</p>
                <p className="hint">Add some choices to begin</p>
              </div>
            ) : (
              <div className="sticks-grid">
                {sticks.map((stick) => (
                  <div key={stick.id} className="stick-item">
                    <span className="stick-text">{stick.text}</span>
                    <button
                      onClick={() => handleDeleteStick(stick.id)}
                      className="delete-stick-button"
                      aria-label="Delete"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="info-box">
            <h4>💡 How to Use:</h4>
            <ol>
              <li>Add your choices</li>
              <li>Press "Shake" button</li>
              <li>Wait for the stick to fall</li>
              <li>See the result!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Save/Load Section */}
      {user && (
        <div className="save-section">
          <div className="input-section">
            <label className="input-label">Bottle Name</label>
            <input
              type="text"
              value={bottleName}
              onChange={(e) => setBottleName(e.target.value)}
              className="input-field"
              placeholder="Enter bottle name..."
              maxLength={100}
            />
          </div>

          <div className="button-row">
            <button onClick={handleSaveBottle} className="btn btn-secondary">
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

          {/* Saved Bottles */}
          {showSaved && (
            <div className="saved-decks">
              <h3 className="saved-title">Saved Bottles ({savedBottles.length})</h3>
              {savedBottles.length === 0 ? (
                <p className="empty-message">No saved bottles yet</p>
              ) : (
                <div className="saved-list">
                  {savedBottles.map((bottle) => (
                    <div key={bottle.id} className="saved-item">
                      <div onClick={() => handleLoadBottle(bottle)} className="saved-info">
                        <span className="saved-name">{bottle.name}</span>
                        <span className="saved-count">{bottle.sticks.length} choices</span>
                      </div>
                      <button
                        onClick={() => handleDeleteBottle(bottle.id)}
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

export default FortuneSticks;
