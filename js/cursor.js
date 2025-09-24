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
    cursor.style.opacity = "1"; // reset opacity

    let arrow = "";
    const lowerText = text.toLowerCase();

    if (!lowerText.includes("coming soon...")) {
      arrow = lowerText.includes("read case study") ? "→" : "↗";
      cursor.style.opacity = "1"; // full opacity
    } else {
      cursor.style.opacity = "0.7"; // half opacity for coming soon
    }

    cursor.innerHTML = `<span class="cursor-text">${text} <span class="arrow">${arrow}</span></span>`;
  });

  el.addEventListener("mouseleave", () => {
    cursor.classList.remove("active");
    cursor.innerHTML = ""; // hide custom hover cursor
    cursor.style.opacity = "0"; // reset opacity
  });
});
