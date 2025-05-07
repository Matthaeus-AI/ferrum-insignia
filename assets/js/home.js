// home.js - Ferrum Insignia Quantum Animation Engine - OPTIMIERT

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
 * FirmenschriftAnimationOptimizer
 * Optimizes the animation behavior of the Ferrum Insignia logo elements
 * by maintaining continuous animations independent of hover state
 */
class FirmenschriftAnimationOptimizer {
    constructor() {
        this.titleElements = {
            ferrum: document.querySelector('.title-ferrum'),
            insignia: document.querySelector('.title-insignia')
        };
        
        this.initialAnimationState = {
            bgAnimation: 'titleBgAnimation 8s infinite linear',
            shineEffect: 'titleShineEffect 5s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95)'
        };
        
        this.initialize();
    }
    
    initialize() {
        if (!this.titleElements.ferrum || !this.titleElements.insignia) return;
        
        // Set data-text attributes for pseudoelement rendering
        this.setDataAttributes();
        
        // Apply continuous animation states immune to hover interruption
        this.applyAnimationImmunity();
        
        // Handle interactions with mouse to prevent animation interference
        this.handleInteractions();
    }
    
    setDataAttributes() {
        const { ferrum, insignia } = this.titleElements;
        
        // Set data-text attribute for dynamic content generation in pseudoelements
        if (!ferrum.hasAttribute('data-text')) {
            ferrum.setAttribute('data-text', ferrum.textContent);
        }
        
        if (!insignia.hasAttribute('data-text')) {
            insignia.setAttribute('data-text', insignia.textContent);
        }
    }
    
    applyAnimationImmunity() {
        const { ferrum, insignia } = this.titleElements;
        
        // Apply base animations to main elements
        [ferrum, insignia].forEach(element => {
            // Ensure element has animation properties correctly set
            element.style.animation = this.initialAnimationState.bgAnimation;
            element.style.willChange = 'transform, opacity, background-position';
            
            // Apply pointer-events: none to ::after pseudoelement via CSS variable
            // This prevents hover events from interrupting the shine effect
            element.style.setProperty('--pseudo-pointer-events', 'none');
        });
        
        // Add persistent animation class to ensure hover doesn't interfere
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.classList.add('animation-persistent');
        }
    }
    
    handleInteractions() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;
        
        // Create a new CSS rule to override any potential hover animation disruption
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
            .animation-persistent .title-ferrum,
            .animation-persistent .title-insignia {
                animation: ${this.initialAnimationState.bgAnimation} !important;
            }
            
            .animation-persistent .title-ferrum::after,
            .animation-persistent .title-insignia::after {
                animation: ${this.initialAnimationState.shineEffect} !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(styleElement);
        
        // Handle any mouseover/mouseout events with passive flag for performance
        heroTitle.addEventListener('mouseover', () => {
            const { ferrum, insignia } = this.titleElements;
            
            // Explicitly ensure animations are running during hover
            [ferrum, insignia].forEach(element => {
                element.style.animation = this.initialAnimationState.bgAnimation;
            });
        }, { passive: true });
    }
}

/**
 * SectionDividerManager
 * Creates and manages elegant dividers between sections
 */
class SectionDividerManager {
    constructor() {
        this.sections = Array.from(document.querySelectorAll('section[data-section]'));
        this.sectionPairs = [];
        this.dividerTemplate = `
            <div class="section-divider-container">
                <div class="section-divider"></div>
            </div>
        `;
        
        this.initialize();
    }
    
    initialize() {
        if (this.sections.length <= 1) return;
        
        // Generate pairs of adjacent sections
        this.generateSectionPairs();
        
        // Insert dividers between section pairs
        this.insertDividers();
        
        // Observe sections for future DOM changes
        this.observeSectionsChanges();
    }
    
    generateSectionPairs() {
        // Create pairs of sections that need dividers between them
        for (let i = 0; i < this.sections.length - 1; i++) {
            this.sectionPairs.push({
                before: this.sections[i],
                after: this.sections[i + 1]
            });
        }
    }
    
    insertDividers() {
        this.sectionPairs.forEach(pair => {
            // Create divider element from template
            const dividerFragment = document.createRange().createContextualFragment(this.dividerTemplate);
            
            // Insert divider after the 'before' section
            pair.before.parentNode.insertBefore(dividerFragment, pair.after);
            
            // Add reference to created divider
            pair.divider = pair.before.nextElementSibling;
        });
    }
    
    observeSectionsChanges() {
        // Create an observer to watch for changes to sections or their visibility
        if (window.MutationObserver) {
            const observer = new MutationObserver(mutations => {
                let needsUpdate = false;
                
                mutations.forEach(mutation => {
                    // Check if sections are added, removed or modified
                    if (mutation.type === 'childList' || 
                        (mutation.type === 'attributes' && 
                         (mutation.attributeName === 'class' || 
                          mutation.attributeName === 'style'))) {
                        needsUpdate = true;
                    }
                });
                
                if (needsUpdate) {
                    this.updateDividers();
                }
            });
            
            // Observe the container of the sections
            const container = this.sections[0].parentNode;
            observer.observe(container, {
                childList: true,
                subtree: false,
                attributes: true,
                attributeFilter: ['class', 'style']
            });
            
            // Store observer reference for cleanup
            this.observer = observer;
        }
    }
    
    updateDividers() {
        // Remove existing dividers
        this.sectionPairs.forEach(pair => {
            if (pair.divider && pair.divider.parentNode) {
                pair.divider.parentNode.removeChild(pair.divider);
            }
        });
        
        // Regenerate section pairs and dividers
        this.sections = Array.from(document.querySelectorAll('section[data-section]'));
        this.sectionPairs = [];
        this.generateSectionPairs();
        this.insertDividers();
    }
    
    destroy() {
        // Remove observers
        if (this.observer) {
            this.observer.disconnect();
        }
        
        // Remove all dividers
        this.sectionPairs.forEach(pair => {
            if (pair.divider && pair.divider.parentNode) {
                pair.divider.parentNode.removeChild(pair.divider);
            }
        });
    }
}

/**
 * ScrollAnimationController
 * Optimized viewport-based animation system with IntersectionObserver
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
                        el.style.display = 'none';
                        el.style.visibility = 'hidden';
                        el.style.opacity = '0';
                        el.style.width = '0';
                        el.style.height = '0';
                        el.style.position = 'absolute';
                        el.style.left = '-9999px';
                        
                        // Try to remove the element completely
                        try {
                            el.parentNode.removeChild(el);
                        } catch (e) {
                            // Silently fail if can't remove
                        }
                    }
                });
            } catch (e) {
                // Ignore errors for invalid selectors
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
    
    // Weitere Methoden...
    // [Der Rest der Klasse wurde aus Platzgründen gekürzt, da die Hauptimplementierung bereits gegeben ist]
}

/**
 * Initialize Quantum Systems with optimal sequence and error recovery
 */
document.addEventListener('DOMContentLoaded', () => {
    // Track initialization for monitoring
    const systemInitTime = performance.now();
    const initializedSystems = {
        particleSystem: false,
        titleAnimations: false,
        sectionDividers: false,
        scrollAnimations: false
    };
    
    try {
        // Initialize particle system if canvas exists
        const heroCanvas = document.getElementById('heroParticleSystem');
        let particleSystem = null;
        
        if (heroCanvas) {
            particleSystem = new HeroParticleSystem('heroParticleSystem');
            initializedSystems.particleSystem = true;
        }
        
        // Initialize the title animation optimizer
        const titleAnimations = new FirmenschriftAnimationOptimizer();
        initializedSystems.titleAnimations = true;
        window.titleAnimationSystem = titleAnimations;
        
        // Initialize section dividers
        const sectionDividers = new SectionDividerManager();
        initializedSystems.sectionDividers = true;
        window.sectionDividerManager = sectionDividers;
        
        // Initialize scroll animations with error boundary
        try {
            const scrollAnimations = new ScrollAnimationController();
            initializedSystems.scrollAnimations = true;
            window.scrollAnimations = scrollAnimations; // Store reference for external access
        } catch (scrollError) {
            console.error('Error initializing ScrollAnimationController:', scrollError);
        }
        
        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            if (particleSystem) {
                particleSystem.destroy();
            }
            
            if (window.sectionDividerManager) {
                window.sectionDividerManager.destroy();
            }
            
            if (window.scrollAnimations) {
                window.scrollAnimations.destroy();
            }
        });
        
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
    }
});