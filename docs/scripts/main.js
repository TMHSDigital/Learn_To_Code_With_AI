document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupEventListeners();
    setupMobileMenu();
});

function initializeTheme() {
    // Check for user preference in localStorage first
    let theme = localStorage.getItem('theme');
    
    // If no theme is set in localStorage, check for system preference
    if (!theme) {
        // Check if user prefers dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme = 'dark';
        } else {
            theme = 'light';
        }
    }
    
    // Apply the theme
    document.body.dataset.theme = theme;
    updateThemeToggleButton(theme);
}

function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation class to cards when they become visible
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.tool-card, .example-card, .feature-card, .offering-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real implementation, this would send the form data to a server
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    // Add click events to example prompts
    document.querySelectorAll('.example-prompt').forEach(prompt => {
        prompt.addEventListener('click', () => {
            // Copy to clipboard functionality
            const text = prompt.textContent;
            navigator.clipboard.writeText(text)
                .then(() => {
                    // Show copy notification
                    const notification = document.createElement('div');
                    notification.className = 'copy-notification';
                    notification.textContent = 'Copied to clipboard!';
                    document.body.appendChild(notification);
                    
                    // Remove the notification after 2 seconds
                    setTimeout(() => {
                        notification.classList.add('fade-out');
                        setTimeout(() => {
                            document.body.removeChild(notification);
                        }, 300);
                    }, 2000);
                });
        });
    });
}

function setupMobileMenu() {
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '☰';
    mobileMenuToggle.setAttribute('aria-label', 'Toggle mobile menu');
    
    const logo = document.querySelector('.logo');
    if (logo && window.innerWidth <= 992) {
        const navContainer = document.querySelector('.nav-container');
        navContainer.insertBefore(mobileMenuToggle, logo.nextSibling);
        
        mobileMenuToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-nav-open');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('mobile-nav-open') && 
            !e.target.closest('.main-nav') && 
            !e.target.closest('.mobile-menu-toggle')) {
            document.body.classList.remove('mobile-nav-open');
        }
    });
}

function toggleTheme() {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Apply theme change with animation
    document.body.classList.add('theme-transition');
    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeToggleButton(newTheme);
    
    // Remove transition class after animation completes
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
}

function updateThemeToggleButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        themeToggle.setAttribute('aria-label', 
            theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
        );
        themeToggle.setAttribute('title',
            theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
        );
    }
} 