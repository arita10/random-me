// Import React and the useState hook
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth, signInWithGoogle, signOutUser } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './CardSelector.css';

function CardSelector({ theme = 'dark' }) {
  // ============================================
  // USER AUTHENTICATION STATE
  // ============================================

  const [user, setUser] = useState(null);

  // ============================================
  // CARD STATE
  // ============================================

  const [cardOptions, setCardOptions] = useState([
    { name: 'Ace ♠', maxSelections: 3, timesSelected: 0 },
    { name: 'King ♥', maxSelections: 3, timesSelected: 0 },
    { name: 'Queen ♦', maxSelections: 3, timesSelected: 0 },
    { name: 'Jack ♣', maxSelections: 3, timesSelected: 0 },
    { name: '10 ♠', maxSelections: 3, timesSelected: 0 },
    { name: '9 ♥', maxSelections: 3, timesSelected: 0 },
    { name: '8 ♦', maxSelections: 3, timesSelected: 0 },
    { name: '7 ♣', maxSelections: 3, timesSelected: 0 }
  ]);

  const [newCardOption, setNewCardOption] = useState('');
  const [cardMaxSelections, setCardMaxSelections] = useState('');
  const [isCardLimitEnabled, setIsCardLimitEnabled] = useState(true);
  const [showCardList, setShowCardList] = useState(true);
  const [flippedCards, setFlippedCards] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [deckName, setDeckName] = useState('Playing Cards');
  const [savedDecks, setSavedDecks] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareUrl, setShowShareUrl] = useState(false);

  // SWIPE STATE FOR CARDS
  const [swipeStart, setSwipeStart] = useState({ x: 0, y: 0 });
  const [swipeEnd, setSwipeEnd] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipingCardIndex, setSwipingCardIndex] = useState(null);

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadSavedDecks(currentUser.uid);
      } else {
        setSavedDecks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // ============================================
  // CARD FUNCTIONS
  // ============================================

  const loadSavedDecks = async (userId) => {
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

  const handleDeleteAllCardOptions = () => {
    const confirmDelete = window.confirm('Are you sure you want to DELETE ALL card options? This cannot be undone!');
    if (!confirmDelete) return;

    setCardOptions([]);
    setFlippedCards([]);
    setSelectedCardIndex(null);
  };

  const handleAddCardOption = () => {
    if (newCardOption.trim() !== '') {
      const newCardOptionObj = {
        name: newCardOption,
        maxSelections: isCardLimitEnabled ? (cardMaxSelections || 1) : Infinity,
        timesSelected: 0
      };
      setCardOptions([...cardOptions, newCardOptionObj]);
      setNewCardOption('');
    }
  };

  const handleRemoveCardOption = (indexToRemove) => {
    const updatedOptions = cardOptions.filter((_, index) => index !== indexToRemove);
    setCardOptions(updatedOptions);
    setFlippedCards(flippedCards.filter(idx => idx !== indexToRemove));
  };

  const handleResetCardCounts = () => {
    const resetOptions = cardOptions.map(opt => ({
      ...opt,
      timesSelected: 0
    }));
    setCardOptions(resetOptions);
    setFlippedCards([]);
    setSelectedCardIndex(null);
  };

  const handleShuffleCards = () => {
    // สุ่มตำแหน่งการ์ดใหม่
    const shuffled = [...cardOptions].sort(() => Math.random() - 0.5);
    setCardOptions(shuffled);
    // รีเซ็ตการ์ดที่พลิกด้วย
    setFlippedCards([]);
    setSelectedCardIndex(null);
  };

  const handleBulkAdd = () => {
    if (bulkInput.trim() === '') return;

    const items = bulkInput
      .split(/[\n,;]+/)
      .map(item => item.trim())
      .filter(item => item !== '');

    const newOptions = items.map(item => ({
      name: item,
      maxSelections: isCardLimitEnabled ? (cardMaxSelections || 1) : Infinity,
      timesSelected: 0
    }));

    setCardOptions([...cardOptions, ...newOptions]);
    setBulkInput('');
    setShowBulkInput(false);
  };

  const loadPreset = (presetName) => {
    const presets = {
      poker: [
        'Ace ♠', 'King ♠', 'Queen ♠', 'Jack ♠', '10 ♠',
        'Ace ♥', 'King ♥', 'Queen ♥', 'Jack ♥', '10 ♥',
        'Ace ♦', 'King ♦', 'Queen ♦', 'Jack ♦', '10 ♦',
        'Ace ♣', 'King ♣', 'Queen ♣', 'Jack ♣', '10 ♣'
      ],
      uno: [
        'Red 0', 'Red 1', 'Red 2', 'Red Skip', 'Red Reverse',
        'Blue 0', 'Blue 1', 'Blue 2', 'Blue Skip', 'Blue Reverse',
        'Green 0', 'Green 1', 'Green 2', 'Green Skip', 'Green Reverse',
        'Yellow 0', 'Yellow 1', 'Yellow 2', 'Yellow Skip', 'Yellow Reverse'
      ],
      tarot: [
        'The Fool', 'The Magician', 'The High Priestess', 'The Empress',
        'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot',
        'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice'
      ],
      numbers: Array.from({ length: 20 }, (_, i) => `Card ${i + 1}`)
    };

    const preset = presets[presetName];
    if (preset) {
      const newOptions = preset.map(item => ({
        name: item,
        maxSelections: 3,
        timesSelected: 0
      }));
      setCardOptions(newOptions);
      setDeckName(
        presetName === 'poker' ? 'Poker Deck 🃏' :
        presetName === 'uno' ? 'UNO Cards 🎴' :
        presetName === 'tarot' ? 'Tarot Cards 🔮' :
        'Numbered Cards 🔢'
      );
    }
  };

  const generateShareUrl = () => {
    const cardNames = cardOptions.map(opt => opt.name).join(',');
    const encodedList = encodeURIComponent(cardNames);
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

  // ============================================
  // CARD SWIPE FUNCTIONS
  // ============================================

  const handleSwipeStart = (e, index) => {
    const card = cardOptions[index];

    if (card.timesSelected >= card.maxSelections) {
      return;
    }

    if (flippedCards.includes(index)) {
      return;
    }

    const touch = e.touches ? e.touches[0] : e;
    setSwipeStart({ x: touch.clientX, y: touch.clientY });
    setIsSwiping(true);
    setSwipingCardIndex(index);
  };

  const handleSwipeMove = (e, index) => {
    if (!isSwiping || swipingCardIndex !== index) return;

    const touch = e.touches ? e.touches[0] : e;
    setSwipeEnd({ x: touch.clientX, y: touch.clientY });
  };

  const handleSwipeEnd = (e, index) => {
    if (!isSwiping || swipingCardIndex !== index) return;

    const deltaX = swipeEnd.x - swipeStart.x;
    const deltaY = swipeEnd.y - swipeStart.y;
    const swipeDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      handleCardClick(index);
    }

    setIsSwiping(false);
    setSwipingCardIndex(null);
    setSwipeStart({ x: 0, y: 0 });
    setSwipeEnd({ x: 0, y: 0 });
  };

  const handleCardClick = (index) => {
    const card = cardOptions[index];

    if (card.timesSelected >= card.maxSelections) {
      alert('This card has been selected the maximum number of times!');
      return;
    }

    if (flippedCards.includes(index)) {
      return;
    }

    setFlippedCards([...flippedCards, index]);
    setSelectedCardIndex(index);

    const updatedOptions = cardOptions.map((opt, idx) => {
      if (idx === index && opt.timesSelected < opt.maxSelections) {
        return {
          ...opt,
          timesSelected: opt.timesSelected + 1
        };
      }
      return opt;
    });

    setCardOptions(updatedOptions);
  };

  const handleSaveDeck = async () => {
    if (!user) {
      setError('Please sign in to save decks');
      return;
    }

    if (!deckName.trim()) {
      setError('Please enter a deck name');
      return;
    }

    try {
      await addDoc(collection(db, 'cardDecks'), {
        userId: user.uid,
        name: deckName,
        cards: cardOptions,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setError('');
      alert('Deck saved successfully! ✅');
      loadSavedDecks(user.uid);
    } catch (error) {
      console.error('Error saving deck:', error);
      setError('Failed to save deck');
    }
  };

  const handleLoadDeck = (deck) => {
    setDeckName(deck.name);
    setCardOptions(deck.cards);
    setFlippedCards([]);
    setShowSaved(false);
    setError('');
  };

  const handleDeleteDeck = async (deckId) => {
    if (!window.confirm('Delete this deck?')) return;

    try {
      await deleteDoc(doc(db, 'cardDecks', deckId));
      if (user) {
        loadSavedDecks(user.uid);
      }
      alert('Deck deleted');
    } catch (error) {
      console.error('Error deleting deck:', error);
      setError('Failed to delete deck');
    }
  };

  const handleReset = () => {
    setCardOptions([
      { name: 'Ace ♠', maxSelections: 3, timesSelected: 0 },
      { name: 'King ♥', maxSelections: 3, timesSelected: 0 },
      { name: 'Queen ♦', maxSelections: 3, timesSelected: 0 },
      { name: 'Jack ♣', maxSelections: 3, timesSelected: 0 },
      { name: '10 ♠', maxSelections: 3, timesSelected: 0 },
      { name: '9 ♥', maxSelections: 3, timesSelected: 0 },
      { name: '8 ♦', maxSelections: 3, timesSelected: 0 },
      { name: '7 ♣', maxSelections: 3, timesSelected: 0 }
    ]);
    setDeckName('Playing Cards');
    setFlippedCards([]);
    setSelectedCardIndex(null);
    setError('');
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={`component-page ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
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

      {/* Main Content */}
      <div className="cards-grid-container">
        <div className="cards-grid">
          {cardOptions.map((card, index) => {
            const isFlipped = flippedCards.includes(index);
            const isMaxedOut = card.timesSelected >= card.maxSelections;
            const isCurrentlySwiping = swipingCardIndex === index;

            return (
              <div
                key={index}
                className={`flip-card ${isFlipped ? 'flipped' : ''} ${isMaxedOut ? 'maxed-out' : ''} ${isCurrentlySwiping ? 'swiping' : ''}`}
                onClick={() => !isCurrentlySwiping && handleCardClick(index)}
                onTouchStart={(e) => handleSwipeStart(e, index)}
                onTouchMove={(e) => handleSwipeMove(e, index)}
                onTouchEnd={(e) => handleSwipeEnd(e, index)}
                onMouseDown={(e) => handleSwipeStart(e, index)}
                onMouseMove={(e) => handleSwipeMove(e, index)}
                onMouseUp={(e) => handleSwipeEnd(e, index)}
                onMouseLeave={(e) => {
                  if (isSwiping && swipingCardIndex === index) {
                    handleSwipeEnd(e, index);
                  }
                }}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="card-back-design">
                      <div className="card-pattern">🃏</div>
                      <div className="card-number">{index + 1}</div>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="card-answer">
                      {card.name}
                    </div>
                    <div className="card-selection-count">
                      {card.maxSelections === Infinity
                        ? `${card.timesSelected}/∞`
                        : `${card.timesSelected}/${card.maxSelections}`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={handleShuffleCards} className="shuffle-button">
          🔀 Shuffle Cards
        </button>

        {/* CARD MANAGEMENT SECTION - NOW RIGHT UNDER THE CARDS */}
        <div className="options-manager" style={{ marginTop: '30px' }}>
          <div className="options-header">
            <h3>Manage Card Options</h3>
            <button
              onClick={() => setShowCardList(!showCardList)}
              className="toggle-list-button"
            >
              {showCardList ? '🔼 Hide List' : '🔽 Show List'}
            </button>
          </div>

          {showCardList && (
            <>
              <div className="add-option-container">
                <div className="add-option">
                  <input
                    type="text"
                    placeholder="Enter new card..."
                    value={newCardOption}
                    onChange={(e) => setNewCardOption(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCardOption()}
                  />
                  <div className="number-input-wrapper">
                    <button
                      className="number-btn"
                      onClick={() => setCardMaxSelections(Math.max(1, (cardMaxSelections || 1) - 1))}
                      disabled={!isCardLimitEnabled || cardMaxSelections <= 1}
                      type="button"
                    >
                      ▼
                    </button>
                    <input
                      type="number"
                      placeholder="Max uses"
                      value={cardMaxSelections}
                      max="99"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || val === null) {
                          setCardMaxSelections('');
                        } else {
                          const num = parseInt(val);
                          if (!isNaN(num) && num >= 0 && num <= 99) {
                            setCardMaxSelections(num);
                          }
                        }
                      }}
                      className="max-selections-input"
                      disabled={!isCardLimitEnabled}
                      inputMode="numeric"
                    />
                    <button
                      className="number-btn"
                      onClick={() => setCardMaxSelections(Math.min(99, (cardMaxSelections || 0) + 1))}
                      disabled={!isCardLimitEnabled || cardMaxSelections >= 99}
                      type="button"
                    >
                      ▲
                    </button>
                  </div>
                  <button onClick={handleAddCardOption}>Add Card</button>
                </div>

                <div className="limit-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={isCardLimitEnabled}
                      onChange={(e) => setIsCardLimitEnabled(e.target.checked)}
                    />
                    <span>Set selection limit (uncheck for unlimited)</span>
                  </label>
                </div>
              </div>

              {/* Bulk Input Section */}
              <button
                onClick={() => setShowBulkInput(!showBulkInput)}
                className="bulk-input-toggle"
              >
                📋 Bulk Add (Paste List)
              </button>

              {showBulkInput && (
                <div className="bulk-input-container">
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="Paste your cards here (one per line, or comma/semicolon separated)&#10;Example:&#10;Ace of Spades&#10;King of Hearts&#10;Queen of Diamonds"
                    className="bulk-input-textarea"
                    rows="6"
                  />
                  <div className="bulk-input-actions">
                    <button onClick={handleBulkAdd} className="btn-primary">
                      ✅ Add All Cards
                    </button>
                    <button onClick={() => setShowBulkInput(false)} className="btn-secondary">
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Presets Section */}
              <div className="presets-section">
                <h4 className="presets-title">⚡ Quick Start Presets</h4>
                <div className="presets-grid">
                  <button onClick={() => loadPreset('poker')} className="preset-btn">
                    🃏 Poker Deck
                  </button>
                  <button onClick={() => loadPreset('uno')} className="preset-btn">
                    🎴 UNO Cards
                  </button>
                  <button onClick={() => loadPreset('tarot')} className="preset-btn">
                    🔮 Tarot Cards
                  </button>
                  <button onClick={() => loadPreset('numbers')} className="preset-btn">
                    🔢 Numbered Cards
                  </button>
                </div>
              </div>

              {/* Share Button */}
              <button onClick={generateShareUrl} className="share-button">
                🔗 Share This Deck
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

              <button onClick={handleResetCardCounts} className="reset-button">
                🔄 Reset All Cards
              </button>

              <button onClick={handleDeleteAllCardOptions} className="delete-all-button">
                🗑️ Delete All Choices
              </button>

              <div className="options-list">
                {cardOptions.map((option, index) => {
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
                        onClick={() => handleRemoveCardOption(index)}
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
      </div>

      {/* Save/Load Section */}
      {user && (
        <div className="save-section">
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

          <div className="button-row">
            <button onClick={handleSaveDeck} className="btn btn-secondary">
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
      )}
    </div>
  );
}

export default CardSelector;
