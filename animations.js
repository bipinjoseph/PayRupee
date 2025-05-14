// Animations JavaScript for PayRupee

document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();

    // Initialize hero animations
    animateHero();

    // Initialize feature card animations
    animateFeatureCards();
});

// Function to initialize scroll animations
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-animate');

    // Check if element is in viewport
    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    };

    // Add visible class to elements in viewport
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    // Hide elements not in viewport
    const hideScrollElement = (element) => {
        element.classList.remove('visible');
    };

    // Check all elements on scroll
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (isElementInViewport(el)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    // Add scroll event listener
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // Check elements on initial load
    handleScrollAnimation();
}

// Function to animate hero section
function animateHero() {
    const heroText = document.querySelector('.hero-text h1');
    const heroParagraph = document.querySelector('.hero-text p');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroImage = document.querySelector('.hero-image');

    if (heroText) heroText.classList.add('animate', 'slide-in-left');
    if (heroParagraph) {
        heroParagraph.classList.add('animate', 'slide-in-left', 'delay-200');
    }
    if (heroButtons) {
        heroButtons.classList.add('animate', 'slide-in-left', 'delay-400');
    }
    if (heroImage) {
        heroImage.classList.add('animate', 'slide-in-right', 'delay-200');
    }
}

// Function to animate feature cards
function animateFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach((card, index) => {
        card.classList.add('scroll-animate', 'from-bottom');
        // Add a slight delay for each card
        card.style.transitionDelay = `${index * 100}ms`;
    });
}

// Add pulse animation to CTA button
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta .btn-primary');
    if (ctaButton) {
        ctaButton.classList.add('animate', 'pulse');
    }
});

// Add hover effects to testimonial cards
document.addEventListener('DOMContentLoaded', function() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow)';
        });
    });
});

// Add animation to steps in How It Works section
document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('.step');

    steps.forEach((step, index) => {
        step.classList.add('scroll-animate', 'scale');
        // Add a slight delay for each step
        step.style.transitionDelay = `${index * 200}ms`;
    });
});
