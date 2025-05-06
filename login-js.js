/**
 * Login System Handler for Card Matching Game
 * -------------------------------------------
 * This script manages the authentication process for the card matching game.
 * It handles form submission, validates credentials against stored user data,
 * and manages authentication state.
 * 
 * The authentication system uses localStorage for user data storage, which is
 * suitable for this demo application but would be replaced with proper server
 * authentication in a production environment.
 */

// Wait for the DOM to be fully loaded before attaching event handlers
document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the login form
    const loginForm = document.getElementById('loginForm');
    
    // Only proceed if we're on the login page (form exists)
    if (loginForm) {
      // Cache DOM elements to avoid repeated lookups
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const errorMessage = document.getElementById('errorMessage');
      
      // Attach submit event handler to the login form
      loginForm.addEventListener('submit', function(e) {
        // Prevent the default form submission behavior
        // This allows us to handle the submission with JavaScript
        e.preventDefault();
        
<<<<<<< HEAD
        
        errorMessage.style.display = 'none';
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
=======
        // Reset error message display from any previous attempts
        errorMessage.style.display = 'none';
        
        // Retrieve and clean up user input values
        // Trim removes any whitespace from both ends of the string
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Basic input validation - ensure required fields are not empty
>>>>>>> d442c7b5dcb5b8950e6650d1d1b6875234b1238c
        if (!username || !password) {
          showError('Please enter both username and password');
          return; // Stop execution if validation fails
        }
        
        try {
<<<<<<< HEAD
=======
          // Two-tier storage approach:
          // 1. First check individual user records (prefixed with 'user_')
          // 2. Then check the consolidated users object if not found
          
          // Check for individual user record first
          // This storage pattern allows for faster lookup of specific users
>>>>>>> d442c7b5dcb5b8950e6650d1d1b6875234b1238c
          const userKey = 'user_' + username;
          const userDataJson = localStorage.getItem(userKey);
          
          if (userDataJson) {
            // User found in individual storage, parse the JSON data
            const userData = JSON.parse(userDataJson);
            
            // Simple password verification
            // NOTE: In production, passwords should be hashed, not stored as plaintext
            if (userData.password === password) {
              // Authentication successful - set session data
              localStorage.setItem('currentUser', username);
              localStorage.setItem('playerName', userData.playerName);
              console.log('Login successful from individual storage');
              
              // Redirect to game page after successful login
              window.location.href = 'test_game.html';
              return; // Exit function after successful login
            }
          }
          
          // If user not found in individual storage, check the main users collection
          // This is a fallback lookup mechanism
          const usersJson = localStorage.getItem('users');
          if (usersJson) {
            const users = JSON.parse(usersJson);
            
            // Check if username exists and password matches
            if (users[username] && users[username].password === password) {
              // Authentication successful from main users collection
              localStorage.setItem('currentUser', username);
              localStorage.setItem('playerName', users[username].playerName);
              console.log('Login successful from users collection');
              
              // Redirect to game page after successful login
              window.location.href = 'test_game.html';
              return; // Exit function after successful login
            }
          }
          
          // If execution reaches here, authentication has failed
          // Either username doesn't exist or password is incorrect
          showError('Invalid username or password');
          
        } catch (error) {
          // Handle any unexpected errors during the authentication process
          // This could be JSON parsing errors or other exceptions
          console.error('Login error:', error);
          showError('Login failed: ' + error.message);
        }
      });
      
      /**
       * Displays an error message to the user
       * @param {string} message - The error message to display
       */
      function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
      }
    }
  });

/**
 * Security Considerations:
 * -----------------------
 * 1. This implementation uses localStorage which is not secure for sensitive data
 * 2. Passwords are stored in plaintext - in production, use proper hashing
 * 3. No protection against brute force attacks
 * 4. No session timeout mechanism
 * 
 * For a production application, consider:
 * - Using HTTPS
 * - Implementing server-side authentication
 * - Using password hashing (bcrypt/Argon2)
 * - Adding rate limiting to prevent brute force attacks
 * - Implementing proper session management
 */