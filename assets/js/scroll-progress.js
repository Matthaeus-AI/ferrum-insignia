// scroll-progress.js - Ferrum Insignia Quantum Scroll Progress System - BALANCED OPTIMIZATION

/**
 * ScrollProgressController
 * Optimized version with selective vertical indicator removal while maintaining animations
 * @class
 */
class ScrollProgressController {
    /**
     * Initialize the controller with optimized configuration parameters
     */
    constructor() {
        // Core DOM references
        this.headerProgressBar = null;       // Header container reference
        this.headerProgressIndicator = null; // Header progress indicator
        
        // State tracking
        this.sections = [];                  // Section elements
        this.isInitialized = false;          // Initialization state flag
        this.scrollThrottleDelay = 16;       // ~60fps optimal frame time
        this.lastScrollTime = 0;             // Last scroll timestamp
        this.rafId = null;                   // requestAnimationFrame ID
        this.resizeObserver = null;          // ResizeObserver reference
        
        // Cached dimensions
        this.viewportHeight = window.innerHeight;
        this.documentHeight = this.getDocumentHeight();
        this.visibilityState = true;         // Document visibility
        
        // Singleton pattern implementation
        if (window.scrollProgressControllerInstance) {
            console.info('[ScrollProgressController] Instance already exists, returning existing instance');
            return window.scrollProgressControllerInstance;
        }
        
        window.scrollProgressControllerInstance = this;
        
        // Initialize the system (header progress only)
        this.init();
    }
    
    /**
     * Initialize the scroll progress controller
     * @private
     */
    init() {
        // Get reference to header progress bar only
        this.headerProgressBar = document.getElementById('headerProgressBar');
        
        if (this.headerProgressBar) {
            this.headerProgressIndicator = this.headerProgressBar.querySelector('.progress-indicator');
        }
        
        // Get all sections
        this.sections = Array.from(document.querySelectorAll('section[data-section]'));
        
        // PRECISION TARGETING: Remove only vertical slider elements
        this.removeVerticalScrollIndicators();
        
        // Wait for DOM to be fully loaded
        this.waitForDOMReady(() => {
            // Bind events for Header progress bar
            this.bindEvents();
            
            // Initial update
            this.updateProgress();
            
            this.isInitialized = true;
        });
    }
    
    /**
     * Wait for DOM-Ready with fallback
     * @param {Function} callback - Function to execute
     * @private
     */
    waitForDOMReady(callback) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(callback, 0);
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }
    
    /**
     * Selectively removes only vertical scroll indicators from the DOM
     * Preserves all other visual effects and animations
     * @private
     */
    removeVerticalScrollIndicators() {
        // Selectors for vertical scroll indicators only
        const verticalIndicatorSelectors = [
            '.section-connector',               // The primary vertical line between sections
            '.scroll-indicator-quantum',        // Quantum-branded vertical slider
            '.scroll-line',                     // Auxiliary vertical line element  
            '.scroll-beam',                     // Beam element of vertical slider
            '.scroll-indicator',                // Generic indicator class
            '.scroll-quantum-indicator',        // Main quantum scroll indicator
        ];
        
        // Remove only vertical indicator elements based on selectors
        verticalIndicatorSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        });
        
        // Attribute-based removal for orientation-specific indicators
        const orientationSelectors = [
            '[data-scroll-indicator-orientation="vertical"]',
            '[data-scroll-progress-orientation="vertical"]'
        ];
        
        orientationSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });
        });
        
        // Apply surgical style correction to neutralize only the vertical section connectors
        this.applySurgicalStyleCorrections();
    }
    
    /**
     * Apply focused CSS overrides to neutralize only vertical connectors
     * while maintaining all other visual effects
     * @private
     */
    applySurgicalStyleCorrections() {
        // Create style element with precise targeting
        const styleElement = document.createElement('style');
        styleElement.id = 'vertical-connector-fix';
        styleElement.textContent = `
            /* Precision targeting of section connectors only */
            .section-connector {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                width: 0 !important;
                height: 0 !important;
            }
            
            /* Reset section spacing to eliminate vertical line artifacts */
            section[data-section] {
                margin-top: 0 !important;
            }
            
            /* Reset CSS variables specific to vertical connectors */
            :root {
                --section-overlap: 0px !important;
            }
        `;
        
        // Insert with high priority
        document.head.appendChild(styleElement);
    }
    
    /**
     * Get the actual document height considering all content
     * @returns {number} Document height in pixels
     */
    getDocumentHeight() {
        return Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );
    }
    
    /**
     * Bind scroll and resize events with performance optimization
     * @private
     */
    bindEvents() {
        // Update progress on scroll with throttling
        this.bindScrollEvent();
        
        // Use ResizeObserver for efficient size updates
        this.bindResizeEvent();
        
        // Handle visibility changes to save resources when page is not visible
        this.bindVisibilityEvent();
        
        // Handle template loaded event for dynamic content
        this.bindTemplateEvent();
    }
    
    /**
     * Bind the scroll event with optimal performance
     * @private
     */
    bindScrollEvent() {
        window.addEventListener('scroll', () => {
            const now = Date.now();
            
            // Throttle scroll events for optimal performance
            if (now - this.lastScrollTime >= this.scrollThrottleDelay) {
                this.lastScrollTime = now;
                
                // Use requestAnimationFrame for smoother updates
                if (this.rafId) {
                    cancelAnimationFrame(this.rafId);
                }
                
                this.rafId = requestAnimationFrame(() => {
                    if (this.isInitialized && this.visibilityState) {
                        this.updateProgress();
                        this.updateActiveSection();
                    }
                });
            }
        }, { passive: true });
    }
    
    /**
     * Bind the resize event
     * @private
     */
    bindResizeEvent() {
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
            this.resizeObserver.observe(document.body);
        } else {
            // Fallback for browsers without ResizeObserver
            let resizeTimeout;
            
            window.addEventListener('resize', () => {
                if (resizeTimeout) {
                    clearTimeout(resizeTimeout);
                }
                
                resizeTimeout = setTimeout(() => {
                    this.handleResize();
                }, 100); // Debounce for performance
            }, { passive: true });
        }
    }
    
    /**
     * Bind the visibility event
     * @private
     */
    bindVisibilityEvent() {
        document.addEventListener('visibilitychange', () => {
            this.visibilityState = document.visibilityState === 'visible';
        });
    }
    
    /**
     * Bind the template event
     * @private
     */
    bindTemplateEvent() {
        document.addEventListener('templateLoaded', () => {
            if (this.isInitialized) {
                // Recalculate document height when templates load
                setTimeout(() => {
                    this.documentHeight = this.getDocumentHeight();
                    this.updateProgress();
                    
                    // Re-run vertical indicator removal in case templates added new ones
                    this.removeVerticalScrollIndicators();
                }, 100);
            }
        });
    }
    
    /**
     * Handle resize with debouncing
     * @private
     */
    handleResize() {
        if (!this.isInitialized) return;
        
        // Update cached dimensions
        this.viewportHeight = window.innerHeight;
        this.documentHeight = this.getDocumentHeight();
        
        // Update progress immediately after resize
        this.updateProgress();
    }
    
    /**
     * Update progress bar position with high performance
     * @private
     */
    updateProgress() {
        // Skip if header indicator not found
        if (!this.headerProgressIndicator) return;
        
        // Calculate scroll progress (0-100%)
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = this.documentHeight - this.viewportHeight;
        const scrollProgress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
        
        // Update header progress bar
        this.headerProgressIndicator.style.width = `${scrollProgress}%`;
    }
    
    /**
     * Update active section marker with binary search for efficiency
     * @private
     */
    updateActiveSection() {
        // Find the current active section with efficient algorithm
        let activeSection = null;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = document.querySelector('.quantum-header')?.offsetHeight || 80;
        const threshold = this.viewportHeight * 0.3; // 30% from top
        
        // Iterate sections in reverse order (bottom to top) for efficient detection
        for (let i = this.sections.length - 1; i >= 0; i--) {
            const section = this.sections[i];
            const rect = section.getBoundingClientRect();
            
            if (rect.top <= threshold + headerHeight) {
                activeSection = section.getAttribute('data-section');
                break;
            }
        }
        
        // Special case for hero section
        if (scrollTop < 50) {
            activeSection = 'hero';
        }
        
        // Update navigation active state for navigation links
        if (activeSection) {
            this.updateNavigationActiveState(activeSection);
        }
    }
    
    /**
     * Update navigation active state
     * @param {string} activeSectionId - Active section ID
     * @private
     */
    updateNavigationActiveState(activeSectionId) {
        // Update desktop navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            const linkSectionId = href.replace('#', '');
            
            if (linkSectionId === activeSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Special handling for home-nav-link
        const homeNavLink = document.getElementById('home-nav-link');
        if (homeNavLink && activeSectionId === 'hero') {
            homeNavLink.classList.add('active');
        }
        
        // Update mobile navigation links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            const linkSectionId = href.replace('#', '');
            
            if (linkSectionId === activeSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    /**
     * Public method to force progress update
     * @public
     */
    forceUpdate() {
        if (this.isInitialized) {
            this.documentHeight = this.getDocumentHeight();
            this.updateProgress();
        }
    }
    
    /**
     * Reinitialize the scroll progress system
     * Useful after dynamic content changes
     * @public
     */
    reinitialize() {
        if (this.isInitialized) {
            // Update cached dimensions
            this.viewportHeight = window.innerHeight;
            this.documentHeight = this.getDocumentHeight();
            
            // Reset section cache
            this.sections = Array.from(document.querySelectorAll('section[data-section]'));
            
            // Update progress
            this.updateProgress();
            
            // Re-run vertical indicator removal
            this.removeVerticalScrollIndicators();
        }
    }
}

// Initialize ScrollProgressController with deferred execution
document.addEventListener('DOMContentLoaded', () => {
    window.scrollProgressController = new ScrollProgressController();
    
    // Ensure controller is properly initialized after all content is loaded
    window.addEventListener('load', () => {
        if (window.scrollProgressController) {
            requestAnimationFrame(() => {
                window.scrollProgressController.forceUpdate();
                
                // Final cleanup
                window.scrollProgressController.removeVerticalScrollIndicators();
            });
        }
    });
});