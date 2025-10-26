// Function to handle messages from the chatbot iframe
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

// For single-page applications, you might need to listen for route changes
// Here's an example using the popstate event (browser back/forward)
window.addEventListener('popstate', notifyChatbotPageChange);

// If you're using a SPA framework like React or Vue, 
// you'll want to call notifyChatbotPageChange() when your routes change

// For hash-based routing
window.addEventListener('hashchange', notifyChatbotPageChange);
