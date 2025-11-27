// CardSelector.js - Complete Card Selector Component
// Place this in: src/components/CardSelector.js

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import { validateCardDeck, checkRateLimit } from '../utils/validation';
import './CardSelector.css';

function CardSelector() {
  const { userId } = useAuth();
  
  // Default playing cards
  const defaultCards = [
    '🂡 Ace ♠', '🂢 2 ♠', '🂣 3 ♠', '🂤 4 ♠', '🂥 5 ♠', '🂦 6 ♠', '🂧 7 ♠', 
    '🂨 8 ♠', '🂩 9 ♠', '🂪 10 ♠', '🂫 Jack ♠', '🂭 Queen ♠', '🂮 King ♠',
    '🂱 Ace ♥', '🂲 2 ♥', '🂳 3 ♥', '🂴 4 ♥', '🂵 5 ♥', '🂶 6 ♥', '🂷 7 ♥',
    '🂸 8 ♥', '🂹 9 ♥', '🂺 10 ♥', '🂻 Jack ♥', '🂽 Queen ♥', '🂾 King ♥',
    '🃁 Ace ♦', '🃂 2 ♦', '🃃 3 ♦', '🃄 4 ♦', '🃅 5 ♦', '🃆 6 ♦', '🃇 7 ♦',
    '🃈 8 ♦', '🃉 9 ♦', '🃊 10 ♦', '🃋 Jack ♦', '🃍 Queen ♦', '🃎 King ♦',
    '🃑 Ace ♣', '🃒 2 ♣', '🃓 3 ♣', '🃔 4 ♣', '🃕 5 ♣', '🃖 6 ♣', '🃗 7 ♣',
    '🃘 8 ♣', '🃙 9 ♣', '🃚 10 ♣', '🃛 Jack ♣', '🃝 Queen ♣', '🃞 King ♣'
  ];

  const [cards, setCards] = useState(defaultCards);
  const [deckName, setDeckName] = useState('Playing Cards');
  const [newCard, setNewCard] = useState('');
  const [selectedCards, setSelectedCards] = useState([]);
  const [drawCount, setDrawCount] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [savedDecks, setSavedDecks] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [selectionMode, setSelectionMode] = useState('draw'); // draw, shuffle, pick
  const [error, setError] = useState('');

  // Preset decks
  const presets = [
    { name: 'Playing Cards', cards: defaultCards },
    { name: 'Yes/No', cards: ['✅ Yes', '❌ No'] },
    { name: 'Rock Paper Scissors', cards: ['✊ Rock', '✋ Paper', '✌️ Scissors'] },
    { name: 'Numbers 1-10', cards: Array.from({length: 10}, (_, i) => `${i + 1}`) },
    { name: 'Coin Flip', cards: ['🪙 Heads', '🪙 Tails'] }
  ];

  // Load saved decks on mount
  useEffect(() => {
    loadSavedDecks();
  }, [userId]);

  // Load saved decks from Firestore
  const loadSavedDecks = async () => {
    if (!userId) return;

    try {
      const q = query(
        collection(db, 'cardDecks'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const decks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedDecks(decks);
    } catch (error) {
      console.error('Error loading decks:', error);
    }
  };

  // Add new card
  const handleAddCard = () => {
    if (!newCard.trim()) {
      setError('Please enter a card');
      return;
    }

    if (cards.length >= 200) {
      setError('Maximum 200 cards allowed');
      return;
    }

    const trimmed = newCard.trim();
    if (trimmed.length > 100) {
      setError('Card text too long (max 100 characters)');
      return;
    }

    setCards([...cards, trimmed]);
    setNewCard('');
    setError('');
  };

  // Remove card
  const handleRemoveCard = (index) => {
    if (cards.length <= 1) {
      setError('Minimum 1 card required');
      return;
    }
    setCards(cards.filter((_, i) => i !== index));
    setError('');
  };

  // Draw cards
  const handleDraw = () => {
    // Rate limiting
    const rateCheck = checkRateLimit('cardDraw', 1000);
    if (!rateCheck.allowed) {
      setError(rateCheck.error);
      return;
    }

    if (drawCount > cards.length) {
      setError(`Cannot draw ${drawCount} cards from ${cards.length} card deck`);
      return;
    }

    setIsDrawing(true);
    setError('');

    setTimeout(() => {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      const drawn = shuffled.slice(0, drawCount);
      setSelectedCards(drawn);
      
      // Remove drawn cards if in "draw" mode
      if (selectionMode === 'draw') {
        setCards(shuffled.slice(drawCount));
      }
      
      setIsDrawing(false);
    }, 800);
  };

  // Shuffle deck
  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setError('');
  };

  // Reset deck
  const handleReset = () => {
    setCards(defaultCards);
    setDeckName('Playing Cards');
    setSelectedCards([]);
    setError('');
  };

  // Load preset deck
  const handleLoadPreset = (preset) => {
    setCards(preset.cards);
    setDeckName(preset.name);
    setSelectedCards([]);
    setError('');
  };

  // Save deck to Firestore
  const handleSaveDeck = async () => {
    if (!userId) {
      setError('Please sign in to save decks');
      return;
    }

    const validation = validateCardDeck({
      name: deckName,
      cards: cards
    });

    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      await addDoc(collection(db, 'cardDecks'), {
        userId: userId,
        name: validation.data.name,
        cards: validation.data.cards,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setError('');
      alert('Deck saved successfully! ✅');
      loadSavedDecks();
    } catch (error) {
      console.error('Error saving deck:', error);
      setError('Failed to save deck');
    }
  };

  // Load saved deck
  const handleLoadDeck = (deck) => {
    setDeckName(deck.name);
    setCards(deck.cards);
    setSelectedCards([]);
    setShowSaved(false);
    setError('');
  };

  // Delete saved deck
  const handleDeleteDeck = async (deckId) => {
    if (!window.confirm('Delete this deck?')) return;

    try {
      await deleteDoc(doc(db, 'cardDecks', deckId));
      loadSavedDecks();
      alert('Deck deleted');
    } catch (error) {
      console.error('Error deleting deck:', error);
      setError('Failed to delete deck');
    }
  };

  return (
    <div className="component-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="page-icon">🃏</span>
          Card Selector
        </h1>
        <p className="page-description">
          Create custom card decks and draw random cards
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="component-grid">
        {/* Left Panel - Controls */}
        <div className="control-panel card">
          <h2 className="panel-title">Deck Configuration</h2>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Preset Decks */}
          <div className="input-section">
            <label className="input-label">Preset Decks</label>
            <div className="preset-grid">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleLoadPreset(preset)}
                  className="preset-btn"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Deck Name */}
          <div className="input-section">
            <label className="input-label">Deck Name</label>
            <input
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="input-field"
              placeholder="Enter deck name..."
              maxLength={100}
            />
          </div>

          {/* Add Card */}
          <div className="input-section">
            <label className="input-label">Add Cards ({cards.length}/200)</label>
            <div className="input-group">
              <input
                type="text"
                value={newCard}
                onChange={(e) => setNewCard(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCard()}
                className="input-field"
                placeholder="Enter card..."
                maxLength={100}
              />
              <button onClick={handleAddCard} className="btn btn-primary">
                Add
              </button>
            </div>
          </div>

          {/* Selection Mode */}
          <div className="input-section">
            <label className="input-label">Selection Mode</label>
            <div className="mode-tabs">
              <button
                onClick={() => setSelectionMode('draw')}
                className={`mode-tab ${selectionMode === 'draw' ? 'active' : ''}`}
              >
                Draw (Remove)
              </button>
              <button
                onClick={() => setSelectionMode('pick')}
                className={`mode-tab ${selectionMode === 'pick' ? 'active' : ''}`}
              >
                Pick (Keep)
              </button>
            </div>
          </div>

          {/* Draw Count */}
          <div className="input-section">
            <label className="input-label">Number of Cards</label>
            <div className="slider-container">
              <input
                type="range"
                value={drawCount}
                onChange={(e) => setDrawCount(parseInt(e.target.value))}
                className="slider"
                min="1"
                max={Math.min(cards.length, 10)}
              />
              <span className="slider-value">{drawCount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button
              onClick={handleDraw}
              disabled={isDrawing || cards.length === 0}
              className="btn btn-primary btn-large"
            >
              {isDrawing ? 'Drawing...' : `Draw ${drawCount} Card${drawCount > 1 ? 's' : ''}`}
              <span className="btn-icon">🎴</span>
            </button>

            <div className="button-row">
              <button onClick={handleShuffle} className="btn btn-secondary">
                🔀 Shuffle
              </button>
              <button onClick={handleSaveDeck} className="btn btn-secondary">
                💾 Save
              </button>
            </div>

            <div className="button-row">
              <button onClick={() => setShowSaved(!showSaved)} className="btn btn-secondary">
                📂 Load
              </button>
              <button onClick={handleReset} className="btn btn-secondary">
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Saved Decks */}
          {showSaved && (
            <div className="saved-decks">
              <h3 className="saved-title">Saved Decks ({savedDecks.length})</h3>
              {savedDecks.length === 0 ? (
                <p className="empty-message">No saved decks yet</p>
              ) : (
                <div className="saved-list">
                  {savedDecks.map((deck) => (
                    <div key={deck.id} className="saved-item">
                      <div onClick={() => handleLoadDeck(deck)} className="saved-info">
                        <span className="saved-name">{deck.name}</span>
                        <span className="saved-count">{deck.cards.length} cards</span>
                      </div>
                      <button
                        onClick={() => handleDeleteDeck(deck.id)}
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

        {/* Right Panel - Card Display */}
        <div className="display-panel card">
          {/* Selected Cards */}
          {selectedCards.length > 0 && (
            <div className="selected-section">
              <h3 className="selected-title">Selected Cards</h3>
              <div className="cards-display">
                {selectedCards.map((card, index) => (
                  <div
                    key={index}
                    className="card-item selected"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {card}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSelectedCards([])}
                className="btn btn-secondary btn-small"
              >
                Clear Selection
              </button>
            </div>
          )}

          {/* Deck Cards */}
          <div className="deck-section">
            <h3 className="deck-title">
              Deck ({cards.length} card{cards.length !== 1 ? 's' : ''})
            </h3>
            {cards.length === 0 ? (
              <div className="empty-deck">
                <div className="empty-deck-icon">🃏</div>
                <p>Deck is empty. Add some cards!</p>
              </div>
            ) : (
              <div className="cards-grid">
                {cards.map((card, index) => (
                  <div key={index} className="card-item-wrapper">
                    <div className="card-item">
                      {card}
                    </div>
                    <button
                      onClick={() => handleRemoveCard(index)}
                      className="card-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardSelector;