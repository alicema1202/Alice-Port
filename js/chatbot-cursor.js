// Handle cursor coordination between main page and chatbot iframe
document.addEventListener('DOMContentLoaded', () => {
  const mainCursor = document.querySelector('.custom-cursor');
  if (!mainCursor) return;
  
  let isChatbotFocused = false;

  // Listen for messages from chatbot iframe
  window.addEventListener('message', (event) => {
    if (event.data === 'chatbot-focused') {
      // Hide main cursor when mouse enters chatbot
      isChatbotFocused = true;
      mainCursor.style.opacity = '0';
      mainCursor.style.visibility = 'hidden';
      mainCursor.style.pointerEvents = 'none';
      document.body.style.cursor = 'none';
    } else if (event.data === 'chatbot-blurred') {
      // Show main cursor when mouse leaves chatbot
      isChatbotFocused = false;
      mainCursor.style.opacity = '1';
      mainCursor.style.visibility = 'visible';
      mainCursor.style.pointerEvents = '';
      document.body.style.cursor = '';
    }
  });

  // Handle cursor for chatbot overlay
  const chatOverlay = document.getElementById('chatOverlay');
  if (chatOverlay) {
    // Only show main cursor when hovering overlay outside iframe
    chatOverlay.addEventListener('mousemove', (e) => {
      const chatFrame = chatOverlay.querySelector('.chatbot-frame');
      const rect = chatFrame?.getBoundingClientRect();
      
      if (!rect || (
        e.clientX < rect.left || 
        e.clientX > rect.right || 
        e.clientY < rect.top || 
        e.clientY > rect.bottom
      )) {
        if (!isChatbotFocused) {
          mainCursor.style.opacity = '1';
          mainCursor.style.visibility = 'visible';
          mainCursor.style.pointerEvents = '';
          document.body.style.cursor = '';
        }
      }
    });
  }
});
