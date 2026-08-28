/* Pricing tier grid interactions shared by the cinematic and adaptive runtimes. */
(() => {
  'use strict';

  function initPricingGrid(grid) {
    if (grid.dataset.gridReady === 'true') return;
    grid.dataset.gridReady = 'true';

    const cards = Array.from(grid.querySelectorAll('[data-pricing-card]'));
    if (!cards.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverInput = window.matchMedia('(hover: hover) and (pointer: fine)');
    const mobileViewport = window.matchMedia('(max-width: 767px)');
    let activeIndex = Math.max(0, cards.findIndex(card => card.classList.contains('is-active')));
    let gridInView = false;
    let mobileScrollFrame = 0;
    const optionFor = card => card.querySelector('[data-pricing-select]');

    function closeTooltips(except) {
      grid.querySelectorAll('.pricing-tier__info-wrap.is-open').forEach(wrap => {
        if (wrap === except) return;
        wrap.classList.remove('is-open');
        wrap.querySelector('[data-pricing-tooltip-button]')?.setAttribute('aria-expanded', 'false');
      });
    }

    function ensureMedia(video) {
      if (video.dataset.mediaReady === 'true') return;
      [[video.dataset.mp4, 'video/mp4'], [video.dataset.webm, 'video/webm']].forEach(([src, type]) => {
        if (!src) return;
        const source = document.createElement('source');
        source.src = src;
        source.type = type;
        video.appendChild(source);
      });
      video.dataset.mediaReady = 'true';
      video.load();
    }

    function ensureSurfaces() {
      cards.forEach(card => {
        const surface = card.querySelector('[data-pricing-surface]');
        if (surface && !surface.getAttribute('src')) surface.src = surface.dataset.src || '';
      });
    }

    function syncMedia() {
      cards.forEach((card, index) => {
        const video = card.querySelector('[data-pricing-video]');
        if (!video) return;
        if (index === activeIndex && gridInView && !reducedMotion.matches) {
          ensureMedia(video);
          const playback = video.play();
          if (playback && typeof playback.catch === 'function') playback.catch(() => {});
        } else {
          video.pause();
        }
      });
    }

    function commitActive(nextIndex, focus = false) {
      const index = Math.min(cards.length - 1, Math.max(0, nextIndex));
      activeIndex = index;
      cards.forEach((card, cardIndex) => {
        const selected = cardIndex === index;
        const option = optionFor(card);
        card.classList.toggle('is-active', selected);
        if (option) {
          option.setAttribute('aria-pressed', String(selected));
          option.tabIndex = selected ? 0 : -1;
        }
      });
      syncMedia();
      if (focus) optionFor(cards[index])?.focus({ preventScroll: true });
    }

    function activateFocusedMobileCard() {
      mobileScrollFrame = 0;
      if (!mobileViewport.matches || !gridInView) return;

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportCenter = viewportHeight / 2;
      let closestIndex = activeIndex;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        if (visibleHeight <= 0) return;

        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== activeIndex) {
        closeTooltips();
        commitActive(closestIndex);
      } else {
        syncMedia();
      }
    }

    function scheduleMobileFocusCheck() {
      if (mobileScrollFrame) return;
      mobileScrollFrame = window.requestAnimationFrame(activateFocusedMobileCard);
    }

    cards.forEach((card, index) => {
      const option = optionFor(card);

      // Desktop activation follows the pointer immediately. Keyboard and touch
      // activation remain available through focus/click and the roving tab stop.
      card.addEventListener('mouseenter', () => {
        if (!hoverInput.matches || activeIndex === index) return;
        closeTooltips();
        commitActive(index);
      }, { passive: true });

      option?.addEventListener('click', () => {
        closeTooltips();
        commitActive(index);
      });
      option?.addEventListener('focus', () => {
        if (activeIndex !== index) commitActive(index);
      });
      option?.addEventListener('keydown', event => {
        const columns = window.matchMedia('(min-width: 900px)').matches ? 2 : 1;
        let next = null;
        if (event.key === 'ArrowLeft') next = Math.max(0, index - 1);
        if (event.key === 'ArrowRight') next = Math.min(cards.length - 1, index + 1);
        if (event.key === 'ArrowUp') next = Math.max(0, index - columns);
        if (event.key === 'ArrowDown') next = Math.min(cards.length - 1, index + columns);
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = cards.length - 1;
        if (next === null || next === index) return;
        event.preventDefault();
        closeTooltips();
        commitActive(next, true);
      });
      card.addEventListener('focusin', event => {
        if (event.target !== option && activeIndex !== index) commitActive(index);
      });
    });

    grid.querySelectorAll('[data-pricing-tooltip-button]').forEach(trigger => {
      trigger.addEventListener('click', event => {
        event.stopPropagation();
        const wrap = trigger.closest('.pricing-tier__info-wrap');
        if (!wrap) return;
        const open = !wrap.classList.contains('is-open');
        closeTooltips(wrap);
        wrap.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', String(open));
      });
    });

    window.addEventListener('scroll', scheduleMobileFocusCheck, { passive: true });
    window.addEventListener('resize', () => {
      closeTooltips();
      scheduleMobileFocusCheck();
    }, { passive: true });
    document.addEventListener('click', event => {
      if (!grid.contains(event.target)) closeTooltips();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeTooltips();
    });
    reducedMotion.addEventListener?.('change', syncMedia);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        gridInView = entries.some(entry => entry.isIntersecting);
        if (gridInView) ensureSurfaces();
        syncMedia();
        scheduleMobileFocusCheck();
      }, { rootMargin: '240px 0px' }).observe(grid);

      const fontObserver = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        grid.classList.add('is-font-ready');
        fontObserver.disconnect();
      }, { rootMargin: '900px 0px' });
      fontObserver.observe(grid);
    } else {
      gridInView = true;
      ensureSurfaces();
      grid.classList.add('is-font-ready');
      scheduleMobileFocusCheck();
    }

    mobileViewport.addEventListener?.('change', scheduleMobileFocusCheck);
    commitActive(activeIndex);
    scheduleMobileFocusCheck();
  }

  const grids = Array.from(document.querySelectorAll('[data-pricing-grid]'));
  if ('IntersectionObserver' in window) {
    const bootstrap = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        initPricingGrid(entry.target);
        bootstrap.unobserve(entry.target);
      });
    }, { rootMargin: '360px 0px' });
    grids.forEach(grid => bootstrap.observe(grid));
  } else {
    grids.forEach(initPricingGrid);
  }
})();
