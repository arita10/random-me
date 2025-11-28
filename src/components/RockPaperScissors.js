import React, { useState } from 'react';
import './RockPaperScissors.css';

function RockPaperScissors({ theme }) {
  const choices = [
    { name: 'rock', emoji: '✊', label: 'Rock' },
    { name: 'paper', emoji: '✋', label: 'Paper' },
    { name: 'scissors', emoji: '✌️', label: 'Scissors' }
  ];

  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ player: 0, computer: 0, draws: 0 });

  const determineWinner = (player, computer) => {
    if (player === computer) return 'draw';

    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'player';
    }

    return 'computer';
  };

  const play = (playerSelection) => {
    if (isPlaying) return;

    setIsPlaying(true);
    setPlayerChoice(playerSelection);
    setResult(null);

    // Animate computer choice
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * 3);
      setComputerChoice(choices[randomIndex].name);
      counter++;

      if (counter >= 10) {
        clearInterval(interval);

        // Final computer choice
        const finalComputerChoice = choices[Math.floor(Math.random() * 3)].name;
        setComputerChoice(finalComputerChoice);

        // Determine winner
        const winner = determineWinner(playerSelection, finalComputerChoice);
        setResult(winner);

        // Update score
        setScore(prev => ({
          ...prev,
          player: winner === 'player' ? prev.player + 1 : prev.player,
          computer: winner === 'computer' ? prev.computer + 1 : prev.computer,
          draws: winner === 'draw' ? prev.draws + 1 : prev.draws
        }));

        setIsPlaying(false);
      }
    }, 100);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScore({ player: 0, computer: 0, draws: 0 });
  };

  const getChoiceEmoji = (choiceName) => {
    return choices.find(c => c.name === choiceName)?.emoji || '';
  };

  return (
    <div className={`component-page ${theme}-theme`}>
      <div className="page-header">
        <h1>✊✋✌️ Rock Paper Scissors</h1>
        <p className="page-description">Play against the computer!</p>
      </div>

      {/* Game Arena */}
      <div className="game-arena">
        <div className="player-section">
          <h3>👤 You</h3>
          <div className={`choice-display ${playerChoice ? 'selected' : ''}`}>
            {playerChoice ? getChoiceEmoji(playerChoice) : '❓'}
          </div>
          <div className="choice-label">
            {playerChoice ? choices.find(c => c.name === playerChoice)?.label : 'Choose!'}
          </div>
        </div>

        <div className="vs-section">
          <div className="vs-text">VS</div>
          {result && (
            <div className={`result-badge ${result}`}>
              {result === 'player' && '🎉 You Win!'}
              {result === 'computer' && '😞 You Lose!'}
              {result === 'draw' && '🤝 Draw!'}
            </div>
          )}
        </div>

        <div className="computer-section">
          <h3>🤖 Computer</h3>
          <div className={`choice-display ${computerChoice ? 'selected' : ''} ${isPlaying ? 'spinning' : ''}`}>
            {computerChoice ? getChoiceEmoji(computerChoice) : '❓'}
          </div>
          <div className="choice-label">
            {computerChoice ? choices.find(c => c.name === computerChoice)?.label : 'Waiting...'}
          </div>
        </div>
      </div>

      {/* Choice Buttons */}
      <div className="choices-container">
        <h3>Make Your Choice</h3>
        <div className="choices-grid">
          {choices.map((choice) => (
            <button
              key={choice.name}
              onClick={() => play(choice.name)}
              disabled={isPlaying}
              className={`choice-button ${playerChoice === choice.name ? 'active' : ''}`}
            >
              <div className="choice-emoji">{choice.emoji}</div>
              <div className="choice-name">{choice.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Scoreboard */}
      <div className="scoreboard">
        <div className="scoreboard-header">
          <h3>📊 Scoreboard</h3>
          <button onClick={resetGame} className="btn-reset">
            Reset Game
          </button>
        </div>

        <div className="score-grid">
          <div className="score-card player-score">
            <div className="score-icon">👤</div>
            <div className="score-label">Your Wins</div>
            <div className="score-value">{score.player}</div>
          </div>

          <div className="score-card draw-score">
            <div className="score-icon">🤝</div>
            <div className="score-label">Draws</div>
            <div className="score-value">{score.draws}</div>
          </div>

          <div className="score-card computer-score">
            <div className="score-icon">🤖</div>
            <div className="score-label">Computer Wins</div>
            <div className="score-value">{score.computer}</div>
          </div>
        </div>

        {(score.player + score.computer + score.draws) > 0 && (
          <div className="total-games">
            Total Games: {score.player + score.computer + score.draws}
          </div>
        )}
      </div>

      {/* Game Rules */}
      <div className="game-rules">
        <h3>📜 Game Rules</h3>
        <ul>
          <li>✊ Rock beats ✌️ Scissors</li>
          <li>✋ Paper beats ✊ Rock</li>
          <li>✌️ Scissors beats ✋ Paper</li>
        </ul>
      </div>
    </div>
  );
}

export default RockPaperScissors;
