import React, { useState } from 'react';
import './ColorPicker.css';

function ColorPicker({ theme }) {
  const [colors, setColors] = useState([
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FF8C00', '#9400D3'
  ]);
  const [newColor, setNewColor] = useState('#FF0000');
  const [selectedColor, setSelectedColor] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Add color
  const handleAddColor = () => {
    if (!colors.includes(newColor)) {
      setColors([...colors, newColor]);
    }
  };

  // Remove color
  const handleRemoveColor = (colorToRemove) => {
    if (colors.length > 1) {
      setColors(colors.filter(c => c !== colorToRemove));
    }
  };

  // Spin the color wheel
  const spinWheel = () => {
    if (colors.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedColor(null);

    // Random rotation between 3-5 full spins plus random position
    const spins = 3 + Math.floor(Math.random() * 3);
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (360 * spins) + extraDegrees;

    setRotation(totalRotation);

    setTimeout(() => {
      // Calculate which color was selected
      const normalizedRotation = totalRotation % 360;
      const sectorSize = 360 / colors.length;
      const selectedIndex = Math.floor((360 - normalizedRotation) / sectorSize) % colors.length;

      setSelectedColor(colors[selectedIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  // Random color without animation
  const pickRandomColor = () => {
    if (colors.length === 0) return;
    const randomIndex = Math.floor(Math.random() * colors.length);
    setSelectedColor(colors[randomIndex]);
  };

  return (
    <div className={`component-page ${theme}-theme`}>
      <div className="page-header">
        <h1>🎨 Color Picker</h1>
        <p className="page-description">Spin the wheel or pick a random color</p>
      </div>

      {/* Color Wheel */}
      <div className="color-wheel-container">
        <div className="wheel-pointer">▼</div>
        <div
          className="color-wheel"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {colors.map((color, index) => {
            const sectorSize = 360 / colors.length;
            const rotation = sectorSize * index;

            return (
              <div
                key={index}
                className="color-sector"
                style={{
                  backgroundColor: color,
                  transform: `rotate(${rotation}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((sectorSize * Math.PI) / 180)}% ${50 - 50 * Math.cos((sectorSize * Math.PI) / 180)}%)`
                }}
              />
            );
          })}
        </div>
        <button
          className="wheel-center"
          onClick={spinWheel}
          disabled={isSpinning || colors.length === 0}
        >
          {isSpinning ? '...' : 'SPIN'}
        </button>
      </div>

      {/* Control Buttons */}
      <div className="color-controls">
        <button
          onClick={pickRandomColor}
          disabled={colors.length === 0}
          className="btn-random-color"
        >
          🎲 Quick Random
        </button>
      </div>

      {/* Selected Color Display */}
      {selectedColor && (
        <div className="selected-color-display">
          <h3>Selected Color</h3>
          <div className="color-result">
            <div
              className="color-preview"
              style={{ backgroundColor: selectedColor }}
            />
            <div className="color-info">
              <div className="color-code">{selectedColor.toUpperCase()}</div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedColor);
                  alert('Color code copied to clipboard!');
                }}
                className="btn-copy"
              >
                📋 Copy Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Manager */}
      <div className="color-manager">
        <h3>🎨 Manage Colors</h3>

        <div className="add-color-section">
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="color-input"
          />
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            placeholder="#FF0000"
            className="color-text-input"
          />
          <button onClick={handleAddColor} className="btn-add-color">
            Add Color
          </button>
        </div>

        <div className="colors-grid">
          {colors.map((color, index) => (
            <div key={index} className="color-item">
              <div
                className="color-swatch"
                style={{ backgroundColor: color }}
              />
              <span className="color-label">{color.toUpperCase()}</span>
              <button
                onClick={() => handleRemoveColor(color)}
                className="btn-remove-color"
                disabled={colors.length === 1}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;
