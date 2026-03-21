/* ============================================================
   HudStack — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. NAV: scroll effect
     ---------------------------------------------------------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     2. MOBILE MENU
     ---------------------------------------------------------- */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------------------------
     3. SERVICES DROPDOWN
     ---------------------------------------------------------- */
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }
  });

  document.addEventListener('click', () => {
    dropdowns.forEach(d => {
      d.classList.remove('open');
      const t = d.querySelector('.nav-dropdown-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  });

  /* HUD reticle removed — no longer injected */

  /* ----------------------------------------------------------
     5. GLITCH TEXT: apply to inner-page hero h1s
     ---------------------------------------------------------- */
  document.querySelectorAll('.hero-inner-page h1').forEach(h1 => {
    h1.classList.add('glitch-text');
  });

  /* ----------------------------------------------------------
     6. TYPEWRITER: CSS-driven reveal, JS hides cursor after
     ---------------------------------------------------------- */
  setTimeout(() => {
    const cursor = document.querySelector('.typewriter-cursor');
    if (cursor) cursor.style.display = 'none';
  }, 3500);

  /* ----------------------------------------------------------
     7. SCROLL ANIMATIONS: Intersection Observer
     ---------------------------------------------------------- */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.08,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .stagger').forEach(el => {
    observer.observe(el);
  });

  // Assign animate-in to cards so they stagger on scroll
  document.querySelectorAll('.card-glass, .card-solid').forEach((card, i) => {
    card.style.transitionDelay = `${(i % 6) * 80}ms`;
    card.classList.add('fade-in');
    observer.observe(card);
  });

  /* ----------------------------------------------------------
     8. SMOOTH SCROLL: anchor links
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
        ) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     9. CONTACT FORM: Web3Forms submission
     ---------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const successMsg = document.getElementById('form-success');
    const errorMsg   = document.getElementById('form-error');
    const submitBtn  = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (successMsg) successMsg.style.display = 'none';
      if (errorMsg)   errorMsg.style.display   = 'none';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        if (data.success) {
          contactForm.reset();
          if (successMsg) {
            successMsg.style.display = 'block';
          }
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        if (errorMsg) {
          errorMsg.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }
    });
  }

})();
