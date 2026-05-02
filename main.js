document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initialize navbar state
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // 2. Intersection Observer for Scroll Animations
    const fadeElements = document.querySelectorAll('.fade-in-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Mobile Menu Logic
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mobileLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Make sections animatable
    const sections = document.querySelectorAll('.section-header, .feature-card, .image-showcase, .content-block, .testimonial-card');
    sections.forEach((el, index) => {
        el.classList.add('fade-in-up');
        // Add slight delay for grid items
        if (el.classList.contains('feature-card') || el.classList.contains('testimonial-card')) {
            el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        }
        observer.observe(el);
    });

    // 3. Modal Logic
    const modal = document.getElementById('booking-modal');
    const openBtns = document.querySelectorAll('#open-booking, #hero-book-btn, [onclick*="open-booking"]');
    const closeBtn = document.getElementById('close-modal');

    if (modal) {
        const openModal = (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        openBtns.forEach(btn => {
            if (btn) btn.addEventListener('click', openModal);
        });

        // Handle Multi-Step Modal Flow
        const step1 = document.getElementById('step-1-availability');
        const stepLoading = document.getElementById('step-loading');
        const step2 = document.getElementById('step-2-details');
        const stepSuccess = document.getElementById('step-success');
        
        const availabilityForm = document.getElementById('availability-form');
        const bookingForm = document.getElementById('booking-details-form');
        const backBtn = document.getElementById('back-to-step-1');
        const closeSuccessBtn = document.getElementById('close-success');

        const showStep = (stepElement) => {
            document.querySelectorAll('.modal-step').forEach(step => {
                step.style.display = 'none';
                step.classList.remove('active');
            });
            stepElement.style.display = 'block';
            setTimeout(() => stepElement.classList.add('active'), 50);
        };

        if (availabilityForm) {
            availabilityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                showStep(stepLoading);
                
                // Simulate querying availability
                setTimeout(() => {
                    showStep(step2);
                }, 1500);
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                showStep(step1);
            });
        }

        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = bookingForm.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                
                btn.textContent = 'Sending...';
                btn.style.opacity = '0.7';
                
                setTimeout(() => {
                    showStep(stepSuccess);
                    btn.textContent = originalText;
                    btn.style.opacity = '1';
                }, 1000);
            });
        }

        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', () => {
                closeModal();
                setTimeout(() => {
                    showStep(step1);
                    if(availabilityForm) availabilityForm.reset();
                    if(bookingForm) bookingForm.reset();
                }, 400);
            });
        }

        // Reset modal when closed via X or outside click
        const resetModal = () => {
            setTimeout(() => {
                showStep(step1);
                if(availabilityForm) availabilityForm.reset();
                if(bookingForm) bookingForm.reset();
            }, 400);
        };

        if (closeBtn) closeBtn.addEventListener('click', () => { closeModal(); resetModal(); });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
                resetModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
                resetModal();
            }
        });

        // 4. Overview Feature Cards Interactivity
        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length > 0) {
            featureCards.forEach(card => {
                card.addEventListener('click', () => {
                    featureCards.forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                });
            });
        }

        // 5. Scroll-Spy & Default View Logic
        const mainSections = document.querySelectorAll('section[id]');
        const navLinksList = document.querySelectorAll('.nav-link');

        const scrollSpy = () => {
            const scrollPosition = window.scrollY + 150; // Offset for navbar

            mainSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinksList.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });

            // Special case for Hero / Very top
            if (window.scrollY < 200) {
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#overview') {
                        link.classList.add('active');
                    }
                });
            }
        };

        window.addEventListener('scroll', scrollSpy);
        
        // Force landing on Overview section
        window.addEventListener('load', () => {
            const overviewSection = document.getElementById('overview');
            if (overviewSection) {
                const yOffset = -80; 
                const y = overviewSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'auto'}); // Immediate jump
            }
            scrollSpy();
        });
    }
});
