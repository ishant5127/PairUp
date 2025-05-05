document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const confirmPasswordInput = document.getElementById('confirmPassword');
      const playerNameInput = document.getElementById('playerName');
      const errorMessage = document.getElementById('errorMessage');
      
      // Initialize users in localStorage if it doesn't exist
      if (!localStorage.getItem('users')) {
        localStorage.setItem('users', '{}');
      }
      
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous error messages
        errorMessage.style.display = 'none';
        
        // Get input values
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const playerName = playerNameInput.value.trim() || username;
        
        // Basic validation
        if (!username || !password) {
          showError('Username and password are required');
          return;
        }
        
        if (password !== confirmPassword) {
          showError('Passwords do not match');
          return;
        }
        
        try {
          // Try to directly save just this one user without loading existing users
          // This bypasses potential issues with existing data
          const userKey = 'user_' + username; // Store each user separately
          const userData = {
            username: username,
            password: password,
            playerName: playerName
          };
          
          // Save individual user
          localStorage.setItem(userKey, JSON.stringify(userData));
          
          // Verify the user was saved properly
          const savedUserData = localStorage.getItem(userKey);
          if (!savedUserData) {
            throw new Error('Failed to save user data');
          }
          
          // Now also update the main users object for compatibility
          // Get current users
          let users = {};
          try {
            const usersJson = localStorage.getItem('users');
            if (usersJson) {
              users = JSON.parse(usersJson);
            }
          } catch (e) {
            console.error('Error parsing users:', e);
            users = {}; // Reset to empty object if corrupted
          }
          
          // Add user to the collection
          users[username] = {
            password: password,
            playerName: playerName
          };
          
          // Save updated users collection
          localStorage.setItem('users', JSON.stringify(users));
          
          // Show success and redirect
          alert('Registration successful! Redirecting to login page...');
          window.location.href = 'test_login.html';
          
        } catch (error) {
          console.error('Registration error:', error);
          showError('Registration failed: ' + error.message);
        }
      });
      
      function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
      }
    }
  });