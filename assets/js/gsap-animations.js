// GSAP Animations System - Hero Section Only

// Configuration object for hero animations
const ANIMATION_CONFIG = {
    hero: {
        diagonalLines: { count: 4, opacity: 0.4, scaleX: 4.0 }
    }
};

// Common animation properties for hero
const COMMON_ANIMATIONS = {
    fadeIn: { opacity: 1, y: 0, rotationX: 0, duration: 0.8, ease: "power2.out" },
    scrollEnter: { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
};

// Central animation registry to prevent duplicates
const ANIMATION_REGISTRY = {
    registeredElements: new Set(),
    
    // Register an element to prevent duplicate animations
    registerElement: (element, type) => {
        const key = `${element.tagName}-${element.className.split(' ')[0]}-${type}`;
        if (ANIMATION_REGISTRY.registeredElements.has(key)) {
            return false; // Already registered
        }
        ANIMATION_REGISTRY.registeredElements.add(key);
        return true;
    },
    
    // Check if element is already animated
    isElementAnimated: (element, type) => {
        const key = `${element.tagName}-${element.className.split(' ')[0]}-${type}`;
        return ANIMATION_REGISTRY.registeredElements.has(key);
    }
};

// Utility functions for hero animations
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
    })
};

// Mouse tracking for quick fact lighting effects
function initQuickFactLighting() {
    const quickFactCards = document.querySelectorAll('.quick-fact-card');
    
    if (quickFactCards.length === 0) return;
    
    quickFactCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Loading local copy...');
        loadGSAP();
        return;
    }
    
    initializeHeroAnimations();
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

    const gsapUrl = window.CC_GSAP_URL || '/vendor/gsap/gsap.min.js';
    loadScript(gsapUrl, gsapUrl,
        () => {
            initializeHeroAnimations();
        });
}

// Main initialization function - Hero only (optimized)
function initializeHeroAnimations() {
    console.log('Initializing hero animation system...');
    
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    console.log('🎯 Initializing hero animations...');
    
    // Portrait and text stay at their first-paint opacity. Only decorations start hidden.
    const bgDecorations = heroSection.querySelectorAll('.absolute.opacity-10 > div');
    const quickFactCards = document.querySelectorAll('.quick-fact-card');
    if (bgDecorations.length > 0) {
        gsap.set(bgDecorations, { opacity: 0, scale: 0.5, rotation: -180 });
    }
    if (quickFactCards.length > 0) {
        gsap.set(quickFactCards, { opacity: 0, y: 20, scale: 0.95 });
    }
    // Initialize floating background animations
    bgDecorations.forEach((circle, index) => {
        const delay = index * 0.5;
        const floatX = (Math.random() - 0.5) * 40;
        const floatY = (Math.random() - 0.5) * 30;
        const floatDuration = 3 + Math.random() * 2;
        
        gsap.timeline({ repeat: -1, yoyo: true, delay })
            .to(circle, { x: floatX, y: floatY, duration: floatDuration, ease: "power1.inOut" });
        
        gsap.to(circle, { rotation: 360, duration: 8 + Math.random() * 4, ease: "none", repeat: -1, delay });
        circle.setAttribute('data-natural-animation', 'true');
    });
    
    // Initialize mouse tracking
    initMouseTracking(heroSection);
    
    // Initialize background shapes
    initSectionBackgroundAnimations('.hero-section', ANIMATION_CONFIG.hero);
    
    // Initialize typewriter effect
    initTypingEffect();
    
    // Initialize quick fact lighting effects
    initQuickFactLighting();
    
    // Decorations and quick facts still enter. Hero portrait and text do not.
    const tl = gsap.timeline();

    if (bgDecorations.length > 0) {
        tl.to(bgDecorations, { 
            opacity: 0.1, 
            scale: 1, 
            rotation: 0, 
            duration: 1, 
            stagger: 0.1 
        }, "-=0.6");
    }
    
    if (quickFactCards.length > 0) {
        tl.to(quickFactCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.4");
    }
    
}

// Typewriter effect. The tagline is split on ". " into phrases:
// - one phrase: typed once, then kept on screen with a blinking cursor;
// - several phrases: each is typed, held, erased, then the next one is typed (loop).
// No punctuation is added. With prefers-reduced-motion, the full text stays static.
// Screen readers get the full text through a visually hidden copy (see hero.html).
let typingEffectInitialized = false;

function initTypewriterForElement(el, startDelayMs) {
    const originalText = (el.getAttribute('data-original-text') || el.textContent).trim();
    const phrases = originalText.split('. ').map(p => p.trim()).filter(Boolean)
        .map((p, i, all) => (i < all.length - 1 && !/[.!?]$/.test(p) ? p + '.' : p));
    if (!phrases.length) return;

    // Reserve the height of the tallest phrase so the layout does not jump while typing.
    let maxHeight = 0;
    phrases.forEach(p => { el.textContent = p; maxHeight = Math.max(maxHeight, el.offsetHeight); });
    el.textContent = phrases[0];
    if (maxHeight) el.style.minHeight = maxHeight + 'px';

    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.setAttribute('aria-hidden', 'true');

    function render(text) {
        el.textContent = text;
        el.appendChild(cursor);
    }

    function typePhrase(phrase, onComplete) {
        const tl = gsap.timeline({ onComplete });
        for (let i = 1; i <= phrase.length; i++) {
            tl.call(render, [phrase.slice(0, i)], i * 0.06);
        }
        return tl;
    }

    function erasePhrase(phrase, onComplete) {
        const tl = gsap.timeline({ onComplete });
        for (let i = phrase.length - 1; i >= 0; i--) {
            tl.call(render, [phrase.slice(0, i)], (phrase.length - i) * 0.03);
        }
        return tl;
    }

    function cycle(index) {
        const phrase = phrases[index];
        typePhrase(phrase, () => {
            if (phrases.length === 1) return; // single phrase: keep it
            gsap.delayedCall(2.5, () => erasePhrase(phrase, () => {
                gsap.delayedCall(0.4, () => cycle((index + 1) % phrases.length));
            }));
        });
    }

    render(''); // start from an empty line (height already reserved)
    setTimeout(() => {
        gsap.to(cursor, { opacity: 0, duration: 0.6, ease: 'power2.inOut', yoyo: true, repeat: -1 });
        cycle(0);
    }, startDelayMs);
}

function initTypingEffect() {
    if (typingEffectInitialized) return;
    typingEffectInitialized = true;

    const elements = document.querySelectorAll('.typewriter');
    if (!elements.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    elements.forEach(el => initTypewriterForElement(el, 300));
}

function initMouseTracking(heroSection) {
    let mouseX = 0, mouseY = 0, isInHero = false;
    let updateTimeout = null;
    const throttleDelay = 16;

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
        
        const elementTypes = [
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

        const glowIntensity = Math.abs(normalizedX + normalizedY) * 0.3;
        gsap.to(heroSection, {
            boxShadow: `0 0 ${20 + glowIntensity * 50}px var(--color-primary-light)`,
            duration: 0.5,
            ease: "power2.out"
        });
    }

    function resetMouseEffects() {
        const elementsToReset = heroSection.querySelectorAll('.morphing-shape, .diagonal-line, .spline-curve');
        const resetElements = Array.from(elementsToReset).filter(el => !el.hasAttribute('data-natural-animation'));
        
        gsap.to(resetElements, {
            x: 0, y: 0, rotation: 0, scale: 1,
            duration: 0.8, ease: "power2.out"
        });
        
        gsap.to(heroSection, { boxShadow: 'none', duration: 0.5, ease: "power2.out" });
    }
}

// Background animations system for hero
function createAndAnimateDiagonalLines(container, options = {}) {
    const config = { count: 4, background: 'linear-gradient(45deg, transparent, var(--color-primary-light), transparent)', height: 3, width: 1200, opacity: 0.4, scaleX: 4.0, duration: 4, rotationDuration: 8, ...options };
    
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
    if (!section) {
        console.warn(`Section with selector "${sectionSelector}" not found. Skipping background animations.`);
        return;
    }

    const shapesContainer = Utils.createContainer(section, '.morphing-shapes', 'morphing-shapes absolute inset-0 pointer-events-none overflow-hidden');

    // Create background animations immediately for hero section
    shapesContainer.innerHTML = '';
    createAndAnimateDiagonalLines(shapesContainer, options.diagonalLines);
    createAndAnimateSplineCurves(shapesContainer, options.splineCurves);
}

// Performance optimizations
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

window.addEventListener('resize', function() {
    // Refresh any GSAP animations if needed
    if (typeof gsap !== 'undefined') {
        gsap.globalTimeline.invalidate();
    }
});