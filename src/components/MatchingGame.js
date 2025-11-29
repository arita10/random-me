import React, { useState, useEffect } from 'react';
import './MatchingGame.css';

const cardEmojis = ['🎮', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺'];

function MatchingGame({ theme }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const duplicatedCards = [...cardEmojis, ...cardEmojis];
    const shuffledCards = duplicatedCards
      .map((emoji, index) => ({ id: index, emoji, isFlipped: false, isMatched: false }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setGameWon(false);
    setIsChecking(false);
  };

  const handleCardClick = (cardId) => {
    if (isChecking) return;
    if (flippedCards.includes(cardId)) return;
    if (matchedCards.includes(cardId)) return;
    if (flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);
      checkForMatch(newFlippedCards);
    }
  };

  const checkForMatch = (flippedCardIds) => {
    const [firstCardId, secondCardId] = flippedCardIds;
    const firstCard = cards.find(card => card.id === firstCardId);
    const secondCard = cards.find(card => card.id === secondCardId);

    if (firstCard.emoji === secondCard.emoji) {
      setTimeout(() => {
        const newMatchedCards = [...matchedCards, firstCardId, secondCardId];
        setMatchedCards(newMatchedCards);
        setFlippedCards([]);
        setIsChecking(false);

        if (newMatchedCards.length === cards.length) {
          setGameWon(true);
        }
      }, 600);
    } else {
      setTimeout(() => {
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const isCardFlipped = (cardId) => {
    return flippedCards.includes(cardId) || matchedCards.includes(cardId);
  };

  const isCardMatched = (cardId) => {
    return matchedCards.includes(cardId);
  };

  return (
    <div className={`matching-game-container ${theme}`}>
      <div className="matching-game-header">
        <h1>Memory Matching Game</h1>
        <p className="game-description">Find all the matching pairs!</p>
      </div>

      <div className="game-stats">
        <div className="stat">
          <span className="stat-label">Moves:</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Matched:</span>
          <span className="stat-value">{matchedCards.length / 2} / {cardEmojis.length}</span>
        </div>
      </div>

      {gameWon && (
        <div className="game-won-message">
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You won in {moves} moves!</p>
        </div>
      )}

      <div className="cards-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${isCardFlipped(card.id) ? 'flipped' : ''} ${isCardMatched(card.id) ? 'matched' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">
                <span className="card-icon">?</span>
              </div>
              <div className="card-back">
                <span className="card-emoji">{card.emoji}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="game-controls">
        <button className="reset-button" onClick={initializeGame}>
          <span className="button-icon">🔄</span>
          New Game
        </button>
      </div>
    </div>
  );
}

export default MatchingGame;
