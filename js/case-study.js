document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("aside nav a");
  const sections = Array.from(navLinks)
    .map(link => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);

  // Smooth scroll on click without forcing active
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const id = link.getAttribute("href").slice(1);
      const section = document.getElementById(id);
      if (section) {
        const goingUp = window.scrollY > section.offsetTop;
        let targetY = section.offsetTop;
        if (goingUp) targetY = Math.max(targetY - 91, 0);

        window.scrollTo({
          top: targetY,
          behavior: "smooth"
        });
      }
    });
  });

  // Scrollspy: progressive in both directions
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 100; // offset for sticky header

    let currentIndex = 0;
    sections.forEach((section, index) => {
      if (scrollPos >= section.offsetTop) {
        currentIndex = index;
      }
    });

    navLinks.forEach(link => link.classList.remove("active"));
    if (navLinks[currentIndex]) {
      navLinks[currentIndex].classList.add("active");
    }
  });
});
