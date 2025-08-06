// GSAP Hero Section Animations
let heroAnimationsInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Loading from CDN...');
        loadGSAP();
        return;
    }
    
    // Only initialize hero animations once
    if (!heroAnimationsInitialized) {
        console.log('Initializing hero animations...');
        
        // Initialize hero animations first (priority)
        initHeroAnimations();
        initParticleSystem();
        initMorphingShapes();
        initScrollEffects();
        initMouseTracking();
        
        // Initialize background animations for Hero section using reusable functions
        if (typeof AnimationUtils !== 'undefined') {
          AnimationUtils.initSectionBackgroundAnimations('.hero-section', {
            diagonalLines: {
              count: 4,
              opacity: 0.6,
              scaleX: 1.5
            },
            splineCurves: {
              count: 3,
              opacity: 0.4,
              scale: 1.2
            }
          });
        }
        
        // Initialize about animations after a short delay to avoid conflicts
        setTimeout(() => {
            initAboutAnimations();
        }, 100);
        
        // Initialize typing effect with delay
        setTimeout(() => {
            initTypingEffect();
        }, 2000);
        
        heroAnimationsInitialized = true;
    } else {
        console.log('Hero animations already initialized, skipping...');
    }
});

function loadGSAP() {
    // Try to load GSAP from node_modules first
    const localScript = document.createElement('script');
    localScript.src = '/node_modules/gsap/dist/gsap.min.js';
    localScript.onerror = function() {
        // Fallback to CDN if local file not found
        const cdnScript = document.createElement('script');
        cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js';
        cdnScript.onload = function() {
            loadScrollTrigger();
        };
        document.head.appendChild(cdnScript);
    };
    localScript.onload = function() {
        loadScrollTrigger();
    };
    document.head.appendChild(localScript);
}

function loadScrollTrigger() {
    const localScrollTrigger = document.createElement('script');
    localScrollTrigger.src = '/node_modules/gsap/dist/ScrollTrigger.min.js';
    localScrollTrigger.onerror = function() {
        // Fallback to CDN
        const cdnScript = document.createElement('script');
        cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js';
        cdnScript.onload = function() {
            gsap.registerPlugin(ScrollTrigger);
            // Only initialize if not already done
            if (!heroAnimationsInitialized) {
                // Initialize hero animations first
                initHeroAnimations();
                initParticleSystem();
                initMorphingShapes();
                initScrollEffects();
                initMouseTracking();
                // Initialize about animations with delay
                setTimeout(() => {
                    initAboutAnimations();
                }, 100);
                heroAnimationsInitialized = true;
            }
        };
        document.head.appendChild(cdnScript);
    };
    localScrollTrigger.onload = function() {
        gsap.registerPlugin(ScrollTrigger);
        // Only initialize if not already done
        if (!heroAnimationsInitialized) {
            // Initialize hero animations first
            initHeroAnimations();
            initParticleSystem();
            initMorphingShapes();
            initScrollEffects();
            initMouseTracking();
            // Initialize about animations with delay
            setTimeout(() => {
                initAboutAnimations();
            }, 100);
            
            // Initialize typing effect with delay
            setTimeout(() => {
                initTypingEffect();
            }, 2000);
            heroAnimationsInitialized = true;
        }
    };
    document.head.appendChild(localScrollTrigger);
}

function initHeroAnimations() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Set initial states
    setInitialStates();

    // Create ScrollTrigger with toggleActions
    ScrollTrigger.create({
        trigger: heroSection,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        id: "hero-section-trigger", // Unique ID to avoid conflicts
        onEnter: () => {
            console.log('Hero section entered - playing animation');
            playHeroAnimation();
        },
        onEnterBack: () => {
            console.log('Hero section re-entered - playing animation');
            playHeroAnimation();
        },
        onLeave: () => {
            console.log('Hero section left - reversing animation');
        },
        onLeaveBack: () => {
            console.log('Hero section re-left - reversing animation');
        }
    });

    // Add floating animation to profile image
    const profileImage = heroSection.querySelector('.lg\\:w-1\\/2 .relative');
    if (profileImage) {
        gsap.to(profileImage, {
            y: -10,
            duration: 2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });
    }

    // Add natural floating animation to background circles (independent of mouse)
    const backgroundCircles = heroSection.querySelectorAll('.absolute.opacity-10 > div');
    backgroundCircles.forEach((circle, index) => {
        // Each circle has its own natural floating pattern
        const floatX = (Math.random() - 0.5) * 40; // Random X movement
        const floatY = (Math.random() - 0.5) * 30; // Random Y movement
        const floatDuration = 3 + Math.random() * 2; // Random duration between 3-5s
        const floatDelay = index * 0.5; // Staggered start
        
        // Use timeline to ensure natural animation is not overridden
        const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: floatDelay });
        
        tl.to(circle, {
            x: floatX,
            y: floatY,
            duration: floatDuration,
            ease: "power1.inOut"
        });
        
        // Add subtle rotation for more natural movement
        gsap.to(circle, {
            rotation: 360,
            duration: 8 + Math.random() * 4,
            ease: "none",
            repeat: -1,
            delay: floatDelay
        });
        
        // Mark circles as having natural animation to prevent mouse interference
        circle.setAttribute('data-natural-animation', 'true');
    });

    // Enhanced hover effects
    initEnhancedHoverEffects();
}

function playHeroAnimation() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) {
        console.error('Hero section not found');
        return;
    }

    // Reset all elements to initial state first
    setInitialStates();

    // Debug: Check if elements are found
    const textElements = [
        '.hero-section [data-animation="greeting"]',
        '.hero-section [data-animation="name"]',
        '.hero-section [data-animation="tagline"]',
        '.hero-section [data-animation="description"]',
        '.hero-section [data-animation="buttons"]',
        '.hero-section [data-animation="social"]'
    ];

    console.log('Found text elements:', textElements.map(selector => document.querySelector(selector)));

    // Create a fresh timeline
    const tl = gsap.timeline();

    tl.to(textElements, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
    });

    // Profile image animation
    const profileImage = heroSection.querySelector('.lg\\:w-1\\/2 .relative');
    if (profileImage) {
        console.log('Profile image found');
        tl.to(profileImage, {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            y: 0,
            duration: 1.2,
            ease: "back.out(1.7)"
        }, "-=0.5");
    } else {
        console.error('Profile image not found');
    }

    // Background decorations animation
    const bgDecorations = heroSection.querySelectorAll('.absolute.opacity-10 > div');
    console.log('Found background decorations:', bgDecorations.length);
    tl.to(bgDecorations, {
        opacity: 0.1,
        scale: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.8");
}

function setInitialStates() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Set text elements to initial state
    const textElements = heroSection.querySelectorAll('[data-animation]');
    gsap.set(textElements, {
        opacity: 0,
        y: 50,
        rotationX: -15
    });

    // Set profile image to initial state
    const profileImage = heroSection.querySelector('.lg\\:w-1\\/2 .relative');
    if (profileImage) {
        gsap.set(profileImage, {
            opacity: 0,
            scale: 0.8,
            rotationY: -20,
            y: 100
        });
    }

    // Set background decorations to initial state
    const bgDecorations = heroSection.querySelectorAll('.absolute.opacity-10 > div');
    gsap.set(bgDecorations, {
        opacity: 0,
        scale: 0.5,
        rotation: -180
    });
}

function initAboutAnimations() {
    console.log('Initializing About section animations...');
    const aboutSection = document.querySelector('.about-section');
    if (!aboutSection) {
        console.error('About section not found!');
        return;
    }
    console.log('About section found, setting up animations...');

    // Set initial states
    setAboutInitialStates();

    // Create ScrollTrigger for About section with unique ID to avoid conflicts
    ScrollTrigger.create({
        trigger: aboutSection,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        id: "about-section-trigger", // Unique ID to avoid conflicts
        onEnter: () => {
            console.log('About section entered - playing animation');
            playAboutAnimation();
        },
        onEnterBack: () => {
            console.log('About section re-entered - playing animation');
            playAboutAnimation();
        }
    });

    // Initialize background animations for About section with reduced intensity
    if (typeof AnimationUtils !== 'undefined') {
        AnimationUtils.initSectionBackgroundAnimations('.about-section', {
            diagonalLines: {
                count: 1, // Reduced from 2
                opacity: 0.4, // Reduced from 0.6
                scaleX: 1.2, // Reduced from 1.3
                duration: 3.0, // Increased from 2.5
                rotationDuration: 6 // Increased from 5
            },
            splineCurves: {
                count: 1,
                opacity: 0.3, // Reduced from 0.4
                scale: 1.05, // Reduced from 1.1
                duration: 4.0, // Increased from 3.5
                rotationDuration: 8 // Increased from 6
            }
        });
    }
}

function setAboutInitialStates() {
    const aboutSection = document.querySelector('.about-section');
    if (!aboutSection) return;

    // Set text elements to initial state
    const textElements = aboutSection.querySelectorAll('[data-animation]');
    gsap.set(textElements, {
        opacity: 0,
        y: 30,
        rotationX: -10
    });

    // Set card to initial state
    const aboutCard = aboutSection.querySelector('.about-card');
    if (aboutCard) {
        gsap.set(aboutCard, {
            opacity: 0,
            scale: 0.9,
            y: 50
        });
    }
}

function playAboutAnimation() {
    const aboutSection = document.querySelector('.about-section');
    if (!aboutSection) return;

    // Reset all elements to initial state first
    setAboutInitialStates();

    // Create a fresh timeline
    const tl = gsap.timeline();

    // Animate title
    const title = aboutSection.querySelector('[data-animation="title"]');
    if (title) {
        tl.to(title, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    }

    // Animate intro text
    const intro = aboutSection.querySelector('[data-animation="intro"]');
    if (intro) {
        tl.to(intro, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.4");
    }

    // Animate card
    const aboutCard = aboutSection.querySelector('.about-card');
    if (aboutCard) {
        tl.to(aboutCard, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: "back.out(1.7)"
        }, "-=0.6");
    }

    // Animate facts title
    const factsTitle = aboutSection.querySelector('[data-animation="facts-title"]');
    if (factsTitle) {
        tl.to(factsTitle, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.8");
    }

    // Animate fact cards with stagger
    const factCards = aboutSection.querySelectorAll('[data-animation^="fact-"]');
    tl.to(factCards, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
    }, "-=0.6");
}

function initParticleSystem() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Create particle container
    let particleContainer = heroSection.querySelector('.particle-container');
    if (!particleContainer) {
        particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container absolute inset-0 pointer-events-none overflow-hidden';
        heroSection.appendChild(particleContainer);
    }

    // Clear existing particles
    particleContainer.innerHTML = '';

    // Create particles
    const particleCount = window.innerWidth < 768 ? 10 : 20;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle absolute w-2 h-2 rounded-full';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.bottom = '-20px';
        particle.style.backgroundColor = Math.random() > 0.5 ? '#3B82F6' : '#8B5CF6';
        particle.style.opacity = '0.6';
        particleContainer.appendChild(particle);
        particles.push(particle);
    }

    // Animate particles with ScrollTrigger
    ScrollTrigger.create({
        trigger: heroSection,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => animateParticles(particles),
        onEnterBack: () => animateParticles(particles)
    });
}

function animateParticles(particles) {
    particles.forEach((particle, index) => {
        gsap.to(particle, {
            y: -window.innerHeight - 100,
            x: Math.random() * 200 - 100,
            duration: 8 + Math.random() * 4,
            delay: index * 0.2,
            ease: "none",
            opacity: 0,
            onComplete: () => {
                particle.style.bottom = '-20px';
                particle.style.opacity = '0.6';
            }
        });
    });
}

function initMorphingShapes() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Create morphing shapes container
    let shapesContainer = heroSection.querySelector('.morphing-shapes');
    if (!shapesContainer) {
        shapesContainer = document.createElement('div');
        shapesContainer.className = 'morphing-shapes absolute inset-0 pointer-events-none overflow-hidden';
        heroSection.appendChild(shapesContainer);
    }

    // Animate shapes with ScrollTrigger
    ScrollTrigger.create({
        trigger: heroSection,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => createAndAnimateMorphingShapes(shapesContainer),
        onEnterBack: () => createAndAnimateMorphingShapes(shapesContainer)
    });
}

function createAndAnimateMorphingShapes(shapesContainer) {
    // Clear existing shapes
    shapesContainer.innerHTML = '';

    // Create morphing shapes with random positions
    const shapes = [];
    const colors = [
        'linear-gradient(45deg, #3B82F6, #8B5CF6)',
        'linear-gradient(45deg, #8B5CF6, #EC4899)',
        'linear-gradient(45deg, #10B981, #3B82F6)'
    ];

    // Different dimensions for each shape
    const dimensions = [
        { width: '24rem', height: '24rem' }, // 384px - Large
        { width: '16rem', height: '16rem' }, // 256px - Medium
        { width: '12rem', height: '12rem' }  // 192px - Small
    ];

    for (let i = 0; i < 3; i++) {
        const shape = document.createElement('div');
        shape.className = 'morphing-shape absolute rounded-full';
        shape.style.background = colors[i];
        shape.style.width = dimensions[i].width;
        shape.style.height = dimensions[i].height;
        
        // Random positions within the hero section
        const randomX = Math.random() * 80 + 10; // 10% to 90% of width
        const randomY = Math.random() * 80 + 10; // 10% to 90% of height
        shape.style.left = randomX + '%';
        shape.style.top = randomY + '%';
        
        shape.style.opacity = '0.1';
        shape.style.transform = 'scale(0.5)';
        shapesContainer.appendChild(shape);
        shapes.push(shape);
    }

    // Create animated diagonal lines
    const diagonalLines = [];
    for (let i = 0; i < 4; i++) {
        const line = document.createElement('div');
        line.className = 'diagonal-line absolute';
        line.style.background = 'linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.3), transparent)';
        line.style.height = '3px';
        line.style.width = '300px';
        line.style.opacity = '0';
        line.style.zIndex = '1';
        
        // Random positions and angles
        const randomX = Math.random() * 80 + 10; // 10% to 90% of width
        const randomY = Math.random() * 80 + 10; // 10% to 90% of height
        const randomAngle = Math.random() * 360;
        
        line.style.left = randomX + '%';
        line.style.top = randomY + '%';
        line.style.transform = `rotate(${randomAngle}deg)`;
        line.style.transformOrigin = 'center center';
        
        shapesContainer.appendChild(line);
        diagonalLines.push(line);
        console.log(`Created diagonal line ${i + 1} at ${randomX.toFixed(1)}%, ${randomY.toFixed(1)}% with angle ${randomAngle.toFixed(1)}°`);
    }

    // Create animated spline curves
    const splineCurves = [];
    for (let i = 0; i < 3; i++) {
        const curve = document.createElement('div');
        curve.className = 'spline-curve absolute';
        curve.style.width = '200px';
        curve.style.height = '200px';
        curve.style.border = '3px solid rgba(139, 92, 246, 0.2)';
        curve.style.borderRadius = '50%';
        curve.style.opacity = '0';
        curve.style.zIndex = '1';
        
        // Random positions
        const randomX = Math.random() * 80 + 10;
        const randomY = Math.random() * 80 + 10;
        curve.style.left = randomX + '%';
        curve.style.top = randomY + '%';
        
        shapesContainer.appendChild(curve);
        splineCurves.push(curve);
        console.log(`Created spline curve ${i + 1} at ${randomX.toFixed(1)}%, ${randomY.toFixed(1)}%`);
    }

    // Start the morphing animation
    animateMorphingShapes(shapes);
    animateDiagonalLines(diagonalLines);
    animateSplineCurves(splineCurves);
}

function animateMorphingShapes(shapes) {
    shapes.forEach((shape, index) => {
        const tl = gsap.timeline({ repeat: -1 });
        
        // Add delay based on index to stagger animations
        const delay = index * 2;
        
        // Animation cycle - slower and smoother
        tl.to(shape, {
            borderRadius: '50%',
            scale: 1,
            opacity: 0.15,
            duration: 6,
            ease: "power2.inOut",
            delay: delay
        })
        .to(shape, {
            borderRadius: '25%',
            rotation: 180,
            duration: 6,
            ease: "power2.inOut"
        }, "-=6")
        .to(shape, {
            borderRadius: '50%',
            rotation: 360,
            duration: 6,
            ease: "power2.inOut"
        }, "-=6")
        // Smooth vanish effect
        .to(shape, {
            opacity: 0,
            scale: 0.3,
            duration: 2,
            ease: "power2.inOut"
        })
        // Reposition and resize with smooth transition
        .call(() => {
            // Generate new random position
            const newX = Math.random() * 80 + 10;
            const newY = Math.random() * 80 + 10;
            
            // Generate new random dimensions
            const dimensions = [
                { width: '20rem', height: '20rem' }, // 320px
                { width: '14rem', height: '14rem' }, // 224px
                { width: '10rem', height: '10rem' }, // 160px
                { width: '28rem', height: '28rem' }, // 448px
                { width: '18rem', height: '18rem' }  // 288px
            ];
            const newDimension = dimensions[Math.floor(Math.random() * dimensions.length)];
            
            // Generate new random color
            const colors = [
                'linear-gradient(45deg, #3B82F6, #8B5CF6)',
                'linear-gradient(45deg, #8B5CF6, #EC4899)',
                'linear-gradient(45deg, #10B981, #3B82F6)',
                'linear-gradient(45deg, #F59E0B, #EF4444)',
                'linear-gradient(45deg, #06B6D4, #3B82F6)'
            ];
            const newColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Apply new properties
            shape.style.left = newX + '%';
            shape.style.top = newY + '%';
            shape.style.width = newDimension.width;
            shape.style.height = newDimension.height;
            shape.style.background = newColor;
            shape.style.transform = 'scale(0.3) rotate(0deg)';
        })
        // Smooth reappear with new properties
        .to(shape, {
            opacity: 0.1,
            scale: 1,
            duration: 2.5,
            ease: "power2.out"
        });
    });
}

function animateDiagonalLines(lines) {
    lines.forEach((line, index) => {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        
        tl.to(line, {
            opacity: 0.6,
            scaleX: 1.5,
            duration: 3,
            ease: "power2.inOut",
            delay: index * 0.5
        })
        .to(line, {
            rotation: line.style.transform.replace('rotate(', '').replace('deg)', '') + 180,
            duration: 6,
            ease: "none"
        }, 0);
    });
}

function animateSplineCurves(curves) {
    curves.forEach((curve, index) => {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        
        tl.to(curve, {
            opacity: 0.4,
            scale: 1.2,
            borderRadius: '0%',
            duration: 5,
            ease: "power2.inOut",
            delay: index * 0.8
        })
        .to(curve, {
            rotation: 360,
            duration: 8,
            ease: "none"
        }, 0);
    });
}

function initScrollEffects() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Parallax effect for background elements
    gsap.to(heroSection.querySelectorAll('.absolute.opacity-10 > div'), {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: heroSection,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Text parallax effect
    gsap.to(heroSection.querySelectorAll('.hero-text-element, .hero-name'), {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: heroSection,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
}

function initMouseTracking() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    let mouseX = 0, mouseY = 0;
    let isInHero = false;
    let rafId = null;

    // Enhanced mouse tracking with perspective effects
    heroSection.addEventListener('mouseenter', () => {
        isInHero = true;
        if (rafId) cancelAnimationFrame(rafId);
        updateMouseEffects();
    });

    heroSection.addEventListener('mouseleave', () => {
        isInHero = false;
        if (rafId) cancelAnimationFrame(rafId);
        
        // Reset mouse-following elements to neutral position (rectangles & lines)
        const profileImage = heroSection.querySelector('.lg\\:w-1\\/2 .relative');
        const morphingShapes = heroSection.querySelectorAll('.morphing-shape');
        const diagonalLines = heroSection.querySelectorAll('.diagonal-line');
        const splineCurves = heroSection.querySelectorAll('.spline-curve');
        
        // Only reset elements that don't have natural animation
        const elementsToReset = [profileImage, ...morphingShapes, ...diagonalLines, ...splineCurves].filter(el => 
            el && !el.hasAttribute('data-natural-animation')
        );
        
        gsap.to(elementsToReset, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            rotation: 0,
            scale: 1,
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out"
        });
        
        // DON'T reset circles - let them continue their natural animation
        // const bgElements = heroSection.querySelectorAll('.absolute.opacity-10 > div');
        
        // Reset glow effect
        gsap.to(heroSection, {
            boxShadow: 'none',
            duration: 0.5,
            ease: "power2.out"
        });
    });

    heroSection.addEventListener('mousemove', (e) => {
        if (!isInHero) return;
        
        const rect = heroSection.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width;
        mouseY = (e.clientY - rect.top) / rect.height;
        
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateMouseEffects);
    });

    function updateMouseEffects() {
        if (!isInHero) return;

        // Calculate normalized mouse position (-1 to 1)
        const normalizedX = (mouseX - 0.5) * 2;
        const normalizedY = (mouseY - 0.5) * 2;

        // Profile image with enhanced 3D effects (follows mouse)
        const profileImage = heroSection.querySelector('.lg\\:w-1\\/2 .relative');
        if (profileImage) {
            const imageMoveX = normalizedX * 20;
            const imageMoveY = normalizedY * 15;
            const imageRotateX = normalizedY * 12;
            const imageRotateY = normalizedX * 15;
            
            gsap.to(profileImage, {
                x: imageMoveX,
                y: imageMoveY,
                rotationX: imageRotateX,
                rotationY: imageRotateY,
                scale: 1 + Math.abs(normalizedX + normalizedY) * 0.03,
                duration: 0.8,
                ease: "power2.out"
            });
        }

        // RECTANGLES & LINES: Follow mouse rhythm
        // Morphing shapes with enhanced mouse tracking (fastest layer)
        const morphingShapes = heroSection.querySelectorAll('.morphing-shape');
        morphingShapes.forEach((shape, index) => {
            const shapeMoveX = normalizedX * (40 + index * 15);
            const shapeMoveY = normalizedY * (30 + index * 10);
            const shapeRotate = normalizedX * (25 + index * 8);
            const shapeScale = 1 + Math.abs(normalizedX + normalizedY) * (0.2 + index * 0.1);
            
            gsap.to(shape, {
                x: shapeMoveX,
                y: shapeMoveY,
                rotation: shapeRotate,
                scale: shapeScale,
                duration: 1.2,
                ease: "power2.out"
            });
        });

        // Diagonal lines with medium speed mouse tracking
        const diagonalLines = heroSection.querySelectorAll('.diagonal-line');
        diagonalLines.forEach((line, index) => {
            const lineMoveX = normalizedX * (25 + index * 8);
            const lineMoveY = normalizedY * (20 + index * 6);
            const lineRotate = normalizedX * (15 + index * 5);
            const lineScale = 1 + Math.abs(normalizedX + normalizedY) * (0.1 + index * 0.05);
            
            gsap.to(line, {
                x: lineMoveX,
                y: lineMoveY,
                rotation: lineRotate,
                scaleX: lineScale,
                duration: 1.5,
                ease: "power2.out"
            });
        });

        // Spline curves with slower mouse tracking (slowest layer)
        const splineCurves = heroSection.querySelectorAll('.spline-curve');
        splineCurves.forEach((curve, index) => {
            const curveMoveX = normalizedX * (15 + index * 5);
            const curveMoveY = normalizedY * (12 + index * 4);
            const curveRotate = normalizedX * (8 + index * 3);
            const curveScale = 1 + Math.abs(normalizedX + normalizedY) * (0.05 + index * 0.02);
            
            gsap.to(curve, {
                x: curveMoveX,
                y: curveMoveY,
                rotation: curveRotate,
                scale: curveScale,
                duration: 2,
                ease: "power2.out"
            });
        });

        // CIRCLES: Move naturally (independent of mouse)
        // Background circles - they have their own natural animation, don't follow mouse
        // The circles will continue their natural floating animation from initHeroAnimations()
        // Elements with data-natural-animation="true" are completely ignored by mouse tracking
        
                // Add subtle glow effect based on mouse position
        const glowIntensity = Math.abs(normalizedX + normalizedY) * 0.3;
        gsap.to(heroSection, {
            boxShadow: `0 0 ${20 + glowIntensity * 50}px rgba(59, 130, 246, ${0.1 + glowIntensity * 0.2})`,
            duration: 0.5,
            ease: "power2.out"
        });
    }
}

function initEnhancedHoverEffects() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Enhanced button hover effects
    const buttons = heroSection.querySelectorAll('.hero-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                y: -5,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Enhanced social icons hover effects
    const socialIcons = heroSection.querySelectorAll('.space-x-6 a');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                scale: 1.2,
                rotation: 360,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        });

        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                scale: 1,
                rotation: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });

    // Enhanced profile image hover effect
    const profileImage = heroSection.querySelector('.lg\\:w-1\\/2 .relative');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', () => {
            gsap.to(profileImage, {
                scale: 1.05,
                rotationY: 5,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        profileImage.addEventListener('mouseleave', () => {
            gsap.to(profileImage, {
                scale: 1,
                rotationY: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    }
}

// Enhanced typing effect with GSAP
let typingEffectInitialized = false;

function initTypingEffect() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;

    // Only initialize once
    if (typingEffectInitialized) {
        console.log('Typing effect already initialized, skipping...');
        return;
    }

    console.log('Initializing typing effect...');
    
    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    
    // Remove the border-right style since we'll use a separate cursor
    typewriterElement.style.borderRight = 'none';
    
    // Create a cursor element that will follow the text
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.style.cssText = `
        display: inline-block;
        width: 2px;
        height: 1.2em;
        background-color: #93c5fd;
        margin-left: 2px;
        vertical-align: text-bottom;
        animation: blink 0.7s step-end infinite;
    `;
    
    // Add cursor to the typewriter element
    typewriterElement.appendChild(cursor);

    const chars = text.split('');
    const timeline = gsap.timeline({ delay: 1.5 });

    chars.forEach((char, index) => {
        timeline.to(typewriterElement, {
            duration: 0.05,
            onUpdate: function() {
                // Update text content
                const textContent = chars.slice(0, index + 1).join('');
                typewriterElement.textContent = textContent;
                // Re-add the cursor after updating text
                typewriterElement.appendChild(cursor);
            }
        });
    });
    
    typingEffectInitialized = true;
}



// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

// Reset initialization flag when page is unloaded
window.addEventListener('beforeunload', function() {
    heroAnimationsInitialized = false;
    typingEffectInitialized = false;
});

// Add window resize handler for responsive animations
window.addEventListener('resize', function() {
    // Refresh ScrollTrigger on resize
    ScrollTrigger.refresh();
}); 