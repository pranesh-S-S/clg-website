// ===== SCROLL ANIMATIONS (Intersection Observer) =====
const fadeEls = document.querySelectorAll('.fade-up');
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);
fadeEls.forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');
let counterStarted = false;
function animateCounters() {
  if (counterStarted) return;
  counterStarted = true;
  
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const spanNode = counter.querySelector('span');
    const suffixHtml = spanNode ? `<span>${spanNode.textContent}</span>` : '';
    
    let current = 0;
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function (easeOutExpo) for smoother deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      current = target * easeProgress;
      
      counter.innerHTML = Math.floor(current) + suffixHtml;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerHTML = target + suffixHtml;
      }
    }
    requestAnimationFrame(updateCounter);
  });
}

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObserver.unobserve(statsSection);
    }
  }, { threshold: 0.3 });
  statsObserver.observe(statsSection);
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== CLICK COLOR EFFECTS =====
function addClickEffect(el, className, duration) {
  el.addEventListener('click', () => {
    el.classList.remove(className);
    void el.offsetWidth; // force reflow to restart animation
    el.classList.add(className);
    setTimeout(() => el.classList.remove(className), duration);
  });
}

// Ripple effect on buttons
function createRipple(e, el) {
  const circle = document.createElement('span');
  circle.classList.add('ripple-circle');
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  circle.style.width = circle.style.height = size + 'px';
  circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
  circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
  el.appendChild(circle);
  setTimeout(() => circle.remove(), 700);
}

// Buttons — glow burst + ripple
document.querySelectorAll('.btn-primary, .btn-apply').forEach(btn => {
  btn.classList.add('ripple-target');
  btn.addEventListener('click', (e) => {
    createRipple(e, btn);
    btn.classList.remove('glow-burst');
    void btn.offsetWidth;
    btn.classList.add('glow-burst');
    setTimeout(() => btn.classList.remove('glow-burst'), 600);
  });
});

// Program cards — color pulse
document.querySelectorAll('.program-card').forEach(card => {
  addClickEffect(card, 'color-pulse', 700);
});

// Campus cards — overlay flash
document.querySelectorAll('.campus-card').forEach(card => {
  addClickEffect(card, 'overlay-flash', 600);
});

// Testimonial cards — shimmer
document.querySelectorAll('.testimonial-card').forEach(card => {
  addClickEffect(card, 'shimmer', 700);
});

// ===== FORWARD SCROLL TO PARENT (For Lenis Smooth Scroll) =====
window.addEventListener('wheel', (e) => {
  if (window.parent) {
    window.parent.postMessage({
      type: 'iframe-wheel',
      deltaY: e.deltaY,
      deltaX: e.deltaX
    }, '*');
  }
}, { passive: true });

// Forward Mobile Touch events
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (window.parent) {
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY - currentY;
    touchStartY = currentY;
    window.parent.postMessage({
      type: 'iframe-touch',
      deltaY: deltaY
    }, '*');
  }
}, { passive: true });

// ===== DYNAMIC IFRAME HEIGHT FOR MOBILE & RESPONSIVENESS =====
function sendHeight() {
  if (window.parent) {
    // Adding a small buffer of 50px to ensure nothing is cut off at the very bottom
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    ) + 50;
    
    window.parent.postMessage({
      type: 'iframe-height',
      height: height
    }, '*');
  }
}
window.addEventListener('load', sendHeight);
window.addEventListener('resize', sendHeight);
// Send it a few times initially to catch delayed image loads or mobile reflows
let heightInterval = setInterval(sendHeight, 1000);
setTimeout(() => clearInterval(heightInterval), 5000);
