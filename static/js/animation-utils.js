// Reusable Animation Utilities for GSAP
// This file contains shared animation functions that can be used across different sections

/**
 * Creates and animates diagonal lines for any section
 * @param {HTMLElement} container - The container element
 * @param {Object} options - Configuration options
 * @param {number} options.count - Number of lines to create (default: 4)
 * @param {string} options.background - Background gradient (default: blue gradient)
 * @param {number} options.height - Line height in px (default: 3)
 * @param {number} options.width - Line width in px (default: 250)
 * @param {number} options.opacity - Maximum opacity (default: 0.8)
 * @param {number} options.scaleX - Maximum scale (default: 1.5)
 * @param {number} options.duration - Animation duration (default: 4)
 * @param {number} options.rotationDuration - Rotation duration (default: 8)
 */
function createAndAnimateDiagonalLines(container, options = {}) {
    const {
        count = 4,
        background = 'linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.4), transparent)',
        height = 3,
        width = 250,
        opacity = 0.8,
        scaleX = 1.5,
        duration = 4,
        rotationDuration = 8
    } = options;

    const diagonalLines = [];

    for (let i = 0; i < count; i++) {
        const line = document.createElement('div');
        line.className = 'diagonal-line absolute';
        line.style.background = background;
        line.style.height = height + 'px';
        line.style.width = width + 'px';
        line.style.opacity = '0';
        line.style.zIndex = '1';
        
        // Random positions and angles
        const randomX = Math.random() * 80 + 10;
        const randomY = Math.random() * 80 + 10;
        const randomAngle = Math.random() * 360;
        
        line.style.left = randomX + '%';
        line.style.top = randomY + '%';
        line.style.transform = `rotate(${randomAngle}deg)`;
        line.style.transformOrigin = 'center center';
        
        container.appendChild(line);
        diagonalLines.push(line);
    }

    // Animate the lines
    diagonalLines.forEach((line, index) => {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        
        tl.to(line, {
            opacity: opacity,
            scaleX: scaleX,
            duration: duration,
            ease: "power2.inOut",
            delay: index * 0.8
        })
        .to(line, {
            rotation: line.style.transform.replace('rotate(', '').replace('deg)', '') + 180,
            duration: rotationDuration,
            ease: "none"
        }, 0);
    });

    return diagonalLines;
}

/**
 * Creates and animates spline curves for any section
 * @param {HTMLElement} container - The container element
 * @param {Object} options - Configuration options
 * @param {number} options.count - Number of curves to create (default: 3)
 * @param {number} options.size - Size in px (default: 180)
 * @param {string} options.border - Border style (default: blue border)
 * @param {number} options.opacity - Maximum opacity (default: 0.6)
 * @param {number} options.scale - Maximum scale (default: 1.2)
 * @param {number} options.duration - Animation duration (default: 6)
 * @param {number} options.rotationDuration - Rotation duration (default: 10)
 */
function createAndAnimateSplineCurves(container, options = {}) {
    const {
        count = 3,
        size = 180,
        border = '3px solid rgba(139, 92, 246, 0.3)',
        opacity = 0.6,
        scale = 1.2,
        duration = 6,
        rotationDuration = 10
    } = options;

    const splineCurves = [];

    for (let i = 0; i < count; i++) {
        const curve = document.createElement('div');
        curve.className = 'spline-curve absolute';
        curve.style.width = size + 'px';
        curve.style.height = size + 'px';
        curve.style.border = border;
        curve.style.borderRadius = '50%';
        curve.style.opacity = '0';
        curve.style.zIndex = '1';
        
        // Random positions
        const randomX = Math.random() * 80 + 10;
        const randomY = Math.random() * 80 + 10;
        curve.style.left = randomX + '%';
        curve.style.top = randomY + '%';
        
        container.appendChild(curve);
        splineCurves.push(curve);
    }

    // Animate the curves
    splineCurves.forEach((curve, index) => {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        
        tl.to(curve, {
            opacity: opacity,
            scale: scale,
            borderRadius: '0%',
            duration: duration,
            ease: "power2.inOut",
            delay: index * 1.2
        })
        .to(curve, {
            rotation: 360,
            duration: rotationDuration,
            ease: "none"
        }, 0);
    });

    return splineCurves;
}







/**
 * Initializes background animations for any section
 * @param {string} sectionSelector - CSS selector for the section
 * @param {Object} options - Configuration options
 */
function initSectionBackgroundAnimations(sectionSelector, options = {}) {
    const section = document.querySelector(sectionSelector);
    if (!section) {
        console.warn(`Section not found: ${sectionSelector}`);
        return;
    }

    // Create shapes container
    let shapesContainer = section.querySelector('.morphing-shapes');
    if (!shapesContainer) {
        shapesContainer = document.createElement('div');
        shapesContainer.className = 'morphing-shapes absolute inset-0 pointer-events-none overflow-hidden';
        section.appendChild(shapesContainer);
    }

    // Create animations with ScrollTrigger
    ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
            // Clear existing shapes before creating new ones
            shapesContainer.innerHTML = '';
            createAndAnimateDiagonalLines(shapesContainer, options.diagonalLines);
            createAndAnimateSplineCurves(shapesContainer, options.splineCurves);
        },
        onEnterBack: () => {
            // Clear existing shapes before creating new ones
            shapesContainer.innerHTML = '';
            createAndAnimateDiagonalLines(shapesContainer, options.diagonalLines);
            createAndAnimateSplineCurves(shapesContainer, options.splineCurves);
        },
        onLeave: () => {
            // Clear shapes when leaving the section
            shapesContainer.innerHTML = '';
        },
        onLeaveBack: () => {
            // Clear shapes when leaving the section
            shapesContainer.innerHTML = '';
        }
    });
}

/**
 * Creates a generic dynamic animation for any domain with mouse following
 * @param {HTMLElement} container - The container element
 * @param {Object} options - Configuration options
 */
function createDynamicAnimation(container, options = {}) {
    const {
        elements = 5,
        color = 'rgba(59, 130, 246, 0.4)',
        duration = 1.2,
        pattern = 'random', // 'random', 'circular', 'grid', 'flow'
        followMouse = true
    } = options;

    const animationElements = [];
    const card = container.closest('.project-card');
    
    if (!card) {
        console.warn('No project-card parent found for mouse following');
        return [];
    }

    // Create floating stars/bubbles that rise upward
    for (let i = 0; i < elements; i++) {
        const element = document.createElement('div');
        element.className = 'dynamic-element absolute';
        
        // Small star/bubble properties
        const size = 4 + Math.random() * 6; // 4-10px for varied sizes
        const isStar = Math.random() > 0.5; // 50% chance of star vs bubble
        
        element.style.width = size + 'px';
        element.style.height = size + 'px';
        element.style.background = 'rgba(255, 255, 255, 0.9)'; // Crispy white
        element.style.opacity = '0';
        element.style.zIndex = '1';
        element.style.transition = 'transform 0.1s ease-out';
        element.style.transformOrigin = 'center center';
        
        // Make some elements star-shaped
        if (isStar) {
            element.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        } else {
            element.style.borderRadius = '50%'; // Circular bubble
        }
        
        // Random starting positions across the card
        const left = 10 + Math.random() * 80; // 10% to 90% across card
        const top = 80 + Math.random() * 20; // Start from bottom (80% to 100%)
        
        element.style.left = left + '%';
        element.style.top = top + '%';
        element.style.transform = 'translate(-50%, -50%)';
        
        // Store original position and properties for mouse following
        element.dataset.originalX = left;
        element.dataset.originalY = top;
        element.dataset.index = i;
        element.dataset.size = size;
        element.dataset.isStar = isStar;
        
        container.appendChild(element);
        animationElements.push(element);
    }

    // Mouse following functionality
    if (followMouse) {
        let mouseX = 0, mouseY = 0;
        let cardRect = card.getBoundingClientRect();
        
        // Update mouse position
        const updateMousePosition = (e) => {
            cardRect = card.getBoundingClientRect();
            mouseX = ((e.clientX - cardRect.left) / cardRect.width) * 100;
            mouseY = ((e.clientY - cardRect.top) / cardRect.height) * 100;
        };
        
        // Animate stars/bubbles to follow mouse with enhanced responsiveness
        const animateToMouse = () => {
            animationElements.forEach((element, index) => {
                const originalX = parseFloat(element.dataset.originalX);
                const originalY = parseFloat(element.dataset.originalY);
                const isStar = element.dataset.isStar === 'true';
                
                // Higher sensitivity for stars, lower for bubbles
                const sensitivity = isStar ? 0.4 + (index * 0.1) : 0.2 + (index * 0.05);
                const maxOffset = isStar ? 30 + (index * 5) : 20 + (index * 3);
                
                // Calculate offset based on mouse position
                const offsetX = (mouseX - 50) * sensitivity;
                const offsetY = (mouseY - 50) * sensitivity;
                
                // Clamp offset to max distance
                const clampedOffsetX = Math.max(-maxOffset, Math.min(maxOffset, offsetX));
                const clampedOffsetY = Math.max(-maxOffset, Math.min(maxOffset, offsetY));
                
                // Stars rotate more, bubbles less
                const rotationOffset = isStar ? (mouseX - 50) * 0.5 : (mouseX - 50) * 0.1;
                
                // Apply transform with enhanced responsiveness
                gsap.to(element, {
                    x: clampedOffsetX,
                    y: clampedOffsetY,
                    rotation: rotationOffset,
                    scale: isStar ? 1.3 : 1.1, // Stars scale more when following mouse
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        };
        
        // Mouse move event
        card.addEventListener('mousemove', (e) => {
            updateMousePosition(e);
            animateToMouse();
        });
        
        // Mouse leave event - return to original positions
        card.addEventListener('mouseleave', () => {
            animationElements.forEach((element) => {
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        });
        
        // Store cleanup function
        container.dataset.mouseFollowCleanup = () => {
            card.removeEventListener('mousemove', updateMousePosition);
            card.removeEventListener('mouseleave', () => {
                animationElements.forEach((element) => {
                    gsap.to(element, {
                        x: 0,
                        y: 0,
                        rotation: 0,
                        scale: 1,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                });
            });
        };
    }

    // Animate stars/bubbles floating upward
    animationElements.forEach((element, index) => {
        const tl = gsap.timeline({ repeat: -1 });
        const delay = index * 0.2; // Stagger the animations
        const duration = 3.0 + Math.random() * 2.0; // 3-5s for varied speeds
        const isStar = element.dataset.isStar === 'true';
        
        // Float upward with subtle side movement
        tl.to(element, {
            opacity: 0.9,
            y: '-120%', // Float up beyond the card
            x: (Math.random() - 0.5) * 20, // Slight random side movement
            scale: isStar ? 1.2 : 1.1, // Stars scale more than bubbles
            rotation: isStar ? 360 : 0, // Stars rotate, bubbles don't
            duration: duration,
            ease: "power1.out",
            delay: delay
        })
        .to(element, {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            ease: "power2.in"
        }, `+=0.1`);
        
        // Reset position after animation completes
        setTimeout(() => {
            if (element.parentNode) {
                const newLeft = 10 + Math.random() * 80;
                const newTop = 80 + Math.random() * 20;
                element.style.left = newLeft + '%';
                element.style.top = newTop + '%';
                element.style.opacity = '0';
                element.style.transform = 'translate(-50%, -50%) scale(1)';
                element.dataset.originalX = newLeft;
                element.dataset.originalY = newTop;
            }
        }, (duration + 0.5) * 1000);
    });

    return animationElements;
}

/**
 * Initializes dynamic hover animations for skills section
 * @param {string} sectionSelector - CSS selector for the skills section
 */
function initSkillsHoverAnimations(sectionSelector) {
    const sections = document.querySelectorAll(sectionSelector);
    
    if (sections.length === 0) {
        console.warn(`Skills section not found: ${sectionSelector}`);
        return;
    }
    
    if (sections.length > 1) {
        console.warn(`Multiple sections found with selector: ${sectionSelector}. Using the first one.`);
    }
    
    const section = sections[0];
    const cards = section.querySelectorAll('.project-card');
    
    // Animation patterns and colors for variety
    const animationPatterns = ['random', 'circular', 'grid', 'flow'];
    const colorPalette = [
        'rgba(59, 130, 246, 0.4)',   // blue
        'rgba(147, 51, 234, 0.4)',   // purple
        'rgba(34, 197, 94, 0.4)',    // green
        'rgba(239, 68, 68, 0.4)',    // red
        'rgba(245, 158, 11, 0.4)',   // yellow
        'rgba(99, 102, 241, 0.4)',   // indigo
        'rgba(236, 72, 153, 0.4)',   // pink
        'rgba(20, 184, 166, 0.4)',   // teal
        'rgba(249, 115, 22, 0.4)',   // orange
        'rgba(6, 182, 212, 0.4)'     // cyan
    ];
    
    cards.forEach((card, index) => {
        // Create animation container inside the card
        let animationContainer = card.querySelector('.domain-animation');
        if (!animationContainer) {
            animationContainer = document.createElement('div');
            animationContainer.className = 'domain-animation absolute inset-0 pointer-events-none overflow-hidden rounded-xl';
            card.appendChild(animationContainer);
        }
        
        // Set up hover events
        let animationElements = [];
        
        card.addEventListener('mouseenter', () => {
            // Clear any existing animations
            animationContainer.innerHTML = '';
            animationElements = [];
            
            // Generate truly random animation options for each hover
            const randomPattern = animationPatterns[Math.floor(Math.random() * animationPatterns.length)];
            const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            const elements = 4 + Math.floor(Math.random() * 4); // 4-7 elements
            
            const animationOptions = {
                elements: elements,
                color: randomColor,
                duration: 1.0 + Math.random() * 0.5, // 1.0-1.5s
                pattern: randomPattern
            };
            
            // Create dynamic animation
            animationElements = createDynamicAnimation(animationContainer, animationOptions);
        });
        
        card.addEventListener('mouseleave', () => {
            // Clean up mouse following event listeners
            if (animationContainer.dataset.mouseFollowCleanup) {
                const cleanup = animationContainer.dataset.mouseFollowCleanup;
                if (typeof cleanup === 'function') {
                    cleanup();
                }
                delete animationContainer.dataset.mouseFollowCleanup;
            }
            
            // Remove animation elements
            animationElements.forEach(element => {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
            animationElements = [];
        });
    });
}

// Export functions for use in other files
window.AnimationUtils = {
    createAndAnimateDiagonalLines,
    createAndAnimateSplineCurves,
    createDynamicAnimation,
    initSectionBackgroundAnimations,
    initSkillsHoverAnimations
};

/*
USAGE EXAMPLES:

1. For a simple section with default settings:
   AnimationUtils.initSectionBackgroundAnimations('.my-section');

2. For a section with custom settings:
   AnimationUtils.initSectionBackgroundAnimations('.my-section', {
     diagonalLines: {
       count: 6,
       opacity: 0.9,
       scaleX: 2.0,
       background: 'linear-gradient(45deg, transparent, rgba(255, 0, 0, 0.4), transparent)'
     },
     splineCurves: {
       count: 2,
       opacity: 0.8,
       scale: 1.5,
       border: '4px solid rgba(0, 255, 0, 0.4)'
     }
   });

3. For individual elements:
   const container = document.querySelector('.my-container');
   AnimationUtils.createAndAnimateDiagonalLines(container, { count: 3 });
   AnimationUtils.createAndAnimateSplineCurves(container, { count: 2 });

4. For dynamic animations with mouse following:
   AnimationUtils.createDynamicAnimation(container, {
     elements: 6,
     color: 'rgba(59, 130, 246, 0.4)',
     pattern: 'circular', // 'random', 'circular', 'grid', 'flow'
     duration: 1.5,
     followMouse: true // Elements follow mouse movement
   });

5. For skills section hover animations (automatically handles any number of cards):
   AnimationUtils.initSkillsHoverAnimations('#skills');
*/ 