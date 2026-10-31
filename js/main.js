/**
 * ==========================================================================
 * MAIN.JS - Framer Studio Interaction System
 * Vanilla ES6 JavaScript (No frameworks, no GSAP, no external libraries)
 * ==========================================================================
 */

// Global Checkout Configuration
const CHECKOUT_URL = "#";

(() => {
  'use strict';

  // Mark HTML with 'js' class to enable progressive enhancement animations
  document.documentElement.classList.add('js');

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPointerDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------------
     1. Scroll Progress Bar (2px Accent Line)
     ------------------------------------------------------------------------ */
  const progressBar = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  /* ------------------------------------------------------------------------
     2. Sticky Fixed Header (Permanently stuck at top, does not scroll away)
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');

  function handleHeaderScroll() {
    if (!header) return;
    const currentScrollY = window.pageYOffset;

    if (currentScrollY > 15) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ------------------------------------------------------------------------
     3. Full-Screen Mobile Sheet Navigation
     ------------------------------------------------------------------------ */
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileSheet = document.getElementById('mobile-sheet');
  const mobileSheetLinks = document.querySelectorAll('.mobile-sheet__link');

  function openMobileSheet() {
    if (!hamburgerBtn || !mobileSheet) return;
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileSheet.classList.add('is-open');
    document.body.classList.add('menu-locked');
  }

  function closeMobileSheet() {
    if (!hamburgerBtn || !mobileSheet) return;
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileSheet.classList.remove('is-open');
    document.body.classList.remove('menu-locked');
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileSheet();
      } else {
        openMobileSheet();
      }
    });
  }

  mobileSheetLinks.forEach((link) => {
    link.addEventListener('click', closeMobileSheet);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileSheet && mobileSheet.classList.contains('is-open')) {
      closeMobileSheet();
      if (hamburgerBtn) hamburgerBtn.focus();
    }
  });

  /* ------------------------------------------------------------------------
     4. Smooth Anchor Scrolling with Header Offset
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      closeMobileSheet();

      const headerOffset = 80;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      history.pushState(null, null, targetId);
    });
  });

  /* ------------------------------------------------------------------------
     5. Heading Word/Line Reveal (Preserving Accessibility & Inline Formatting)
     ------------------------------------------------------------------------ */
  if (!isReducedMotion) {
    const headingsToReveal = document.querySelectorAll('.reveal-words');
    headingsToReveal.forEach((heading) => {
      const fullText = heading.textContent.trim();
      heading.setAttribute('aria-label', fullText);

      let wordIndex = 0;
      function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!text.trim()) return document.createTextNode(text);
          const frag = document.createDocumentFragment();
          const tokens = text.split(/(\s+)/);
          tokens.forEach((token) => {
            if (/^\s+$/.test(token)) {
              frag.appendChild(document.createTextNode(token));
            } else if (token) {
              const mask = document.createElement('span');
              mask.className = 'word-mask';
              const inner = document.createElement('span');
              inner.className = 'word-inner';
              inner.style.transitionDelay = `${wordIndex * 40}ms`;
              inner.textContent = token;
              mask.appendChild(inner);
              frag.appendChild(mask);
              wordIndex++;
            }
          });
          return frag;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const clone = node.cloneNode(false);
          Array.from(node.childNodes).forEach((child) => {
            clone.appendChild(processNode(child));
          });
          return clone;
        }
        return node.cloneNode(true);
      }

      const frag = document.createDocumentFragment();
      Array.from(heading.childNodes).forEach((child) => {
        frag.appendChild(processNode(child));
      });
      heading.innerHTML = '';
      heading.appendChild(frag);
    });
  }

  /* ------------------------------------------------------------------------
     6. Viewport Intersection Observers (Reveals & Video Playback)
     ------------------------------------------------------------------------ */
  if ('IntersectionObserver' in window) {
    // Reveal Elements on Scroll
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll, .reveal-words').forEach((el) => {
      revealObserver.observe(el);
    });

    // Viewport-Only Video Playback
    if (!isReducedMotion) {
      const videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting) {
              if (video.paused && !video.closest('.card:not(:hover)')) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                  playPromise.catch(() => {});
                }
              }
            } else {
              if (!video.paused) {
                video.pause();
              }
            }
          });
        },
        { threshold: 0.2 }
      );

      document.querySelectorAll('video[autoplay], .hero__video-frame video, .final-cta__bg-video').forEach((vid) => {
        videoObserver.observe(vid);
      });
    }

    // How It Works Sticky Storytelling Step Tracker & Navigation
    const stepCards = document.querySelectorAll('.how-it-works__step-card');
    const stepNavItems = document.querySelectorAll('.js-step-nav');

    if (stepCards.length > 0) {
      if ('IntersectionObserver' in window) {
        const stepObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const stepNum = entry.target.getAttribute('data-step') || '1';
                stepCards.forEach((c) => c.classList.remove('is-active'));
                entry.target.classList.add('is-active');

                stepNavItems.forEach((btn) => {
                  const match = btn.getAttribute('data-step') === stepNum;
                  btn.classList.toggle('is-active', match);
                  btn.setAttribute('aria-current', match ? 'step' : 'false');
                });
              }
            });
          },
          { rootMargin: '-20% 0px -40% 0px', threshold: 0.15 }
        );

        stepCards.forEach((step) => stepObserver.observe(step));
      }

      // Smooth click-to-step scroll
      stepNavItems.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetStep = btn.getAttribute('data-step');
          const card = document.querySelector(`.how-it-works__step-card[data-step="${targetStep}"]`);
          if (card) {
            const headerOffset = 90;
            const elementPosition = card.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: isReducedMotion ? 'auto' : 'smooth'
            });
          }
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
     7. Scroll & Mouse Interactive Studio Console Stage
     ------------------------------------------------------------------------ */
  const consoleStage = document.querySelector('.hero__console-window');
  if (consoleStage && isPointerDevice && !isReducedMotion) {
    const stageWrapper = document.querySelector('.hero__stage-wrapper');
    if (stageWrapper) {
      stageWrapper.addEventListener('mousemove', (e) => {
        const rect = stageWrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        consoleStage.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-2px)`;
      });

      stageWrapper.addEventListener('mouseleave', () => {
        consoleStage.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
      });
    }
  }

  /* ------------------------------------------------------------------------
     7b. Hero Studio Live Audio Spectrum & Waveform Visualizer
     ------------------------------------------------------------------------ */
  const studioCanvas = document.getElementById('hero-studio-visualizer');
  if (studioCanvas && !isReducedMotion) {
    const ctx = studioCanvas.getContext('2d');
    let isVisible = true;
    let time = 0;

    function resizeCanvas() {
      const rect = studioCanvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        studioCanvas.width = rect.width * (window.devicePixelRatio || 1);
        studioCanvas.height = rect.height * (window.devicePixelRatio || 1);
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      }
    }
    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) drawStudioVisualizer();
        },
        { threshold: 0.1 }
      );
      obs.observe(studioCanvas);
    }

    function drawStudioVisualizer() {
      if (!isVisible) return;
      const w = studioCanvas.getBoundingClientRect().width;
      const h = studioCanvas.getBoundingClientRect().height;
      if (!w || !h) {
        requestAnimationFrame(drawStudioVisualizer);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      time += 0.032;

      const centerY = h * 0.48;

      // 1. Equalizer Spectrum Bars (Symmetrically centered audio envelope)
      const barCount = Math.min(56, Math.floor(w / 10));
      const barWidth = 3.5;
      const totalBarWidth = barCount * barWidth;
      const barGap = (w - totalBarWidth) / (barCount + 1);

      for (let i = 0; i < barCount; i++) {
        const x = barGap + i * (barWidth + barGap);
        const distFromCenter = Math.abs(i - barCount / 2) / (barCount / 2);
        const envelope = Math.cos(distFromCenter * (Math.PI / 2.2)); // Natural vocal envelope

        const freqWave = Math.sin(time * 1.8 + i * 0.25) * 0.5 + 0.5;
        const voiceMod = Math.sin(time * 0.9 + i * 0.1) * Math.cos(time * 1.3 + i * 0.04);
        const amplitude = Math.max(0.12, (freqWave * 0.65 + voiceMod * 0.35) * envelope);
        const barHeight = Math.max(6, amplitude * (h * 0.68));
        const y = centerY - barHeight / 2;

        const grad = ctx.createLinearGradient(x, y, x, y + barHeight);
        grad.addColorStop(0, 'rgba(139, 124, 246, 0.9)');
        grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.95)');
        grad.addColorStop(1, 'rgba(139, 124, 246, 0.3)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, 2);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }

      // 2. Continuous Vocal Envelope Waveform Line
      ctx.beginPath();
      ctx.lineWidth = 1.75;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';

      ctx.moveTo(0, centerY);
      for (let x = 0; x <= w; x += 5) {
        const y = centerY + Math.sin(x * 0.018 + time * 2) * 12 * Math.cos(x * 0.008 + time * 0.7);
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary Harmonics
      ctx.beginPath();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(139, 124, 246, 0.35)';
      ctx.moveTo(0, centerY);
      for (let x = 0; x <= w; x += 5) {
        const y = centerY + Math.cos(x * 0.024 + time * 1.5) * 9 * Math.sin(x * 0.01 + time);
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      requestAnimationFrame(drawStudioVisualizer);
    }

    drawStudioVisualizer();
  }

  /* ------------------------------------------------------------------------
     8. Magnetic Primary Buttons (Desktop Pointer Only)
     ------------------------------------------------------------------------ */
  if (isPointerDevice && !isReducedMotion) {
    const magneticBtns = document.querySelectorAll('.btn--primary');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  /* ------------------------------------------------------------------------
     9. Studio Custom Cursor (Desktop Pointer Only)
     ------------------------------------------------------------------------ */
  if (isPointerDevice && !isReducedMotion) {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    const cursorRing = document.createElement('div');
    cursorRing.className = 'custom-cursor-ring';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      document.body.classList.add('cursor-active');
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const interactiveTargets = document.querySelectorAll('a, button, .card, .bento-media, .media-frame');
    interactiveTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ------------------------------------------------------------------------
     10. Video Card Hover-Play & Touch Fallback
     ------------------------------------------------------------------------ */
  const videoCards = document.querySelectorAll('.problem__card, .features__tile--large');
  videoCards.forEach((card) => {
    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      const playPromise = video.play();
      if (playPromise !== undefined) playPromise.catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
    });

    card.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });

  /* ------------------------------------------------------------------------
     11. Checkout & Pricing Routing
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.js-buy-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (CHECKOUT_URL && CHECKOUT_URL !== '#') {
        window.location.href = CHECKOUT_URL;
      } else {
        const pricingSection = document.querySelector('#pricing');
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  document.querySelectorAll('.js-scroll-pricing').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pricingSection = document.querySelector('#pricing');
      if (pricingSection) {
        const headerOffset = 80;
        const targetPos = pricingSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

})();
