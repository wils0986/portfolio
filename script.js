// JS Closes lightbox with escape key and button click


document.addEventListener('DOMContentLoaded', () => {
  // Open lightbox
  document.querySelectorAll('.lightbox').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) target.classList.add('active');
    });
  });

  // Close lightbox on close button click
  document.querySelectorAll('.lightbox-close').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const lightbox = btn.closest('.lightbox-target');
      if (lightbox) lightbox.classList.remove('active');
    });
  });

  // Close lightbox on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.lightbox-target.active').forEach(activeBox => {
        activeBox.classList.remove('active');
      });
    }
  });
});

// Safe to access DOM elements here
const button = document.getElementById("myButton");
button.addEventListener("click", () => {
  alert("Button clicked!");
});