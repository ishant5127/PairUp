

// Add click event listener to the start button that executes when clicked
document.getElementById('startBtn').addEventListener('click', () => {
  // Retrieve the player's name from the input field
  // The trim() method removes whitespace from both ends of the string
  // This prevents submissions with only spaces
  const playerName = document.getElementById('playerName').value.trim();
  
  // Validate that the player has entered a name
  // This is a simple form validation to ensure we have player identification
  if (!playerName) {
    // Show an alert if validation fails, prompting the user to enter their name
    // This prevents anonymous players and ensures leaderboard functionality works
    alert('Please enter your name before starting.');
    return; // Early return prevents the rest of the function from executing
  }
  
  // If validation passes, store the player name in localStorage
  // localStorage persists data across browser sessions and between pages
  // This makes the player name available on the game and leaderboard pages
  localStorage.setItem('playerName', playerName);
  
  // Redirect the player to the game page to begin playing
  // This uses window.location.href to navigate to a new page
  // The browser will load game.html which contains the actual game interface
  window.location.href = 'game.html';
});

