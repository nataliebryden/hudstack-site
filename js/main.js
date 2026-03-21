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

  /* ----------------------------------------------------------
     4. HUD RETICLE: inject into every hero section
     ---------------------------------------------------------- */
  const hudSVG = `<div class="hud-element" aria-hidden="true">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="4 8"/>
      <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" stroke-width="0.75"/>
      <line x1="100" y1="20" x2="100" y2="40" stroke="currentColor" stroke-width="1.5"/>
      <line x1="100" y1="160" x2="100" y2="180" stroke="currentColor" stroke-width="1.5"/>
      <line x1="20" y1="100" x2="40" y2="100" stroke="currentColor" stroke-width="1.5"/>
      <line x1="160" y1="100" x2="180" y2="100" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="4" fill="currentColor"/>
      <circle cx="100" cy="100" r="12" fill="none" stroke="currentColor" stroke-width="0.75"/>
      <line x1="60" y1="60" x2="70" y2="70" stroke="currentColor" stroke-width="0.5"/>
      <line x1="140" y1="60" x2="130" y2="70" stroke="currentColor" stroke-width="0.5"/>
      <line x1="60" y1="140" x2="70" y2="130" stroke="currentColor" stroke-width="0.5"/>
      <line x1="140" y1="140" x2="130" y2="130" stroke="currentColor" stroke-width="0.5"/>
    </svg>
  </div>`;

  document.querySelectorAll('.hero, .hero-inner-page').forEach(hero => {
    hero.insertAdjacentHTML('beforeend', hudSVG);
  });

  /* ----------------------------------------------------------
     5. GLITCH TEXT: apply to inner-page hero h1s
     ---------------------------------------------------------- */
  document.querySelectorAll('.hero-inner-page h1').forEach(h1 => {
    h1.classList.add('glitch-text');
  });

  /* ----------------------------------------------------------
     6. TYPEWRITER: homepage hero h1
     ---------------------------------------------------------- */
  const typewriterEl = document.querySelector('.hero .typewriter');
  if (typewriterEl) {
    const fullText = typewriterEl.textContent.trim();
    typewriterEl.textContent = '';
    typewriterEl.classList.add('typing');

    let i = 0;
    const speed = 55;

    function type() {
      if (i < fullText.length) {
        typewriterEl.textContent += fullText.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        typewriterEl.classList.remove('typing');
      }
    }

    // Small delay so the page settles before typing starts
    setTimeout(type, 600);
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
