// GSAP Hero Section Animations
document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Loading from CDN...');
        loadGSAP();
        return;
    }
    
    initHeroAnimations();
});

function loadGSAP() {
    // Load GSAP from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = function() {
        // Load ScrollTrigger plugin
        const scrollTriggerScript = document.createElement('script');
        scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
        scrollTriggerScript.onload = function() {
            gsap.registerPlugin(ScrollTrigger);
            initHeroAnimations();
        };
        document.head.appendChild(scrollTriggerScript);
    };
    document.head.appendChild(script);
}

function initHeroAnimations() {
    // Set up GSAP defaults
    gsap.set(".hero-animate", { opacity: 0, y: 50 });
    
    // Create the main timeline
    const heroTimeline = gsap.timeline({ 
        defaults: { 
            ease: "power3.out",
            duration: 1
        }
    });

    // Background decoration animations
    const backgroundElements = document.querySelectorAll('.hero-section .absolute.opacity-10 > div');
    backgroundElements.forEach((el, index) => {
        gsap.set(el, { scale: 0, opacity: 0 });
        heroTimeline.to(el, {
            scale: 1,
            opacity: 0.1,
            duration: 1.5,
            ease: "back.out(1.7)",
            delay: index * 0.3
        }, 0);
    });

    // Profile image container animation
    const profileContainer = document.querySelector('.hero-section .lg\\:w-1\\/2 .relative');
    if (profileContainer) {
        gsap.set(profileContainer, { scale: 0.8, opacity: 0, rotation: -10 });
        heroTimeline.to(profileContainer, {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 1.2,
            ease: "back.out(1.7)"
        }, 0.2);
    }

    // Image glow effect
    const imageGlow = document.querySelector('.hero-section .absolute.-z-10 .bg-gradient-to-br');
    if (imageGlow) {
        gsap.set(imageGlow, { scale: 0.5, opacity: 0 });
        heroTimeline.to(imageGlow, {
            scale: 1,
            opacity: 0.2,
            duration: 2,
            ease: "power2.out"
        }, 0.5);
    }

    // Location badge animation
    const locationBadge = document.querySelector('.hero-section .absolute.-bottom-4.-right-4');
    if (locationBadge) {
        gsap.set(locationBadge, { scale: 0, opacity: 0, y: 20 });
        heroTimeline.to(locationBadge, {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        }, 1.2);
    }

    // Text content animations
    const textElements = [
        '.hero-section .hero-text-element:nth-child(1)', // "Hello, I'm"
        '.hero-section .hero-name', // Name
        '.hero-section .typewriter', // Tagline
        '.hero-section .hero-text-element:nth-child(4)', // Description
        '.hero-section .hero-text-element:nth-child(5)', // Buttons
        '.hero-section .hero-text-element:nth-child(6)' // Social links
    ];

    textElements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            gsap.set(element, { opacity: 0, y: 30 });
            heroTimeline.to(element, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out"
            }, 0.8 + (index * 0.15));
        }
    });

    // Floating animation for profile image
    const profileImage = document.querySelector('.hero-section img');
    if (profileImage) {
        gsap.to(profileImage, {
            y: -10,
            duration: 3,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });
    }

    // Continuous background animation
    const backgroundContainer = document.querySelector('.hero-section .absolute.inset-0');
    if (backgroundContainer) {
        gsap.to(backgroundContainer, {
            rotation: 360,
            duration: 60,
            ease: "none",
            repeat: -1
        });
    }

    // Interactive hover animations
    initInteractiveAnimations();
    
    // Scroll-triggered animations
    initScrollAnimations();
}

function initInteractiveAnimations() {
    // Button hover effects
    const buttons = document.querySelectorAll('.hero-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Social icons hover effects
    const socialIcons = document.querySelectorAll('.hero-section .space-x-6 a');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                scale: 1.2,
                rotation: 10,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        });
        
        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Profile image hover effect
    const profileContainer = document.querySelector('.hero-section .lg\\:w-1\\/2 .relative');
    if (profileContainer) {
        profileContainer.addEventListener('mouseenter', () => {
            gsap.to(profileContainer, {
                scale: 1.02,
                rotation: 2,
                duration: 0.5,
                ease: "power2.out"
            });
        });
        
        profileContainer.addEventListener('mouseleave', () => {
            gsap.to(profileContainer, {
                scale: 1,
                rotation: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    }
}

function initScrollAnimations() {
    // Parallax effect for background elements
    const backgroundElements = document.querySelectorAll('.hero-section .absolute.opacity-10 > div');
    backgroundElements.forEach((el, index) => {
        gsap.to(el, {
            y: (index + 1) * 20,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Text parallax effect
    const textContent = document.querySelector('.hero-section .lg\\:w-1\\/2');
    if (textContent) {
        gsap.to(textContent, {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }
}

// Enhanced typing effect with GSAP
function initTypingEffect() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;

    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    typewriterElement.style.borderRight = '2px solid #93c5fd';

    const chars = text.split('');
    const timeline = gsap.timeline({ delay: 1.5 });

    chars.forEach((char, index) => {
        timeline.to(typewriterElement, {
            duration: 0.05,
            onUpdate: function() {
                typewriterElement.textContent = chars.slice(0, index + 1).join('');
            }
        });
    });

    // Blinking cursor effect
    gsap.to(typewriterElement, {
        borderRightColor: 'transparent',
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initTypingEffect, 2000);
});

// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
}); 