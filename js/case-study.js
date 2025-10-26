document.addEventListener("DOMContentLoaded", () => {
  // CONFIG
  const HEADER_OFFSET = 100; // how far from top we consider "in view" for scrollspy
  const UP_SCROLL_HEADER_OFFSET = 91; // your desired 91px offset when scrolling up
  const FOOTER_GAP = 20; // how many px to leave above footer when clamping

  // DOM refs
  const headerDiv = document.querySelector(".header-bar");
  const aside = document.querySelector("aside");
  const backToTop = document.querySelector(".back-to-top");
  const footer = document.querySelector("footer");

  // Build aligned arrays of nav links <-> sections (keeps indices consistent)
  const rawNavLinks = Array.from(document.querySelectorAll("aside nav a"));
  const pairs = rawNavLinks
    .map(link => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return null;
      const id = href.slice(1);
      const section = document.getElementById(id);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  const navLinks = pairs.map(p => p.link);
  const sections = pairs.map(p => p.section);

  // compute max scroll top so viewport bottom sits FOOTER_GAP px above footer top
  function computeMaxScroll(gap = FOOTER_GAP) {
    const scrollY = window.scrollY;
    // footerTop relative to document
    let footerTop = document.body.scrollHeight;
    if (footer) {
      footerTop = footer.getBoundingClientRect().top + scrollY;
    }
    // max top such that (top + innerHeight) <= (footerTop - gap)
    const maxTop = footerTop - window.innerHeight - gap;
    return Math.max(0, Math.floor(maxTop));
  }

  // returns a clamped top target for a given section respecting offset and footer
  function getClampedTargetForSection(section, offset = 0) {
    const scrollY = window.scrollY;
    const sectionTop = Math.round(section.getBoundingClientRect().top + scrollY - offset);
    const maxScroll = computeMaxScroll();
    return Math.min(sectionTop, maxScroll);
  }

  // update active links based on scroll position
  function updateActiveOnScroll() {
    const scrollPos = window.scrollY;
    const viewportHeight = window.innerHeight;
    const OFFSET = 100; // Offset from top of viewport to trigger section change
    
    // Find the current section based on scroll position
    let activeIndex = 0;
    let lastVisibleIndex = 0;
    
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      
      // Check if this section is currently visible in the viewport
      const isVisible = (
        rect.top < viewportHeight && // Section top is above viewport bottom
        rect.bottom > 0 // Section bottom is below viewport top
      );
      
      if (isVisible) {
        lastVisibleIndex = index;
        
        // If section top reaches trigger point, make it active
        if (rect.top <= OFFSET) {
          activeIndex = index;
        }
      }
    });

    // Special handling for last section:
    // If we're seeing the last section at all, and we're past the halfway point of the previous section,
    // activate the last section
    if (lastVisibleIndex === sections.length - 1) {
      const previousSection = sections[sections.length - 2];
      if (previousSection) {
        const prevRect = previousSection.getBoundingClientRect();
        if (prevRect.bottom < viewportHeight * 0.75) { // When we're 75% through previous section
          activeIndex = sections.length - 1;
        }
      }
    }

    // Always make last section active if we're near bottom of page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      activeIndex = sections.length - 1;
    }

    // Update active state
    navLinks.forEach(l => l.classList.remove("active"));
    if (navLinks[activeIndex]) {
      navLinks[activeIndex].classList.add("active");
    }
  }

  // resize should recalc max scroll in future calls; also update active once
  window.addEventListener("resize", () => {
    // small debounce would be fine in real app, but this is simple
    updateActiveOnScroll();
  });

  // MAIN: Smooth scroll on click with clamping and upward offset
  navLinks.forEach((link, idx) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = sections[idx];
      if (!section) return;

      const scrollY = window.scrollY;
      const sectionTop = Math.round(section.getBoundingClientRect().top + scrollY);
      const goingUp = sectionTop < scrollY;
      const offset = goingUp ? UP_SCROLL_HEADER_OFFSET : 0;

      // compute a clamped target using offset
      const targetTop = getClampedTargetForSection(section, offset);

      // If targetTop ended up clamped to max and corresponds to the last section,
      // make sure the last nav becomes active (so last link isn't skipped)
      const maxScroll = computeMaxScroll();
      const clamped = targetTop >= maxScroll;

      // trigger smooth scroll
      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });

      // If we clamped to the bottom, mark the last nav active immediately so it doesn't get skipped.
      // Otherwise we rely on natural scrollspy progression.
      if (clamped) {
        navLinks.forEach(l => l.classList.remove("active"));
        navLinks[navLinks.length - 1].classList.add("active");
      }
    });
  });

  // header show/hide behavior (kept simple)
  let prevScrollPos = window.pageYOffset;
  window.addEventListener("scroll", () => {
    const currentScrollPos = window.pageYOffset;

    if (currentScrollPos < 200) {
      headerDiv.style.top = "0";
      headerDiv.classList.remove("midpage");
      backToTop?.classList.add("hide");
    } else if (prevScrollPos > currentScrollPos) {
      // scrolling up
      headerDiv.style.top = "0";
      headerDiv.classList.add("midpage");
      if (currentScrollPos > window.innerHeight - 40) aside?.classList.add("extra-top-padding");
      else aside?.classList.remove("extra-top-padding");
    } else if (!document.querySelector(".nav-content")?.classList.contains("active")) {
      // scrolling down
      headerDiv.style.top = "-200px";
      backToTop?.classList.remove("hide");
      aside?.classList.remove("extra-top-padding");
    }

    prevScrollPos = currentScrollPos;

    // update scrollspy each scroll frame
    updateActiveOnScroll();
  });

  // initial activation on load
  updateActiveOnScroll();
});
