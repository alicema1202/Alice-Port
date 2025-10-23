// Grain texture overlay functionality
// This script adds a grain texture overlay to all pages

// Set grain overlay height to match page height
function setGrainOverlayHeight() {
    const grainOverlay = document.getElementById('grain-overlay');
    if (!grainOverlay) return;
    // Prevent overlapping measurements during rapid resize
    if (setGrainOverlayHeight.isMeasuring) return;
    setGrainOverlayHeight.isMeasuring = true;

    // Temporarily hide the overlay so it doesn't affect document measurements
    const prevDisplay = grainOverlay.style.display;
    grainOverlay.style.display = 'none';
    // Reset inline styles so measurements are accurate
    grainOverlay.style.height = 'auto';
    grainOverlay.style.width = '100%';

    // Compute several candidate heights and pick the largest.
    // Using getBoundingClientRect on body/html helps with some browser quirks.
    const docEl = document.documentElement;

    const candidates = [
        document.body.scrollHeight,
        document.body.offsetHeight,
        docEl.scrollHeight,
        docEl.offsetHeight,
        docEl.clientHeight,
        window.innerHeight
    ];

    // If there's a large main content area, include its bottom coordinate.
    const mainContent = document.querySelector('main#content');
    if (mainContent) {
        // Use offsetTop + offsetHeight which are document-space values and
        // less likely to double-count scrollY than getBoundingClientRect()+scrollY.
        candidates.push(mainContent.offsetTop + mainContent.offsetHeight);
    }

    // Final height should at least fill the viewport
    let finalHeight = Math.max(...candidates, window.innerHeight);

    // Clamp to documentElement.scrollHeight to avoid overshoot from mixed calculations
    finalHeight = Math.min(finalHeight, docEl.scrollHeight || finalHeight);
    grainOverlay.style.height = finalHeight + 'px';
    // ensure overlay covers full width and won't cause horizontal scroll
    grainOverlay.style.left = '0';
    grainOverlay.style.top = '0';
    // restore visibility
    grainOverlay.style.display = prevDisplay || '';
    setGrainOverlayHeight.isMeasuring = false;
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
