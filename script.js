// ==========================================
// AUTOSERVIS KABÁTEK 
// ==========================================

document.addEventListener('DOMContentLoaded', function () {

    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);

        const scrollBtn = document.getElementById('scroll-top');
        if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
            mobileNav.setAttribute('aria-hidden', !isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    const scrollBtn = document.getElementById('scroll-top');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const revealEls = document.querySelectorAll(
        '.service-card, .stk-card, .why-card, .feature-item, .split-image, .split-content, .section-header, .stk-docs, .contact-form-wrap, .contact-info-wrap'
    );

    revealEls.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
        
                const delay = (entry.target.dataset.index || 0) * 80;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));

    const form = document.getElementById('booking-form');
    const submitBtn = document.getElementById('submit-btn');
    const formSuccess = document.getElementById('form-success');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const required = form.querySelectorAll('[required]');
            let valid = true;
            required.forEach(field => {
                field.style.borderColor = '';
                if (!field.value.trim()) {
                    field.style.borderColor = '#e8271a';
                    valid = false;
                }
            });
            if (!valid) return;

            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Odesílám...';

            try {
                const data = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    form.reset();
                    if (formSuccess) {
                        formSuccess.style.display = 'flex';
                        setTimeout(() => formSuccess.style.display = 'none', 6000);
                    }
                    submitBtn.querySelector('span').textContent = 'Odesláno ✓';
                    setTimeout(() => {
                        submitBtn.querySelector('span').textContent = 'Odeslat rezervaci';
                        submitBtn.disabled = false;
                    }, 4000);
                } else {
                    throw new Error('Chyba odeslání');
                }
            } catch {
                submitBtn.querySelector('span').textContent = 'Chyba – zkuste znovu';
                submitBtn.disabled = false;
                setTimeout(() => {
                    submitBtn.querySelector('span').textContent = 'Odeslat rezervaci';
                }, 3000);
            }
        });
    }

    // ---- COOKIES ----
    const cookieBanner  = document.getElementById('cookie-banner');
    const acceptBtn     = document.getElementById('accept-cookies');
    const declineBtn    = document.getElementById('decline-cookies');

    const GA_ID = 'G-XXXXXXXXXX'; // Doplňit  GA4 ID!!

    function loadGA() {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', GA_ID);
    }

    if (!cookieBanner) return;

    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
        loadGA();
    } else if (consent === null) {
        setTimeout(() => cookieBanner.classList.add('show'), 1500);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
            loadGA();
        });
    }
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

});

// MOBILNÍ NAV
function closeMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    const hamburger = document.getElementById('hamburger');
    if (mobileNav) mobileNav.classList.remove('open');
    if (hamburger) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
}
