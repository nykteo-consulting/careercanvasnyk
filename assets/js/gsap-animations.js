// GSAP Animations System - Optimized and Consolidated

// Configuration object for all animations
const ANIMATION_CONFIG = {
    hero: {
        diagonalLines: { count: 4, opacity: 0.6, scaleX: 1.5 },
        splineCurves: { count: 3, opacity: 0.4, scale: 1.2 }
    },
    about: {
        diagonalLines: { count: 1, opacity: 0.4, scaleX: 1.2, duration: 3.0, rotationDuration: 6 },
        splineCurves: { count: 1, opacity: 0.3, scale: 1.05, duration: 4.0, rotationDuration: 8 }
    },
    technical: {
        diagonalLines: { count: 2, opacity: 0.3, scaleX: 1.2, duration: 4.0, rotationDuration: 8 },
        splineCurves: { count: 1, opacity: 0.2, scale: 1.1, duration: 5.0, rotationDuration: 10 }
    }
};

// Common animation properties - Expanded for better reuse
const COMMON_ANIMATIONS = {
    fadeIn: { opacity: 1, y: 0, rotationX: 0, duration: 0.8, ease: "power2.out" },
    fadeOut: { opacity: 0, y: 30, rotationX: -10, duration: 0.4, ease: "power2.out" },
    hover: { scale: 1.05, duration: 0.3, ease: "power2.out" },
    reset: { scale: 1, y: 0, duration: 0.3, ease: "power2.out" },
    
    // Scroll animations
    scrollEnter: { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
    scrollLeave: { opacity: 0.3, y: -20, scale: 0.98, duration: 0.4, ease: "power2.out" },
    scrollLeaveBack: { opacity: 0.3, y: 20, scale: 0.98, duration: 0.4, ease: "power2.out" },
    
    // Card animations
    cardEnter: { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" },
    cardLeave: { opacity: 0.3, y: -20, scale: 0.98, duration: 0.4, ease: "power2.out" }
};

// Utility functions
const Utils = {
    // Create container with fallback
    createContainer: (parent, className, fallback) => {
        return parent.querySelector(className) || (() => {
            const container = document.createElement('div');
            container.className = fallback;
            parent.appendChild(container);
            return container;
        })();
    },

    // Random position generator
    randomPosition: (min = 10, max = 90) => ({
        x: Math.random() * (max - min) + min,
        y: Math.random() * (max - min) + min
    }),

    // Create ScrollTrigger with common settings
    createScrollTrigger: (trigger, options = {}) => {
        const defaults = {
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        };
        return ScrollTrigger.create({ ...defaults, ...options, trigger });
    },


    
    // Unified ScrollTrigger batch creation
    createScrollTriggerBatch: (elements, options = {}) => {
        const defaults = {
            start: "top 85%",
            end: "bottom 15%",
            onEnter: (elements) => {
                elements.forEach((el, index) => {
                    const delay = el.dataset.animateDelay ? parseInt(el.dataset.animateDelay) : index * 100;
                    gsap.fromTo(el, 
                        { opacity: 0, y: 30, scale: 0.95 },
                        { ...COMMON_ANIMATIONS.scrollEnter, delay: delay / 1000 }
                    );
                });
            },
            onEnterBack: (elements) => {
                elements.forEach(el => gsap.to(el, COMMON_ANIMATIONS.cardEnter));
            },
            onLeave: (elements) => {
                elements.forEach(el => gsap.to(el, COMMON_ANIMATIONS.scrollLeave));
            },
            onLeaveBack: (elements) => {
                elements.forEach(el => gsap.to(el, COMMON_ANIMATIONS.scrollLeaveBack));
            }
        };
        
        return ScrollTrigger.batch(elements, { ...defaults, ...options });
    },
    
    // Unified hover effects creation - Fixed to properly reset elements
    createHoverEffects: (elements, config) => {
        const { enter = {}, leave = {} } = config;
        
        elements.forEach(element => {
            // Store original state using GSAP
            const originalState = {};
            ['scale', 'y', 'rotation', 'opacity'].forEach(prop => {
                if (enter[prop] !== undefined) {
                    originalState[prop] = gsap.getProperty(element, prop);
                }
            });
            
            element.addEventListener('mouseenter', () => {
                gsap.to(element, { ...enter, overwrite: true });
            });
            
            element.addEventListener('mouseleave', () => {
                // Reset to original state
                gsap.to(element, { 
                    ...leave, 
                    overwrite: true,
                    onComplete: () => {
                        // Ensure we're back to original state for all properties
                        Object.entries(originalState).forEach(([prop, value]) => {
                            gsap.set(element, { [prop]: value });
                        });
                    }
                });
            });
        });
    }
};

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Loading from CDN...');
        loadGSAP();
        return;
    }
    
    initializeAllAnimations();
});

// GSAP loader with fallback
function loadGSAP() {
    const loadScript = (src, fallback, onLoad) => {
        console.log(`Loading GSAP from: ${src}`);
        const script = document.createElement('script');
        script.src = src;
        script.onerror = (error) => {
            console.warn(`Failed to load GSAP from ${src}, trying fallback: ${fallback}`);
            const fallbackScript = document.createElement('script');
            fallbackScript.src = fallback;
            fallbackScript.onload = () => {
                console.log('GSAP loaded from fallback successfully');
                onLoad();
            };
            fallbackScript.onerror = (fallbackError) => {
                console.error('Both GSAP sources failed to load:', error, fallbackError);
            };
            document.head.appendChild(fallbackScript);
        };
        script.onload = () => {
            console.log('GSAP loaded successfully from primary source');
            onLoad();
        };
        document.head.appendChild(script);
    };

    loadScript('/js/gsap.min.js', 
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js',
        () => loadScrollTrigger());
}

function loadScrollTrigger() {
    const loadScript = (src, fallback, onLoad) => {
        console.log(`Loading ScrollTrigger from: ${src}`);
        const script = document.createElement('script');
        script.src = src;
        script.onerror = (error) => {
            console.warn(`Failed to load ScrollTrigger from ${src}, trying fallback: ${fallback}`);
            const fallbackScript = document.createElement('script');
            fallbackScript.src = fallback;
            fallbackScript.onload = () => {
                console.log('ScrollTrigger loaded from fallback successfully');
                try {
                    gsap.registerPlugin(ScrollTrigger);
                    onLoad();
                } catch (e) {
                    console.error('Failed to register ScrollTrigger plugin:', e);
                }
            };
            fallbackScript.onerror = (fallbackError) => {
                console.error('Both ScrollTrigger sources failed to load:', error, fallbackError);
            };
            document.head.appendChild(fallbackScript);
        };
        script.onload = () => {
            console.log('ScrollTrigger loaded successfully from primary source');
            try {
                gsap.registerPlugin(ScrollTrigger);
                onLoad();
            } catch (e) {
                console.error('Failed to register ScrollTrigger plugin:', e);
            }
        };
        document.head.appendChild(script);
    };

    loadScript('/js/ScrollTrigger.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js',
        initializeAllAnimations);
}

// Main initialization function
function initializeAllAnimations() {
    console.log('Initializing all animations...');
    
    // Initialize core systems
    initHeroAnimations();
    initUniversalAnimations();
    initScrollAnimations();
    
    // Initialize section-specific animations with consolidated timing
    const initSequence = [
        { fn: () => { initAboutAnimations(); initSectionBackgroundAnimations('.about-section', ANIMATION_CONFIG.about); }, delay: 100 },
        { fn: () => { initTechnicalAnimations(); initSectionBackgroundAnimations('#technical', ANIMATION_CONFIG.technical); }, delay: 200 },
        { fn: () => { initExperienceAnimations(); }, delay: 300 },
        { fn: () => { 
            initSkillsAnimations();
            if (document.querySelector('[data-animation="404-image"]')) {
                init404Animations();
            }
        }, delay: 400 }
    ];
    
    // Execute initialization sequence
    initSequence.forEach(({ fn, delay }) => setTimeout(fn, delay));
    
    // Initialize navigation and scrolling immediately
    initNavigationHighlighting();
    initSmoothScrolling();
    
    // Initialize typing effect with delay
    setTimeout(() => initTypingEffect(), 2000);
}

// Hero section animations
function initHeroAnimations() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    console.log('🎯 Initializing hero animations...');
    
    setInitialStates(heroSection);
    initHeroScrollTrigger(heroSection);
    initFloatingAnimations(heroSection);
    initMouseTracking(heroSection);
    initSectionBackgroundAnimations('.hero-section', ANIMATION_CONFIG.hero);
    
    // Ensure hero animation plays immediately on page load
    console.log('⏰ Scheduling hero animation in 200ms...');
    setTimeout(() => {
        console.log('🚀 Playing hero animation...');
        playHeroAnimation(heroSection);
    }, 200);
}

function setInitialStates(section) {
    const configs = [
        // Text elements
        { selector: '[data-animation]:not([data-animation="profile-image"]):not([data-animation="location-badge"])', props: { opacity: 0, y: 50, rotationX: -15 } },
        // Profile image and location badge - set to initial animation states
        { selector: '[data-animation="profile-image"]', props: { opacity: 0, scale: 0.8, rotationY: -15, y: 30 } },
        { selector: '[data-animation="location-badge"]', props: { opacity: 0, y: 20, scale: 0.8 } },
        // Background decorations
        { selector: '.absolute.opacity-10 > div', props: { opacity: 0, scale: 0.5, rotation: -180 } }
    ];

    configs.forEach(({ selector, props }) => {
        const elements = section.querySelectorAll(selector);
        if (elements.length > 0) gsap.set(elements, props);
    });
}



function initHeroScrollTrigger(heroSection) {
    // Create ScrollTrigger for navigation-based animations
    Utils.createScrollTrigger(heroSection, {
        id: "hero-section-trigger",
        onEnter: () => playHeroAnimation(heroSection),
        onEnterBack: () => playHeroAnimation(heroSection)
    });
}

function playHeroAnimation(heroSection) {
    console.log('🎬 playHeroAnimation called');
    
    console.log('✅ Starting hero animation...');
    
    // Get elements (initial states already set by setInitialStates)
    const textElements = heroSection.querySelectorAll('[data-animation]:not([data-animation="profile-image"]):not([data-animation="location-badge"])');
    const profileImage = heroSection.querySelector('[data-animation="profile-image"]');
    const locationBadge = heroSection.querySelector('[data-animation="location-badge"]');
    const bgDecorations = heroSection.querySelectorAll('.absolute.opacity-10 > div');

    console.log('🔍 Found elements:', {
        textElements: textElements.length,
        profileImage: !!profileImage,
        locationBadge: !!locationBadge,
        bgDecorations: bgDecorations.length
    });

    const tl = gsap.timeline({
        onComplete: () => {
            console.log('🎉 Hero animation completed!');
        }
    });
    
    // Animate profile image first, then text elements, then location badge, then background decorations
    tl.to(profileImage, { opacity: 1, scale: 1, rotationY: 0, y: 0, duration: 1.2, ease: "back.out(1.7)" })
      .to(textElements, { ...COMMON_ANIMATIONS.fadeIn, stagger: 0.15 }, "-=0.8")
      .to(locationBadge, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }, "-=0.6")
      .to(bgDecorations, { opacity: 0.1, scale: 1, rotation: 0, duration: 1, stagger: 0.1 }, "-=0.8");
}

function initFloatingAnimations(heroSection) {
    // Profile image no longer has continuous bouncing - only initial entrance animation
    // const profileImage = heroSection.querySelector('[data-animation="profile-image"]');
    // if (profileImage) {
    //     gsap.to(profileImage, { y: -10, duration: 2, ease: "power1.inOut", yoyo: true, repeat: -1 });
    // }

    const backgroundCircles = heroSection.querySelectorAll('.absolute.opacity-10 > div');
    backgroundCircles.forEach((circle, index) => {
        const delay = index * 0.5;
        const floatX = (Math.random() - 0.5) * 40;
        const floatY = (Math.random() - 0.5) * 30;
        const floatDuration = 3 + Math.random() * 2;
        
        gsap.timeline({ repeat: -1, yoyo: true, delay })
            .to(circle, { x: floatX, y: floatY, duration: floatDuration, ease: "power1.inOut" });
        
        gsap.to(circle, { rotation: 360, duration: 8 + Math.random() * 4, ease: "none", repeat: -1, delay });
        circle.setAttribute('data-natural-animation', 'true');
    });
}

// Mouse tracking system - Optimized with throttling
function initMouseTracking(heroSection) {
    let mouseX = 0, mouseY = 0, isInHero = false;
    let updateTimeout = null;
    const throttleDelay = 16; // ~60fps

    const events = {
        mouseenter: () => { 
            isInHero = true; 
            updateMouseEffects(); 
        },
        mouseleave: () => { 
            isInHero = false; 
            resetMouseEffects(); 
        },
        mousemove: (e) => {
            if (!isInHero) return;
            const rect = heroSection.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top) / rect.height;
            
            // Throttle updates for better performance
            if (!updateTimeout) {
                updateTimeout = setTimeout(() => {
                    updateMouseEffects();
                    updateTimeout = null;
                }, throttleDelay);
            }
        }
    };

    Object.entries(events).forEach(([event, handler]) => {
        heroSection.addEventListener(event, handler);
    });

    function updateMouseEffects() {
        if (!isInHero) return;
        
        const normalizedX = (mouseX - 0.5) * 2;
        const normalizedY = (mouseY - 0.5) * 2;
        
        // Animate different element types with different sensitivities
        const elementTypes = [
            { selector: '[data-animation="profile-image"]', sensitivity: { x: 20, y: 15, rotateX: 12, rotateY: 15 } },
            { selector: '.morphing-shape', sensitivity: { x: 40, y: 30, rotate: 25, scale: 0.2 } },
            { selector: '.diagonal-line', sensitivity: { x: 25, y: 20, rotate: 15, scale: 0.1 } },
            { selector: '.spline-curve', sensitivity: { x: 15, y: 12, rotate: 8, scale: 0.05 } }
        ];

        elementTypes.forEach(({ selector, sensitivity }) => {
            const elements = heroSection.querySelectorAll(selector);
            elements.forEach((el, index) => {
                if (el.hasAttribute('data-natural-animation')) return;
                
                const multiplier = index + 1;
                gsap.to(el, {
                    x: normalizedX * (sensitivity.x + index * 8),
                    y: normalizedY * (sensitivity.y + index * 6),
                    rotation: normalizedX * (sensitivity.rotate + index * 5),
                    scale: 1 + Math.abs(normalizedX + normalizedY) * (sensitivity.scale + index * 0.05),
                    duration: 1.2 + index * 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Glow effect
        const glowIntensity = Math.abs(normalizedX + normalizedY) * 0.3;
        gsap.to(heroSection, {
            boxShadow: `0 0 ${20 + glowIntensity * 50}px var(--color-primary-light)`,
            duration: 0.5,
            ease: "power2.out"
        });
    }

    function resetMouseEffects() {
        const elementsToReset = heroSection.querySelectorAll('.morphing-shape, .diagonal-line, .spline-curve, [data-animation="profile-image"]');
        const resetElements = Array.from(elementsToReset).filter(el => !el.hasAttribute('data-natural-animation'));
        
        gsap.to(resetElements, {
            x: 0, y: 0, rotationX: 0, rotationY: 0, rotation: 0, scale: 1, scaleX: 1,
            duration: 0.8, ease: "power2.out"
        });
        
        gsap.to(heroSection, { boxShadow: 'none', duration: 0.5, ease: "power2.out" });
    }
}

// About section animations
function initAboutAnimations() {
    const aboutSection = document.querySelector('.about-section');
    if (!aboutSection) return;

    setAboutInitialStates(aboutSection);
    
    Utils.createScrollTrigger(aboutSection, {
        id: "about-section-trigger",
        onEnter: () => playAboutAnimation(aboutSection),
        onEnterBack: () => playAboutAnimation(aboutSection)
    });
}

function setAboutInitialStates(section) {
    const textElements = section.querySelectorAll('[data-animation]');
    const aboutCard = section.querySelector('.about-card');
    
    gsap.set(textElements, { opacity: 0, y: 30, rotationX: -10 });
    if (aboutCard) gsap.set(aboutCard, { opacity: 0, scale: 0.9, y: 50 });
}

function playAboutAnimation(section) {
    setAboutInitialStates(section);
    
    const tl = gsap.timeline();
    const title = section.querySelector('[data-animation="title"]');
    const intro = section.querySelector('[data-animation="intro"]');
    const aboutCard = section.querySelector('.about-card');
    const factsTitle = section.querySelector('[data-animation="facts-title"]');
    const factCards = section.querySelectorAll('[data-animation^="fact-"]');

    if (title) tl.to(title, COMMON_ANIMATIONS.fadeIn);
    if (intro) tl.to(intro, COMMON_ANIMATIONS.fadeIn, "-=0.4");
    if (aboutCard) tl.to(aboutCard, { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.6");
    if (factsTitle) tl.to(factsTitle, COMMON_ANIMATIONS.fadeIn, "-=0.8");
    tl.to(factCards, { ...COMMON_ANIMATIONS.fadeIn, stagger: 0.15 }, "-=0.6");
}

// Technical section animations
function initTechnicalAnimations() {
    const technicalSection = document.querySelector('#technical');
    if (!technicalSection) return;
    
    const technicalCards = technicalSection.querySelectorAll('.tech-skill-card');
    const skillIcons = technicalSection.querySelectorAll('[data-animation="skill-icon"]');
    
    // Set initial states for technical cards to ensure they're visible
    gsap.set(technicalCards, { opacity: 1, y: 0, scale: 1 });
    
    // Initialize card hover effects
    initCardHoverEffects(technicalCards, 'technical');
    
    // Add skill icon hover animations using unified hover system
    Utils.createHoverEffects(skillIcons, {
        enter: { scale: 1.15, rotation: 5, duration: 0.3, ease: "back.out(1.7)" },
        leave: { scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" }
    });
    
    // Create a dedicated scroll trigger for technical cards using unified function
    Utils.createScrollTriggerBatch(technicalCards, {
        onEnter: (elements) => {
            elements.forEach((el, index) => {
                const delay = el.dataset.animateDelay ? parseInt(el.dataset.animateDelay) : index * 100;
                gsap.fromTo(el, 
                    { opacity: 0, y: 30, scale: 0.95 },
                    { ...COMMON_ANIMATIONS.scrollEnter, delay: delay / 1000 }
                );
            });
        }
    });
}

// Experience section animations
function initExperienceAnimations() {
    const experienceSection = document.querySelector('#experience');
    if (!experienceSection) return;
    
    // Simple fade-in animations for timeline items
    const timelineItems = experienceSection.querySelectorAll('.timeline-item');
    
    // Set initial states - just fade in, no sliding
    gsap.set(timelineItems, { opacity: 0, y: 20 });
    
    // More responsive scroll trigger - trigger earlier and animate faster
    Utils.createScrollTriggerBatch(timelineItems, {
        start: "top 90%", // Trigger when element is 90% from top (earlier)
        onEnter: (elements) => {
            elements.forEach((element, index) => {
                gsap.to(element, { 
                    opacity: 1,
                    y: 0,
                    duration: 0.4, // Faster animation
                    delay: index * 0.05, // Shorter delay between items
                    ease: "power2.out"
                });
            });
        },
        onEnterBack: (elements) => {
            elements.forEach(element => {
                gsap.to(element, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
            });
        }
    });
    
    // Simple hover effects for cards
    const companyCards = experienceSection.querySelectorAll('.company-card');
    const achievementCards = experienceSection.querySelectorAll('.achievements-card');
    
    initCardHoverEffects(companyCards, 'experience');
    initCardHoverEffects(achievementCards, 'experience');
}

// Skills section animations
function initSkillsAnimations() {
    const skillsSection = document.querySelector('#skills');
    if (!skillsSection) return;
    
    const skillCards = skillsSection.querySelectorAll('.skill-card');
    const skillTags = skillsSection.querySelectorAll('[data-animation="skill-tag"]');
    
    // Set initial states for skill cards - start hidden for animation
    gsap.set(skillCards, { opacity: 0, y: 30, scale: 0.95 });
    
    // Add scroll animations for skill cards - reuse experience pattern
    Utils.createScrollTriggerBatch(skillCards, {
        start: "top 90%", // Trigger when element is 90% from top
        onEnter: (elements) => {
            elements.forEach((element, index) => {
                gsap.to(element, { 
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4, // Fast animation
                    delay: index * 0.05, // Short stagger
                    ease: "back.out(1.7)" // Nice bounce effect
                });
            });
        },
        onEnterBack: (elements) => {
            elements.forEach(element => {
                gsap.to(element, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
            });
        }
    });
    
    // Add hover effects to skill cards
    initCardHoverEffects(skillCards, 'skills');
    
    // Add hover effects to skill tags using unified system
    Utils.createHoverEffects(skillTags, {
        enter: { scale: 1.05, y: -2, duration: 0.3, ease: "power2.out" },
        leave: { scale: 1, y: 0, duration: 0.3, ease: "power2.out" }
    });
}

// Universal animation system
function initUniversalAnimations() {
    const animationTypes = {
        social: { scale: 1.4, duration: 0.15 },
        buttons: { scale: 1.1, duration: 0.15 },
        card: { scale: 1.05, y: -5, duration: 0.3 },
        image: { scale: 1.05, rotationY: 5, duration: 0.4 },
        '404-image': { scale: 1.05, y: -10, duration: 0.6, ease: "back.out(1.7)" }
    };

    Object.entries(animationTypes).forEach(([type, props]) => {
        const containers = document.querySelectorAll(`[data-animation="${type}"]`);
        containers.forEach(container => {
            let elements;
            if (type === 'social') {
                elements = container.querySelectorAll('a, i.fab, i.fas');
            } else if (type === 'buttons') {
                elements = container.querySelectorAll('a, button');
            } else {
                elements = [container];
            }
            
            elements.forEach(element => {
                // Store original state for proper reset
                const originalState = {};
                Object.keys(props).forEach(prop => {
                    if (prop !== 'duration' && prop !== 'ease') {
                        originalState[prop] = gsap.getProperty(element, prop);
                    }
                });
                
                element.addEventListener('mouseenter', () => {
                    gsap.to(element, { ...props, overwrite: true });
                });
                
                element.addEventListener('mouseleave', () => {
                    // Reset to original state
                    gsap.to(element, { 
                        ...originalState, 
                        duration: 0.2, 
                        ease: "power2.out",
                        overwrite: true 
                    });
                });
            });
        });
    });
}

// Scroll animations system - Using unified function
function initScrollAnimations() {
    Utils.createScrollTriggerBatch('[data-animate]:not(.project-card):not(.skill-card):not(.tech-skill-card):not(.timeline-item)', {
        onEnter: (elements) => {
            elements.forEach((el, index) => {
                const delay = el.dataset.animateDelay ? parseInt(el.dataset.animateDelay) : index * 100;
                gsap.set(el, { opacity: 0, y: 30, scale: 0.95 });
                gsap.to(el, { ...COMMON_ANIMATIONS.fadeIn, delay: delay / 1000 });
            });
        },
        onEnterBack: (elements) => elements.forEach(el => gsap.to(el, COMMON_ANIMATIONS.fadeIn)),
        onLeaveBack: (elements) => elements.forEach(el => gsap.to(el, COMMON_ANIMATIONS.fadeOut))
    });
}

// 404 page animations
function init404Animations() {
    const image404 = document.querySelector('[data-animation="404-image"]');
    if (!image404) return;
    
    // Set initial state
    gsap.set(image404, { opacity: 0, scale: 0.8, y: 30 });
    
    // Animate in with a nice entrance
    gsap.to(image404, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 0.3
    });
    
    // Add floating animation after entrance
    gsap.to(image404, {
        y: -10,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.5
    });
}

// Background animations system - Beautiful diagonal lines and spline curves
function createAndAnimateDiagonalLines(container, options = {}) {
    const config = { count: 4, background: 'linear-gradient(45deg, transparent, var(--color-primary-light), transparent)', height: 3, width: 250, opacity: 0.8, scaleX: 1.5, duration: 4, rotationDuration: 8, ...options };
    
    const lines = Array.from({ length: config.count }, (_, i) => {
        const line = document.createElement('div');
        const pos = Utils.randomPosition();
        Object.assign(line.style, {
            position: 'absolute',
            background: config.background,
            height: config.height + 'px',
            width: config.width + 'px',
            opacity: '0',
            zIndex: '1',
            left: pos.x + '%',
            top: pos.y + '%',
            transform: `rotate(${Math.random() * 360}deg)`,
            transformOrigin: 'center center'
        });
        line.className = 'diagonal-line';
        container.appendChild(line);
        return line;
    });

    lines.forEach((line, index) => {
        gsap.timeline({ repeat: -1, yoyo: true })
            .to(line, { opacity: config.opacity, scaleX: config.scaleX, duration: config.duration, delay: index * 0.8, ease: "power2.inOut" })
            .to(line, { rotation: '+=180', duration: config.rotationDuration, ease: "none" }, 0);
    });

    return lines;
}

function createAndAnimateSplineCurves(container, options = {}) {
    const config = { count: 3, size: 180, border: '3px solid var(--color-primary)', opacity: 0.6, scale: 1.2, duration: 6, rotationDuration: 10, ...options };
    
    const curves = Array.from({ length: config.count }, (_, i) => {
        const curve = document.createElement('div');
        const pos = Utils.randomPosition();
        Object.assign(curve.style, {
            position: 'absolute',
            width: config.size + 'px',
            height: config.size + 'px',
            border: config.border,
            borderRadius: '50%',
            opacity: '0',
            zIndex: '1',
            left: pos.x + '%',
            top: pos.y + '%'
        });
        curve.className = 'spline-curve';
        container.appendChild(curve);
        return curve;
    });

    curves.forEach((curve, index) => {
        gsap.timeline({ repeat: -1, yoyo: true })
            .to(curve, { opacity: config.opacity, scale: config.scale, borderRadius: '0%', duration: config.duration, delay: index * 1.2, ease: "power2.inOut" })
            .to(curve, { rotation: 360, duration: config.rotationDuration, ease: "none" }, 0);
    });

    return curves;
}

function initSectionBackgroundAnimations(sectionSelector, options = {}) {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const shapesContainer = Utils.createContainer(section, '.morphing-shapes', 'morphing-shapes absolute inset-0 pointer-events-none overflow-hidden');

    Utils.createScrollTrigger(section, {
        onEnter: () => {
            shapesContainer.innerHTML = '';
            createAndAnimateDiagonalLines(shapesContainer, options.diagonalLines);
            createAndAnimateSplineCurves(shapesContainer, options.splineCurves);
        },
        onEnterBack: () => {
            shapesContainer.innerHTML = '';
            createAndAnimateDiagonalLines(shapesContainer, options.diagonalLines);
            createAndAnimateSplineCurves(shapesContainer, options.splineCurves);
        },
        onLeave: () => shapesContainer.innerHTML = '',
        onLeaveBack: () => shapesContainer.innerHTML = ''
    });
}

// Card hover effects system - Consolidated and optimized
function initCardHoverEffects(cards, type = 'default') {
    const hoverConfig = {
        technical: { y: -8, scale: 1.02, glowColor: 'var(--color-primary-light)', glowSize: '0 20px 40px -10px' },
        experience: { y: 0, scale: 1, glowColor: 'var(--color-text-muted)', glowSize: '0 10px 20px -5px' },
        skills: { y: -4, scale: 1.02, glowColor: 'var(--color-success)', glowSize: '0 12px 25px -6px' },
        default: { y: -5, scale: 1.05, glowColor: 'var(--color-secondary)', glowSize: '0 15px 30px -8px' }
    };
    
    const config = hoverConfig[type] || hoverConfig.default;
    const defaultShadow = '0 10px 25px -5px var(--color-text-muted), 0 4px 6px -2px var(--color-border-secondary)';
    
    cards.forEach(card => {
        const enterAnimation = gsap.timeline({ paused: true })
            .to(card, { y: config.y, scale: config.scale, duration: 0.4, ease: "power2.out" })
            .to(card, { boxShadow: `${config.glowSize} ${config.glowColor}`, duration: 0.4, ease: "power2.out" }, 0);
            
        const leaveAnimation = gsap.timeline({ paused: true })
            .to(card, COMMON_ANIMATIONS.reset)
            .to(card, { boxShadow: defaultShadow, duration: 0.4, ease: "power2.out" }, 0);
        
        card.addEventListener('mouseenter', () => enterAnimation.play());
        card.addEventListener('mouseleave', () => leaveAnimation.play());
    });
}

// Typing effect
let typingEffectInitialized = false;

function initTypingEffect() {
    if (typingEffectInitialized) return;
    
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;

    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    Object.assign(cursor.style, {
        display: 'inline-block',
        width: '2px',
        height: '1.2em',
        backgroundColor: 'var(--color-primary-light)',
        marginLeft: '2px',
        verticalAlign: 'text-bottom',
        animation: 'blink 0.7s step-end infinite'
    });
    
    typewriterElement.appendChild(cursor);

    const chars = text.split('');
    const timeline = gsap.timeline({ delay: 1.5 });

    chars.forEach((char, index) => {
        timeline.to(typewriterElement, {
            duration: 0.05,
            onUpdate: function() {
                const textContent = chars.slice(0, index + 1).join('');
                typewriterElement.textContent = textContent;
                typewriterElement.appendChild(cursor);
            }
        });
    });
    
    typingEffectInitialized = true;
}

// Navigation highlighting system
function initNavigationHighlighting() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    // Create ScrollTrigger for each section to update navigation
    sections.forEach(section => {
        Utils.createScrollTrigger(section, {
            onEnter: () => updateActiveNav(section.getAttribute('id')),
            onEnterBack: () => updateActiveNav(section.getAttribute('id')),
            onLeave: () => updateActiveNav(section.getAttribute('id')),
            onLeaveBack: () => updateActiveNav(section.getAttribute('id'))
        });
    });
    
    function updateActiveNav(sectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active-nav');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active-nav');
            }
        });
    }
}

// Smooth scrolling system
function initSmoothScrolling() {
    const navigationLinks = document.querySelectorAll('a[href^="#"]');
    
    if (navigationLinks.length === 0) return;
    
    navigationLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Use GSAP timing with native smooth scrolling for better performance
                gsap.delayedCall(0, () => {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
}

// Performance optimizations
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

window.addEventListener('beforeunload', function() {
    typingEffectInitialized = false;
});

window.addEventListener('resize', function() {
    ScrollTrigger.refresh();
});