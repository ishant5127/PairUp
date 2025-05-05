// Card data setup (placeholder images or symbols, you can replace with actual image paths)
const allCardSymbols = ['🍎', '🍌', '🍇', '🍒', '🍉', '🍑', '🍍', '🥑', '🥝', '🍓', '🍋', '🍊', '🍐', '🥭', '🍈', '🍏'];
let cardSymbols = [];
let deck = [];

// Game state variables
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let matchCount = 0;
let timerInterval;
let totalSeconds = 0;
let gameStarted = false;
let difficulty = 'medium'; // default difficulty
let cardFlipTime = 1000; // default flip back time in ms

// Load player name
document.getElementById('displayName').innerText = localStorage.getItem('playerName') || 'Player';

// Game options event listeners
document.getElementById('startGameButton').addEventListener('click', setupGame);

// Setup the game based on chosen options
function setupGame() {
  // Get selected options
  difficulty = document.getElementById('difficultySelect').value;
  const numberOfPairs = parseInt(document.getElementById('pairsSelect').value);
  
  // Set difficulty parameters
  switch(difficulty) {
    case 'easy':
      cardFlipTime = 1500; // Slower card flip back for easier memorization
      break;
    case 'medium':
      cardFlipTime = 1000;
      break;
    case 'hard':
      cardFlipTime = 700; // Faster card flip back for harder challenge
      break;
  }
  
  // Select symbols based on number of pairs
  cardSymbols = allCardSymbols.slice(0, numberOfPairs);
  
  // Hide options and show game
  document.getElementById('gameOptions').style.display = 'none';
  document.getElementById('cardGrid').style.display = 'grid';
  
  // Reset game variables
  resetGame();
  
  // Create card grid with appropriate layout
  const cardGrid = document.getElementById('cardGrid');
  if (numberOfPairs <= 6) {
    cardGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  } else if (numberOfPairs <= 8) {
    cardGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  } else {
    cardGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
  }
}

// Shuffle deck using Fisher-Yates shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Create card elements and attach event listeners
function createCards() {
  // Create deck with pairs of each symbol
  deck = [...cardSymbols, ...cardSymbols];
  
  const cardGrid = document.getElementById('cardGrid');
  cardGrid.innerHTML = '';
  shuffle(deck).forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${symbol}</div>
      </div>
    `;
    card.addEventListener('click', flipCard);
    cardGrid.appendChild(card);
  });
}

// Flip card logic
function flipCard() {
  if (lockBoard) return;
  if (!gameStarted) {
    // Start timer on first flip
    startTimer();
    gameStarted = true;
  }
  if (this === firstCard) return;
  this.classList.add('flipped');

  if (!hasFlippedCard) {
    // First card
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  // Second card
  secondCard = this;
  evaluateMatch();
}

// Evaluate match
function evaluateMatch() {
  moves++;
  document.getElementById('movesCounter').innerText = `Moves: ${moves}`;
  const firstSymbol = firstCard.querySelector('.card-back').textContent;
  const secondSymbol = secondCard.querySelector('.card-back').textContent;
  if (firstSymbol === secondSymbol) {
    disableCards();
    matchCount++;
    if (matchCount === cardSymbols.length) {
      endGame();
    }
  } else {
    unflipCards();
  }
}

// Disable matched cards
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

// Flip cards back if not matched
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, cardFlipTime); // This time varies based on difficulty
}

// Reset board state
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Timer functions
function startTimer() {
  timerInterval = setInterval(() => {
    totalSeconds++;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    document.getElementById('timer').innerText = 
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

// End game: stop timer, calculate score, store in localStorage, redirect
function endGame() {
  stopTimer();
  
  // Get time components
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeTaken = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Calculate score based on moves, time, and difficulty
  // Base score from matches
  const matchScore = matchCount * 100;
  
  // Move efficiency (perfect game would use exactly matchCount * 2 moves)
  const moveEfficiency = Math.max(0, 1 - ((moves - (matchCount * 2)) / (matchCount * 3)));
  
  // Time efficiency (decreases as time increases, with time adjusted by difficulty)
  let maxTimeSeconds;
  switch(difficulty) {
    case 'easy':
      maxTimeSeconds = 240; // 4 minutes for easy
      break;
    case 'medium':
      maxTimeSeconds = 180; // 3 minutes for medium
      break;
    case 'hard':
      maxTimeSeconds = 120; // 2 minutes for hard
      break;
  }
  const timeEfficiency = Math.max(0, 1 - (totalSeconds / maxTimeSeconds));
  
  // Difficulty multiplier
  let difficultyMultiplier;
  switch(difficulty) {
    case 'easy':
      difficultyMultiplier = 1.0;
      break;
    case 'medium':
      difficultyMultiplier = 1.5;
      break;
    case 'hard':
      difficultyMultiplier = 2.0;
      break;
  }
  
  // Final score calculation (weighted: 40% moves, 60% time, multiplied by difficulty)
  const score = Math.round(matchScore * (0.4 * moveEfficiency + 0.6 * timeEfficiency) * difficultyMultiplier);
  
  const playerName = localStorage.getItem('playerName');
  storeScore(playerName, score, timeTaken, moves, difficulty, cardSymbols.length);
  
  // Show score before redirecting
  alert(`Game Complete!\nDifficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}\nPairs: ${cardSymbols.length}\nScore: ${score}\nTime: ${timeTaken}\nMoves: ${moves}`);
  
  window.location.href = 'test_leaderboard.html';
}

// Store scores in localStorage with additional move information
function storeScore(name, score, time, moves, difficulty, pairs) {
  const dateStr = new Date().toLocaleString();
  let scores = JSON.parse(localStorage.getItem('scores')) || [];
  scores.push({ 
    name, 
    score, 
    time, 
    moves, 
    difficulty,
    pairs,
    date: dateStr 
  });
  scores.sort((a, b) => b.score - a.score); // Sort by score descending
  localStorage.setItem('scores', JSON.stringify(scores));
}

// Reset game
function resetGame() {
  moves = 0;
  matchCount = 0;
  totalSeconds = 0;
  gameStarted = false;
  stopTimer();
  document.getElementById('timer').innerText = '00:00';
  document.getElementById('movesCounter').innerText = 'Moves: 0';
  createCards();
}

// Initialize game options on page load
window.addEventListener('DOMContentLoaded', () => {
  // Initial setup - show options first
  document.getElementById('gameOptions').style.display = 'block';
  document.getElementById('cardGrid').style.display = 'none';
});