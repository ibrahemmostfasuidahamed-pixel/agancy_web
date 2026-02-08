// ========================================
// DOM Elements
// ========================================
const header = document.querySelector('.header');
const backToTopBtn = document.getElementById('backToTop');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

// ========================================
// Custom Cursor - Professional Design
// ========================================
let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;
let ringX = 0, ringY = 0;

if (cursorDot && cursorRing) {
    // Track mouse position
    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor with smooth lag effect
    function animateCursor() {
        // Dot follows quickly
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        cursorDot.style.left = (dotX - 4) + 'px';
        cursorDot.style.top = (dotY - 4) + 'px';

        // Ring follows with more lag (smooth effect)
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = (ringX - 17.5) + 'px';
        cursorRing.style.top = (ringY - 17.5) + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .nav-link, .blog-card, .hero-btn, .social-icon, .dot');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            cursorRing.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            cursorRing.classList.remove('hover');
        });
    });

    // Click effect
    window.addEventListener('mousedown', () => {
        cursorDot.classList.add('active');
        cursorRing.classList.add('active');
    });
    window.addEventListener('mouseup', () => {
        cursorDot.classList.remove('active');
        cursorRing.classList.remove('active');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '0.6';
    });
}

// ========================================
// Scroll Event Handlers
// ========================================

// Header scroll effect - Hide on scroll down, show on scroll up
let lastScrollY = 0;
function handleHeaderScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
        header.classList.add('scrolled');

        // Hide on scroll down, show on scroll up
        if (currentScrollY > lastScrollY) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
    } else {
        header.classList.remove('scrolled');
        header.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
}

// Back to top button visibility
function handleBackToTop() {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

// ========================================
// Scroll-triggered Animations
// ========================================

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered delay for multiple elements
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);

            // Optionally unobserve after animation
            // animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
}

// ========================================
// Mobile Menu Toggle
// ========================================

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');

    // Animate hamburger to X
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Close menu when clicking a link
function closeMobileMenu() {
    navMenu.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    const spans = mobileMenuBtn.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

// ========================================
// Smooth Scroll to Top
// ========================================

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========================================
// Pagination Dots (What We Do Section)
// ========================================

const dots = document.querySelectorAll('.dot');
const textContents = [
    {
        decorated: `<span class="highlight-circle">في بصمة</span> هنقولك ان <span class="strikethrough">الأنيميشن صعب ومعقد</span> <span class="highlight-underline">سهل وبسيط</span> ممكن تتعلمه وتربح منه`,
        main: `في <strong>بصمة</strong> هنساعدك في رحلتك كلها من مرحلة ماقبل الوصول لأول عميل لحد ماتكون <span class="highlight">Top Rated</span>`
    },
    {
        decorated: `<span class="highlight-circle">كورسات</span> مصممة خصيصاً للمبتدئين في عالم <span class="highlight-underline">الرسوم المتحركة</span>`,
        main: `هنعلمك من <strong>الصفر</strong> لحد ما تبقى محترف في <span class="highlight">After Effects</span> و <span class="highlight">Blender</span>`
    },
    {
        decorated: `<span class="highlight-circle">مجتمع</span> من الأنيميتورز العرب المحترفين`,
        main: `هتلاقي <strong>دعم</strong> مستمر و<span class="highlight">تواصل</span> مع ناس في نفس المجال`
    },
    {
        decorated: `<span class="highlight-circle">فرص عمل</span> حقيقية في سوق العمل الحر`,
        main: `هنساعدك تحصل على <strong>أول عميل</strong> وتبدأ تربح من <span class="highlight">موهبتك</span>`
    }
];

function switchContent(index) {
    // Update active dot
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Update content with animation
    const decoratedText = document.querySelector('.decorated-text');
    const mainText = document.querySelector('.main-text');

    if (decoratedText && mainText && textContents[index]) {
        decoratedText.style.opacity = '0';
        mainText.style.opacity = '0';

        setTimeout(() => {
            decoratedText.innerHTML = textContents[index].decorated;
            mainText.innerHTML = textContents[index].main;
            decoratedText.style.opacity = '1';
            mainText.style.opacity = '1';
        }, 300);
    }
}

// ========================================
// Initialize Everything
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    initScrollAnimations();

    // Trigger hero animations on load
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 300);

    // Event listeners
    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        handleBackToTop();
    });

    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu on link click
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Back to top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }

    // Service Carousel (What We Do Section)
    const dots = document.querySelectorAll('.pagination-dots .dot');
    const serviceContents = document.querySelectorAll('.service-content');

    function switchService(index) {
        // Remove active class from all
        dots.forEach(dot => dot.classList.remove('active'));
        serviceContents.forEach(content => content.classList.remove('active'));

        // Add active class to selected
        dots[index].classList.add('active');
        serviceContents[index].classList.add('active');
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => switchService(index));
    });

    // Auto-rotate services every 5 seconds
    let currentServiceIndex = 0;
    setInterval(() => {
        currentServiceIndex = (currentServiceIndex + 1) % serviceContents.length;
        switchService(currentServiceIndex);
    }, 5000);
});

// ========================================
// Smooth scroll for anchor links
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
