/* ═══════════════════════════════════════════
   SkillSync main.js
   - Header scroll shadow
   - Mobile nav toggle (hamburger)
   - Intersection Observer reveal animations
   - Email interest form (client-side only)
═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Header: add shadow on scroll ── */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile nav toggle ── */
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav  = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      mobileNav.setAttribute('aria-hidden', String(expanded));
      mobileNav.classList.toggle('open', !expanded);
    });

    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNav.classList.remove('open');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNav.classList.remove('open');
        hamburger.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (mobileNav.classList.contains('open')
          && !mobileNav.contains(e.target)
          && !hamburger.contains(e.target)) {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNav.classList.remove('open');
      }
    });
  }

  /* ── Reveal animations via IntersectionObserver ── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });
      revealElements.forEach(el => io.observe(el));
    } else {
      // Fallback: make all visible immediately
      revealElements.forEach(el => el.classList.add('visible'));
    }
  } else {
    // Respect reduced motion — no need to do anything; CSS already handles it
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  /* ── Interest form ── */
  const form        = document.getElementById('interest-form');
  const emailInput  = document.getElementById('cohort-email');
  const errorEl     = document.getElementById('email-error');
  const successEl   = document.getElementById('cohort-success');

  if (form && emailInput && errorEl && successEl) {

    const showError = msg => {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      successEl.hidden = true;
      emailInput.setAttribute('aria-invalid', 'true');
    };

    const clearError = () => {
      errorEl.textContent = '';
      errorEl.hidden = true;
      emailInput.removeAttribute('aria-invalid');
    };

    const showSuccess = () => {
      successEl.hidden = false;
      errorEl.hidden   = true;
      clearError();
    };

    emailInput.addEventListener('input', clearError);

    form.addEventListener('submit', e => {
      e.preventDefault();
      const val = emailInput.value.trim();

      if (!val) {
        showError('Please enter your email address.');
        emailInput.focus();
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        showError('Please enter a valid email address.');
        emailInput.focus();
        return;
      }

      // All good — show success (no backend; this is a demo form)
      showSuccess();
      form.reset();
    });
  }

  /* ── Active nav link highlighting on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .footer-link');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    let activeId = '';

    const navIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.setAttribute('aria-current', href === '#' + activeId ? 'location' : 'false');
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(s => navIO.observe(s));
  }

})();
