/* ========================================
   Rashlyn Graphics & ICT Solutions - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    const handleNavScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // --- Mobile Hamburger Menu ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    // Create backdrop element
    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-menu-backdrop';
    document.body.appendChild(backdrop);

    const openMenu = () => {
        hamburger.classList.add('active');
        navLinks.classList.add('open');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    backdrop.addEventListener('click', closeMenu);

    navLinks.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            closeMenu();
        }
    });

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinkElements.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // --- Fade-in on Scroll (Intersection Observer) ---
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2500;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            requestAnimationFrame(updateCounter);
        });
    };

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // --- Portfolio Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach((item, i) => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, i * 80);
                } else {
                    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 500);
                }
            });
        });
    });

    // --- Contact Form → WhatsApp Redirect ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !phone || !message) {
                return;
            }

            const whatsappMessage = encodeURIComponent(
                `Hello Rashlyn Graphics! 👋\n\n` +
                `*Name:* ${name}\n` +
                `*Email:* ${email}\n` +
                `*Phone:* ${phone}\n\n` +
                `*Message:*\n${message}`
            );

            const phoneNumber = '233547642937';
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
            window.open(whatsappURL, '_blank');
        });
    }

    // --- Scroll-to-Top Button ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
