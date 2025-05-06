document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      const errorMessage = document.getElementById('errorMessage');
      
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        
        errorMessage.style.display = 'none';
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !password) {
          showError('Please enter both username and password');
          return;
        }
        
        try {
          const userKey = 'user_' + username;
          const userDataJson = localStorage.getItem(userKey);
          
          if (userDataJson) {
            
            const userData = JSON.parse(userDataJson);
            
            if (userData.password === password) {
             
              localStorage.setItem('currentUser', username);
              localStorage.setItem('playerName', userData.playerName);
              console.log('Login successful from individual storage');
              window.location.href = 'test_game.html'; // Changed redirect to test_index.html
              return;
            }
          }
          
          // If not found in individual storage, check main users object
          const usersJson = localStorage.getItem('users');
          if (usersJson) {
            const users = JSON.parse(usersJson);
            
            if (users[username] && users[username].password === password) {
              // Login successful from users collection
              localStorage.setItem('currentUser', username);
              localStorage.setItem('playerName', users[username].playerName);
              console.log('Login successful from users collection');
              window.location.href = 'test_game.html'; // Changed redirect to test_index.html
              return;
            }
          }
          
          // If we get here, login failed
          showError('Invalid username or password');
          
        } catch (error) {
          console.error('Login error:', error);
          showError('Login failed: ' + error.message);
        }
      });
      
      function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
      }
    }
  });