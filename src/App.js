// Import React and the useState hook
import React, { useState, useEffect } from 'react';
import './App.css';
import { auth, signInWithGoogle, signOutUser, saveWheel, loadWheel, getUserWheels, deleteWheel } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AdminPanel from './AdminPanel';
import { logPageVisit } from './firebase'


function App() {
  // ============================================
  // USER AUTHENTICATION STATE
  // ============================================
  
  const [user, setUser] = useState(null);
  const [savedWheels, setSavedWheels] = useState([]);
  const [wheelName, setWheelName] = useState('My Wheel');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
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

  useEffect(() => {
    // Log page visit when app loads
    logPageVisit(user ? user.uid : 'anonymous');
  }, [user]);
  
  const loadUserWheels = async (userId) => {
    try {
      const wheels = await getUserWheels(userId);
      setSavedWheels(wheels);
    } catch (error) {
      console.error("Error loading wheels:", error);
    }
  };
  
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      alert("Error signing in: " + error.message);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      alert("Error signing out: " + error.message);
    }
  };
  
  const handleSaveWheel = async () => {
    if (!user) {
      alert("Please sign in to save your wheel!");
      return;
    }
    
    if (!wheelName.trim()) {
      alert("Please enter a name for your wheel!");
      return;
    }
    
    try {
      await saveWheel(user.uid, wheelName, options);
      alert(`Wheel "${wheelName}" saved successfully!`);
      loadUserWheels(user.uid);
    } catch (error) {
      alert("Error saving wheel: " + error.message);
    }
  };
  
  const handleLoadWheel = async (name) => {
    if (!user) return;
    
    try {
      const loadedOptions = await loadWheel(user.uid, name);
      if (loadedOptions) {
        setOptions(loadedOptions);
        setWheelName(name);
        alert(`Wheel "${name}" loaded successfully!`);
      }
    } catch (error) {
      alert("Error loading wheel: " + error.message);
    }
  };
  
  const handleDeleteWheel = async (name) => {
    if (!user) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;
    
    try {
      await deleteWheel(user.uid, name);
      alert(`"${name}" deleted successfully!`);
      loadUserWheels(user.uid);
    } catch (error) {
      alert("Error deleting wheel: " + error.message);
    }
  };
  
  // ============================================
  // TAB STATE
  // ============================================
  
  const [activeTab, setActiveTab] = useState('wheel');
  
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
  const [diceMaxSelections, setDiceMaxSelections] = useState(1);
  const [isDiceLimitEnabled, setIsDiceLimitEnabled] = useState(true);
  const [showDiceList, setShowDiceList] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  
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
  const [cardMaxSelections, setCardMaxSelections] = useState(1);
  const [isCardLimitEnabled, setIsCardLimitEnabled] = useState(true);
  const [showCardList, setShowCardList] = useState(true);
  const [flippedCards, setFlippedCards] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);

  // SWIPE STATE FOR CARDS
  const [swipeStart, setSwipeStart] = useState({ x: 0, y: 0 });
  const [swipeEnd, setSwipeEnd] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipingCardIndex, setSwipingCardIndex] = useState(null);

  // ============================================
  // WHEEL FUNCTIONS
  // ============================================

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
      let normalizedRotation = totalRotation % 360;
      if (normalizedRotation < 0) normalizedRotation += 360;
      
      const anglePerOption = 360 / options.length;
      let selectedIndex = Math.floor(-normalizedRotation / anglePerOption);
      
      while (selectedIndex < 0) {
        selectedIndex += options.length;
      }
      
      selectedIndex = selectedIndex % options.length;
      
      console.log('🎯 Selected index:', selectedIndex, '- Option:', options[selectedIndex].name);
      
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


  // ============================================
  // DICE FUNCTIONS
  // ============================================

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
        maxSelections: isDiceLimitEnabled ? diceMaxSelections : Infinity,
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

  // ============================================
  // CARD FUNCTIONS
  // ============================================

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
        maxSelections: isCardLimitEnabled ? cardMaxSelections : Infinity,
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

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="App">
      <h1>🎲 Random Selector Game</h1>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'wheel' ? 'active' : ''}`}
          onClick={() => setActiveTab('wheel')}
        >
          🎡 Wheel
        </button>
        <button 
          className={`tab-button ${activeTab === 'dice' ? 'active' : ''}`}
          onClick={() => setActiveTab('dice')}
        >
          🎲 Dice
        </button>
        <button 
          className={`tab-button ${activeTab === 'cards' ? 'active' : ''}`}
          onClick={() => setActiveTab('cards')}
        >
          🃏 Cards
        </button>
      </div>

      {/* WHEEL TAB */}
      {activeTab === 'wheel' && (
        <div className="tab-content">
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
                
                const background = rainbowColors[index % rainbowColors.length];
                
                return (
                  <div
                    key={index}
                    className="wheel-segment"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      background: background,
                      opacity: 1
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
                    <input
                      type="number"
                      placeholder="Max uses"
                      value={maxSelections}
                      min="1"
                      max="99"
                      onChange={(e) => setMaxSelections(parseInt(e.target.value) || 1)}
                      className="max-selections-input"
                      disabled={!isLimitEnabled}
                    />
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
        </div>
      )}

      {/* DICE TAB */}
      {activeTab === 'dice' && (
        <div className="tab-content">
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
                    <input
                      type="number"
                      placeholder="Max uses"
                      value={diceMaxSelections}
                      min="1"
                      max="99"
                      onChange={(e) => setDiceMaxSelections(parseInt(e.target.value) || 1)}
                      className="max-selections-input"
                      disabled={!isDiceLimitEnabled}
                    />
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
        </div>
      )}

      {/* CARDS TAB - MANAGEMENT SECTION NOW UNDER THE CARDS */}
      {activeTab === 'cards' && (
        <div className="tab-content">
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
                      <input
                        type="number"
                        placeholder="Max uses"
                        value={cardMaxSelections}
                        min="1"
                        max="99"
                        onChange={(e) => setCardMaxSelections(parseInt(e.target.value) || 1)}
                        className="max-selections-input"
                        disabled={!isCardLimitEnabled}
                      />
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
        </div>
      )}

      {/* Login and Save Section */}
      <div className="auth-section">
        {!user ? (
          <div className="auth-container">
            <p>Sign in to save your configurations!</p>
            <button onClick={handleSignIn} className="google-signin-button">
              <span className="google-icon">🔐</span>
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="auth-container">
            <div className="user-info">
              {user.photoURL && (
                <img src={user.photoURL} alt="Profile" className="user-avatar" />
              )}
              <div className="user-details">
                <p className="user-name">{user.displayName}</p>
                <p className="user-email">{user.email}</p>
              </div>
              <button onClick={handleSignOut} className="signout-button">
                Sign Out
              </button>
            </div>

            <button 
              onClick={() => setShowAdminPanel(true)} 
              className="admin-button"
              style={{
                padding: '10px 20px',
                background: 'rgba(255, 215, 0, 0.3)',
                color: 'white',
                border: '2px solid gold',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '10px',
                width: '100%',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 215, 0, 0.5)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 215, 0, 0.3)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              📊 Admin Panel
            </button>
            
            <div className="save-wheel-section">
              <h3>💾 Save Current Configuration</h3>
              <div className="save-controls">
                <input
                  type="text"
                  placeholder="Configuration name..."
                  value={wheelName}
                  onChange={(e) => setWheelName(e.target.value)}
                  className="wheel-name-input"
                />
                <button onClick={handleSaveWheel} className="save-button">
                  Save
                </button>
              </div>
            </div>
            
            {savedWheels.length > 0 && (
              <div className="saved-wheels-section">
                <h3>📂 Your Saved Configurations</h3>
                <div className="saved-wheels-list">
                  {savedWheels.map((wheel) => (
                    <div key={wheel.name} className="saved-wheel-item">
                      <span className="saved-wheel-name">{wheel.name}</span>
                      <div className="saved-wheel-actions">
                        <button 
                          onClick={() => handleLoadWheel(wheel.name)}
                          className="load-button"
                        >
                          Load
                        </button>
                        <button 
                          onClick={() => handleDeleteWheel(wheel.name)}
                          className="delete-saved-button"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showAdminPanel && (
        <AdminPanel 
          user={user} 
          onClose={() => setShowAdminPanel(false)} 
        />
      )}
    </div>
  );
}

export default App;