const modal = document.getElementById('mediaModal');
const video = document.getElementById('popupVideo');
const pdf = document.getElementById('popupPDF');
const closeBtn = modal.querySelector('.close');

// Detect mobile devices
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// Open modal
document.querySelectorAll('.media-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const type = link.getAttribute('data-type'); // 'video' or 'pdf'
    const src = link.getAttribute('href');

    if (!type || !src) return;

    if (type === 'video') {
      if (isMobile) {
        // On mobile, open native video player
        window.location.href = src;
        return;
      } else {
        video.src = src;
        video.style.display = 'block';
        pdf.style.display = 'none';
        video.autoplay = true;
        video.muted = false; // ensure autoplay works
        video.load();
        video.play().catch(() => console.warn('Autoplay blocked'));
      }
    } else if (type === 'pdf') {
      if (isMobile) {
        // On mobile, open PDF in new tab
        window.open(src, '_blank', 'noopener,noreferrer');
        return;
      } else {
        pdf.src = src;
        pdf.style.display = 'block';
        video.style.display = 'none';
        video.pause();
        video.currentTime = 0;
      }
    }

    modal.style.display = 'flex';
  });
});

// Close modal
closeBtn.addEventListener('click', closeModal);

// Close by clicking outside content
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

function closeModal() {
  modal.style.display = 'none';
  video.pause();
  video.src = '';
  pdf.src = '';
}
