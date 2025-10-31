let cursor;
let hoverTimeout;
let isChatbotMode = false;
let cursorDisabled = false;

// Initialize cursor when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  cursor = document.querySelector(".custom-cursor");
  if (!cursor) return;
  
  // Check if we're in the chatbot iframe
  isChatbotMode = window.self !== window.top;
  
  // If we're in the chatbot, notify parent when ready
  if (isChatbotMode) {
    document.addEventListener("mouseenter", () => {
      window.parent.postMessage('chatbot-focused', '*');
    });
    document.addEventListener("mouseleave", () => {
      window.parent.postMessage('chatbot-blurred', '*');
    });
  } else {
    // Main page cursor coordination
    window.addEventListener('message', (event) => {
      if (event.data === 'chatbot-focused') {
        cursor.style.opacity = '0';
        cursor.style.visibility = 'hidden';
        cursor.style.pointerEvents = 'none';
      } else if (event.data === 'chatbot-blurred') {
        cursor.style.opacity = '1';
        cursor.style.visibility = 'visible';
        cursor.style.pointerEvents = '';
      }
    });
  }
  
  // Position cursor off-screen on touch devices (phones/tablets)
  const isTouchCapable = () => ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  const hasFinePointer = () => {
    try {
      return (window.matchMedia && window.matchMedia('(any-pointer: fine)').matches) || false;
    } catch (_) { return false; }
  };
  const getEffectiveWidth = () => {
    // Prefer parent window width when running inside the chatbot iframe
    try {
      if (isChatbotMode && window.parent && window.parent !== window) {
        // Only use parent if same-origin; otherwise fall back to screen width
        if (window.parent.location && window.parent.location.origin === window.location.origin) {
          return (window.parent.innerWidth || window.parent.document.documentElement.clientWidth || window.screen.width || 0);
        }
      }
    } catch (_) { /* cross-origin, ignore */ }
    return (window.innerWidth || document.documentElement.clientWidth || window.screen.width || 0);
  };
  const isSmallScreen = () => {
    const w = getEffectiveWidth();
    if (w <= 0) return (window.matchMedia && window.matchMedia('(max-width: 900px)').matches) || false;
    return w <= 900;
  };
  // Treat as phone/tablet only when it's touch AND small AND no fine pointer available
  const isSmallTouchDevice = () => isTouchCapable() && isSmallScreen() && !hasFinePointer();
  const hideCursor = () => {
    cursor.classList.add("outside");
    cursor.style.left = "-9999px";
    cursor.style.top = "-9999px";
    cursor.style.opacity = "0";
    cursor.style.visibility = "hidden";
  };
  const showCursor = () => {
    cursor.classList.remove("outside");
    cursor.style.visibility = "visible";
    cursor.style.opacity = "1";
  };

  const applyTouchMode = () => {
    // Disable custom cursor only on truly small touch devices. Preserve on touch laptops and desktops.
    cursorDisabled = isSmallTouchDevice();
    if (cursorDisabled) {
      hideCursor();
    } else {
      // Visible on larger screens; position will update on mousemove
      showCursor();
    }
  };

  applyTouchMode();
  
  // Handle window resize
  window.addEventListener('resize', applyTouchMode);
  window.addEventListener('orientationchange', applyTouchMode);

  // Track mouse movement
  document.addEventListener("mousemove", e => {
    if (cursorDisabled) return;
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
    cursor.style.display = "block";
    cursor.style.opacity = "1";
  });

  // Hide cursor when mouse leaves the page
  document.addEventListener("mouseleave", () => {
    if (cursorDisabled) return;
    cursor.classList.add("outside");
  });

  // Show cursor when mouse enters the page
  document.addEventListener("mouseenter", () => {
    if (cursorDisabled) return;
    cursor.classList.remove("outside");
  });

  // Show default cursor state (circle) by default
  cursor.classList.add("default");
  cursor.style.opacity = "1";

  // Handle other hoverable elements (links, buttons, etc.) - but not data-cursor elements
  document.addEventListener("mouseover", (e) => {
    if (cursorDisabled) return;
    const target = e.target;
    const isDataCursor = target.hasAttribute("data-cursor") || target.closest("[data-cursor]");
    const isHoverable = target.matches("a, button, input, select, textarea, [onclick], [role='button'], .clickable, .nav-item, .previous") || (target.closest("aside nav") && target.matches("a, p"));
    
    // Debug logging
    if (target.closest("aside")) {
      console.log("Hovering over aside element:", target, "isHoverable:", isHoverable);
    }
    
    if (isHoverable && !isDataCursor) {
      clearTimeout(hoverTimeout);
      cursor.classList.remove("default", "active");
      cursor.classList.add("hoverable");
      cursor.innerHTML = "";
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (cursorDisabled) return;
    const target = e.target;
    const isDataCursor = target.hasAttribute("data-cursor") || target.closest("[data-cursor]");
    const isHoverable = target.matches("a, button, input, select, textarea, [onclick], [role='button'], .clickable, .nav-item, .previous") || (target.closest("aside nav") && target.matches("a, p"));
    
    if (isHoverable && !isDataCursor) {
      hoverTimeout = setTimeout(() => {
        cursor.classList.remove("hoverable");
        cursor.classList.add("default");
      }, 50);
    }
  });

  // Show custom cursor only on hoverable elements
  document.querySelectorAll("[data-cursor]").forEach(el => {
    el.addEventListener("mouseenter", () => {
      if (cursorDisabled) return;
      clearTimeout(hoverTimeout);
      const text = el.getAttribute("data-cursor");
      cursor.classList.remove("default", "hoverable");
      cursor.classList.add("active");
      cursor.style.opacity = "1"; // reset opacity

      let arrow = "";
      const lowerText = text.toLowerCase();

      if (!lowerText.includes("coming soon...")) {
        arrow = lowerText.includes("case study") ? "→" : "↗";
        cursor.classList.remove("coming-soon");
        cursor.style.background = "rgba(255, 255, 255, 0.5)";
      } else {
        arrow = "";
        cursor.classList.add("coming-soon");
        cursor.style.background = "rgba(200, 200, 200, 0.2)";
      }

      cursor.innerHTML = `<span class="cursor-text">${text} <span class="arrow">${arrow}</span></span>`;
    });

    el.addEventListener("mouseleave", () => {
      if (cursorDisabled) return;
      hoverTimeout = setTimeout(() => {
      cursor.classList.remove("active", "hoverable", "coming-soon");
      cursor.classList.add("default");
        cursor.innerHTML = ""; // hide custom hover cursor
        cursor.style.opacity = "1"; // show default cursor
        cursor.style.background = "rgba(255, 255, 255, 0.5)"; // reset background
      }, 100); // 100ms delay before returning to default
    });
  });

  // Ensure taps on touch devices don't flash the cursor
  document.addEventListener("touchstart", () => {
    applyTouchMode();
    if (cursorDisabled) hideCursor();
  }, { passive: true });
  document.addEventListener("touchmove", () => {
    if (cursorDisabled) hideCursor();
  }, { passive: true });
});
