// ---- Navbar: scroll class ----
const navbar = document.getElementById('navbar');
const SCROLL_THRESHOLD = 60;

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
}, { passive: true });

// ---- Hamburger / Mobile drawer ----
const hamburger = document.getElementById('hamburger');
const drawer    = document.getElementById('mobile-drawer');
const spans     = hamburger.querySelectorAll('span');

hamburger.addEventListener('click', () => {
  const isOpen = drawer.classList.toggle('open');
  // Animate to X
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.transform = '';
  }
});

// Close drawer on link click
drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    drawer.classList.remove('open');
    spans[0].style.transform = '';
    spans[1].style.transform = '';
  });
});

// ---- Reveal on scroll (IntersectionObserver) ----
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Unobserve after triggering for performance
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ---- Sticky Scroll Feature Section ----
const featureSteps   = document.querySelectorAll('.feature-step');
const phoneScreens   = document.querySelectorAll('.phone-screen');

function activateScreen(index) {
  phoneScreens.forEach((screen, i) => {
    screen.classList.toggle('active', i === index);
  });
}

const stepObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = parseInt(entry.target.dataset.screen, 10);
      activateScreen(idx);
    }
  });
}, {
  threshold: 0,
  rootMargin: '-45% 0px -45% 0px' // trigger when step is in middle 10% of viewport
});

featureSteps.forEach(step => stepObserver.observe(step));

// ---- Screenshots: drag to scroll ----
const ssTrack = document.getElementById('screenshots-track');
if (ssTrack) {
  let isDown = false;
  let startX;
  let scrollLeft;

  ssTrack.addEventListener('mousedown', (e) => {
    isDown = true;
    ssTrack.style.cursor = 'grabbing';
    startX    = e.pageX - ssTrack.offsetLeft;
    scrollLeft = ssTrack.parentElement.scrollLeft;
  });
  ssTrack.addEventListener('mouseleave', () => {
    isDown = false;
    ssTrack.style.cursor = 'grab';
  });
  ssTrack.addEventListener('mouseup', () => {
    isDown = false;
    ssTrack.style.cursor = 'grab';
  });
  ssTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - ssTrack.offsetLeft;
    const walk = (x - startX) * 1.5;
    ssTrack.parentElement.scrollLeft = scrollLeft - walk;
  });
}

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinksAll.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.style.color = href === current ? 'var(--accent)' : '';
  });
}, { passive: true });
