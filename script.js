/* ==========================================================================
   ENGAGEMENT INVITATION — Shubham & Pranjal
   JavaScript: Animations, Countdown, Gallery, & Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ── Initialize all modules ──
  initNavigation();
  initCountdown();
  initRevealAnimations();
  initPetalAnimation();
  initGalleryLightbox();
  initSmoothScroll();
  initParallax();
});

/* ==========================================================================
   1. NAVIGATION
   ========================================================================== */
function initNavigation() {
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  // Scroll effect — add class when scrolled past hero
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // Mobile toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Close menu on link click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active section highlighting
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  // ────────────────────────────────────────────────
  // CUSTOMIZE: Set your engagement ceremony date & time here
  // Format: 'YYYY-MM-DDTHH:MM:SS' (24-hour format)
  // ────────────────────────────────────────────────
  const eventDate = new Date('2026-11-12T11:00:00').getTime();

  const daysEl   = document.getElementById('countdown-days');
  const hoursEl  = document.getElementById('countdown-hours');
  const minsEl   = document.getElementById('countdown-mins');
  const secsEl   = document.getElementById('countdown-secs');

  if (!daysEl) return;

  function updateCountdown() {
    const now = Date.now();
    const diff = eventDate - now;

    if (diff <= 0) {
      // Event has started / passed
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minsEl.textContent = '0';
      secsEl.textContent = '0';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    // Animate value changes
    animateValue(daysEl, days);
    animateValue(hoursEl, hours);
    animateValue(minsEl, mins);
    animateValue(secsEl, secs);
  }

  function animateValue(el, newVal) {
    const strVal = String(newVal).padStart(2, '0');
    if (el.textContent !== strVal) {
      el.style.transform = 'translateY(-4px)';
      el.style.opacity = '0.6';
      setTimeout(() => {
        el.textContent = strVal;
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      }, 150);
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   3. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  if (!revealElements.length) return;

  // Check if reduced motion is preferred
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add stagger index for children
        const parent = entry.target;
        if (parent.classList.contains('stagger-children')) {
          Array.from(parent.children).forEach((child, i) => {
            child.style.setProperty('--stagger-index', i);
          });
        }
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. FLOATING PETAL ANIMATION (Canvas)
   ========================================================================== */
function initPetalAnimation() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let petals = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  // Petal class
  class Petal {
    constructor() {
      this.reset();
      // Start at random Y for initial population
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 1.2 + 0.3;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.sway = Math.random() * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.swayOffset = Math.random() * Math.PI * 2;

      // Rose gold / blush tones
      const colors = [
        'rgba(183, 110, 121,',  // Rose gold
        'rgba(212, 165, 116,',  // Gold
        'rgba(245, 208, 197,',  // Blush
        'rgba(232, 201, 160,',  // Light gold
        'rgba(211, 161, 146,',  // Dusty rose
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.swayOffset) * this.sway * 0.3;
      this.rotation += this.rotationSpeed;
      this.swayOffset += this.swaySpeed;

      if (this.y > canvas.height + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      // Draw petal shape
      ctx.beginPath();
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        this.size / 2, -this.size,
        this.size, -this.size / 2,
        0, this.size
      );
      ctx.bezierCurveTo(
        -this.size, -this.size / 2,
        -this.size / 2, -this.size,
        0, 0
      );
      ctx.fill();

      ctx.restore();
    }
  }

  // Create petals (fewer on mobile)
  const isMobile = window.innerWidth < 768;
  const petalCount = isMobile ? 15 : 30;

  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(petal => {
      petal.update();
      petal.draw();
    });
    animationId = requestAnimationFrame(animate);
  }

  // Only animate when hero is in view
  const heroSection = document.querySelector('.hero');
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate();
      } else {
        cancelAnimationFrame(animationId);
      }
    });
  }, { threshold: 0.1 });

  heroObserver.observe(heroSection);
}

/* ==========================================================================
   5. GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (!lightbox) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   6. RSVP FORM
   ========================================================================== */
function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  const successMsg = document.getElementById('rsvp-success');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // ────────────────────────────────────────────────
    // CUSTOMIZE: Connect this to your backend / Google Forms / Formspree
    // For now, it shows a success message on submit.
    // Example: Replace with fetch() to your form endpoint.
    // ────────────────────────────────────────────────

    // Gather form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log('RSVP Submission:', data);

    // Show success message
    form.style.display = 'none';
    successMsg.classList.add('show');

    // Optional: Reset after some time
    setTimeout(() => {
      form.reset();
      form.style.display = 'flex';
      successMsg.classList.remove('show');
    }, 8000);
  });
}

/* ==========================================================================
   7. SMOOTH SCROLL
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80; // Navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   8. PARALLAX EFFECT ON HERO BG
   ========================================================================== */
function initParallax() {
  const heroBg = document.querySelector('.hero-bg img');
  if (!heroBg) return;

  // Only on desktop — parallax can be janky on mobile
  if (window.innerWidth < 768) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero').offsetHeight;
    if (scrollY < heroHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.35}px) scale(1.1)`;
    }
  }, { passive: true });

  // Initial scale for parallax headroom
  heroBg.style.transform = 'scale(1.1)';
}
