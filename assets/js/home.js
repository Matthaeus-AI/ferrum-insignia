// home.js - Ferrum Insignia Quantum Animation Engine - OPTIMIERT OHNE SLIDEBARS

/**
 * HeroParticleSystem
 * Advanced particle physics with mouse interaction and optimized rendering
 */
class HeroParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.particleCount = 80;
        this.connectionDistance = 120;
        this.mouseRadius = 150;
        this.initialized = false;
        this.frameId = null;
        this.lastFrameTime = 0;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.visibilityState = true;
        
        // Performance optimization: Pre-allocate arrays
        this.particleConnectionIndexes = [];
        
        // Spatial partitioning grid for connection optimization
        this.gridSize = 150; // Grid cell size, slightly larger than connectionDistance
        this.grid = {}; // Sparse hash grid
        
        this.init();
    }
    
    init() {
        // Set canvas DPI correctly for modern displays
        this.resizeCanvas();
        this.createParticles();
        this.bindEvents();
        this.lastFrameTime = performance.now();
        this.animate(this.lastFrameTime);
        this.initialized = true;
    }
    
    resizeCanvas() {
        // High DPI display support
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;
        
        // Set canvas size for proper rendering
        this.canvas.width = displayWidth * dpr;
        this.canvas.height = displayHeight * dpr;
        
        // Set CSS size for proper display
        this.canvas.style.width = `${displayWidth}px`;
        this.canvas.style.height = `${displayHeight}px`;
        
        // Update particle count based on viewport size
        this.particleCount = Math.min(Math.floor((displayWidth * displayHeight) / 15000), 100);
        
        // Reset canvas to prevent blurring
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);
    }
    
    createParticles() {
        this.particles = [];
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.5 + 0.5,
                density: Math.random() * 30 + 1,
                gridX: 0, // Will be updated in updateGrid()
                gridY: 0  // Will be updated in updateGrid()
            });
        }
        
        // Pre-calculate connection indexes
        this.updateParticleConnectionIndexes();
    }
    
    // Update particle grid position
    updateGrid() {
        // Clear the grid
        this.grid = {};
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            // Calculate grid cell
            const gridX = Math.floor(particle.x / this.gridSize);
            const gridY = Math.floor(particle.y / this.gridSize);
            
            // Update particle grid position
            particle.gridX = gridX;
            particle.gridY = gridY;
            
            // Add particle to grid
            const gridKey = `${gridX},${gridY}`;
            if (!this.grid[gridKey]) {
                this.grid[gridKey] = [];
            }
            
            this.grid[gridKey].push(i); // Store particle index
        }
    }
    
    // Pre-calculate potential connection indexes
    updateParticleConnectionIndexes() {
        this.particleConnectionIndexes = [];
        
        // Use a spatial partitioning approach with neighboring cells
        for (let i = 0; i < this.particles.length; i++) {
            this.particleConnectionIndexes[i] = [];
            
            for (let j = i + 1; j < this.particles.length; j++) {
                this.particleConnectionIndexes[i].push(j);
            }
        }
    }
    
    bindEvents() {
        // Optimized resize handler with debounce
        let resizeTimeout;
        const resizeHandler = () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            
            resizeTimeout = setTimeout(() => {
                if (this.initialized) {
                    this.resizeCanvas();
                    this.createParticles();
                }
            }, 150);
        };
        
        window.addEventListener('resize', resizeHandler, { passive: true });
        
        // Optimized mousemove with passive event
        const mouseMoveHandler = (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        };
        
        document.addEventListener('mousemove', mouseMoveHandler, { passive: true });
        
        // Handle visibility change to save resources
        document.addEventListener('visibilitychange', () => {
            this.visibilityState = document.visibilityState === 'visible';
            
            if (this.visibilityState && !this.frameId) {
                this.lastFrameTime = performance.now();
                this.animate(this.lastFrameTime);
            }
        });
        
        // Store event handlers for cleanup
        this.eventHandlers = {
            resize: resizeHandler,
            mousemove: mouseMoveHandler
        };
    }
    
    animate(currentTime) {
        // Use RAF for optimal animation timing
        this.frameId = requestAnimationFrame((time) => this.animate(time));
        
        // Skip animation if not visible
        if (!this.visibilityState) return;
        
        // Throttle rendering to target FPS
        const elapsed = currentTime - this.lastFrameTime;
        if (elapsed < this.frameInterval) return;
        
        // Update time tracking
        this.lastFrameTime = currentTime - (elapsed % this.frameInterval);
        
        // Clear canvas with optimization
        this.ctx.clearRect(0, 0, this.canvas.width / (window.devicePixelRatio || 1), 
                          this.canvas.height / (window.devicePixelRatio || 1));
        
        // Update grid for spatial partitioning
        this.updateGrid();
        
        // Batch update physics for all particles
        this.updateParticles();
        
        // Batch rendering operations for better performance
        this.drawParticles();
        this.drawConnections();
    }
    
    updateParticles() {
        const displayWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const displayHeight = this.canvas.height / (window.devicePixelRatio || 1);
        const mouseRadiusSquared = this.mouseRadius * this.mouseRadius;
        
        // Batch update physics for all particles
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Mouse interaction with spatial optimization
            const dx = this.mousePosition.x - particle.x;
            const dy = this.mousePosition.y - particle.y;
            const distanceSquared = dx * dx + dy * dy;
            
            // Skip square root calculation when possible
            if (distanceSquared < mouseRadiusSquared) {
                const distance = Math.sqrt(distanceSquared);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (this.mouseRadius - distance) / this.mouseRadius;
                const directionX = forceDirectionX * force * particle.density * 0.05;
                const directionY = forceDirectionY * force * particle.density * 0.05;
                
                particle.vx -= directionX;
                particle.vy -= directionY;
            }
            
            // Boundary check with velocity inversion
            if (particle.x < 0) {
                particle.x = 0;
                particle.vx *= -1;
            } else if (particle.x > displayWidth) {
                particle.x = displayWidth;
                particle.vx *= -1;
            }
            
            if (particle.y < 0) {
                particle.y = 0;
                particle.vy *= -1;
            } else if (particle.y > displayHeight) {
                particle.y = displayHeight;
                particle.vy *= -1;
            }
            
            // Apply friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        }
    }
    
    drawParticles() {
        // Batch rendering for performance
        this.ctx.fillStyle = `rgba(192, 192, 192, 0.8)`;
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawConnections() {
        // Spatial partitioning for connection optimization
        const connectionDistanceSquared = this.connectionDistance * this.connectionDistance;
        
        this.ctx.lineWidth = 0.5;
        
        // Use pre-calculated indexes for faster iteration
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            
            // Check grid neighbors for potential connections
            const neighbors = this.getGridNeighbors(p1.gridX, p1.gridY);
            
            for (const j of neighbors) {
                // Skip if same particle or already processed
                if (j <= i) continue;
                
                const p2 = this.particles[j];
                
                // Calculate distance squared for efficiency
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distanceSquared = dx * dx + dy * dy;
                
                if (distanceSquared < connectionDistanceSquared) {
                    const distance = Math.sqrt(distanceSquared);
                    const opacity = (1 - distance / this.connectionDistance) * 0.2;
                    
                    this.ctx.strokeStyle = `rgba(192, 192, 192, ${opacity})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    // Get neighboring grid cell particles
    getGridNeighbors(gridX, gridY) {
        const neighbors = [];
        
        // Check current cell and surrounding cells
        for (let x = gridX - 1; x <= gridX + 1; x++) {
            for (let y = gridY - 1; y <= gridY + 1; y++) {
                const key = `${x},${y}`;
                if (this.grid[key]) {
                    neighbors.push(...this.grid[key]);
                }
            }
        }
        
        return neighbors;
    }
    
    destroy() {
        // Properly clean up resources
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
        
        // Clean up event listeners
        if (this.eventHandlers) {
            window.removeEventListener('resize', this.eventHandlers.resize);
            document.removeEventListener('mousemove', this.eventHandlers.mousemove);
        }
        
        this.particles = [];
        this.grid = {};
        this.particleConnectionIndexes = [];
        this.initialized = false;
    }
}

/**
 * ScrollAnimationController
 * Optimized viewport-based animation system with IntersectionObserver
 * KRITISCH MODIFIZIERT: Entfernung aller Slidebar/Scroll-Indikator Funktionalität
 */
class ScrollAnimationController {
    constructor() {
        this.sections = [];
        this.animatedElements = new Map(); // Track elements and their states
        this.observerInstances = new Map(); // Track observer instances
        this.loadProgress = 0;
        this.initialized = false;
        this.rafPending = false;
        this.resizeObserver = null;
        this.intersectionThresholds = [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]; // More granular thresholds
        
        // Optimize performance-critical parameters
        this.optimizationParameters = {
            debounceDelay: 100,
            useRAF: true,
            batchDOMUpdates: true,
            cacheComputedStyles: true,
            useWillChange: false, // Deaktiviert für bessere Performance
            applyHardwareAcceleration: true,
            // KRITISCH: Alle Scroll-Indikator Parameter deaktivieren
            createScrollIndicators: false,  // Blockiere Erzeugung von Scroll-Indikatoren
            showSectionMarkers: false,      // Blockiere Erzeugung von Sektionsmarkern
            enableVerticalScrollbar: false, // Blockiere vertikale Scrollbar
            generateSideIndicators: false,  // Blockiere seitliche Indikatoren
            showSectionLabels: false        // Blockiere Sektionslabels
        };
        
        // Element state cache for performance
        this.elementStateCache = new WeakMap();
        
        // Kill-Switch für eventuell erzeugte Indikatoren
        this.killSwitchInterval = null;
        
        // Setup IntersectionObserver with optimized configuration
        this.setupIntersectionObserver();
        
        // Immediate first cleanup
        this.removeAllScrollIndicators();
        
        // Start kill-switch for continuous monitoring
        this.startSlidebarKillSwitch();
    }
    
    /**
     * KILL-SWITCH: Kontinuierliche Überwachung und Entfernung von Slidebars
     * @private
     */
    startSlidebarKillSwitch() {
        // Execute immediate cleanup
        this.removeAllScrollIndicators();
        
        // Stop previous interval if exists
        if (this.killSwitchInterval) {
            clearInterval(this.killSwitchInterval);
        }
        
        // Start aggressive interval for repeated removal
        this.killSwitchInterval = setInterval(() => {
            this.removeAllScrollIndicators();
        }, 1000); // Check and remove every second
        
        // Observer for DOM mutations to immediately remove newly added slidebars
        if (window.MutationObserver) {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length) {
                        // If new DOM elements were added, remove slidebars
                        this.removeAllScrollIndicators();
                    }
                }
            });
            
            // Observe entire body for changes
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Store reference for cleanup
            this.mutationObserver = observer;
        }
    }
    
    /**
     * Entfernt systematisch alle Scrollindikatoren aus dem DOM
     * @private
     */
    removeAllScrollIndicators() {
        // Comprehensive list of selectors for scroll indicators
        const selectors = [
            '.scroll-indicator-quantum',
            '.scroll-line',
            '.scroll-beam',
            '.scroll-indicator',
            '.scroll-quantum-indicator',
            '.quantum-scroll-progress',
            '.scroll-progress-track',
            '.scroll-progress-bar',
            '.scroll-section-marker',
            '.scroll-section-label',
            '.scroll-progress-top',
            '.scroll-progress-bottom',
            '.scroll-indicator-container',
            '.scroll-progress-marker',
            '.scroll-progress-track-vertical',
            '.scroll-progress-indicator',
            '.scroll-indicator-wrapper',
            '.scroll-visual-indicator',
            '.scroll-markers',
            '.slide-indicator',
            '.slide-bar',
            '.slide-marker',
            '.sidebar-progress',
            '.vertical-progress',
            '.vertical-indicator',
            '.vertical-markers',
            '.vertical-navigation',
            '.side-navigation',
            '.nav-progress-indicator'
        ];
        
        // Pattern-based selectors for dynamically generated elements
        const patternSelectors = [
            '[class*="scroll-indicator"]',
            '[class*="scroll-progress"]',
            '[class*="slide-bar"]',
            '[class*="vertical-progress"]',
            '[class*="side-indicator"]',
            '[id*="scroll-indicator"]',
            '[id*="scroll-progress"]'
        ];
        
        // Attribute selectors
        const attributeSelectors = [
            '[data-scroll-indicator]',
            '[data-scroll-progress]',
            '[data-slide-indicator]',
            '[data-vertical-indicator]',
            '[data-section-indicator]'
        ];
        
        // Específico para el área Hero
        const heroSection = document.querySelector('.hero-quantum');
        if (heroSection) {
            const heroSelectors = [
                '.hero-quantum .scroll-indicator-quantum',
                '.hero-quantum .scroll-line',
                '.hero-quantum .scroll-beam',
                '.hero-quantum [class*="scroll"]',
                '.hero-quantum [class*="slider"]',
                '.hero-quantum [class*="indicator"]'
            ];
            
            heroSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el && el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                });
            });
        }
        
        // Remove all elements based on selectors
        selectors.concat(patternSelectors, attributeSelectors).forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el && el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                });
            } catch (e) {
                // Ignore errors if selector is invalid
            }
        });
    }
    
    setupIntersectionObserver() {
        // Base observer options with improved thresholds
        const baseOptions = {
            root: null,
            thresholds: this.intersectionThresholds
        };
        
        // Create main observer for sections with optimized rootMargin
        const sectionObserver = new IntersectionObserver((entries) => {
            if (!this.rafPending && this.optimizationParameters.useRAF) {
                this.rafPending = true;
                requestAnimationFrame(() => {
                    this.processSectionEntries(entries);
                    this.rafPending = false;
                });
            } else {
                this.processSectionEntries(entries);
            }
        }, {
            ...baseOptions,
            rootMargin: '-5% 0px -15% 0px' // Improved margin for sections
        });
        
        // Register all sections with the observer
        this.sections = document.querySelectorAll('section[data-section]');
        this.sections.forEach(section => {
            // Critically important: Make section immediately visible
            section.style.opacity = '1';
            section.style.visibility = 'visible';
            section.style.transform = 'translateY(0)';
            
            // Initialize state tracking with pre-computation
            this.animatedElements.set(section, {
                isVisible: true, // Set to true initially
                hasBeenVisible: true, // Set to true initially
                type: 'section',
                childElements: this.getAnimatableChildren(section),
                rootOffset: this.computeElementOffset(section),
                animationDuration: this.getAnimationDuration(section)
            });
            
            // Apply performance optimizations sparingly
            if (this.optimizationParameters.useWillChange) {
                section.style.willChange = 'opacity, transform';
            }
            
            // Start observing
            sectionObserver.observe(section);
            
            // Immediately make all child elements visible - CRITICAL FIX
            this.forceInitialSectionVisibility(section);
        });
        
        // Store observer instance
        this.observerInstances.set('sections', sectionObserver);
        
        // Create product observer with special rootMargin for better product transitions
        const productObserver = new IntersectionObserver((entries) => {
            if (!this.rafPending && this.optimizationParameters.useRAF) {
                this.rafPending = true;
                requestAnimationFrame(() => {
                    this.processProductEntries(entries);
                    this.rafPending = false;
                });
            } else {
                this.processProductEntries(entries);
            }
        }, {
            ...baseOptions,
            rootMargin: '-10% 0px -10% 0px' // Optimized margin for products
        });
        
        // Register product viewports with improved selection
        const products = document.querySelectorAll('.product-viewport');
        products.forEach(product => {
            // CRITICAL FIX: Make products initially visible
            product.style.opacity = '1';
            product.style.visibility = 'visible';
            product.style.transform = 'translateY(0)';
            
            // Initialize state tracking with performance optimizations
            this.animatedElements.set(product, {
                isVisible: true,
                hasBeenVisible: true,
                type: 'product',
                childElements: {
                    card: product.querySelector('.product-card'),
                    info: product.querySelector('.product-info')
                },
                layout: product.getAttribute('data-layout') || 'right'
            });
            
            // Apply hardware acceleration for smoother animations
            if (this.optimizationParameters.applyHardwareAcceleration) {
                const card = product.querySelector('.product-card');
                const info = product.querySelector('.product-info');
                
                if (card) {
                    card.style.transform = 'translateZ(0)';
                    card.style.opacity = '1';
                    card.style.visibility = 'visible';
                    card.classList.add('visible');
                }
                if (info) {
                    info.style.transform = 'translateZ(0)';
                    info.style.opacity = '1';
                    info.style.visibility = 'visible';
                    info.classList.add('visible');
                }
            }
            
            // Start observing
            productObserver.observe(product);
            
            // Immediately make all child elements visible - CRITICAL FIX
            this.forceInitialProductVisibility(product);
        });
        
        // Store observer instance
        this.observerInstances.set('products', productObserver);
        
        // Create observer for other animatable elements with optimized threshold
        const elementObserver = new IntersectionObserver((entries) => {
            if (!this.rafPending && this.optimizationParameters.useRAF) {
                this.rafPending = true;
                requestAnimationFrame(() => {
                    this.processElementEntries(entries);
                    this.rafPending = false;
                });
            } else {
                this.processElementEntries(entries);
            }
        }, {
            ...baseOptions,
            rootMargin: '-5% 0px -5% 0px'
        });
        
        // Register individual animatable elements with batching
        const animatableElements = document.querySelectorAll('.animatable, .section-title, .section-header');
        
        // Process in batches for better performance
        if (this.optimizationParameters.batchDOMUpdates) {
            this.processBatch(animatableElements, (element) => {
                this.registerAnimatableElement(element, elementObserver);
                // Make element initially visible - CRITICAL FIX
                element.style.opacity = '1';
                element.style.visibility = 'visible';
                element.style.transform = 'translateY(0)';
                element.classList.add('visible');
            }, 10);
        } else {
            animatableElements.forEach(element => {
                this.registerAnimatableElement(element, elementObserver);
                // Make element initially visible - CRITICAL FIX
                element.style.opacity = '1';
                element.style.visibility = 'visible';
                element.style.transform = 'translateY(0)';
                element.classList.add('visible');
            });
        }
        
        // Monitor window resize events
        this.setupResizeObserver();
        
        // Initialize visibility detection optimization
        this.setupVisibilityDetection();
        
        this.initialized = true;
        
        // Final cleanup after initialization
        setTimeout(() => {
            this.removeAllScrollIndicators();
        }, 500);
    }
    
    // Force initial visibility for section content - CRITICAL FIX
    forceInitialSectionVisibility(section) {
        const state = this.animatedElements.get(section);
        section.classList.add('visible');
        
        if (state && state.childElements) {
            const { title, content, items } = state.childElements;
            
            if (title) {
                title.style.opacity = '1';
                title.style.visibility = 'visible';
                title.style.transform = 'translateY(0)';
                title.classList.add('visible');
            }
            
            if (content) {
                content.style.opacity = '1';
                content.style.visibility = 'visible';
                content.style.transform = 'translateY(0)';
                content.classList.add('visible');
            }
            
            if (items && items.length) {
                items.forEach(item => {
                    item.style.opacity = '1';
                    item.style.visibility = 'visible';
                    item.style.transform = 'translateY(0)';
                    item.classList.add('visible');
                });
            }
        }
        
        // Force all child elements to be visible - CRITICAL FIX
        const allElements = section.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
    }
    
    // Force initial visibility for product elements - CRITICAL FIX
    forceInitialProductVisibility(product) {
        product.classList.add('visible');
        
        const card = product.querySelector('.product-card');
        const info = product.querySelector('.product-info');
        
        if (card) {
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.transform = 'translateX(0) scale(1)';
            card.classList.add('visible');
        }
        
        if (info) {
            info.style.opacity = '1';
            info.style.visibility = 'visible';
            info.style.transform = 'translateX(0)';
            info.classList.add('visible');
        }
        
        // Force all child elements to be visible - CRITICAL FIX
        const allElements = product.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
    }
    
    // Process elements in batches
    processBatch(elements, processFn, batchSize = 10) {
        const total = elements.length;
        let index = 0;
        
        const processBatchInternal = () => {
            const limit = Math.min(index + batchSize, total);
            
            for (let i = index; i < limit; i++) {
                processFn(elements[i], i);
            }
            
            index = limit;
            
            if (index < total) {
                setTimeout(processBatchInternal, 0);
            }
        };
        
        processBatchInternal();
    }
    
    // Register a single animatable element
    registerAnimatableElement(element, observer) {
        // Initialize state tracking
        this.animatedElements.set(element, {
            isVisible: true, // Set to true initially - CRITICAL FIX
            hasBeenVisible: true, // Set to true initially
            type: 'element',
            animationDelay: this.getComputedDelay(element)
        });
        
        // Apply performance optimizations
        if (this.optimizationParameters.applyHardwareAcceleration) {
            element.style.transform = 'translateZ(0)';
        }
        
        // Start observing
        observer.observe(element);
    }
    
    // Get all animatable children of a section
    getAnimatableChildren(section) {
        const result = {
            title: section.querySelector('.section-title'),
            content: section.querySelector('.section-content, .story-content, .about-content'),
            items: Array.from(section.querySelectorAll('.tech-feature, .grid-element, .feature-item'))
        };
        
        return result;
    }
    
    // Compute element offset for optimization
    computeElementOffset(element) {
        if (!element) return { top: 0, left: 0 };
        
        const rect = element.getBoundingClientRect();
        
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    }
    
    // Get animation duration from element or defaults
    getAnimationDuration(element) {
        if (!element) return 1000; // Default 1s
        
        if (this.optimizationParameters.cacheComputedStyles) {
            if (!this.elementStateCache.has(element)) {
                const computedStyle = getComputedStyle(element);
                const durationText = computedStyle.getPropertyValue('--animation-duration') || 
                                    computedStyle.getPropertyValue('animation-duration') ||
                                    '1s';
                                    
                // Parse duration to milliseconds
                let duration = 1000;
                if (durationText.includes('ms')) {
                    duration = parseFloat(durationText);
                } else if (durationText.includes('s')) {
                    duration = parseFloat(durationText) * 1000;
                }
                
                this.elementStateCache.set(element, { 
                    duration,
                    delay: this.getComputedDelay(element)
                });
            }
            
            return this.elementStateCache.get(element).duration;
        }
        
        return 1000; // Fallback to 1s
    }
    
    // Get computed animation delay
    getComputedDelay(element) {
        if (!element) return 0;
        
        if (this.optimizationParameters.cacheComputedStyles) {
            if (!this.elementStateCache.has(element)) {
                const computedStyle = getComputedStyle(element);
                const delayText = computedStyle.getPropertyValue('--animation-delay') || 
                                 computedStyle.getPropertyValue('animation-delay') ||
                                 '0s';
                                 
                // Parse delay to milliseconds
                let delay = 0;
                if (delayText.includes('ms')) {
                    delay = parseFloat(delayText);
                } else if (delayText.includes('s')) {
                    delay = parseFloat(delayText) * 1000;
                }
                
                this.elementStateCache.set(element, { 
                    delay,
                    duration: this.getAnimationDuration(element)
                });
            }
            
            return this.elementStateCache.get(element).delay;
        }
        
        return 0; // Fallback to no delay
    }
    
    setupResizeObserver() {
        // Use ResizeObserver if available, otherwise fallback to window resize
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
            this.resizeObserver.observe(document.body);
        } else {
            // Fallback with debounce
            let resizeTimeout;
            
            window.addEventListener('resize', () => {
                if (resizeTimeout) {
                    clearTimeout(resizeTimeout);
                }
                
                resizeTimeout = setTimeout(() => {
                    this.handleResize();
                }, this.optimizationParameters.debounceDelay);
            }, { passive: true });
        }
    }
    
    setupVisibilityDetection() {
        // Optimize for tab visibility
        document.addEventListener('visibilitychange', () => {
            const isVisible = document.visibilityState === 'visible';
            
            if (isVisible) {
                // When tab becomes visible, refresh animation states
                this.refreshAnimationStates();
                // Also remove any slidebars that might have appeared
                this.removeAllScrollIndicators();
            }
        });
    }
    
    refreshAnimationStates() {
        // Re-evaluate visible elements
        this.animatedElements.forEach((state, element) => {
            // Make sure all elements are visible - CRITICAL FIX
            element.style.opacity = '1';
            element.style.visibility = 'visible';
            element.style.transform = 'translateY(0)';
            
            if (!element.classList.contains('visible')) {
                element.classList.add('visible');
            }
            
            // Refresh child elements
            this.refreshChildElements(element, state);
        });
    }
    
    refreshChildElements(element, state) {
        // Re-apply animations to child elements
        if (state.type === 'section') {
            this.animateSection(element);
        } else if (state.type === 'product') {
            this.animateProduct(element);
        }
    }
    
    handleResize() {
        if (!this.initialized) return;
        
        // Update cached dimensions for all elements
        this.animatedElements.forEach((state, element) => {
            if (state.rootOffset) {
                state.rootOffset = this.computeElementOffset(element);
            }
        });
        
        // Remove any slidebars that might have appeared
        this.removeAllScrollIndicators();
    }
    
    /**
     * Process section visibility changes with optimized state management
     * @param {IntersectionObserverEntry[]} entries - Intersection observer entries
     */
    processSectionEntries(entries) {
        // Batch process all entries
        entries.forEach(entry => this.processSectionVisibility(entry));
    }
    
    processSectionVisibility(entry) {
        // Skip if element is not tracked
        if (!this.animatedElements.has(entry.target)) return;
        
        const elementState = this.animatedElements.get(entry.target);
        const sectionId = entry.target.getAttribute('data-section');
        
        // Element entering viewport with minimal visibility (reduced threshold to 0.1)
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            if (!elementState.isVisible) {
                // Update state
                entry.target.classList.add('visible');
                elementState.isVisible = true;
                elementState.hasBeenVisible = true;
                
                // Apply specific animations based on section type
                this.animateSection(entry.target);
                
                // Force visibility on all elements - CRITICAL FIX
                const allElements = entry.target.querySelectorAll('*');
                allElements.forEach(el => {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                });
                
                // Dispatch event for external coordination
                this.dispatchSectionEvent('sectionEnter', sectionId, entry.target);
            }
        } 
        // Element leaving viewport - all elements stay visible - CRITICAL FIX
        else if (elementState.hasBeenVisible && entry.intersectionRatio < 0.05) {
            // Update state tracking but keep elements visible
            elementState.isVisible = false;
            
            // Dispatch event
            this.dispatchSectionEvent('sectionLeave', sectionId, entry.target);
        }
    }
    
    /**
     * Process product entries with optimized batching
     * @param {IntersectionObserverEntry[]} entries - Intersection observer entries
     */
    processProductEntries(entries) {
        // Process all product entries
        entries.forEach(entry => this.processProductVisibility(entry));
    }
    
    /**
     * Process product visibility with specialized handling
     * @param {IntersectionObserverEntry} entry - Intersection observer entry
     */
    processProductVisibility(entry) {
        // Skip if element is not tracked
        if (!this.animatedElements.has(entry.target)) return;
        
        const elementState = this.animatedElements.get(entry.target);
        
        // Extract DOM references from cached state
        const { card, info } = elementState.childElements;
        const layout = elementState.layout;
        
        // Product entering viewport (reduced threshold to 0.1)
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            if (!elementState.isVisible) {
                this.animateProduct(entry.target, card, info, layout);
                
                // Update state
                elementState.isVisible = true;
                elementState.hasBeenVisible = true;
            }
        } 
        // Product leaving viewport - no need to hide elements - CRITICAL FIX
        else if (elementState.hasBeenVisible && entry.intersectionRatio < 0.05) {
            // Just update state tracking but keep elements visible
            elementState.isVisible = false;
        }
    }
    
    /**
     * Animate product with optimized timing - CRITICAL FIX FOR PRODUCT VISIBILITY
     */
    animateProduct(product, card, info, layout) {
        // Apply hardware-accelerated transforms based on layout direction
        if (card && !card.classList.contains('visible')) {
            card.classList.add('visible');
            
            // Apply appropriate transform based on layout
            if (this.optimizationParameters.applyHardwareAcceleration) {
                card.style.transform = 'translateZ(0) scale(1)';
                card.style.opacity = '1';
                card.style.visibility = 'visible';
            }
        }
        
        if (info && !info.classList.contains('visible')) {
            // Make info visible immediately
            info.classList.add('visible');
            
            if (this.optimizationParameters.applyHardwareAcceleration) {
                info.style.transform = 'translateZ(0) translateX(0)';
                info.style.opacity = '1';
                info.style.visibility = 'visible';
            }
        }
    }
    
    /**
     * Process element entries with RAF optimization
     */
    processElementEntries(entries) {
        entries.forEach(entry => this.processElementVisibility(entry));
    }
    
    /**
     * Process generic element visibility
     * @param {IntersectionObserverEntry} entry - Intersection observer entry
     */
    processElementVisibility(entry) {
        // Skip if element is not tracked
        if (!this.animatedElements.has(entry.target)) return;
        
        const elementState = this.animatedElements.get(entry.target);
        
        // Element entering viewport (reduced threshold to 0.1)
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            if (!elementState.isVisible) {
                entry.target.classList.add('visible');
                elementState.isVisible = true;
                elementState.hasBeenVisible = true;
                
                // Apply hardware acceleration if needed - CRITICAL FIX FOR VISIBILITY
                if (this.optimizationParameters.applyHardwareAcceleration) {
                    entry.target.style.transform = 'translateZ(0) translateY(0)';
                    entry.target.style.opacity = '1';
                    entry.target.style.visibility = 'visible';
                }
            }
        } 
        // Element leaving viewport - no need to hide elements
        else if (elementState.hasBeenVisible && entry.intersectionRatio < 0.05) {
            // Just update state tracking but keep elements visible - CRITICAL FIX
            elementState.isVisible = false;
        }
    }
    
    /**
     * Dispatch section visibility event
     * @param {string} eventName - Event name
     * @param {string} sectionId - Section ID
     * @param {HTMLElement} element - Section element
     */
    dispatchSectionEvent(eventName, sectionId, element) {
        const event = new CustomEvent(eventName, {
            bubbles: true,
            detail: { 
                sectionId,
                element
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Apply section-specific animations with optimal sequencing
     * @param {HTMLElement} section - Section element
     */
    animateSection(section) {
        const sectionType = section.getAttribute('data-section');
        
        // Get cached child elements
        const state = this.animatedElements.get(section);
        if (!state) return;
        
        const { title, content, items } = state.childElements;
        
        // Animate section titles uniformly with proper timing
        if (title && !title.classList.contains('visible')) {
            title.classList.add('visible');
            
            if (this.optimizationParameters.applyHardwareAcceleration) {
                title.style.transform = 'translateZ(0) translateY(0)';
                title.style.opacity = '1';
                title.style.visibility = 'visible';
            }
        }
        
        // Call specific animation method based on section type
        switch (sectionType) {
            case 'story':
                this.animateStorySection(section, content, items);
                break;
            case 'products':
                this.animateProductSection(section);
                break;
            case 'technology':
                this.animateTechnologySection(section, items);
                break;
            case 'about':
                this.animateAboutSection(section, content);
                break;
            case 'contact':
                this.animateContactSection(section);
                break;
        }
    }
    
    animateStorySection(section, content, gridElements) {
        // Animate content - CRITICAL FIX FOR VISIBILITY
        if (content && !content.classList.contains('visible')) {
            content.classList.add('visible');
            
            if (this.optimizationParameters.applyHardwareAcceleration) {
                content.style.transform = 'translateZ(0) translateX(0)';
                content.style.opacity = '1';
                content.style.visibility = 'visible';
            }
        }
        
        // Animate grid with optimized staggering
        const grid = section.querySelector('.story-metallic-grid');
        if (grid && !grid.classList.contains('visible')) {
            grid.classList.add('visible');
            
            if (this.optimizationParameters.applyHardwareAcceleration) {
                grid.style.transform = 'translateZ(0) perspective(1000px) rotateY(0)';
                grid.style.opacity = '1';
                grid.style.visibility = 'visible';
            }
        }
    }
    
    animateProductSection(section) {
        // Animate section header with optimal timing
        const header = section.querySelector('.section-header');
        if (header && !header.classList.contains('visible')) {
            header.classList.add('visible');
            
            if (this.optimizationParameters.applyHardwareAcceleration) {
                header.style.transform = 'translateZ(0) translateY(0)';
                header.style.opacity = '1';
                header.style.visibility = 'visible';
            }
        }
    }
    
    animateTechnologySection(section, features) {
        if (!features || features.length === 0) return;
        
        // Animation with staggered timing
        features.forEach((feature, index) => {
            if (!feature.classList.contains('visible')) {
                feature.classList.add('visible');
                
                if (this.optimizationParameters.applyHardwareAcceleration) {
                    feature.style.transform = 'translateZ(0) translateY(0)';
                    feature.style.opacity = '1';
                    feature.style.visibility = 'visible';
                }
            }
        });
    }
    
    animateAboutSection(section, content) {
        if (content && !content.classList.contains('visible')) {
            content.classList.add('visible');
            
            if (this.optimizationParameters.applyHardwareAcceleration) {
                content.style.transform = 'translateZ(0) translateY(0)';
                content.style.opacity = '1';
                content.style.visibility = 'visible';
            }
        }
    }
    
    animateContactSection(section) {
        const info = section.querySelector('.contact-info');
        const form = section.querySelector('.contact-form');
        
        if (info && !info.classList.contains('visible')) {
            info.classList.add('visible');
            
            if (this.optimizationParameters.applyHardwareAcceleration) {
                info.style.transform = 'translateZ(0) translateY(0)';
                info.style.opacity = '1';
                info.style.visibility = 'visible';
            }
        }
        
        if (form && !form.classList.contains('visible')) {
            form.classList.add('visible');
            
            if (this.optimizationParameters.applyHardwareAcceleration) {
                form.style.transform = 'translateZ(0) translateY(0)';
                form.style.opacity = '1';
                form.style.visibility = 'visible';
            }
        }
    }
    
    /**
     * Destroy controller and disconnect observers
     */
    destroy() {
        // Clean up killswitch interval
        if (this.killSwitchInterval) {
            clearInterval(this.killSwitchInterval);
            this.killSwitchInterval = null;
        }
        
        // Disconnect mutation observer if exists
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        
        // Disconnect all observers
        this.observerInstances.forEach(observer => {
            observer.disconnect();
        });
        
        // Disconnect resize observer if available
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        // Clean up state
        this.observerInstances.clear();
        this.animatedElements.clear();
        this.elementStateCache = new WeakMap();
        this.initialized = false;
        
        // Final cleanup
        this.removeAllScrollIndicators();
    }
}

/**
 * CardInteractionController
 * Handles 3D hover effects for cards with optimized rendering
 */
class CardInteractionController {
    constructor() {
        this.cards = document.querySelectorAll('.product-card');
        this.cardStates = new Map(); // Track transform state for each card
        this.rafId = null;
        this.eventHandlers = new Map(); // For event cleanup
        this.initialized = false;
        
        // Performance optimization parameters
        this.optimizationParams = {
            useRAF: true,                 // Use requestAnimationFrame
            debounceDelay: 16,            // Optimal debounce delay (1 frame @ 60FPS)
            useCPUOptimization: true,     // Use CPU-optimized calculations
            useHardwareAcceleration: true // Use hardware acceleration
        };
        
        // Initialize the controller
        this.init();
    }
    
    init() {
        // Skip if no cards found
        if (!this.cards || this.cards.length === 0) return;
        
        this.cards.forEach(card => {
            // Initialize transform state tracking
            this.cardStates.set(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                transitioning: false,
                isHovering: false
            });
            
            // Optimize card rendering with GPU acceleration
            if (this.optimizationParams.useHardwareAcceleration) {
                this.applyHardwareAcceleration(card);
            }
            
            // Setup event listeners
            this.setupCardInteractions(card);
        });
        
        // Listen for card flip events to coordinate interactions
        document.addEventListener('cardFlipped', this.handleCardFlipped.bind(this));
        document.addEventListener('beforeCardFlip', this.handleBeforeCardFlip.bind(this));
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden' && this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
        });
        
        this.initialized = true;
    }
    
    applyHardwareAcceleration(card) {
        // Apply hardware acceleration to card components
        const cardInner = card.querySelector('.card-inner');
        const cardFront = card.querySelector('.card-front');
        const cardBack = card.querySelector('.card-back');
        const cardMetallic = card.querySelector('.card-metallic');
        
        if (cardInner) {
            cardInner.style.willChange = 'transform';
            cardInner.style.transform = 'translateZ(0)';
        }
        
        if (cardFront) {
            cardFront.style.willChange = 'transform';
            cardFront.style.backfaceVisibility = 'hidden';
        }
        
        if (cardBack) {
            cardBack.style.willChange = 'transform';
            cardBack.style.backfaceVisibility = 'hidden';
        }
        
        if (cardMetallic) {
            cardMetallic.style.willChange = 'transform';
        }
    }
    
    setupCardInteractions(card) {
        // Mouse move handling for 3D hover effect with optimal debouncing
        const mouseMoveHandler = this.optimizationParams.useCPUOptimization ? 
            this.createThrottledMouseMoveHandler(card) : 
            (e) => this.handleMouseMove(e, card);
        
        card.addEventListener('mousemove', mouseMoveHandler, { passive: true });
        
        // Mouse leave handling to reset transforms
        const mouseLeaveHandler = (e) => this.handleMouseLeave(e, card);
        card.addEventListener('mouseleave', mouseLeaveHandler, { passive: true });
        
        // Store handlers for cleanup
        this.eventHandlers.set(card, {
            mousemove: mouseMoveHandler,
            mouseleave: mouseLeaveHandler
        });
    }
    
    createThrottledMouseMoveHandler(card) {
        let lastExecution = 0;
        
        return (e) => {
            const now = performance.now();
            if (now - lastExecution < this.optimizationParams.debounceDelay) return;
            
            lastExecution = now;
            this.handleMouseMove(e, card);
        };
    }
    
    handleCardFlipped(e) {
        const { card } = e.detail;
        
        // Reset transforms for flipped card
        if (this.cardStates.has(card)) {
            const state = this.cardStates.get(card);
            state.rotateX = 0;
            state.rotateY = 0;
            state.scale = 1;
            state.transitioning = false;
            
            // Reset transform on front face with optimized approach
            const frontMetallic = card.querySelector('.card-front .card-metallic');
            if (frontMetallic) {
                // Use transform matrix for optimization
                frontMetallic.style.transform = 'none';
            }
        }
    }
    
    handleBeforeCardFlip(e) {
        const { card } = e.detail;
        
        // Mark card as transitioning
        if (this.cardStates.has(card)) {
            this.cardStates.get(card).transitioning = true;
        }
    }
    
    handleMouseMove(e, card) {
        // Skip if card is being flipped or is flipped
        const state = this.cardStates.get(card);
        if (!state || state.transitioning || card.getAttribute('data-flipped') === 'true') {
            return;
        }
        
        // Update hover state
        state.isHovering = true;
        
        // Get card dimensions and mouse position
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation with optimized cubic easing
        const xNormalized = (x - centerX) / centerX; // -1 to 1
        const yNormalized = (y - centerY) / centerY; // -1 to 1
        
        // Apply easing with pre-computed calculations
        const rotateY = this.computeEasedRotation(xNormalized, 15); // max 15 degrees
        const rotateX = this.computeEasedRotation(yNormalized, 10, true); // max 10 degrees
        
        // Update state with optimized interpolation
        const interpolationFactor = 0.1;
        state.rotateX += (rotateX - state.rotateX) * interpolationFactor;
        state.rotateY += (rotateY - state.rotateY) * interpolationFactor;
        state.scale += (1.05 - state.scale) * interpolationFactor;
        
        // Apply transform with requestAnimationFrame for smoother updates
        if (this.optimizationParams.useRAF) {
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
            
            this.rafId = requestAnimationFrame(() => {
                this.applyCardTransform(card, state);
                this.updateShineEffect(card, x, y, centerX, centerY, rect);
                this.rafId = null;
            });
        } else {
            this.applyCardTransform(card, state);
            this.updateShineEffect(card, x, y, centerX, centerY, rect);
        }
    }
    
    // Compute eased rotation with performance optimization
    computeEasedRotation(normalizedValue, maxDegrees, invertSign = false) {
        // Fast approximation of cubic easing
        const absValue = Math.abs(normalizedValue);
        const easedValue = absValue < 0.5 ? 
            4 * absValue * absValue * absValue : 
            1 - Math.pow(-2 * absValue + 2, 3) / 2;
        
        const sign = invertSign ? normalizedValue : -normalizedValue;
        return easedValue * Math.sign(sign) * maxDegrees;
    }
    
    applyCardTransform(card, state) {
        // Apply transform to front face only
        const metallic = card.querySelector('.card-front .card-metallic');
        if (metallic) {
            // Use optimized transform properties
            if (this.optimizationParams.useHardwareAcceleration) {
                // Use matrix3d for directly communicating with GPU
                metallic.style.transform = `
                    perspective(1000px) 
                    rotateX(${state.rotateX}deg) 
                    rotateY(${state.rotateY}deg) 
                    scale3d(${state.scale}, ${state.scale}, ${state.scale})
                `;
            } else {
                metallic.style.transform = `
                    perspective(1000px) 
                    rotateX(${state.rotateX}deg) 
                    rotateY(${state.rotateY}deg) 
                    scale(${state.scale})
                `;
            }
        }
    }
    
    updateShineEffect(card, x, y, centerX, centerY, rect) {
        // Calculate parameters for shine effect
        const distanceX = (x - centerX) / centerX;
        const distanceY = (y - centerY) / centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Update shine element
        const shine = card.querySelector('.card-front .card-shine');
        if (shine) {
            const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
            
            // Optimized gradient with minimal color stops
            shine.style.background = `linear-gradient(
                ${angle}deg,
                rgba(255,255,255,0) 0%,
                rgba(255,255,255,${0.1 + distance * 0.2}) 45%,
                rgba(255,255,255,${0.3 + distance * 0.4}) 50%,
                rgba(255,255,255,${0.1 + distance * 0.2}) 55%,
                rgba(255,255,255,0) 100%
            )`;
        }
    }
    
    handleMouseLeave(e, card) {
        // Get card state
        const state = this.cardStates.get(card);
        if (!state || state.transitioning) {
            return;
        }
        
        // Update hover state
        state.isHovering = false;
        
        // Reset state with proper timing
        const resetState = () => {
            state.rotateX = 0;
            state.rotateY = 0;
            state.scale = 1;
            
            // Apply smooth transform reset
            const metallic = card.querySelector('.card-front .card-metallic');
            if (metallic) {
                // Use optimal transition
                metallic.style.transition = 'transform 0.6s var(--ease-quantum)';
                
                // Apply transform reset
                if (this.optimizationParams.useHardwareAcceleration) {
                    metallic.style.transform = `
                        perspective(1000px) 
                        rotateX(0deg) 
                        rotateY(0deg) 
                        scale3d(1, 1, 1)
                    `;
                } else {
                    metallic.style.transform = `
                        perspective(1000px) 
                        rotateX(0deg) 
                        rotateY(0deg) 
                        scale(1)
                    `;
                }
                
                // Clean up transition property after animation completes
                setTimeout(() => {
                    metallic.style.transition = '';
                }, 600);
            }
            
            // Reset shine effect
            const shine = card.querySelector('.card-front .card-shine');
            if (shine) {
                shine.style.background = '';
            }
        };
        
        // Use RAF for smooth timing
        if (this.optimizationParams.useRAF) {
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
            
            this.rafId = requestAnimationFrame(resetState);
        } else {
            resetState();
        }
    }
    
    /**
     * Clean up resources and event listeners
     */
    destroy() {
        // Cancel any pending animations
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        
        // Remove event listeners
        this.eventHandlers.forEach((handlers, card) => {
            if (handlers.mousemove) {
                card.removeEventListener('mousemove', handlers.mousemove);
            }
            
            if (handlers.mouseleave) {
                card.removeEventListener('mouseleave', handlers.mouseleave);
            }
        });
        
        // Clear state
        this.eventHandlers.clear();
        this.cardStates.clear();
        this.initialized = false;
    }
}

/**
 * SmoothScrollController
 * Manages programmatic scroll with physics-based animations
 */
class SmoothScrollController {
    constructor() {
        this.scrolling = false;
        this.scrollDuration = 800; // ms
        this.scrollAnimationId = null;
        this.eventHandlers = new Map();
        
        // Performance optimizations
        this.optimizationParams = {
            useRAF: true,                 // Use requestAnimationFrame
            batchDOMReads: true,          // Batch DOM reads for layout thrashing prevention
            useHardwareAcceleration: true, // Hardware acceleration for scroll target
            scrollThrottle: 100           // Minimum ms between scroll operations
        };
        
        // Cache commonly used values
        this.lastScrollTime = 0;
        
        this.init();
    }
    
    init() {
        // Handle configurator buttons with optimal delegation
        this.setupConfiguratorButtons();
        
        // Handle CTA buttons with optimized delegation
        this.setupCTAButtons();
    }
    
    setupConfiguratorButtons() {
        const clickHandler = (e) => {
            const configuratorButton = e.target.closest('.configurator-button');
            if (!configuratorButton) return;
            
            e.preventDefault();
            const productId = configuratorButton.getAttribute('data-product');
            
            // Use loader for transition if available with cached time check
            const now = Date.now();
            if (now - this.lastScrollTime < this.optimizationParams.scrollThrottle) return;
            this.lastScrollTime = now;
            
            if (window.quantumLoader) {
                window.quantumLoader.navigateTo(`configurator.html?product=${productId}`);
            } else {
                window.location.href = `configurator.html?product=${productId}`;
            }
        };
        
        document.addEventListener('click', clickHandler);
        this.eventHandlers.set('configurator', clickHandler);
    }
    
    setupCTAButtons() {
        const clickHandler = (e) => {
            const ctaButton = e.target.closest('.cta-quantum');
            if (!ctaButton) return;
            
            e.preventDefault();
            const targetId = ctaButton.getAttribute('data-target');
            
            if (!targetId) return;
            
            // Use cached time check for throttling
            const now = Date.now();
            if (now - this.lastScrollTime < this.optimizationParams.scrollThrottle) return;
            this.lastScrollTime = now;
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                this.smoothScrollToElement(targetSection);
            }
        };
        
        document.addEventListener('click', clickHandler);
        this.eventHandlers.set('cta', clickHandler);
    }
    
    smoothScrollToElement(element) {
        // Skip if already scrolling or no element
        if (this.scrolling || !element) return;
        
        this.scrolling = true;
        
        // Apply hardware acceleration during scroll
        if (this.optimizationParams.useHardwareAcceleration) {
            element.style.willChange = 'transform';
        }
        
        // Get current and target positions with optimized header offset calculation
        const headerHeight = this.getHeaderHeight();
        const startPosition = window.pageYOffset;
        
        // Batch DOM reads to prevent layout thrashing
        let targetPosition;
        
        if (this.optimizationParams.batchDOMReads) {
            requestAnimationFrame(() => {
                targetPosition = element.getBoundingClientRect().top + startPosition - headerHeight;
                this.startScrollAnimation(startPosition, targetPosition);
            });
        } else {
            targetPosition = element.getBoundingClientRect().top + startPosition - headerHeight;
            this.startScrollAnimation(startPosition, targetPosition);
        }
    }
    
    getHeaderHeight() {
        // Dynamic header height calculation
        const header = document.querySelector('.quantum-header');
        const isHeaderScrolled = window.scrollY > 50;
        const headerHeight = isHeaderScrolled ? 
            (header?.offsetHeight || 70) : 
            (header?.offsetHeight || 80);
        
        return headerHeight;
    }
    
    startScrollAnimation(startPosition, targetPosition) {
        // Calculate distance to scroll
        const distance = targetPosition - startPosition;
        
        // Animation variables
        let startTime = null;
        
        // Optimal easing function for smooth motion
        const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);
        
        // Animation function with RAF
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / this.scrollDuration, 1);
            const easedProgress = easeOutQuint(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            // Continue animation if not complete
            if (progress < 1) {
                this.scrollAnimationId = requestAnimationFrame(animation);
            } else {
                this.scrolling = false;
                this.scrollAnimationId = null;
                
                // Release hardware acceleration
                this.releaseHardwareAcceleration();
            }
        };
        
        // Start animation with RAF
        if (this.scrollAnimationId) {
            cancelAnimationFrame(this.scrollAnimationId);
        }
        
        this.scrollAnimationId = requestAnimationFrame(animation);
    }
    
    releaseHardwareAcceleration() {
        // Release hardware acceleration on scrollable elements
        if (this.optimizationParams.useHardwareAcceleration) {
            document.querySelectorAll('[data-section]').forEach(section => {
                section.style.willChange = 'auto';
            });
        }
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            this.smoothScrollToElement(section);
        }
    }
    
    /**
     * Clean up resources and event listeners
     */
    destroy() {
        // Cancel any active scroll animation
        if (this.scrollAnimationId) {
            cancelAnimationFrame(this.scrollAnimationId);
            this.scrollAnimationId = null;
        }
        
        // Remove event listeners
        this.eventHandlers.forEach((handler, key) => {
            document.removeEventListener('click', handler);
        });
        
        this.eventHandlers.clear();
        this.scrolling = false;
    }
}

/**
 * Initialize Quantum Systems with optimal sequence and error recovery
 * CRITICAL: Modified to prevent Slidebar creation and enforce removal
 */
document.addEventListener('DOMContentLoaded', () => {
    // Emergency cleanup before any initialization
    function emergencyCleanup() {
        const selectors = [
            '.scroll-indicator-quantum',
            '.scroll-line',
            '.scroll-beam',
            '.scroll-indicator',
            '.scroll-quantum-indicator',
            '[class*="scroll-indicator"]',
            '[class*="slide-bar"]'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        });
        
        // Remove specifically from hero section
        const heroSection = document.querySelector('.hero-quantum');
        if (heroSection) {
            const scrollElements = heroSection.querySelectorAll('[class*="scroll"]');
            scrollElements.forEach(el => {
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        }
    }
    
    // Perform initial emergency cleanup
    emergencyCleanup();
    
    // Track initialization for monitoring
    const systemInitTime = performance.now();
    const initializedSystems = {
        particleSystem: false,
        scrollAnimations: false,
        cardInteractions: false,
        smoothScroll: false
    };
    
    try {
        // Initialize particle system if canvas exists
        const heroCanvas = document.getElementById('heroParticleSystem');
        let particleSystem = null;
        
        if (heroCanvas) {
            particleSystem = new HeroParticleSystem('heroParticleSystem');
            initializedSystems.particleSystem = true;
        }
        
        // Initialize scroll animations with error boundary
        try {
            const scrollAnimations = new ScrollAnimationController();
            initializedSystems.scrollAnimations = true;
            window.scrollAnimations = scrollAnimations; // Store reference for external access
        } catch (scrollError) {
            console.error('Error initializing ScrollAnimationController:', scrollError);
        }
        
        // Initialize smooth scroll with error boundary
        try {
            const smoothScroll = new SmoothScrollController();
            initializedSystems.smoothScroll = true;
            window.smoothScroll = smoothScroll; // Store reference for external access
        } catch (scrollError) {
            console.error('Error initializing SmoothScrollController:', scrollError);
        }
        
        // Initialize card interactions with error boundary
        try {
            // Check if we have product cards before initializing
            if (document.querySelectorAll('.product-card').length > 0) {
                const cardInteractions = new CardInteractionController();
                initializedSystems.cardInteractions = true;
                window.cardInteractions = cardInteractions; // Store reference for external access
            }
        } catch (cardError) {
            console.error('Error initializing CardInteractionController:', cardError);
        }
        
        // Setup MutationObserver for continuous monitoring and removal of any dynamically added slidebars
        if (window.MutationObserver) {
            const observer = new MutationObserver((mutations) => {
                // When DOM changes, run emergency cleanup
                emergencyCleanup();
                
                // If controllers exist, trigger their cleanup methods
                if (window.scrollProgressController && typeof window.scrollProgressController.removeAllScrollIndicators === 'function') {
                    window.scrollProgressController.removeAllScrollIndicators();
                }
                
                if (window.scrollAnimations && typeof window.scrollAnimations.removeAllScrollIndicators === 'function') {
                    window.scrollAnimations.removeAllScrollIndicators();
                }
            });
            
            // Observe the entire document
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
            
            // Store for cleanup
            window.slidebarsObserver = observer;
        }
        
        // Periodic cleanup interval for aggressive removal
        const cleanupInterval = setInterval(() => {
            emergencyCleanup();
            
            // Trigger controller cleanup methods if available
            if (window.scrollProgressController && typeof window.scrollProgressController.removeAllScrollIndicators === 'function') {
                window.scrollProgressController.removeAllScrollIndicators();
            }
            
            if (window.scrollAnimations && typeof window.scrollAnimations.removeAllScrollIndicators === 'function') {
                window.scrollAnimations.removeAllScrollIndicators();
            }
        }, 2000); // Run every 2 seconds
        
        // Performance optimization: Throttle scroll events for header state
        let ticking = false;
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                lastScrollY = window.scrollY;
                
                window.requestAnimationFrame(() => {
                    // Update header state
                    const header = document.querySelector('.quantum-header');
                    if (header) {
                        if (lastScrollY > 50) {
                            header.classList.add('scrolled');
                        } else {
                            header.classList.remove('scrolled');
                        }
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        }, { passive: true });
        
        // Initialize metallic shine effect on logo hover with optimized calculation
        const logoFerrum = document.querySelector('.title-ferrum');
        const logoInsignia = document.querySelector('.title-insignia');
        
        if (logoFerrum && logoInsignia) {
            // Throttled mousemove handler
            let logoAnimationFrame = null;
            
            document.addEventListener('mousemove', (e) => {
                if (logoAnimationFrame) {
                    cancelAnimationFrame(logoAnimationFrame);
                }
                
                logoAnimationFrame = requestAnimationFrame(() => {
                    const x = e.clientX / window.innerWidth;
                    const y = e.clientY / window.innerHeight;
                    
                    const angle = Math.atan2(y - 0.5, x - 0.5) * 180 / Math.PI;
                    
                    // Cache gradient strings for performance
                    const gradient = `linear-gradient(${angle}deg, 
                        #e5e4e2 0%, #c0c0c0 30%, #e5e4e2 60%, #f5f5f5 100%)`;
                    
                    logoFerrum.style.background = gradient;
                    logoInsignia.style.background = gradient;
                    
                    logoFerrum.style.webkitBackgroundClip = 'text';
                    logoInsignia.style.webkitBackgroundClip = 'text';
                    
                    // Standard property for Firefox compatibility
                    logoFerrum.style.backgroundClip = 'text';
                    logoInsignia.style.backgroundClip = 'text';
                    
                    logoAnimationFrame = null;
                });
            }, { passive: true });
        }
        
        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            // Clear cleanup interval
            clearInterval(cleanupInterval);
            
            // Disconnect observer
            if (window.slidebarsObserver) {
                window.slidebarsObserver.disconnect();
            }
            
            if (particleSystem) {
                particleSystem.destroy();
            }
            
            if (window.scrollAnimations) {
                window.scrollAnimations.destroy();
            }
            
            if (window.cardInteractions) {
                window.cardInteractions.destroy();
            }
            
            if (window.smoothScroll) {
                window.smoothScroll.destroy();
            }
        });
        
        // Trigger card-flip initialization if controller exists
        if (window.cardFlipController) {
            // Wait for animations to complete
            setTimeout(() => {
                // Dispatch custom event for flip initialization
                document.dispatchEvent(new CustomEvent('cardsReady'));
            }, 1000);
        }
        
        // Final emergency cleanup after initialization
        setTimeout(() => {
            emergencyCleanup();
        }, 1000);
        
        // Signal that all systems are initialized
        const initTime = performance.now() - systemInitTime;
        document.dispatchEvent(new CustomEvent('quantumSystemsInitialized', {
            detail: {
                time: initTime,
                systems: initializedSystems
            }
        }));
        
    } catch (error) {
        console.error('Error initializing Quantum systems:', error);
        
        // Even on critical error, attempt to clean up slidebars
        emergencyCleanup();
    }
});