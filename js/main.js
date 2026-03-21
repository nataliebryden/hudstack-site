/* ============================================================
   HudStack — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. NAV: scroll effect
     ---------------------------------------------------------- */
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

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
