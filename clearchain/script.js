document.addEventListener('DOMContentLoaded', () => {
    
    // Intersection Observer for fade-in elements
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe all elements with the 'fade-in' class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Optional: Add interactivity to the 3D cube on mouse move
    const heroVisual = document.querySelector('.hero-visual');
    const glassCube = document.querySelector('.glass-cube');
    
    if (heroVisual && glassCube) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Subtle tilt effect
            glassCube.style.transform = `translateY(-20px) rotateX(${-y * 0.05}deg) rotateY(${x * 0.05}deg)`;
        });

        heroVisual.addEventListener('mouseleave', () => {
            // Reset to default floating state
            glassCube.style.transform = 'translateY(-20px) rotateX(0) rotateY(0)';
            
            // Clear inline style so CSS animation takes over again
            setTimeout(() => {
                glassCube.style.transform = '';
            }, 300);
        });
    }

    // Glow effect for Feature Cards (Linear style)
    const featuresGrid = document.querySelector('.features-grid');
    if (featuresGrid) {
        featuresGrid.addEventListener('mousemove', e => {
            for(const card of document.querySelectorAll('.feature-card')) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }
        });
    }
});
