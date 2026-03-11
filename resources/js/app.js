import './bootstrap';

/**
 * Creates and animates background shapes with mouse interaction.
 */
function initInteractiveBackground() {
  const container = document.querySelector('.bg-shapes');
  if (!container) return;

  const colors = [
    'rgba(30, 64, 175, 0.15)', // Deep Navy
    'rgba(14, 165, 233, 0.12)', // Sky Blue
    'rgba(59, 130, 246, 0.12)', // Blue
    'rgba(16, 185, 129, 0.1)',  // Emerald
  ];

  const shapeCount = 10;
  const shapes = [];
  
  for (let i = 0; i < shapeCount; i++) {
    const shape = document.createElement('div');
    shape.className = 'shape';
    
    const size = Math.floor(200 + Math.random() * 350);
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.left = `${Math.random() * 100}%`;
    shape.style.backgroundColor = colors[i % colors.length];
    
    const duration = 15 + Math.random() * 15;
    const delay = Math.random() * -30;
    shape.style.animationDuration = `${duration}s`;
    shape.style.animationDelay = `${delay}s`;
    
    container.appendChild(shape);
    shapes.push({
      el: shape,
      x: 0,
      y: 0,
      factor: (i + 1) * 0.02
    });
  }

  // Mouse move effect for shapes
  window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const moveX = (clientX - centerX) / centerX;
    const moveY = (clientY - centerY) / centerY;

    shapes.forEach(shape => {
      const x = moveX * 50 * shape.factor;
      const y = moveY * 50 * shape.factor;
      shape.el.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

/**
 * Adds reveal animation to cards when they enter the viewport.
 */
function initCardReveal() {
  const cards = document.querySelectorAll('.card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    observer.observe(card);
  });
}

/**
 * Interactive search filtering for tables.
 */
function enableTableSearch() {
  const searchInput = document.getElementById('searchInput');
  const tableBody = document.getElementById('dataTable');

  if (!searchInput || !tableBody) return;

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach((row) => {
      const text = row.textContent.trim().toLowerCase();
      if (text.includes(term)) {
        row.style.display = '';
        row.style.opacity = '1';
      } else {
        row.style.display = 'none';
        row.style.opacity = '0';
      }
    });
  });
}

/**
 * Initialize all interactive components.
 */
window.addEventListener('DOMContentLoaded', () => {
  initInteractiveBackground();
  initCardReveal();
  enableTableSearch();
});
