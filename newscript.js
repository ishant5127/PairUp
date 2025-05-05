/**
 * Background Animation System for Card Matching Game
 * This script creates an interactive, animated background with floating cards and particles
 * that respond to user mouse movements, enhancing the visual appeal of the game.
 */

// Create and inject the canvas for particles and set up the entire background system
function setupParticleBackground() {
    // Create canvas element that will contain our particle animation
    // Using canvas for performance benefits over DOM elements
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-bg';
    document.body.prepend(canvas); // Add to body before other elements so it appears behind
    
    // Create gradient overlay to improve text readability against the animated background
    // This adds depth and a visual layer between content and animation
    const overlay = document.createElement('div');
    overlay.className = 'gradient-overlay';
    document.body.prepend(overlay);
    
    // Add decorative floating cards to reinforce the game's theme
    createFloatingCards();
    
    // Start particle animation system - creates the "constellation" effect
    initParticles();
}
  
// Create floating background cards that drift slowly across the screen
// These provide thematic consistency with the card matching gameplay
function createFloatingCards() {
    const body = document.body;
    const numberOfCards = 12; // Balance between visual interest and performance
    
    for (let i = 0; i < numberOfCards; i++) {
        const card = document.createElement('div');
        card.className = 'floating-card';
        
        // Random positioning across the entire viewport
        // Using percentage values ensures responsiveness on different screen sizes
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Random size variation creates depth perception
        // Larger cards appear closer, smaller ones further away
        const size = 40 + Math.random() * 70;
        
        // Random rotation adds to the floating effect and visual interest
        const rotation = Math.random() * 360;
        
        // Varied animation timing prevents synchronization
        // This creates a more natural, organic movement pattern
        const duration = 10 + Math.random() * 20; // How long each float cycle takes
        const delay = Math.random() * 8; // Staggered start times
        
        // Apply calculated styles to each card
        card.style.left = `${left}%`;
        card.style.top = `${top}%`;
        card.style.width = `${size}px`;
        card.style.height = `${size * 1.2}px`; // Maintains card aspect ratio
        card.style.transform = `rotate(${rotation}deg)`;
        card.style.animationDuration = `${duration}s`;
        card.style.animationDelay = `${delay}s`;
        
        body.appendChild(card);
    }
}
  
// Initialize the particle system that creates the connected dots effect
// This creates a network/constellation visual that responds to mouse movement
function initParticles() {
    const canvas = document.getElementById('particles-bg');
    const ctx = canvas.getContext('2d'); // Get 2D drawing context
    
    // Make canvas full screen for complete coverage
    // This ensures animation fills the entire viewport regardless of size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particle system configuration
    const particleCount = 100; // Balance between visual density and performance
    const particles = []; // Array to store all particle objects
    
    // Adjust canvas on window resize for responsive design
    // Prevents distortion when the browser window changes size
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Create particle objects with randomized properties
    // Each particle has position, size, color, movement vector, and opacity
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width, // Random horizontal position
            y: Math.random() * canvas.height, // Random vertical position
            radius: Math.random() * 3 + 1, // Varied size for visual interest
            color: getRandomColor(), // From our color palette
            speedX: Math.random() * 0.5 - 0.25, // Random horizontal velocity (-0.25 to 0.25)
            speedY: Math.random() * 0.5 - 0.25, // Random vertical velocity (-0.25 to 0.25)
            opacity: Math.random() * 0.5 + 0.2 // Semi-transparent appearance (0.2 to 0.7)
        });
    }
    
    // Generate random color from our game's color palette
    // Using a consistent palette keeps the animation on-brand
    function getRandomColor() {
        const colors = [
            '#4facfe', '#00f2fe', '#0af2f3', '#67e8f9', 
            '#22d3ee', '#a5f3fc', '#e0f2fe', '#bae6fd'
        ]; // Coordinated blue/teal palette
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Main animation loop for particles
    // Uses requestAnimationFrame for smooth, browser-optimized rendering
    function drawParticles() {
        // Clear previous frame to avoid trails (unless we want them)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Process and draw each particle
        particles.forEach(particle => {
            // Draw the particle as a circle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            
            // Update particle position based on its velocity vector
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap particles around screen edges for infinite animation
            // This creates the illusion of an endless field of particles
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
        });
        
        // Draw connecting lines between nearby particles
        // This creates a network/constellation effect
        connectParticles();
        
        // Schedule the next animation frame
        // This creates a smooth, continuous animation loop
        requestAnimationFrame(drawParticles);
    }
    
    // Connect particles with lines if they're close enough
    // Creates a network/constellation effect that enhances visual interest
    function connectParticles() {
        const maxDistance = 150; // Maximum distance for drawing connections
        
        // Check each particle pair for proximity
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                // Calculate distance between particles using Pythagorean theorem
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only draw lines between particles that are close enough
                if (distance < maxDistance) {
                    // Line opacity fades with distance - closer particles have stronger connections
                    const opacity = 1 - (distance / maxDistance);
                    
                    // Draw the connecting line
                    ctx.beginPath();
                    ctx.strokeStyle = particles[i].color;
                    ctx.globalAlpha = opacity * 0.2; // Subtle, semi-transparent lines
                    ctx.lineWidth = 0.5; // Thin lines for delicate appearance
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Add mouse interaction capabilities
    // Particles are attracted to mouse position, creating an interactive element
    let mouseX = 0;
    let mouseY = 0;
    
    // Track mouse position across the screen
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        
        // Apply attractive force to particles within range of mouse
        // Creates a magnetic effect where particles follow cursor
        particles.forEach(particle => {
            // Calculate distance between mouse and particle
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Only affect particles within a certain radius of mouse
            if (distance < 150) {
                // Calculate angle from particle to mouse (in radians)
                const angle = Math.atan2(dy, dx);
                const force = 0.1; // Strength of attraction
                
                // Apply force vector in direction of mouse
                particle.speedX += Math.cos(angle) * force;
                particle.speedY += Math.sin(angle) * force;
                
                // Limit maximum particle speed to prevent excessive velocity
                // This creates a more controlled, fluid animation
                const maxSpeed = 3;
                const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                
                if (speed > maxSpeed) {
                    // Normalize vector and apply max speed
                    particle.speedX = (particle.speedX / speed) * maxSpeed;
                    particle.speedY = (particle.speedY / speed) * maxSpeed;
                }
            }
            
            // Apply friction to gradually slow particles
            // This prevents perpetual acceleration and creates more natural movement
            particle.speedX *= 0.98; // 2% reduction per frame
            particle.speedY *= 0.98; // 2% reduction per frame
        });
    });
    
    // Begin the animation loop
    drawParticles();
}
  
// Initialize card flipping functionality for the game page
// This function serves as a bridge to the game mechanics
function initCardFlipping() {
    // This would be used in your game.html page
    // Left as placeholder for integration with your existing game logic
    // The actual implementation would handle card selection, flipping, and matching
}
  
// Event handler for the Start Game button on the landing page
// Validates player name input and redirects to the game page
document.getElementById('startBtn').addEventListener('click', () => {
    // Get player name and validate
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) {
        alert('Please enter your name before starting.');
        return;
    }
    // Store player name in browser's local storage for use in game and leaderboard
    localStorage.setItem('playerName', playerName);
    // Redirect player to the game page to begin playing
    window.location.href = 'test_game.html';
});
  
// Run setup when page finishes loading
// This ensures all DOM elements are available before we manipulate them
window.addEventListener('DOMContentLoaded', setupParticleBackground);