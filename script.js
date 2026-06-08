// Mobile Drawer Menu
(function () {
    const hamburger = document.getElementById('hamburgerBtn');
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const closeBtn = document.getElementById('drawerClose');
    const productsToggle = document.getElementById('drawerProductsToggle');
    const productsSubmenu = document.getElementById('drawerSubmenu');

    if (!hamburger || !drawer) return;

    function openDrawer() {
        hamburger.classList.add('is-active');
        drawer.classList.add('is-open');
        if (overlay) overlay.classList.add('is-visible');
        document.body.classList.add('drawer-open');
    }

    function closeDrawer() {
        hamburger.classList.remove('is-active');
        drawer.classList.remove('is-open');
        if (overlay) overlay.classList.remove('is-visible');
        document.body.classList.remove('drawer-open');
    }

    hamburger.addEventListener('click', function () {
        if (drawer.classList.contains('is-open')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
            closeDrawer();
        }
    });

    // Products accordion
    if (productsToggle && productsSubmenu) {
        productsToggle.addEventListener('click', function () {
            const isExpanded = productsToggle.classList.contains('is-expanded');
            productsToggle.classList.toggle('is-expanded', !isExpanded);
            productsSubmenu.classList.toggle('is-expanded', !isExpanded);
        });
    }

    // Close drawer on window resize past breakpoint
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && drawer.classList.contains('is-open')) {
            closeDrawer();
        }
    });
})();

// Applications Section Tabs
function openAppTab(evt, tabId) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("app-tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("app-tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabId).classList.add("active");
    evt.currentTarget.className += " active";
}

// Home Banner Slider
(function () {
    const slider = document.getElementById('homeHeroSlider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const prevBtn = slider.querySelector('.hero-slider-prev');
    const nextBtn = slider.querySelector('.hero-slider-next');
    const label = slider.querySelector('.hero-slider-status strong');
    const dots = Array.from(slider.querySelectorAll('.hero-slider-dot'));
    let activeIndex = slides.findIndex(slide => slide.classList.contains('active'));
    if (activeIndex < 0) activeIndex = 0;

    function showSlide(index) {
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('active', slideIndex === activeIndex);
        });
        if (label) label.textContent = slides[activeIndex].dataset.slideLabel || '';
        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeIndex;
            dot.classList.toggle('active', isActive);
            if (isActive) {
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.removeAttribute('aria-current');
            }
        });
        window.dispatchEvent(new CustomEvent('packion:hero-slide-change'));
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            showSlide(activeIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            showSlide(activeIndex + 1);
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener('click', function () {
            showSlide(Number(dot.dataset.slideIndex || 0));
        });
    });

    showSlide(activeIndex);
})();

// Foam Hero Product Image Slider (inside Banner 1)
(function () {
    const foamSlider = document.getElementById('heroFoamSlider');
    if (!foamSlider) return;

    const slides = Array.from(foamSlider.querySelectorAll('.foam-slider-slide'));
    const prevBtn = foamSlider.querySelector('.foam-slider-prev');
    const nextBtn = foamSlider.querySelector('.foam-slider-next');
    const dotsContainer = document.getElementById('foamSliderDots');
    const labelEl = document.getElementById('foamSliderLabel');
    const progressBar = document.getElementById('foamSliderProgressBar');

    const AUTOPLAY_INTERVAL = 4000; // 4 seconds per slide
    let currentIndex = 0;
    let autoplayTimer = null;
    let isTransitioning = false;

    // Build dots dynamically
    slides.forEach(function (slide, i) {
        const dot = document.createElement('button');
        dot.className = 'foam-slider-dot' + (i === 0 ? ' active' : '');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Show ' + (slide.dataset.foamLabel || 'slide ' + (i + 1)));
        dot.dataset.foamIndex = i;
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll('.foam-slider-dot'));

    function showFoamSlide(newIndex) {
        if (isTransitioning || newIndex === currentIndex) return;
        isTransitioning = true;

        const oldSlide = slides[currentIndex];
        const newSlide = slides[(newIndex + slides.length) % slides.length];
        const targetIndex = (newIndex + slides.length) % slides.length;

        // Add exiting class to old slide
        oldSlide.classList.remove('active');
        oldSlide.classList.add('exiting');

        // Activate new slide
        newSlide.classList.add('active');

        // Update dots
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === targetIndex);
        });

        // Update label
        if (labelEl) {
            labelEl.style.opacity = '0';
            labelEl.style.transform = 'translateY(-4px)';
            setTimeout(function () {
                labelEl.textContent = newSlide.dataset.foamLabel || '';
                labelEl.style.opacity = '1';
                labelEl.style.transform = 'translateY(0)';
            }, 250);
        }

        // Restart progress bar
        restartProgress();

        // Clean up after transition
        setTimeout(function () {
            oldSlide.classList.remove('exiting');
            isTransitioning = false;
        }, 750);

        currentIndex = targetIndex;
    }

    function nextFoamSlide() {
        showFoamSlide(currentIndex + 1);
    }

    function prevFoamSlide() {
        showFoamSlide(currentIndex - 1);
    }

    // Progress bar animation
    function restartProgress() {
        if (!progressBar) return;
        progressBar.classList.remove('animating');
        // Force reflow
        void progressBar.offsetWidth;
        progressBar.classList.add('animating');
    }

    // Autoplay
    function startAutoplay() {
        stopAutoplay();
        restartProgress();
        autoplayTimer = setInterval(function () {
            nextFoamSlide();
        }, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
        if (progressBar) {
            progressBar.classList.remove('animating');
            progressBar.style.width = '0%';
        }
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            prevFoamSlide();
            startAutoplay(); // restart timer after manual interaction
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            nextFoamSlide();
            startAutoplay();
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            const idx = Number(dot.dataset.foamIndex || 0);
            showFoamSlide(idx);
            startAutoplay();
        });
    });

    // Pause autoplay on hover
    foamSlider.addEventListener('mouseenter', function () {
        stopAutoplay();
    });

    foamSlider.addEventListener('mouseleave', function () {
        // Only restart if foam banner is currently active
        const foamBanner = document.querySelector('.foam-slide.active');
        if (foamBanner) {
            startAutoplay();
        }
    });

    // Listen for main hero slide changes to start/stop foam autoplay
    window.addEventListener('packion:hero-slide-change', function () {
        const foamBanner = document.querySelector('.foam-slide.active');
        if (foamBanner) {
            startAutoplay();
        } else {
            stopAutoplay();
        }
    });

    // Initial start
    startAutoplay();
})();

// Solutions Section Tab Switcher (mobile only)
function switchSolutionsTab(evt, panelId) {
    // Switch active tab button
    var btns = document.getElementsByClassName('solutions-tab-btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
    }
    evt.currentTarget.classList.add('active');
    // Switch active panel
    var panels = document.getElementsByClassName('split-panel');
    for (var i = 0; i < panels.length; i++) {
        panels[i].classList.remove('tab-active');
    }
    document.getElementById(panelId).classList.add('tab-active');
}

// Navigation Dropdown Level 1 and Level 2 Close Delay & Hover Management
(function () {
    const CLOSE_DELAY = 900;
    const navItem = document.getElementById('nav-products');
    if (!navItem) return;

    const level1 = navItem.querySelector('.dd-level1');
    const subItems = [...navItem.querySelectorAll('.dd-has-sub')];
    const level1Items = level1 ? [...level1.children] : [];
    let menuOpen = false;
    let activeLevel2 = null;
    let activeSubItem = null;
    let closeTimer = null;
    let closeAnimTimer = null;

    level1Items.forEach((item, index) => {
        item.style.setProperty('--dd-i', index);
    });

    subItems.forEach((subItem) => {
        const subLinks = [...subItem.querySelectorAll('.dd-level2 > li')];
        subLinks.forEach((item, index) => {
            item.style.setProperty('--dd-i', index);
        });
    });

    function replayAnimation(element, className) {
        if (!element) return;
        element.classList.remove(className);
        void element.offsetWidth;
        element.classList.add(className);
    }

    function inRect(rect, x, y) {
        return x >= rect.left - 4 && x <= rect.right + 4 && y >= rect.top - 4 && y <= rect.bottom + 4;
    }

    function cursorInMenuZone(x, y) {
        if (inRect(navItem.getBoundingClientRect(), x, y)) return true;
        if (level1 && inRect(level1.getBoundingClientRect(), x, y)) return true;
        if (activeLevel2 && inRect(activeLevel2.getBoundingClientRect(), x, y)) return true;
        return false;
    }

    function openMenu() {
        clearTimeout(closeTimer);
        clearTimeout(closeAnimTimer);
        if (menuOpen && navItem.classList.contains('dd-open')) return;
        navItem.classList.remove('dd-closing');
        navItem.classList.add('dd-open');
        replayAnimation(navItem, 'dd-opening');
        menuOpen = true;
    }

    function closeAll() {
        if (!menuOpen && !navItem.classList.contains('dd-open')) return;
        menuOpen = false;
        clearTimeout(closeAnimTimer);
        navItem.classList.remove('dd-opening');
        navItem.classList.add('dd-closing');
        navItem.classList.remove('dd-open');
        if (activeSubItem) {
            activeSubItem.classList.remove('dd-sub-open', 'dd-sub-opening');
        }
        activeSubItem = null;
        activeLevel2 = null;
        closeAnimTimer = setTimeout(function () {
            navItem.classList.remove('dd-closing');
        }, 950);
    }

    function scheduleClose() {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(closeAll, CLOSE_DELAY);
    }

    function openSubMenu(subItem) {
        clearTimeout(closeTimer);
        if (activeSubItem === subItem && subItem.classList.contains('dd-sub-open')) return;
        subItems.forEach(s => {
            if (s !== subItem) s.classList.remove('dd-sub-open', 'dd-sub-opening');
        });
        subItem.classList.add('dd-sub-open');
        replayAnimation(subItem, 'dd-sub-opening');
        activeSubItem = subItem;
        activeLevel2 = subItem.querySelector('.dd-level2');
    }

    navItem.addEventListener('mouseenter', openMenu);

    subItems.forEach(function (subItem) {
        subItem.addEventListener('mouseenter', function () {
            openMenu();
            openSubMenu(subItem);
        });

        subItem.addEventListener('focusin', function () {
            openMenu();
            openSubMenu(subItem);
        });

        const trigger = subItem.querySelector('.dd-item');
        if (trigger) {
            trigger.addEventListener('click', function (event) {
                if (window.matchMedia('(hover: none)').matches) {
                    event.preventDefault();
                    openMenu();
                    openSubMenu(subItem);
                }
            });
        }
    });

    document.addEventListener('mousemove', function (event) {
        if (!menuOpen) return;

        if (cursorInMenuZone(event.clientX, event.clientY)) {
            clearTimeout(closeTimer);
            if (level1) {
                subItems.forEach(function (subItem) {
                    const rect = subItem.getBoundingClientRect();
                    if (inRect(rect, event.clientX, event.clientY) && activeSubItem !== subItem) {
                        openSubMenu(subItem);
                    }
                });
            }
        } else {
            scheduleClose();
        }
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('#nav-products')) closeAll();
    });
})();

// Drag-to-scroll on the industry carousel
(function () {
    const track = document.getElementById('indTrack');
    if (!track) return;

    let isDown = false, startX, scrollLeft;
    track.addEventListener('mousedown', e => {
        isDown = true;
        track.classList.add('active');
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => { isDown = false; });
    track.addEventListener('mouseup', () => { isDown = false; });
    track.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.6;
        track.scrollLeft = scrollLeft - walk;
    });

    const indNext = document.getElementById('indNext');
    if (indNext) {
        indNext.addEventListener('click', () => {
            track.scrollBy({ left: 280, behavior: 'smooth' });
        });
    }

    const indPrev = document.getElementById('indPrev');
    if (indPrev) {
        indPrev.addEventListener('click', () => {
            track.scrollBy({ left: -280, behavior: 'smooth' });
        });
    }
})();

// Spray Technology Banner - Fluid Dynamics Feature Accordion
(function () {
    const items = document.querySelectorAll('.fluid-feature-item');
    if (items.length === 0) return;

    items.forEach(item => {
        // Toggle active on hover (desktop)
        item.addEventListener('mouseenter', () => {
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
        
        // Toggle active on click (mobile/tablet touch support)
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
})();

// Floating WhatsApp contact button
(function () {
    const phoneNumber = '918275448503';
    const message = encodeURIComponent('Hello Packion, I would like to know more about your solutions.');

    function addWhatsAppButton() {
        if (document.querySelector('.floating-whatsapp')) return;

        const link = document.createElement('a');
        link.className = 'floating-whatsapp';
        link.href = `https://wa.me/${phoneNumber}?text=${message}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'Chat on WhatsApp');
        link.innerHTML = `
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M16.04 3.2c-7.08 0-12.84 5.65-12.84 12.6 0 2.22.6 4.39 1.75 6.29L3.1 28.8l6.91-1.78a13.03 13.03 0 0 0 6.03 1.5c7.08 0 12.84-5.65 12.84-12.6S23.12 3.2 16.04 3.2Zm0 23.18c-1.93 0-3.82-.52-5.47-1.5l-.39-.23-4.1 1.06 1.09-3.88-.26-.4a10.26 10.26 0 0 1-1.58-5.48c0-5.76 4.8-10.45 10.71-10.45 5.9 0 10.7 4.69 10.7 10.45 0 5.75-4.8 10.43-10.7 10.43Zm5.88-7.82c-.32-.16-1.9-.92-2.2-1.02-.29-.11-.51-.16-.72.16-.22.31-.83 1.02-1.02 1.23-.19.21-.38.24-.7.08-.32-.16-1.37-.49-2.61-1.56-.96-.84-1.61-1.88-1.8-2.2-.19-.31-.02-.48.14-.64.15-.14.32-.37.48-.55.16-.18.21-.31.32-.52.11-.21.05-.39-.03-.55-.08-.16-.72-1.7-.99-2.33-.26-.61-.53-.53-.72-.54h-.62c-.21 0-.55.08-.84.39-.29.31-1.1 1.05-1.1 2.56s1.13 2.97 1.29 3.17c.16.21 2.22 3.32 5.38 4.66.75.32 1.34.51 1.8.65.76.24 1.45.2 1.99.12.61-.09 1.9-.76 2.17-1.5.27-.73.27-1.36.19-1.5-.08-.13-.29-.21-.61-.37Z"/>
            </svg>
        `;
        document.body.appendChild(link);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addWhatsAppButton);
    } else {
        addWhatsAppButton();
    }
})();

// Site-wide scroll reveal animation
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches || !('IntersectionObserver' in window)) return;

    const revealSelector = [
        'section h1',
        'section h2',
        'section h3',
        'section .section-label',
        'section .section-subtitle',
        'section .hero-content > *',
        'section .hero-copy > *',
        'section .hero-image-panel',
        'section .hero-visual',
        'section .about-visual-frame',
        '.hero-slider .hero-slide.active .left-col > *',
        '.hero-slider .hero-slide.active .hero-image-panel',
        '.hero-slider .hero-slide.active .fluid-copy-block > *',
        '.hero-slider .hero-slide.active .fluid-product-block',
        '.hero-slider .hero-slide.active .fluid-console-block',
        'section [class*="grid"] > *',
        'section [class*="cards"] > *',
        'section [class*="list"] > *',
        'section [class*="row"] > *',
        'section [class*="panel"]',
        'section [class*="feature"]',
        'section [class*="product-card"]',
        'section [class*="app-card"]',
        'section [class*="benefit-card"]',
        'section [class*="related-card"]',
        'section [class*="gallery"] > *',
        'section [class*="contact-left"]',
        'section [class*="contact-right"]',
        'section form',
        'main [class*="grid"] > *',
        'main [class*="cards"] > *',
        'main [class*="list"] > *',
        'main [class*="row"] > *',
        'main [class*="panel"]',
        'main [class*="feature"]',
        'main [class*="product-card"]',
        'main [class*="app-card"]',
        'main [class*="benefit-card"]',
        'main [class*="related-card"]',
        'main [class*="gallery"] > *',
        'main [class*="contact-left"]',
        'main [class*="contact-right"]',
        'main form',
        '.pw-category-header > *',
        '.pw-cta-inner > *',
        '.fm-hero-content > *',
        '.fm-hero-stage',
        '.fm-overview-left > *',
        '.fm-overview-img-wrapper',
        '.fm-specs-left > *',
        '.fm-specs-img-wrapper',
        '.fm-banner-inner > *',
        '.sp-hero-content > *',
        '.sp-hero-image-pane',
        '.sp-summary-left > *',
        '.sp-summary-right > *',
        '.sp-case-left > *',
        '.sp-case-right',
        '.sp-cta-inner > *',
        '.footer-cta > *',
        '.footer-col'
    ].join(',');

    const skipSelector = [
        'header',
        'nav',
        '.dropdown-menu',
        '.dd-level1',
        '.dd-level2',
        '.dd-item',
        '.mobile-menu',
        'script',
        'style'
    ].join(',');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    }, {
        root: null,
        threshold: 0.06,
        rootMargin: '0px 0px -4% 0px'
    });

    function isUsableElement(element) {
        if (!element || element.dataset.scrollPrepared === 'true') return false;
        if (element.closest(skipSelector)) return false;
        if (element.children.length === 1 && element.firstElementChild && element.firstElementChild.classList.contains('scroll-reveal')) return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 10 && rect.height > 10;
    }

    function variantForElement(element, index) {
        const textMotion = ['scroll-from-left', 'scroll-from-right', 'scroll-from-up', 'scroll-from-down'];

        if (element.matches('.hero-image-panel, .fluid-product-block, .fluid-console-block')) {
            return index % 2 ? 'scroll-from-right' : 'scroll-zoom';
        }
        if (element.matches('[class*="left"], .fm-overview-left > *, .fm-specs-left > *, .sp-summary-left > *, .sp-case-left > *')) {
            return 'scroll-from-left';
        }
        if (element.matches('[class*="right"], .fm-overview-img-wrapper, .fm-specs-img-wrapper, .sp-summary-right > *, .sp-case-right')) {
            return 'scroll-from-right';
        }
        if (element.matches('[class*="product-card"], [class*="feature"], [class*="benefit-card"], [class*="app-card"], [class*="related-card"], [class*="gallery"] > *, .footer-col')) {
            return index % 3 === 0 ? 'scroll-flip' : 'scroll-zoom';
        }
        if (element.matches('h1, h2, h3, .section-label')) {
            return textMotion[index % textMotion.length];
        }
        return textMotion[index % textMotion.length];
    }

    function prepareReveal(root = document) {
        const scope = root.nodeType === 1 ? root : document;
        const matches = [];

        if (scope.matches && scope.matches(revealSelector)) matches.push(scope);
        scope.querySelectorAll(revealSelector).forEach((element) => matches.push(element));

        matches.forEach((element, index) => {
            if (!isUsableElement(element)) return;
            element.dataset.scrollPrepared = 'true';
            element.classList.add('scroll-reveal', variantForElement(element, index));
            element.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 85}ms`);
            revealObserver.observe(element);
        });
    }

    function updateScrollSync() {
        const syncTargets = document.querySelectorAll('.hero-image-panel, .fluid-product-block, .fluid-console-block, .about-visual-frame, .fm-hero-stage, .sp-hero-image-pane, .pw-product-card, .fm-related-card, .sp-related-card');
        const viewportHeight = window.innerHeight || 1;

        syncTargets.forEach((target) => {
            if (target.closest(skipSelector)) return;
            const rect = target.getBoundingClientRect();
            const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight));
            target.style.setProperty('--scroll-lift', (progress * 16).toFixed(2));
            target.classList.add('scroll-sync-lift');
        });
    }

    let ticking = false;
    function requestSyncUpdate() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateScrollSync();
            ticking = false;
        });
    }

    function initScrollMotion() {
        prepareReveal();
        updateScrollSync();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollMotion);
    } else {
        initScrollMotion();
    }

    window.addEventListener('load', initScrollMotion);
    window.addEventListener('packion:hero-slide-change', initScrollMotion);
    window.addEventListener('scroll', requestSyncUpdate, { passive: true });
    window.addEventListener('resize', requestSyncUpdate);

    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== 1) return;
                prepareReveal(node);
            });
        });
        requestSyncUpdate();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
})();
