const modal = document.getElementById('mediaModal');
const video = document.getElementById('popupVideo');
const pdf = document.getElementById('popupPDF');
const closeBtn = modal.querySelector('.close');

// Open modal
document.querySelectorAll('.media-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const type = link.getAttribute('data-type');
    const src = link.getAttribute('href');

    if(type === 'video') {
      video.src = src;
      video.style.display = 'block';
      pdf.style.display = 'none';
      video.play();
    } else if(type === 'pdf') {
      pdf.src = src;
      pdf.style.display = 'block';
      video.style.display = 'none';
      video.pause();
      video.currentTime = 0;
    }

    modal.style.display = 'flex';
  });
});

// Close modal
closeBtn.addEventListener('click', () => {
  closeModal();
});

// Close on clicking outside content
modal.addEventListener('click', e => {
  if(e.target === modal) {
    closeModal();
  }
});

function closeModal() {
  modal.style.display = 'none';
  video.pause();
  video.src = '';
  pdf.src = '';
}
