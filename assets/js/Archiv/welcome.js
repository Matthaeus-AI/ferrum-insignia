/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CoffeeKiss - Coffee Bean Animation Engine
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Innovative Kaffeebohnen-Partikelsystem mit Eigenrotation
 * Basierend auf mathematisch präziser State-Machine-Architektur
 * 
 * Features:
 * - Image-based Particle System (PNG-Kaffeebohnen)
 * - Eigenrotation um eigene Achse
 * - Slow Stellar Drift Animation
 * - State-Machine (normal, hover, departure)
 * - Exponential Velocity Algorithm
 * - Adaptive Performance Management
 * - Navigation zu home.html
 * 
 * @version 1.0.0
 * @author CoffeeKiss Development Team
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // Global Configuration & Constants
    // ═══════════════════════════════════════════════════════════════════════
    
    const config = window.COFFEE_BEAN_CONFIG || {
        beanImages: [
            'assets/images/coffee-bean.png',
            'assets/images/coffee-bean-dark.png',
            'assets/images/coffee-bean-light.png'
        ],
        density: 1.0,
        precision: 'high',
        animationSpeed: 1.0,
        beanSizeMin: 12,
        beanSizeMax: 32,
        rotationSpeed: {
            base: 0.15,
            hover: 0.4,
            departure: 1.5
        },
        velocityMultipliers: {
            base: 0.15,
            hover: 1.8,
            departure: 7.5,
            exponent: 2.4,
            duration: 1400
        },
        enablePerformanceMonitoring: true,
        targetFrameRate: 60,
        adaptiveQuality: true,
        states: {
            normal: 'normal',
            hover: 'hover',
            departure: 'departure',
            reducedMotion: 'reduced-motion'
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Canvas & Context
    // ═══════════════════════════════════════════════════════════════════════
    
    let canvas;
    let ctx;
    let animationFrameId = null;

    // ═══════════════════════════════════════════════════════════════════════
    // Coffee Bean Image Management
    // ═══════════════════════════════════════════════════════════════════════
    
    const beanImages = [];
    let imagesLoaded = 0;
    let imagesTotal = 0;
    let allImagesLoaded = false;

    // ═══════════════════════════════════════════════════════════════════════
    // Particle System State
    // ═══════════════════════════════════════════════════════════════════════
    
    let coffeeBeans = [];
    let currentState = config.states.normal;
    let departureStartTime = 0;
    let isNavigating = false;

    // ═══════════════════════════════════════════════════════════════════════
    // Performance Monitoring
    // ═══════════════════════════════════════════════════════════════════════
    
    let lastFrameTime = 0;
    let deltaTime = 0;
    let fps = 60;
    let frameCount = 0;
    let fpsUpdateTime = 0;

    // ═══════════════════════════════════════════════════════════════════════
    // DOM Elements
    // ═══════════════════════════════════════════════════════════════════════
    
    let enterButton;
    let container;
    let loaderTransition;

    // ═══════════════════════════════════════════════════════════════════════
    // Coffee Bean Class - Particle with Rotation
    // ═══════════════════════════════════════════════════════════════════════
    
    class CoffeeBean {
        constructor(x, y, vx, vy, size, imageIndex, depth) {
            // Position
            this.x = x;
            this.y = y;
            this.z = depth || Math.random(); // Depth for layering (0-1)
            
            // Velocity
            this.vx = vx;
            this.vy = vy;
            
            // Size
            this.baseSize = size;
            this.size = size * (0.5 + this.z * 0.5); // Size varies with depth
            
            // Image
            this.imageIndex = imageIndex;
            
            // ⚠️ ROTATION PROPERTIES (NEU!)
            this.rotation = Math.random() * Math.PI * 2; // Random start angle (0-360°)
            this.rotationSpeed = (Math.random() - 0.5) * 1.5 * config.rotationSpeed.base; // Random rotation speed (reduced variation)
            
            // Visual properties
            this.opacity = 0.6 + this.z * 0.4; // Opacity varies with depth
            this.scale = 1.0;
        }

        /**
         * Update bean position and rotation
         */
        update(deltaTime, velocityMultiplier, rotationMultiplier) {
            // Update position (drift)
            this.x += this.vx * velocityMultiplier * deltaTime * 60;
            this.y += this.vy * velocityMultiplier * deltaTime * 60;
            
            // ⚠️ Update rotation (eigenrotation um eigene Achse)
            this.rotation += this.rotationSpeed * rotationMultiplier * deltaTime * 60;
            
            // Wrap around edges
            const margin = this.size + 50;
            
            if (this.x < -margin) {
                this.x = canvas.width + margin;
            } else if (this.x > canvas.width + margin) {
                this.x = -margin;
            }
            
            if (this.y < -margin) {
                this.y = canvas.height + margin;
            } else if (this.y > canvas.height + margin) {
                this.y = -margin;
            }
        }

        /**
         * Draw coffee bean on canvas with rotation
         */
        draw(ctx) {
            const img = beanImages[this.imageIndex];
            
            // Skip if image not loaded
            if (!img || !img.complete) return;
            
            // Save context state
            ctx.save();
            
            // Set opacity based on depth
            ctx.globalAlpha = this.opacity;
            
            // ⚠️ Apply transformation matrix for rotation
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation); // Eigenrotation!
            ctx.scale(this.scale, this.scale);
            
            // Draw bean centered at origin
            const drawSize = this.size;
            ctx.drawImage(
                img,
                -drawSize / 2,
                -drawSize / 2,
                drawSize,
                drawSize
            );
            
            // Restore context state
            ctx.restore();
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Image Preloading System
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Preload all coffee bean images
     */
    function preloadImages() {
        console.log('CoffeeKiss: Starting image preload...');
        
        imagesTotal = config.beanImages.length;
        
        if (imagesTotal === 0) {
            console.warn('CoffeeKiss: No images configured, using placeholders');
            createPlaceholderBeans();
            return;
        }
        
        // Set timeout to use placeholders if images take too long
        const loadTimeout = setTimeout(() => {
            if (imagesLoaded < imagesTotal) {
                console.warn('CoffeeKiss: Image loading timeout, using placeholders');
                createPlaceholderBeans();
            }
        }, 2000); // 2 second timeout
        
        config.beanImages.forEach((src, index) => {
            const img = new Image();
            
            img.onload = () => {
                imagesLoaded++;
                console.log(`✓ Coffee bean image loaded [${imagesLoaded}/${imagesTotal}]: ${src}`);
                
                if (imagesLoaded === imagesTotal) {
                    clearTimeout(loadTimeout);
                    allImagesLoaded = true;
                    console.log('✓ All coffee bean images loaded successfully!');
                    initializeCoffeeBeanSystem();
                }
            };
            
            img.onerror = (error) => {
                console.error(`✗ Failed to load coffee bean image: ${src}`);
                imagesLoaded++;
                
                // Use placeholders if all images fail
                if (imagesLoaded === imagesTotal) {
                    clearTimeout(loadTimeout);
                    console.warn('⚠ All images failed to load, using placeholders');
                    createPlaceholderBeans();
                }
            };
            
            img.src = src;
            beanImages[index] = img;
        });
    }

    /**
     * Create high-quality placeholder coffee beans
     */
    function createPlaceholderBeans() {
        console.log('CoffeeKiss: Creating placeholder coffee beans...');
        
        const colors = [
            { fill: '#6f4e37', shadow: '#4a3224', highlight: '#8b6347' }, // Medium
            { fill: '#3e2723', shadow: '#2c1b1a', highlight: '#5d3a2e' }, // Dark
            { fill: '#a67c52', shadow: '#7a5a3c', highlight: '#c4986b' }  // Light
        ];
        
        colors.forEach((colorScheme, index) => {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            
            // Enable anti-aliasing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Center point
            const cx = 64;
            const cy = 64;
            
            // Shadow
            ctx.fillStyle = colorScheme.shadow;
            ctx.beginPath();
            ctx.ellipse(cx + 2, cy + 3, 28, 21, Math.PI * 0.15, 0, Math.PI * 2);
            ctx.fill();
            
            // Main bean body
            const gradient = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, 30);
            gradient.addColorStop(0, colorScheme.highlight);
            gradient.addColorStop(0.5, colorScheme.fill);
            gradient.addColorStop(1, colorScheme.shadow);
            ctx.fillStyle = gradient;
            
            ctx.beginPath();
            ctx.ellipse(cx, cy, 28, 21, Math.PI * 0.15, 0, Math.PI * 2);
            ctx.fill();
            
            // Bean crack (characteristic line)
            ctx.strokeStyle = colorScheme.shadow;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 2;
            
            ctx.beginPath();
            ctx.moveTo(cx - 5, cy - 18);
            ctx.quadraticCurveTo(cx - 8, cy, cx - 5, cy + 18);
            ctx.stroke();
            
            ctx.shadowBlur = 0;
            
            // Highlight on crack
            ctx.strokeStyle = colorScheme.highlight;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx - 3, cy - 16);
            ctx.quadraticCurveTo(cx - 6, cy, cx - 3, cy + 16);
            ctx.stroke();
            
            // Subtle texture
            for (let i = 0; i < 20; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 15;
                const x = cx + Math.cos(angle) * distance;
                const y = cy + Math.sin(angle) * distance;
                
                ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.05})`;
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Convert canvas to image
            const img = new Image();
            img.src = canvas.toDataURL('image/png');
            beanImages[index] = img;
        });
        
        console.log('✓ Placeholder coffee beans created');
        allImagesLoaded = true;
        initializeCoffeeBeanSystem();
    }
    
    /**
     * Fallback system if images fail to load
     */
    function createFallbackSystem() {
        console.warn('CoffeeKiss: External images failed, using high-quality placeholders');
        createPlaceholderBeans();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Initialization
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Initialize canvas and context
     */
    function initializeCanvas() {
        canvas = document.getElementById('coffeeBeanSystem');
        
        if (!canvas) {
            console.error('CoffeeKiss: Canvas element not found!');
            return false;
        }
        
        ctx = canvas.getContext('2d', {
            alpha: true,
            desynchronized: true,
            willReadFrequently: false
        });
        
        if (!ctx) {
            console.error('CoffeeKiss: Failed to get 2D context!');
            return false;
        }
        
        // Set canvas size
        resizeCanvas();
        
        console.log('✓ Canvas initialized:', canvas.width, 'x', canvas.height);
        return true;
    }

    /**
     * Resize canvas to window size
     */
    function resizeCanvas() {
        if (!canvas) return;
        
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        
        if (ctx) {
            ctx.scale(dpr, dpr);
        }
        
        // Update bean count on resize
        if (coffeeBeans.length > 0) {
            const newBeanCount = calculateBeanCount();
            const currentBeanCount = coffeeBeans.length;
            
            if (newBeanCount > currentBeanCount) {
                // Add more beans
                const beansToAdd = newBeanCount - currentBeanCount;
                for (let i = 0; i < beansToAdd; i++) {
                    coffeeBeans.push(createRandomBean());
                }
            } else if (newBeanCount < currentBeanCount) {
                // Remove excess beans
                coffeeBeans = coffeeBeans.slice(0, newBeanCount);
            }
        }
    }

    /**
     * Calculate optimal number of beans based on viewport
     */
    function calculateBeanCount() {
        const viewportArea = window.innerWidth * window.innerHeight;
        const baseCount = parseInt(
            getComputedStyle(document.documentElement)
                .getPropertyValue('--bean-count-coefficient') || '80'
        );
        
        const finalCount = Math.round(baseCount * config.density);
        
        // Clamp between reasonable limits
        return Math.max(20, Math.min(150, finalCount));
    }

    /**
     * Create a random coffee bean
     */
    function createRandomBean() {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        // Random velocity (slow drift)
        const speed = config.velocityMultipliers.base;
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        // Random size
        const size = config.beanSizeMin + 
                    Math.random() * (config.beanSizeMax - config.beanSizeMin);
        
        // Random image (if multiple images available)
        const imageIndex = Math.floor(Math.random() * beanImages.length);
        
        // Random depth
        const depth = Math.random();
        
        return new CoffeeBean(x, y, vx, vy, size, imageIndex, depth);
    }

    /**
     * Initialize coffee bean system
     */
    function initializeCoffeeBeanSystem() {
        console.log('CoffeeKiss: Initializing coffee bean system...');
        
        // Calculate bean count
        const beanCount = calculateBeanCount();
        console.log(`CoffeeKiss: Creating ${beanCount} coffee beans`);
        
        // Create beans
        coffeeBeans = [];
        for (let i = 0; i < beanCount; i++) {
            coffeeBeans.push(createRandomBean());
        }
        
        // Sort by depth (back to front)
        coffeeBeans.sort((a, b) => a.z - b.z);
        
        console.log('✓ Coffee bean system initialized');
        
        // Start animation
        startAnimation();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Animation Loop
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Start animation loop
     */
    function startAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        lastFrameTime = performance.now();
        console.log('✓ Animation started');
        
        animate(lastFrameTime);
    }

    /**
     * Main animation loop
     */
    function animate(currentTime) {
        animationFrameId = requestAnimationFrame(animate);
        
        // Calculate delta time
        deltaTime = (currentTime - lastFrameTime) / 1000; // Convert to seconds
        deltaTime = Math.min(deltaTime, 0.1); // Cap at 100ms to prevent huge jumps
        lastFrameTime = currentTime;
        
        // Update FPS counter
        frameCount++;
        if (currentTime - fpsUpdateTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            fpsUpdateTime = currentTime;
            
            // Update canvas data attribute
            if (canvas) {
                canvas.setAttribute('data-current-fps', fps);
            }
        }
        
        // Get velocity and rotation multipliers based on current state
        const velocityMultiplier = getVelocityMultiplier(currentTime);
        const rotationMultiplier = getRotationMultiplier();
        
        // Clear canvas
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Update and draw all coffee beans
        for (let i = 0; i < coffeeBeans.length; i++) {
            const bean = coffeeBeans[i];
            bean.update(deltaTime, velocityMultiplier, rotationMultiplier);
            bean.draw(ctx);
        }
        
        // Check if departure animation is complete
        if (currentState === config.states.departure) {
            const departureProgress = (currentTime - departureStartTime) / config.velocityMultipliers.duration;
            
            if (departureProgress >= 1.0 && !isNavigating) {
                navigateToHome();
            }
        }
    }

    /**
     * Get velocity multiplier based on current state
     */
    function getVelocityMultiplier(currentTime) {
        switch (currentState) {
            case config.states.normal:
                return config.velocityMultipliers.base;
            
            case config.states.hover:
                return config.velocityMultipliers.hover;
            
            case config.states.departure:
                // Exponential acceleration
                const progress = (currentTime - departureStartTime) / config.velocityMultipliers.duration;
                const clampedProgress = Math.min(progress, 1.0);
                const exponentialFactor = Math.pow(
                    config.velocityMultipliers.departure,
                    config.velocityMultipliers.exponent * clampedProgress
                );
                return config.velocityMultipliers.base * exponentialFactor;
            
            case config.states.reducedMotion:
                return 0;
            
            default:
                return config.velocityMultipliers.base;
        }
    }

    /**
     * Get rotation multiplier based on current state
     */
    function getRotationMultiplier() {
        switch (currentState) {
            case config.states.normal:
                return config.rotationSpeed.base;
            
            case config.states.hover:
                return config.rotationSpeed.hover;
            
            case config.states.departure:
                return config.rotationSpeed.departure;
            
            case config.states.reducedMotion:
                return 0;
            
            default:
                return config.rotationSpeed.base;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // State Management
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Set animation state
     */
    function setState(newState) {
        if (currentState === newState) return;
        
        console.log(`State transition: ${currentState} → ${newState}`);
        currentState = newState;
        
        // Update container data attribute
        if (container) {
            container.setAttribute('data-animation-state', newState);
        }
        
        // Update canvas data attribute
        if (canvas) {
            canvas.setAttribute('data-animation-state', newState);
        }
        
        // Handle departure state
        if (newState === config.states.departure) {
            departureStartTime = performance.now();
            startDepartureSequence();
        }
    }

    /**
     * Start departure animation sequence
     */
    function startDepartureSequence() {
        console.log('✓ Departure sequence initiated');
        
        // Update container
        if (container) {
            container.setAttribute('data-departure-phase', '1');
        }
        
        // Fade out text content (optional CSS animation)
        const content = document.querySelector('.coffee-content');
        if (content) {
            content.style.opacity = '0';
            content.style.transition = 'opacity 0.6s ease';
        }
    }

    /**
     * Navigate to home.html
     */
    function navigateToHome() {
        if (isNavigating) return;
        
        isNavigating = true;
        console.log('✓ Navigating to home.html');
        
        // Show loader transition
        if (loaderTransition) {
            loaderTransition.classList.add('active');
        }
        
        // Navigate after transition
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 600);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Event Handlers
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Button hover enter
     */
    function onButtonHoverEnter() {
        if (currentState === config.states.normal) {
            setState(config.states.hover);
        }
    }

    /**
     * Button hover leave
     */
    function onButtonHoverLeave() {
        if (currentState === config.states.hover) {
            setState(config.states.normal);
        }
    }

    /**
     * Button click
     */
    function onButtonClick() {
        if (currentState !== config.states.departure && !isNavigating) {
            setState(config.states.departure);
        }
    }

    /**
     * Window resize handler
     */
    function onWindowResize() {
        resizeCanvas();
    }

    /**
     * Visibility change handler
     */
    function onVisibilityChange() {
        if (document.hidden) {
            // Pause animation when tab is hidden
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        } else {
            // Resume animation when tab is visible
            if (!animationFrameId) {
                lastFrameTime = performance.now();
                animate(lastFrameTime);
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Setup & Initialization
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Setup DOM references
     */
    function setupDOMReferences() {
        enterButton = document.getElementById('enterButton');
        container = document.querySelector('.quantum-container');
        loaderTransition = document.querySelector('.loader-transition');
        
        if (!enterButton) {
            console.error('CoffeeKiss: Enter button not found!');
            return false;
        }
        
        console.log('✓ DOM references established');
        return true;
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Button events
        if (enterButton) {
            enterButton.addEventListener('mouseenter', onButtonHoverEnter);
            enterButton.addEventListener('mouseleave', onButtonHoverLeave);
            enterButton.addEventListener('click', onButtonClick);
            
            // Touch support
            enterButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                onButtonHoverEnter();
            });
            enterButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                onButtonClick();
            });
        }
        
        // Window events
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('visibilitychange', onVisibilityChange);
        
        // Reduced motion preference
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reducedMotionQuery.matches) {
            setState(config.states.reducedMotion);
        }
        reducedMotionQuery.addEventListener('change', (e) => {
            if (e.matches) {
                setState(config.states.reducedMotion);
            } else {
                setState(config.states.normal);
            }
        });
        
        console.log('✓ Event listeners registered');
    }

    /**
     * Main initialization function
     */
    function init() {
        console.log('═══════════════════════════════════════════════════════');
        console.log('CoffeeKiss Animation Engine v1.0.0');
        console.log('═══════════════════════════════════════════════════════');
        
        // Setup DOM
        if (!setupDOMReferences()) {
            console.error('✗ Failed to setup DOM references');
            return;
        }
        
        // Initialize canvas
        if (!initializeCanvas()) {
            console.error('✗ Failed to initialize canvas');
            return;
        }
        
        // Setup event listeners
        setupEventListeners();
        
        // Preload images and start animation
        preloadImages();
        
        console.log('✓ CoffeeKiss Animation Engine initialized');
        console.log('═══════════════════════════════════════════════════════');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Cleanup
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Destroy animation engine and cleanup
     */
    function destroy() {
        console.log('CoffeeKiss: Cleaning up...');
        
        // Cancel animation frame
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        
        // Remove event listeners
        if (enterButton) {
            enterButton.removeEventListener('mouseenter', onButtonHoverEnter);
            enterButton.removeEventListener('mouseleave', onButtonHoverLeave);
            enterButton.removeEventListener('click', onButtonClick);
        }
        
        window.removeEventListener('resize', onWindowResize);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        
        // Clear beans
        coffeeBeans = [];
        
        console.log('✓ Cleanup complete');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Public API
    // ═══════════════════════════════════════════════════════════════════════
    
    window.coffeeBeanEngine = {
        init,
        destroy,
        setState,
        getState: () => currentState,
        getBeanCount: () => coffeeBeans.length,
        getFPS: () => fps,
        config
    };

    // ═══════════════════════════════════════════════════════════════════════
    // Auto-initialize on DOM ready
    // ═══════════════════════════════════════════════════════════════════════
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        init();
    }

})();
