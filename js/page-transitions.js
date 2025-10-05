// Simple Page Transitions
(function() {
    'use strict';
    
    let isTransitioning = false;
    
    // Add transition styles
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body.page-transition {
                transition: opacity 0.4s ease, transform 0.4s ease;
            }
            
            body.page-transition.slide-up {
                opacity: 0;
                transform: translateY(-30px);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Check if link is internal
    function isInternalLink(href) {
        if (!href) return false;
        
        // Skip external links, mailto, tel, anchors
        if (href.startsWith('http') || href.startsWith('mailto:') || 
            href.startsWith('tel:') || href.startsWith('#') ||
            href.includes('alicemadesign.com')) {
            return false;
        }
        
        // Skip links that open in new tabs
        const link = document.querySelector(`a[href="${href}"]`);
        if (link && (link.target === '_blank' || link.getAttribute('rel') === 'noopener')) {
            return false;
        }
        
        // Skip media player controls - check if it's a media-related link
        if (link && (
            link.closest('video') || 
            link.closest('.media-player') || 
            link.closest('[data-media]') ||
            link.classList.contains('media-control') ||
            link.classList.contains('media-link') ||
            link.getAttribute('data-media-control') ||
            link.getAttribute('data-type') ||
            link.getAttribute('data-cursor')
        )) {
            return false;
        }
        
        // Skip any links inside media containers
        if (link && link.closest('video, audio, .video-container, .media-container')) {
            return false;
        }
        
        return true;
    }
    
    // Handle link clicks
    function handleClick(e) {
        if (isTransitioning) return;
        
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!isInternalLink(href)) return;
        
        e.preventDefault();
        
        // Add transition class
        document.body.classList.add('page-transition');
        
        // Always slide up
        document.body.classList.add('slide-up');
        isTransitioning = true;
        
        // Navigate after transition
        setTimeout(() => {
            window.location.href = href;
        }, 400);
    }
    
    // Initialize
    function init() {
        addStyles();
        document.addEventListener('click', handleClick, true);
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();