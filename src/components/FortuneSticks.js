import React, { useState, useEffect } from 'react';
import './FortuneSticks.css';

function FortuneSticks() {
  const [sticks, setSticks] = useState([]);
  const [newStick, setNewStick] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [selectedStick, setSelectedStick] = useState(null);
  const [fallingStick, setFallingStick] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  // Load sticks from localStorage on mount
  useEffect(() => {
    const savedSticks = localStorage.getItem('fortuneSticks');
    if (savedSticks) {
      try {
        setSticks(JSON.parse(savedSticks));
      } catch (error) {
        console.error('Error loading saved sticks:', error);
      }
    }
  }, []);

  // Save sticks to localStorage whenever they change
  useEffect(() => {
    if (sticks.length > 0) {
      localStorage.setItem('fortuneSticks', JSON.stringify(sticks));
    }
  }, [sticks]);

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
      alert('กรุณาเพิ่มตัวเลือกก่อนเขย่า / Please add choices first');
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
    if (window.confirm('ล้างตัวเลือกทั้งหมด? / Clear all choices?')) {
      setSticks([]);
      setSelectedStick(null);
      setFallingStick(null);
      localStorage.removeItem('fortuneSticks');
    }
  };

  return (
    <div className="fortune-sticks-container">
      <div className="fortune-sticks-header">
        <h1>🥢 เขย่าไม้ไผ่ / Fortune Sticks</h1>
        <p>เพิ่มตัวเลือกและเขย่าเพื่อสุ่ม / Add choices and shake to select randomly</p>
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
              <div className="bottle-empty">ว่างเปล่า<br/>Empty</div>
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
              {isShaking ? '🔄 กำลังเขย่า... / Shaking...' : '🥢 เขย่า! / Shake!'}
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
                <div className="result-label">🎉 ผลลัพธ์ / Result:</div>
                <div className="result-text">{selectedStick.text}</div>
                <button onClick={resetSelection} className="reset-button">
                  เขย่าอีกครั้ง / Shake Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          <div className="add-stick-form">
            <h3>➕ เพิ่มตัวเลือก / Add Choices</h3>
            <form onSubmit={handleAddStick}>
              <input
                type="text"
                value={newStick}
                onChange={(e) => setNewStick(e.target.value)}
                placeholder="พิมพ์ตัวเลือก... / Type choice..."
                className="stick-input"
              />
              <button type="submit" className="add-button">
                เพิ่ม / Add
              </button>
            </form>
          </div>

          <div className="sticks-list">
            <div className="sticks-list-header">
              <h3>📋 รายการตัวเลือก ({sticks.length})</h3>
              {sticks.length > 0 && (
                <button onClick={clearAllSticks} className="clear-all-button">
                  🗑️ ล้างทั้งหมด / Clear All
                </button>
              )}
            </div>

            {sticks.length === 0 ? (
              <div className="empty-state">
                <p>ยังไม่มีตัวเลือก<br/>No choices yet</p>
                <p className="hint">เพิ่มตัวเลือกเพื่อเริ่มต้น<br/>Add some choices to begin</p>
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
            <h4>💡 วิธีใช้ / How to Use:</h4>
            <ol>
              <li>เพิ่มตัวเลือกของคุณ / Add your choices</li>
              <li>กดปุ่ม "เขย่า" / Press "Shake" button</li>
              <li>รอให้ไม้ไผ่ตกมา / Wait for the stick to fall</li>
              <li>ดูผลลัพธ์! / See the result!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FortuneSticks;
