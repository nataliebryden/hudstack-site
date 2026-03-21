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
     5. TYPEWRITER: pure JS, one character at a time
     ---------------------------------------------------------- */
  const heading = document.getElementById('hero-heading');
  if (heading) {
    const fullText = heading.getAttribute('data-text');
    if (fullText) {
      heading.innerHTML = '<span class="hero-cursor">|</span>';
      let i = 0;
      const speed = fullText.length < 20 ? 100 : fullText.length < 35 ? 80 : 60;
      function typeChar() {
        if (i < fullText.length) {
          heading.innerHTML = fullText.substring(0, i + 1) + '<span class="hero-cursor">|</span>';
          i++;
          setTimeout(typeChar, speed);
        } else {
          setTimeout(() => {
            const cursor = heading.querySelector('.hero-cursor');
            if (cursor) cursor.remove();
          }, 1500);
        }
      }
      setTimeout(typeChar, 600);
    }
  }

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
