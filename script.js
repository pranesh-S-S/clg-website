// ===== HERO SLIDER =====
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dot');
const heroTitles = [
  'Shape Your <span class="highlight">Future</span> With Us',
  'Where <span class="highlight">Innovation</span> Meets Excellence',
  'Discover Your <span class="highlight">Potential</span>'
];
const heroSubtitles = [
  'Discover world-class education, cutting-edge research, and a vibrant campus life that prepares you for tomorrow\'s challenges.',
  'Join a community of brilliant minds pushing the boundaries of knowledge across 50+ programs.',
  'State-of-the-art facilities, globally recognized faculty, and a legacy of academic brilliance await you.'
];

let currentSlide = 0;
let slideInterval;

function goToSlide(index) {
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[index].classList.add('active');
  dots[index].classList.add('active');
  document.getElementById('heroTitle').innerHTML = heroTitles[index];
  document.getElementById('heroSubtitle').textContent = heroSubtitles[index];
  currentSlide = index;
}

function nextSlide() {
  goToSlide((currentSlide + 1) % slides.length);
}

function prevSlide() {
  goToSlide((currentSlide - 1 + slides.length) % slides.length);
}

function startAutoplay() {
  slideInterval = setInterval(nextSlide, 5000);
}

function resetAutoplay() {
  clearInterval(slideInterval);
  startAutoplay();
}

document.getElementById('nextSlide').addEventListener('click', () => { nextSlide(); resetAutoplay(); });
document.getElementById('prevSlide').addEventListener('click', () => { prevSlide(); resetAutoplay(); });
dots.forEach(dot => {
  dot.addEventListener('click', () => { goToSlide(parseInt(dot.dataset.index)); resetAutoplay(); });
});
startAutoplay();

// ===== STICKY HEADER =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('active');
  });
});

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
    const suffix = counter.querySelector('span') ? counter.querySelector('span').textContent : '';
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.innerHTML = Math.floor(current) + '<span>' + suffix + '</span>';
    }, 25);
  });
}

const statsSection = document.querySelector('.stats-section');
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    statsObserver.unobserve(statsSection);
  }
}, { threshold: 0.3 });
statsObserver.observe(statsSection);

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

// Nav links — color flash
document.querySelectorAll('.nav-links a:not(.btn-apply)').forEach(link => {
  addClickEffect(link, 'color-flash', 600);
});

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

// ===== TOUCH SWIPE FOR HERO SLIDER =====
let touchStartX = 0;
let touchEndX = 0;
const heroEl = document.getElementById('hero');
heroEl.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
heroEl.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) { nextSlide(); } else { prevSlide(); }
    resetAutoplay();
  }
}, { passive: true });
