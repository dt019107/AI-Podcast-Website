/**
 * ==========================================================================
 * HERO.JS - Bold Editorial Neo-Brutalist Podcast Hero & Interactions
 * Vanilla JavaScript (ES6), IIFE Encapsulated, Classic <script defer>
 * Zero libraries, zero frameworks, zero globals
 * ==========================================================================
 */
(() => {
  'use strict';

  // Mark document with 'js' class for progressive enhancement
  document.documentElement.classList.add('js');

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPointerDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Trigger choreographed entrance if motion is allowed
  if (!isReducedMotion) {
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      requestAnimationFrame(() => {
        heroEl.classList.add('hero--animate');
      });
    }
  }

  // DOM Elements
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  const header = document.getElementById('header');
  const problemSection = document.getElementById('problem');
  const portraitImg = document.getElementById('hero-portrait-img');
  const earDuotone = document.getElementById('hero-ear-duotone');
  const soundRings = document.querySelector('.hero__sound-rings');
  const coinSticker = document.getElementById('hero-coin-sticker');
  const mainCta = document.getElementById('hero-main-cta');
  const ribbonTop = document.getElementById('hero-ribbon-top');
  const ribbonBottom = document.getElementById('hero-ribbon-bottom');

  /* ------------------------------------------------------------------------
     1. Fallback Handling for Missing/Error Images
     ------------------------------------------------------------------------ */
  if (portraitImg) {
    portraitImg.addEventListener('error', () => {
      portraitImg.style.display = 'none';
      if (earDuotone) earDuotone.style.display = 'none';
      const fallback = document.querySelector('.hero__portrait-fallback');
      if (fallback) fallback.style.display = 'block';
    });
  }

  const coinImg = document.querySelector('.hero__coin-img');
  if (coinImg) {
    coinImg.addEventListener('error', () => {
      coinImg.style.display = 'none';
      const fallback = document.querySelector('.hero__coin-fallback');
      if (fallback) fallback.style.display = 'flex';
    });
  }

  /* ------------------------------------------------------------------------
     2. Header: Adaptive Light/Dark Theme & Scroll Hide/Show
     ------------------------------------------------------------------------ */
  if (header) {
    // A) Adaptive Dark Mode when scrolling onto dark sections
    if ('IntersectionObserver' in window && problemSection) {
      const darkObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // If problem section is in view or user scrolled past hero
          if (entry.isIntersecting || entry.boundingClientRect.top < 100) {
            header.classList.add('is-dark');
          } else {
            header.classList.remove('is-dark');
          }
        });
      }, { rootMargin: '-60px 0px 0px 0px', threshold: [0, 0.1] });

      darkObserver.observe(problemSection);
    }

    // B) Smart Hide-on-Scroll-Down / Show-on-Scroll-Up
    let lastScrollY = window.pageYOffset || 0;
    let scrollTicking = false;

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const currentY = Math.max(0, window.pageYOffset || 0);

          if (currentY > 90 && currentY > lastScrollY + 6) {
            header.classList.add('is-hidden');
          } else if (currentY < lastScrollY - 6 || currentY <= 90) {
            header.classList.remove('is-hidden');
          }

          // Fallback check for dark mode based on scroll position
          if (heroSection) {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight - 80;
            if (currentY >= heroBottom) {
              header.classList.add('is-dark');
            } else {
              header.classList.remove('is-dark');
            }
          }

          lastScrollY = currentY;
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     3. Smooth Scroll Parallax & Ribbon Scrolling Animation
     ------------------------------------------------------------------------ */
  if (!isReducedMotion) {
    let targetScrollY = window.pageYOffset || 0;
    let currentScrollY = targetScrollY;
    let isTicking = false;

    const topWrap = document.querySelector('.hero__ribbon-wrap--top');
    const bottomWrap = document.querySelector('.hero__ribbon-wrap--bottom');

    function onScroll() {
      targetScrollY = Math.max(0, window.pageYOffset || 0);
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(updateScrollPhysics);
      }
    }

    function updateScrollPhysics() {
      // Smooth lerp for buttery Framer-level motion
      currentScrollY += (targetScrollY - currentScrollY) * 0.1;

      if (currentScrollY < 1400) {
        // 1. Tactile ribbon scroll translation:
        // Top ribbon moves left as you scroll down
        // Bottom ribbon moves right as you scroll down
        if (ribbonTop) {
          ribbonTop.style.transform = `translateX(${currentScrollY * -0.32}px)`;
        }
        if (ribbonBottom) {
          ribbonBottom.style.transform = `translateX(${currentScrollY * 0.32}px)`;
        }

        // 2. Subtle tilt response (+/- 1.8deg max)
        const tiltDelta = Math.min(1.8, (currentScrollY / 500) * 1.8);
        if (topWrap) {
          topWrap.style.transform = `rotate(${-4 + tiltDelta * 0.4}deg)`;
        }
        if (bottomWrap) {
          bottomWrap.style.transform = `rotate(${3 - tiltDelta * 0.4}deg)`;
        }

        // 3. Subtle portrait parallax for touch / non-pointer devices
        if (portraitImg && !isPointerDevice) {
          portraitImg.style.transform = `translateY(${currentScrollY * 0.06}px)`;
        }
      }

      // Continue animating until settled
      if (Math.abs(targetScrollY - currentScrollY) > 0.1) {
        requestAnimationFrame(updateScrollPhysics);
      } else {
        currentScrollY = targetScrollY;
        isTicking = false;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollPhysics();
  }

  /* ------------------------------------------------------------------------
     4. Desktop Pointer Parallax (Desktop Mouse Only)
     ------------------------------------------------------------------------ */
  if (isPointerDevice && !isReducedMotion) {
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    function updatePointerParallax() {
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      // Portrait and rings shift up to 12px opposite cursor
      if (portraitImg) {
        const scrollOffset = (window.pageYOffset || 0) * 0.08;
        portraitImg.style.transform = `translate(${-mouseX * 12}px, ${-mouseY * 10 + scrollOffset}px)`;
      }

      if (soundRings) {
        soundRings.style.transform = `translate(calc(-50% + ${-mouseX * 14}px), calc(-50% + ${-mouseY * 12}px))`;
      }

      if (earDuotone) {
        earDuotone.style.transform = `translate(calc(-50% + ${-mouseX * 12}px), calc(-50% + ${-mouseY * 10}px))`;
      }

      // Coin tilts toward cursor
      if (coinSticker) {
        const coinInner = coinSticker.querySelector('.hero__coin-wrap');
        if (coinInner) {
          coinInner.style.transform = `translate(${mouseX * 8}px, ${mouseY * 8}px) rotate(${mouseX * 6}deg)`;
        }
      }

      requestAnimationFrame(updatePointerParallax);
    }

    requestAnimationFrame(updatePointerParallax);
  }

  /* ------------------------------------------------------------------------
     5. Smooth Scroll For Anchor Links (#pricing, #demo)
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#' && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: isReducedMotion ? 'auto' : 'smooth' });
          history.pushState(null, null, targetId);
        }
      }
    });
  });

})();
