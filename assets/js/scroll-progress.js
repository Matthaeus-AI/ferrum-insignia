// scroll-progress.js - Ferrum Insignia Quantum Scroll Progress System

/**
 * ScrollProgressController
 * Manages the header progress indicator for optimal user experience
 * Note: Vertical indicators have been removed per requirements
 * @class
 */
class ScrollProgressController {
    /**
     * Initialize the controller with optimal configuration parameters
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
        } else {
            console.warn('[ScrollProgressController] Header progress bar not found');
        }
        
        // Get all sections
        this.sections = Array.from(document.querySelectorAll('section[data-section]'));
        
        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            // Bind events
            this.bindEvents();
            
            // Initial update
            this.updateProgress();
            
            this.isInitialized = true;
        });
        
        // Initialize immediately if DOM already loaded
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this.bindEvents();
            this.updateProgress();
            this.isInitialized = true;
        }
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
        // Update progress on scroll with throttling and RAF for optimal performance
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
                    }
                });
            }
        }, { passive: true });
        
        // Use ResizeObserver for efficient size updates
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
            this.resizeObserver.observe(document.body);
        } else {
            // Fallback for browsers without ResizeObserver
            window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
        }
        
        // Handle visibility changes to save resources when page is not visible
        document.addEventListener('visibilitychange', () => {
            this.visibilityState = document.visibilityState === 'visible';
        });
        
        // Handle template loaded event for dynamic content
        document.addEventListener('templateLoaded', () => {
            if (this.isInitialized) {
                // Recalculate document height when templates load
                setTimeout(() => {
                    this.documentHeight = this.getDocumentHeight();
                    this.updateProgress();
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
        
        // Update active section efficiently
        this.updateActiveSection(scrollTop);
    }
    
    /**
     * Update active section marker with binary search for efficiency
     * @param {number} scrollTop - Current scroll position
     * @private
     */
    updateActiveSection(scrollTop) {
        // Find the current active section with efficient algorithm
        let activeSection = null;
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
        
        // Update navigation active state for HOME button
        this.updateNavigationActiveState(activeSection);
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
     * Scroll to a specific section with smooth animation
     * @param {string} sectionId - Section ID to scroll to
     * @public
     */
    scrollToSection(sectionId) {
        const section = document.querySelector(`section[data-section="${sectionId}"]`);
        if (!section) return;
        
        const headerHeight = document.querySelector('.quantum-header')?.offsetHeight || 80;
        const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        // Smooth scroll to section with browser API
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
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
            });
        }
    });
});