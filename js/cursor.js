const cursor = document.querySelector(".custom-cursor");

// Track mouse movement
document.addEventListener("mousemove", e => {
  cursor.style.top = `${e.clientY}px`;
  cursor.style.left = `${e.clientX}px`;
});

// Show custom cursor only on hoverable elements
document.querySelectorAll("[data-cursor]").forEach(el => {
  el.addEventListener("mouseenter", () => {
    const text = el.getAttribute("data-cursor");
    cursor.classList.add("active");

    // Choose arrow based on text
    const arrow = text.toLowerCase().includes("read case study") ? "→" : "↗";

    cursor.innerHTML = `<span class="cursor-text">${text} <span class="arrow">${arrow}</span></span>`;
  });

  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("active");
    cursor.innerHTML = ""; // hide custom hover cursor
  });
});
