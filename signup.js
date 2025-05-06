/**
 * Signup Form Handler for Card Matching Game
 * ------------------------------------------
 * This script manages user registration for the Card Pair Matching game.
 * It handles form validation, user data storage, and navigation to the
 * login page after successful registration.
 * 
 * The registration system uses localStorage for user data storage in two ways:
 * 1. Individual user records with 'user_[username]' keys
 * 2. A consolidated 'users' object containing all registered users
 * 
 * This dual approach provides redundancy and faster lookup options.
 */

// Wait for DOM to be fully loaded before attaching event handlers
document.addEventListener('DOMContentLoaded', function() {
    // Get reference to the signup form element
    const signupForm = document.getElementById('signupForm');
    
    // Only proceed if we're on the signup page (form exists)
    if (signupForm) {
      // Cache DOM elements to avoid repeated lookups
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const confirmPasswordInput = document.getElementById('confirmPassword');
      const playerNameInput = document.getElementById('playerName');
      const errorMessage = document.getElementById('errorMessage');
      
      // Initialize users in localStorage if it doesn't exist
      // This ensures we have a valid JSON object to work with
      if (!localStorage.getItem('users')) {
        localStorage.setItem('users', '{}');
      }
      
      // Attach submit event handler to the signup form
      signupForm.addEventListener('submit', function(e) {
        // Prevent default form submission behavior
        // This allows us to handle the submission with JavaScript
        e.preventDefault();
        
        // Clear previous error messages to start with a clean slate
        errorMessage.style.display = 'none';
        
        // Get and clean up input values
        // Trim removes whitespace from both ends of the string
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        // If no player name is provided, fall back to username
        const playerName = playerNameInput.value.trim() || username;
        
        // Basic validation - check for required fields
        if (!username || !password) {
          showError('Username and password are required');
          return; // Stop execution if validation fails
        }
        
        // Ensure password confirmation matches
        if (password !== confirmPassword) {
          showError('Passwords do not match');
          return; // Stop execution if validation fails
        }
        
        try {
          // Try to directly save just this one user without loading existing users
          // This bypasses potential issues with existing data
          // Individual storage approach for faster lookup when logging in
          const userKey = 'user_' + username; // Store each user separately with prefix
          const userData = {
            username: username,
            password: password, // NOTE: In production, passwords should be hashed
            playerName: playerName
          };
          
          // Save individual user record
          localStorage.setItem(userKey, JSON.stringify(userData));
          
          // Verify the user was saved properly by attempting to retrieve it
          // This ensures localStorage is working correctly
          const savedUserData = localStorage.getItem(userKey);
          if (!savedUserData) {
            throw new Error('Failed to save user data');
          }
          
          // Now also update the main users object for compatibility and redundancy
          // This approach allows for iterating through all users if needed
          // Get current users collection
          let users = {};
          try {
            const usersJson = localStorage.getItem('users');
            if (usersJson) {
              users = JSON.parse(usersJson);
            }
          } catch (e) {
            // Handle the case where users data might be corrupted
            console.error('Error parsing users:', e);
            users = {}; // Reset to empty object if corrupted
          }
          
          // Add user to the collection with username as key
          users[username] = {
            password: password, // NOTE: In production, passwords should be hashed
            playerName: playerName
          };
          
          // Save updated users collection back to localStorage
          localStorage.setItem('users', JSON.stringify(users));
          
          // Show success message and redirect to login page
          alert('Registration successful! Redirecting to login page...');
          window.location.href = 'test_login.html';
          
        } catch (error) {
          // Log detailed error to console for debugging
          console.error('Registration error:', error);
          // Show user-friendly error message on the page
          showError('Registration failed: ' + error.message);
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
 * 3. No protection against username conflicts beyond simple validation
 * 4. Limited validation of input data
 * 
 * For a production application, consider:
 * - Using server-side user management
 * - Implementing secure password hashing (bcrypt/Argon2)
 * - Adding more robust input validation and sanitization
 * - Using HTTPS for all data transmission
 */