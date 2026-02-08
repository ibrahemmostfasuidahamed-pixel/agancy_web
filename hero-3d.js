// ========================================
// Apple-Style Scrollytelling Hero
// Professional Implementation
// ========================================

const canvas = document.getElementById('hero-canvas');
const context = canvas ? canvas.getContext('2d') : null;

if (canvas && context) {
    // Configuration
    const frameCount = 80;
    const currentFrame = index => `frame/ffout${String(index + 1).padStart(3, '0')}.gif`;

    // State
    const images = [];
    let imagesLoaded = 0;
    let canvasReady = false;

    // Preload all frames
    console.log('🎬 Loading frames...');

    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);

        img.onload = () => {
            imagesLoaded++;

            // Set canvas size on first image load
            if (imagesLoaded === 1) {
                canvas.width = img.width;
                canvas.height = img.height;
                canvasReady = true;
                render(0);
            }

            // Log progress
            if (imagesLoaded % 20 === 0 || imagesLoaded === frameCount) {
                console.log(`📦 Loaded ${imagesLoaded}/${frameCount} frames`);
            }
        };

        images.push(img);
    }

    // Render function
    function render(frameIndex) {
        if (!canvasReady) return;

        const index = Math.min(frameCount - 1, Math.max(0, Math.floor(frameIndex)));
        const img = images[index];

        if (img && img.complete) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
    }

    // Text overlay management
    const overlays = [
        { element: document.querySelector('.text-overlay-1'), start: 0, end: 0.25 },
        { element: document.querySelector('.text-overlay-2'), start: 0.25, end: 0.5 },
        { element: document.querySelector('.text-overlay-3'), start: 0.5, end: 0.75 },
        { element: document.querySelector('.text-overlay-4'), start: 0.75, end: 1 }
    ];

    // Scroll handler
    function updateOnScroll() {
        const heroSection = document.querySelector('.scrollytelling-hero');
        if (!heroSection) return;

        const rect = heroSection.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));

        // Update frame
        const frameIndex = scrollProgress * (frameCount - 1);
        render(frameIndex);

        // Update text overlays
        overlays.forEach(overlay => {
            if (!overlay.element) return;

            const isActive = scrollProgress >= overlay.start && scrollProgress < overlay.end;

            if (isActive) {
                overlay.element.classList.add('active');
            } else {
                overlay.element.classList.remove('active');
            }
        });
    }

    // Throttled scroll listener for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial render
    updateOnScroll();

    console.log('✅ Scrollytelling hero initialized');
}
