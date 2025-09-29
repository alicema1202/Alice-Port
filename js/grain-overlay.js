// Grain texture overlay functionality
// This script adds a grain texture overlay to all pages

// Set grain overlay height to match page height
function setGrainOverlayHeight() {
    const grainOverlay = document.getElementById('grain-overlay');
    if (grainOverlay) {
        // Reset height first to force recalculation
        grainOverlay.style.height = 'auto';
        
        // Get the actual document height with more comprehensive calculation
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight,
            document.documentElement.clientHeight,
            window.innerHeight
        );
        
        // For case study pages (like resume), also check the main content area
        const mainContent = document.querySelector('main#content');
        if (mainContent) {
            const mainHeight = mainContent.offsetHeight + mainContent.offsetTop;
            const finalHeight = Math.max(documentHeight, mainHeight);
            grainOverlay.style.height = finalHeight + 'px';
        } else {
            // Set the height to match the document
            grainOverlay.style.height = documentHeight + 'px';
        }
    }
}

// Initialize grain overlay
function initGrainOverlay() {
    // Check if grain overlay already exists
    let grainOverlay = document.getElementById('grain-overlay');
    
    if (!grainOverlay) {
        // Create grain overlay element
        grainOverlay = document.createElement('div');
        grainOverlay.id = 'grain-overlay';
        grainOverlay.className = 'grain-overlay';
        
        // Insert at the beginning of body
        document.body.insertBefore(grainOverlay, document.body.firstChild);
    }
    
    // Set initial height
    setGrainOverlayHeight();
}

// Initialize immediately to prevent flash
initGrainOverlay();

// Also initialize when DOM is ready as backup
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGrainOverlay);
}

// Debounced resize handler to prevent excessive calls
let resizeTimeout;
function debouncedResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setGrainOverlayHeight, 100);
}

// Set height on page load and resize
window.addEventListener('load', setGrainOverlayHeight);
window.addEventListener('resize', debouncedResize);

// Additional initialization with delay for case study pages
setTimeout(() => {
    setGrainOverlayHeight();
}, 500);

// Also try again after a longer delay to catch any late-loading content
setTimeout(() => {
    setGrainOverlayHeight();
}, 1000);
