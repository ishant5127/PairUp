/**
 * Home Page Controller Script
 * --------------------------
 * This script manages the player name input form on the home page and handles
 * the transition to the game page. It performs basic validation to ensure
 * players identify themselves before starting the game.
 * 
 * Key functions:
 * - Validates the player name input field isn't empty
 * - Stores the player name in browser's localStorage for use across game pages
 * - Redirects the player to the game page when validation passes
 */

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

/**
 * Note: localStorage is browser-specific and has a limited storage capacity
 * (typically 5-10MB depending on the browser). For a simple game like this,
 * it's more than sufficient for storing player names and scores.
 * 
 * For a production application with many users, consider:
 * - Adding data validation beyond just empty checks
 * - Implementing server-side storage for persistent leaderboards
 * - Adding security measures for user data protection
 */