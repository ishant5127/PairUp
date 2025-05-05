// test_about.js - JavaScript for the Card Pair Matching About Page

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkUserLoggedIn();
    
    // Initialize any interactive elements
    initializeInteractions();
    
    // Handle navigation highlighting
    highlightCurrentNav();
});

/**
 * Check if a user is currently logged in and update UI accordingly
 */
function checkUserLoggedIn() {
    // Get user info from localStorage if it exists
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        try {
            const userObj = JSON.parse(currentUser);
            // You could update UI here to show logged-in state
            console.log('User logged in:', userObj.displayName || userObj.username);
            
            // If you want to add a personalized welcome or logged-in indicator
            // For example, adding a small user indicator in the nav
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                const loginLink = document.querySelector('.nav-links a[href="test_login.html"]');
                if (loginLink) {
                    // Replace login link with username and logout option
                    const li = loginLink.parentElement;
                    li.innerHTML = `<span>Hi, ${userObj.displayName || userObj.username}</span> | <a href="#" id="logoutBtn">Logout</a>`;
                    
                    // Add logout functionality
                    document.getElementById('logoutBtn').addEventListener('click', function(e) {
                        e.preventDefault();
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('userScores');
                        alert('You have been logged out successfully.');
                        window.location.href = 'test_index.html';
                    });
                }
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('currentUser'); // Clear invalid data
        }
    }
}

/**
 * Initialize interactive elements on the about page
 */
function initializeInteractions() {
    // Team member hover effects
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Highlight the current page in the navigation
 */
function highlightCurrentNav() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop();
    
    // Find matching nav link and add active class
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
            link.style.fontWeight = 'bold';
            link.style.textDecoration = 'underline';
        }
    });
}

/**
 * Handle form submissions for contact or newsletter if they exist
 */
function handleFormSubmissions() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Here you would normally send data to server
            console.log('Form submitted:', formDataObj);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
}

// Add a simple animation effect for sections when they come into view
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.about-section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionBottom = section.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        // Check if section is in viewport
        if (sectionTop < windowHeight * 0.75 && sectionBottom > 0) {
            if (!section.classList.contains('visible')) {
                section.classList.add('visible');
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        }
    });
});

// Initialize sections with starting styles for animation
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.about-section');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Trigger scroll event to check initially visible sections
    window.dispatchEvent(new Event('scroll'));
});