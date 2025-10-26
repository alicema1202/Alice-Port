// Function to toggle the chatbot overlay
function toggleChatOverlay() {
    const overlay = document.getElementById('chatOverlay');
    const chatFrame = document.querySelector('.chatbot-frame');
    const chatIcon = document.querySelector('.chatbtn span');
    const chatBtn = document.querySelector('.chatbtn');
    
    if (overlay) {
        const wasVisible = overlay.classList.contains('visible');
        overlay.classList.toggle('visible');
        chatBtn.classList.toggle('active');
        
        if (chatIcon.innerHTML === "close") {
            chatIcon.innerHTML = "assistant";
        } else {
            chatIcon.innerHTML = "close";
        }

        // Load content if not already loaded and opening overlay
        if (!wasVisible && overlay.classList.contains('visible') && !chatFrame.src) {
            const path = window.location.pathname;
            const chatbotPath = path.includes('/') && !path.endsWith('/') 
                ? '../includes/chatbot.html'  // In subdirectory
                : 'includes/chatbot.html';    // In root
            chatFrame.src = chatbotPath;
        }
    }
}

// Listen for messages from the chatbot iframe
window.addEventListener('message', function(event) {
    console.log('Parent page received message:', event.data);
    const chatbotIframe = document.querySelector('.chatbot-frame');
    console.log('Found chatbot iframe:', chatbotIframe);
    
    // Only process messages from our chatbot iframe
    if (event.source !== chatbotIframe?.contentWindow) return;
    
    // Handle different message types
    if (event.data === 'chatbot-focused') {
        // Handle focus event
    } else if (event.data === 'chatbot-blurred') {
        // Handle blur event
    } else if (event.data.type === 'requestCurrentPage') {
        // Send the current page URL to the chatbot
        chatbotIframe.contentWindow.postMessage({
            type: 'pageChange',
            url: window.location.href
        }, '*');
    }
});

// Function to notify chatbot iframe about page changes
function notifyChatbotPageChange() {
    console.log('Notifying chatbot of page change');
    const chatbotIframe = document.querySelector('.chatbot-frame');
    if (chatbotIframe) {
        chatbotIframe.contentWindow.postMessage({
            type: 'pageChange',
            url: window.location.href
        }, '*');
    }
}

// Listen for page changes
window.addEventListener('load', notifyChatbotPageChange);
window.addEventListener('popstate', notifyChatbotPageChange);
window.addEventListener('hashchange', notifyChatbotPageChange);
