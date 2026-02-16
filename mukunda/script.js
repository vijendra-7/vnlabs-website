// ============================================
// SHREE MUKUNDA VIDYAPEETH - Interactive Features
// ============================================

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');

mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll animation for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(element => {
    observer.observe(element);
});

// Contact form handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // In a real application, you would send this data to a server
    // For now, we'll just show an alert
    alert(`Thank you for your message, ${name}! We'll get back to you at ${email} soon.`);

    // Reset form
    contactForm.reset();
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Stagger animation delays for cards
const academicCards = document.querySelectorAll('.academic-card');
academicCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

const facilityCards = document.querySelectorAll('.facility-card');
facilityCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.05}s`;
});

// Add dynamic year to footer
const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.innerHTML = `&copy; ${currentYear} SHREE MUKUNDA VIDYAPEETH. All rights reserved.`;
}

// Preload images for better performance
window.addEventListener('load', () => {
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
        const newImg = new Image();
        newImg.src = img.src;
    });
});

console.log('SHREE MUKUNDA VIDYAPEETH - Website loaded successfully! 🎓');
