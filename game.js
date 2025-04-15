// Card data setup (placeholder images or symbols, you can replace with actual image paths)
const cardSymbols = ['🍎','🍌','🍇','🍒','🍉','🍑','🍍','🥑'];
// Double up and shuffle array
let deck = [...cardSymbols, ...cardSymbols];

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let matchCount = 0;
let timerInterval;
let totalSeconds = 0;
let gameStarted = false;

// Load player name
document.getElementById('displayName').innerText = localStorage.getItem('playerName') || 'Player';

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
  }, 1000);
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
  // Simple scoring formula (example)
  const score = (matchCount * 10) - (moves - matchCount);
  const playerName = localStorage.getItem('playerName');
  const timeTaken = document.getElementById('timer').innerText;
  storeScore(playerName, score, timeTaken);
  window.location.href = 'leaderboard.html';
}

// Store scores in localStorage
function storeScore(name, score, time) {
  const dateStr = new Date().toLocaleString();
  let scores = JSON.parse(localStorage.getItem('scores')) || [];
  scores.push({ name, score, time, date: dateStr });
  localStorage.setItem('scores', JSON.stringify(scores));
}

// Initialize game on page load
window.addEventListener('DOMContentLoaded', createCards);