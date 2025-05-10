// card-flip.js - Ferrum Insignia Card Flip Controller

/**
 * CardFlipController
 * High-performance 3D card flip animation system with optimal GPU utilization
 * @class
 */
class CardFlipController {
    /**
     * Initialize the CardFlipController with optimal configuration parameters
     */
    constructor() {
        // Core configuration parameters
        this.flipDuration = 900;               // Duration of flip animation in ms
        this.flipEasing = 'cubic-bezier(0.25, 0.1, 0.25, 1)'; // Quantum easing curve
        this.cooldownDuration = 800;           // Prevent rapid flips by enforcing cooldown
        
        // Performance optimization parameters
        this.gpuRenderingEnabled = true;       // Force GPU rendering
        this.useRequestAnimationFrame = true;  // Use RAF for animations when possible
        this.debounceTouchEvents = true;       // Debounce touch events for better performance
        
        // State tracking variables
        this.flippableCards = document.querySelectorAll('[data-card-flippable="true"]');
        this.flippingInProgress = new Map();   // Track cards currently animating
        this.touchStartTime = 0;               // For touch interaction detection
        this.touchStartPosition = { x: 0, y: 0 }; // For swipe detection
        
        // Initialize controller
        this.initialize();
    }
    
    /**
     * Initialize the controller with optimal event binding
     * @private
     */
    initialize() {
        if (!this.flippableCards.length) return;

        // Pre-initialize computation
        this.precomputeTransformations();
        
        // Initialize cards
        this.flippableCards.forEach(card => {
            // Initialize state tracking
            this.flippingInProgress.set(card, false);
            
            // Set initial state attribute if not present
            if (!card.hasAttribute('data-flipped')) {
                card.setAttribute('data-flipped', 'false');
            }
            
            // Set up event listeners
            this.setupEventListeners(card);
            
            // Prepare card content
            this.prepareCardContent(card);
        });
        
        console.debug('[CardFlipController] Initialized with', this.flippableCards.length, 'flippable cards');
    }
    
    /**
     * Precompute transformation matrices for optimal performance
     * @private
     */
    precomputeTransformations() {
        // Pre-compute transform matrices to avoid layout thrashing
        this.transformations = {
            front: 'rotateY(0deg)',
            back: 'rotateY(180deg)',
            flipped: 'rotateY(180deg)',
            unflipped: 'rotateY(0deg)'
        };
    }
    
    /**
     * Set up event listeners with optimal delegation
     * @param {HTMLElement} card - Card element
     * @private
     */
    setupEventListeners(card) {
        // Click event with optimal delegation
        card.addEventListener('click', this.createClickHandler(card), { passive: true });
        
        // Touch events for mobile optimization
        if (this.debounceTouchEvents) {
            this.setupDebouncedTouchEvents(card);
        } else {
            this.setupDirectTouchEvents(card);
        }
        
        // Keyboard accessibility
        card.addEventListener('keydown', this.createKeyboardHandler(card));
        
        // Set focusable for keyboard navigation
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-pressed', 'false');
        card.setAttribute('aria-label', 'Karte umdrehen');
    }
    
    /**
     * Create optimal click handler with bound scope
     * @param {HTMLElement} card - Card element
     * @returns {Function} - Event handler
     * @private
     */
    createClickHandler(card) {
        return (e) => {
            // Don't flip if click originated on a button or link inside the card
            if (e.target.closest('button, a')) return;
            
            // Process flip with active cooling
            this.processCardFlip(card);
        };
    }
    
    /**
     * Create keyboard handler with optimal event processing
     * @param {HTMLElement} card - Card element
     * @returns {Function} - Event handler
     * @private
     */
    createKeyboardHandler(card) {
        return (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.processCardFlip(card);
            }
        };
    }
    
    /**
     * Set up direct touch events for max responsiveness
     * @param {HTMLElement} card - Card element
     * @private
     */
    setupDirectTouchEvents(card) {
        // Touchstart event
        card.addEventListener('touchstart', (e) => {
            this.touchStartTime = Date.now();
            this.touchStartPosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }, { passive: true });
        
        // Touchend event
        card.addEventListener('touchend', (e) => {
            // Only flip if it was a tap, not a scroll or swipe
            const touchDuration = Date.now() - this.touchStartTime;
            const touchEndPosition = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY
            };
            
            const distanceX = Math.abs(touchEndPosition.x - this.touchStartPosition.x);
            const distanceY = Math.abs(touchEndPosition.y - this.touchStartPosition.y);
            
            // Check for short tap without significant movement
            if (touchDuration < 300 && distanceX < 10 && distanceY < 10) {
                // Don't flip if touch was on a button or link
                if (!e.target.closest('button, a')) {
                    this.processCardFlip(card);
                }
            }
        }, { passive: true });
    }
    
    /**
     * Set up debounced touch events for performance
     * @param {HTMLElement} card - Card element
     * @private
     */
    setupDebouncedTouchEvents(card) {
        let touchTimeout = null;
        
        // Touchstart event with debounce
        card.addEventListener('touchstart', (e) => {
            this.touchStartTime = Date.now();
            this.touchStartPosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
            
            // Clear any pending timeout
            if (touchTimeout) {
                clearTimeout(touchTimeout);
            }
        }, { passive: true });
        
        // Touchend event with debounce
        card.addEventListener('touchend', (e) => {
            touchTimeout = setTimeout(() => {
                // Only flip if it was a tap, not a scroll or swipe
                const touchDuration = Date.now() - this.touchStartTime;
                const touchEndPosition = {
                    x: e.changedTouches[0].clientX,
                    y: e.changedTouches[0].clientY
                };
                
                const distanceX = Math.abs(touchEndPosition.x - this.touchStartPosition.x);
                const distanceY = Math.abs(touchEndPosition.y - this.touchStartPosition.y);
                
                // Check for short tap without significant movement
                if (touchDuration < 300 && distanceX < 10 && distanceY < 10) {
                    // Don't flip if touch was on a button or link
                    if (!e.target.closest('button, a')) {
                        this.processCardFlip(card);
                    }
                }
            }, 16); // Optimal debounce time (1 frame @ 60fps)
        }, { passive: true });
    }
    
    /**
     * Prepare card content for optimal rendering and accessibility
     * @param {HTMLElement} card - Card element
     * @private
     */
    prepareCardContent(card) {
        // Get card faces
        const cardFront = card.querySelector('.card-front');
        const cardBack = card.querySelector('.card-back');
        
        if (cardFront && cardBack) {
            // Set ARIA attributes for accessibility
            cardFront.setAttribute('aria-hidden', 'false');
            cardBack.setAttribute('aria-hidden', 'true');
            
            // Force GPU acceleration for smoother animations
            if (this.gpuRenderingEnabled) {
                cardFront.style.willChange = 'transform';
                cardBack.style.willChange = 'transform';
                
                // Pre-compute transforms to avoid layout thrashing
                cardFront.style.transform = this.transformations.front;
                cardBack.style.transform = this.transformations.back;
            }
        }
        
        // Set transition properties on inner element
        const cardInner = card.querySelector('.card-inner');
        if (cardInner) {
            cardInner.style.transition = `transform ${this.flipDuration}ms ${this.flipEasing}`;
        }
    }
    
    /**
     * Process a card flip with cooling period
     * @param {HTMLElement} card - Card element to flip
     * @private
     */
    processCardFlip(card) {
        // Skip if animation is already in progress
        if (this.flippingInProgress.get(card)) return;
        
        // Set flipping flag to prevent multiple clicks
        this.flippingInProgress.set(card, true);
        
        // Execute flip with optimal timing
        this.flipCard(card);
        
        // Set cooldown period
        setTimeout(() => {
            this.flippingInProgress.set(card, false);
        }, this.cooldownDuration);
    }
    
    /**
     * Flip card with optimized animation and state management
     * @param {HTMLElement} card - Card element to flip
     * @public
     */
    flipCard(card) {
        // Get current state
        const isFlipped = card.getAttribute('data-flipped') === 'true';
        
        // Dispatch custom event before flip starts
        this.dispatchCardEvent('beforeCardFlip', card, isFlipped);
        
        // Note: Sound effect has been removed from here
        
        // Toggle flipped state
        card.setAttribute('data-flipped', !isFlipped);
        card.setAttribute('aria-pressed', !isFlipped);
        
        // Update ARIA attributes for accessibility
        const cardFront = card.querySelector('.card-front');
        const cardBack = card.querySelector('.card-back');
        
        if (cardFront && cardBack) {
            cardFront.setAttribute('aria-hidden', isFlipped ? 'false' : 'true');
            cardBack.setAttribute('aria-hidden', isFlipped ? 'true' : 'false');
        }
        
        // Dispatch event for flipped state change
        this.dispatchCardEvent('cardFlipped', card, !isFlipped);
        
        // After animation completes
        setTimeout(() => {
            // Dispatch completion event
            this.dispatchCardEvent('cardFlipComplete', card, !isFlipped);
            
            // Trigger shine effect after flip
            this.refreshShineEffect(card);
        }, this.flipDuration);
    }
    
    /**
     * Dispatch card event with optimal event propagation
     * @param {string} eventName - Event name
     * @param {HTMLElement} card - Card element
     * @param {boolean} isFlipped - Flipped state
     * @private
     */
    dispatchCardEvent(eventName, card, isFlipped) {
        const event = new CustomEvent(eventName, {
            bubbles: true,
            composed: true, // For shadow DOM compatibility
            detail: { 
                card, 
                isFlipped,
                productId: card.getAttribute('data-product')
            }
        });
        card.dispatchEvent(event);
    }
    
    /**
     * Refresh shine effect after card flip with RAF optimization
     * @param {HTMLElement} card - Card element
     * @private
     */
    refreshShineEffect(card) {
        const isFlipped = card.getAttribute('data-flipped') === 'true';
        const side = isFlipped ? '.card-back' : '.card-front';
        const shine = card.querySelector(`${side} .card-shine`);
        
        if (shine) {
            if (this.useRequestAnimationFrame) {
                // Use RAF for better performance
                requestAnimationFrame(() => {
                    // Reset animation
                    shine.style.animation = 'none';
                    
                    // Force reflow
                    shine.offsetWidth;
                    
                    // Restart animation
                    shine.style.animation = 'cardShine 8s infinite linear';
                });
            } else {
                // Fallback for older browsers
                shine.style.animation = 'none';
                
                // Force reflow
                void shine.offsetWidth;
                
                // Restart animation
                shine.style.animation = 'cardShine 8s infinite linear';
            }
        }
    }
    
    /**
     * Flip all cards to front or back side with staggered timing
     * @param {boolean} toFront - If true, flip all cards to front side
     * @public
     */
    flipAllCards(toFront = true) {
        this.flippableCards.forEach((card, index) => {
            const isCurrentlyFlipped = card.getAttribute('data-flipped') === 'true';
            
            // Only flip if necessary
            if ((toFront && isCurrentlyFlipped) || (!toFront && !isCurrentlyFlipped)) {
                setTimeout(() => {
                    this.processCardFlip(card);
                }, 100 * index); // Stagger animations for visual appeal
            }
        });
    }
    
    /**
     * Get card by product ID with optimal search algorithm
     * @param {string} productId - Product identifier
     * @returns {HTMLElement|null} - Card element or null if not found
     * @public
     */
    getCardByProductId(productId) {
        // Direct query selector optimization
        const card = document.querySelector(`.product-card[data-product="${productId}"]`);
        if (card && card.hasAttribute('data-card-flippable')) {
            return card;
        }
        
        // Fallback to iteration
        return Array.from(this.flippableCards).find(card => {
            return card.getAttribute('data-product') === productId;
        }) || null;
    }
    
    /**
     * Programmatically flip a specific product card
     * @param {string} productId - Product identifier
     * @public
     */
    flipProductCard(productId) {
        const card = this.getCardByProductId(productId);
        if (card) {
            this.processCardFlip(card);
            
            // Scroll to card if not in viewport
            if (!this.isElementInViewport(card)) {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }
    
    /**
     * Check if element is in viewport with optimal calculation
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} - True if element is in viewport
     * @private
     */
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Initialize controller with optimal timing
document.addEventListener('DOMContentLoaded', () => {
    window.cardFlipController = new CardFlipController();
    
    // Optional: Add keyboard navigation for advanced functionality
    document.addEventListener('keydown', (e) => {
        if (e.key === 'f' || e.key === 'F') {
            window.cardFlipController.flipAllCards(true); // Flip all to front
        } else if (e.key === 'b' || e.key === 'B') {
            window.cardFlipController.flipAllCards(false); // Flip all to back
        }
    });
});