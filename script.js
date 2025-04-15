// This file handles the name input on the home page and navigation to the game page

document.getElementById('startBtn').addEventListener('click', () => {
  const playerName = document.getElementById('playerName').value.trim();
  if (!playerName) {
    alert('Please enter your name before starting.');
    return;
  }
  // Store player name in local storage
  localStorage.setItem('playerName', playerName);
  // Redirect to the game page
  window.location.href = 'game.html';
});