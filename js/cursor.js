let cursor;
let hoverTimeout;

// Initialize cursor when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  cursor = document.querySelector(".custom-cursor");
  if (!cursor) return;
  
  // Position cursor off-screen on touch devices (phones/tablets)
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    cursor.style.left = "-9999px";
    cursor.style.top = "-9999px";
    return;
  }
  
  // Handle window resize
  window.addEventListener('resize', () => {
    // Re-check on resize
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      cursor.style.left = "-9999px";
      cursor.style.top = "-9999px";
    }
  });

  // Track mouse movement
  document.addEventListener("mousemove", e => {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
    cursor.style.display = "block";
    cursor.style.opacity = "1";
  });

  // Hide cursor when mouse leaves the page
  document.addEventListener("mouseleave", () => {
    cursor.classList.add("outside");
  });

  // Show cursor when mouse enters the page
  document.addEventListener("mouseenter", () => {
    cursor.classList.remove("outside");
  });

  // Show default cursor state (circle) by default
  cursor.classList.add("default");
  cursor.style.opacity = "1";

  // Handle other hoverable elements (links, buttons, etc.) - but not data-cursor elements
  document.addEventListener("mouseover", (e) => {
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
      hoverTimeout = setTimeout(() => {
      cursor.classList.remove("active", "hoverable", "coming-soon");
      cursor.classList.add("default");
        cursor.innerHTML = ""; // hide custom hover cursor
        cursor.style.opacity = "1"; // show default cursor
        cursor.style.background = "rgba(255, 255, 255, 0.5)"; // reset background
      }, 100); // 100ms delay before returning to default
    });
  });
});
