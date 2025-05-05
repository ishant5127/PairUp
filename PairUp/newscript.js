// Create and inject the canvas for particles
function setupParticleBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-bg';
    document.body.prepend(canvas);
    
    // Create gradient overlay
    const overlay = document.createElement('div');
    overlay.className = 'gradient-overlay';
    document.body.prepend(overlay);
    
    // Create floating cards with glow effect
    createFloatingCards();
    
    // Initialize particle animation
    initParticles();
  }
  
  // Create floating background cards
  function createFloatingCards() {
    const body = document.body;
    const numberOfCards = 12;
    
    for (let i = 0; i < numberOfCards; i++) {
      const card = document.createElement('div');
      card.className = 'floating-card';
      
      // Random positioning
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      // Random size variation
      const size = 40 + Math.random() * 70;
      
      // Random rotation
      const rotation = Math.random() * 360;
      
      // Random animation duration and delay
      const duration = 10 + Math.random() * 20;
      const delay = Math.random() * 8;
      
      // Apply styles
      card.style.left = `${left}%`;
      card.style.top = `${top}%`;
      card.style.width = `${size}px`;
      card.style.height = `${size * 1.2}px`;
      card.style.transform = `rotate(${rotation}deg)`;
      card.style.animationDuration = `${duration}s`;
      card.style.animationDelay = `${delay}s`;
      
      body.appendChild(card);
    }
  }
  
  // Initialize particles
  function initParticles() {
    const canvas = document.getElementById('particles-bg');
    const ctx = canvas.getContext('2d');
    
    // Make canvas full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particle properties
    const particleCount = 100;
    const particles = [];
    
    // Handle resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: getRandomColor(),
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    // Generate random color
    function getRandomColor() {
      const colors = [
        '#4facfe', '#00f2fe', '#0af2f3', '#67e8f9', 
        '#22d3ee', '#a5f3fc', '#e0f2fe', '#bae6fd'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Draw particles
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      // Connect nearby particles with lines
      connectParticles();
      
      requestAnimationFrame(drawParticles);
    }
    
    // Connect particles with lines if they're close enough
    function connectParticles() {
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            // Calculate opacity based on distance
            const opacity = 1 - (distance / maxDistance);
            
            ctx.beginPath();
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = opacity * 0.2;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Add some interactivity - particles follow mouse
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      
      // Attract particles to mouse
      particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const angle = Math.atan2(dy, dx);
          const force = 0.1;
          
          particle.speedX += Math.cos(angle) * force;
          particle.speedY += Math.sin(angle) * force;
          
          // Limit max speed
          const maxSpeed = 3;
          const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
          
          if (speed > maxSpeed) {
            particle.speedX = (particle.speedX / speed) * maxSpeed;
            particle.speedY = (particle.speedY / speed) * maxSpeed;
          }
        }
        
        // Add friction
        particle.speedX *= 0.98;
        particle.speedY *= 0.98;
      });
    });
    
    // Start animation
    drawParticles();
  }
  
  // Initialize card flipping functionality 
  function initCardFlipping() {
    // This would be used in your game.html page
    // Left as placeholder for integration with your existing game logic
  }
  
  // Original code for the start button
  document.getElementById('startBtn').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) {
      alert('Please enter your name before starting.');
      return;
    }
    // Store player name in local storage
    localStorage.setItem('playerName', playerName);
    // Redirect to the game page
    window.location.href = 'test_game.html';
  });
  
  // Run setup on page load
  window.addEventListener('DOMContentLoaded', setupParticleBackground);