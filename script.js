
// DOM Content Loaded event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    init();
});

function init() {
    try {
        // Set up navigation
        setupNavigation();
        
        // Set up form handling
        setupFormHandling();
        
        // Set up demo button
        setupDemoButton();
        
        // Show home section by default
        showSection('home');
        
        console.log('Website initialized successfully');
    } catch (error) {
        console.error('Error initializing website:', error);
        showError('Failed to initialize website properly');
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
}

function showSection(sectionId) {
    try {
        // Hide all sections
        const sections = document.querySelectorAll('main section');
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        } else {
            console.error(`Section with id "${sectionId}" not found`);
            showError(`Page not found: ${sectionId}`);
            // Fallback to home section
            const homeSection = document.getElementById('home');
            if (homeSection) {
                homeSection.classList.remove('hidden');
            }
        }
    } catch (error) {
        console.error('Error showing section:', error);
        showError(`Failed to display section: ${sectionId}`);
    }
}

function setupFormHandling() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    }
}

function handleFormSubmit(form) {
    try {
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Validate form data
        if (!validateForm(name, email, message)) {
            return;
        }
        
        // Simulate form submission
        console.log('Form submitted:', { name, email, message });
        
        // Show success message
        showSuccess('Message sent successfully!');
        
        // Reset form
        form.reset();
        
        // Clear any previous error messages
        const existingErrors = document.querySelectorAll('.error');
        existingErrors.forEach(error => error.remove());
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showError('Failed to send message. Please try again.');
    }
}

function validateForm(name, email, message) {
    const errors = [];
    
    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!email || !isValidEmail(email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!message || message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        showError(errors.join('. '));
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setupDemoButton() {
    const demoBtn = document.getElementById('demo-btn');
    
    if (demoBtn) {
        demoBtn.addEventListener('click', function() {
            try {
                const messages = [
                    'Hello! Welcome to my website!',
                    'This is a demo button.',
                    'The website is working perfectly!',
                    'Thanks for clicking!'
                ];
                
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                showSuccess(randomMessage);
                
            } catch (error) {
                console.error('Error with demo button:', error);
                showError('Demo button encountered an error');
            }
        });
    }
}

function showError(message) {
    showMessage(message, 'error');
}

function showSuccess(message) {
    showMessage(message, 'success');
}

function showMessage(message, type) {
    try {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.error, .success');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message element
        const messageEl = document.createElement('div');
        messageEl.className = type;
        messageEl.textContent = message;
        
        // Insert message at the top of the main content
        const main = document.querySelector('main');
        main.insertBefore(messageEl, main.firstChild);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
        
    } catch (error) {
        console.error('Error showing message:', error);
    }
}

// Error handling for uncaught errors
window.addEventListener('error', function(e) {
    console.error('Uncaught error:', e.error);
    showError('An unexpected error occurred. Please refresh the page.');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showError('A background process failed. Some features may not work properly.');
});
