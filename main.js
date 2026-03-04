/* TRINO PRODUTORA - SITE EFFECTS
    Animações de Scroll e UI
*/

document.addEventListener('DOMContentLoaded', () => {
    // Revelação ao Rolar
    const observerOptions = { threshold: 0.15 };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card-luxe, .stat-box, h1, .stat-card').forEach(el => {
        el.classList.add('reveal-init'); // Classe inicial no CSS
        revealObserver.observe(el);
    });
});

let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('dots');

// Criar pontos (dots) dinamicamente
slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
});

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function goToSlide(n) {
    currentSlide = n;
    const offset = -currentSlide * 100;
    document.getElementById('testimonialSlider').style.transform = `translateX(${offset}%)`;
    updateDots();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(currentSlide);
}

// Auto-play a cada 5 segundos
setInterval(nextSlide, 5000);


