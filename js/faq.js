/**
 * ==========================================================================
 * FAQ.JS - Framer Studio Accessible Accordion
 * ARIA compliant, keyboard navigation, smooth grid height expansion (250ms)
 * ==========================================================================
 */

(() => {
  'use strict';

  function initFAQ() {
    const accordion = document.querySelector('.js-accordion');
    if (!accordion) return;

    const items = accordion.querySelectorAll('.accordion__item');
    const allowMultipleOpen = false;

    items.forEach((item, index) => {
      const trigger = item.querySelector('.accordion__trigger');
      const content = item.querySelector('.accordion__content, .accordion__panel');

      if (!trigger || !content) return;

      // Unique accessibility attributes
      const idNumber = index + 1;
      const triggerId = `faq-trigger-${idNumber}`;
      const contentId = `faq-content-${idNumber}`;

      trigger.setAttribute('id', triggerId);
      trigger.setAttribute('aria-controls', contentId);
      content.setAttribute('id', contentId);
      content.setAttribute('role', 'region');
      content.setAttribute('aria-labelledby', triggerId);

      // Open first item by default
      if (index === 0) {
        openItem(item, trigger, content);
      } else {
        closeItem(item, trigger, content);
      }

      // Click event
      trigger.addEventListener('click', () => {
        const isCurrentlyOpen = trigger.getAttribute('aria-expanded') === 'true';

        if (!allowMultipleOpen) {
          items.forEach((otherItem) => {
            if (otherItem !== item) {
              const otherTrigger = otherItem.querySelector('.accordion__trigger');
              const otherContent = otherItem.querySelector('.accordion__content, .accordion__panel');
              if (otherTrigger && otherContent) {
                closeItem(otherItem, otherTrigger, otherContent);
              }
            }
          });
        }

        if (isCurrentlyOpen) {
          closeItem(item, trigger, content);
        } else {
          openItem(item, trigger, content);
        }
      });

      // Keyboard navigation support: Arrow Up / Down, Home, End
      trigger.addEventListener('keydown', (e) => {
        const triggers = Array.from(accordion.querySelectorAll('.accordion__trigger'));
        const currentIndex = triggers.indexOf(trigger);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % triggers.length;
          triggers[nextIndex].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + triggers.length) % triggers.length;
          triggers[prevIndex].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          triggers[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          triggers[triggers.length - 1].focus();
        }
      });
    });

    function openItem(item, trigger, content) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      content.classList.add('is-open');
    }

    function closeItem(item, trigger, content) {
      item.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      content.classList.remove('is-open');
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
})();
