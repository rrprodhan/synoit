/* Lightweight pricing-page interactions. Heavy cinematic effects stay off this route. */
(() => {
  'use strict';
  window.__synoitRuntime = 'adaptive';

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  function initPricingCarousel(carousel) {
    if (carousel.dataset.carouselReady === 'true') return;
    carousel.dataset.carouselReady = 'true';
    const viewport = carousel.querySelector('[data-pricing-viewport]');
    const cards = Array.from(carousel.querySelectorAll('[data-pricing-card]'));
    if (!viewport || !cards.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeIndex = Math.max(0, cards.findIndex(card => card.classList.contains('is-active')));
    let carouselInView = false;
    let pendingIndex = null;
    let pendingFocus = false;
    let settleTimer = 0;

    const optionFor = card => card.querySelector('[data-pricing-select]');

    function closeTooltips(except) {
      carousel.querySelectorAll('.pricing-tier__info-wrap.is-open').forEach(wrap => {
        if (wrap === except) return;
        wrap.classList.remove('is-open');
        wrap.querySelector('[data-pricing-tooltip-button]')?.setAttribute('aria-expanded', 'false');
      });
    }

    function ensureMedia(video) {
      if (video.dataset.mediaReady === 'true') return;
      [[video.dataset.webm, 'video/webm'], [video.dataset.mp4, 'video/mp4']].forEach(([src, type]) => {
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
        if (surface && !surface.getAttribute('src')) surface.src = surface.dataset.src;
      });
    }

    function pauseMedia() {
      cards.forEach(card => card.querySelector('[data-pricing-video]')?.pause());
    }

    function syncMedia() {
      cards.forEach((card, index) => {
        const video = card.querySelector('[data-pricing-video]');
        if (!video) return;
        if (index === activeIndex && carouselInView && !reducedMotion.matches) {
          ensureMedia(video);
          video.play()?.catch(() => {});
        } else {
          video.pause();
        }
      });
    }

    function nearestCardIndex() {
      if (viewport.scrollLeft <= 64) return 0;
      const viewportRect = viewport.getBoundingClientRect();
      const center = viewportRect.left + viewportRect.width / 2;
      let nearest = 0;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const nextDistance = Math.abs(rect.left + rect.width / 2 - center);
        if (nextDistance < distance) {
          nearest = index;
          distance = nextDistance;
        }
      });
      return nearest;
    }

    function commitActive(nextIndex, focus = false) {
      const index = Math.min(cards.length - 1, Math.max(0, nextIndex));
      activeIndex = index;
      pendingIndex = null;
      carousel.classList.remove('is-centering');
      cards.forEach((card, cardIndex) => {
        const selected = cardIndex === index;
        const option = optionFor(card);
        card.classList.toggle('is-active', selected);
        if (option) {
          option.setAttribute('aria-selected', String(selected));
          option.tabIndex = selected ? 0 : -1;
        }
      });
      syncMedia();
      if (focus) optionFor(cards[index])?.focus({ preventScroll: true });
      pendingFocus = false;
    }

    function finishCentering() {
      window.clearTimeout(settleTimer);
      commitActive(pendingIndex === null ? nearestCardIndex() : pendingIndex, pendingFocus);
    }

    function scheduleSettle(delay = 150) {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(finishCentering, delay);
    }

    function centerCard(card, options = {}) {
      const index = cards.indexOf(card);
      if (index < 0) return;
      const viewportRect = viewport.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const rawTarget = viewport.scrollLeft + cardRect.left - viewportRect.left
        - (viewportRect.width - cardRect.width) / 2;
      const target = Math.min(
        Math.max(0, viewport.scrollWidth - viewport.clientWidth),
        Math.max(0, rawTarget),
      );
      pendingIndex = index;
      pendingFocus = Boolean(options.focus);
      carousel.classList.add('is-centering');
      pauseMedia();
      if (Math.abs(target - viewport.scrollLeft) < 1 || reducedMotion.matches) {
        viewport.scrollLeft = target;
        finishCentering();
        return;
      }
      viewport.scrollTo({ left: target, behavior: 'smooth' });
      scheduleSettle(220);
    }

    cards.forEach((card, index) => {
      const option = optionFor(card);
      option?.addEventListener('click', () => {
        closeTooltips();
        centerCard(card);
      });
      option?.addEventListener('focus', () => {
        if (activeIndex !== index) centerCard(card);
      });
      option?.addEventListener('keydown', event => {
        let next = null;
        if (event.key === 'ArrowLeft') next = Math.max(0, index - 1);
        if (event.key === 'ArrowRight') next = Math.min(cards.length - 1, index + 1);
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = cards.length - 1;
        if (next === null) return;
        event.preventDefault();
        centerCard(cards[next], { focus: true });
      });
      card.addEventListener('focusin', event => {
        if (event.target !== option && activeIndex !== index) centerCard(card);
      });
    });

    carousel.querySelectorAll('[data-pricing-tooltip-button]').forEach(trigger => {
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

    viewport.addEventListener('scroll', () => {
      closeTooltips();
      carousel.classList.add('is-centering');
      pauseMedia();
      scheduleSettle();
    }, { passive: true });
    const releaseTarget = () => {
      pendingIndex = null;
      pendingFocus = false;
    };
    viewport.addEventListener('pointerdown', releaseTarget, { passive: true });
    viewport.addEventListener('wheel', releaseTarget, { passive: true });
    window.addEventListener('resize', () => {
      closeTooltips();
      pendingIndex = null;
      scheduleSettle(80);
    }, { passive: true });
    document.addEventListener('click', event => {
      if (!carousel.contains(event.target)) closeTooltips();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeTooltips();
    });

    const motionChange = () => {
      syncMedia();
      if (reducedMotion.matches) finishCentering();
    };
    reducedMotion.addEventListener?.('change', motionChange);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        carouselInView = entries.some(entry => entry.isIntersecting);
        if (carouselInView) ensureSurfaces();
        syncMedia();
      }, { rootMargin: '280px 0px' }).observe(viewport);

      const fontObserver = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        carousel.classList.add('is-font-ready');
        fontObserver.disconnect();
      }, { rootMargin: '900px 0px' });
      fontObserver.observe(viewport);
    } else {
      carouselInView = true;
      ensureSurfaces();
      carousel.classList.add('is-font-ready');
    }

    commitActive(activeIndex);
  }

  const pricingCarousels = Array.from(document.querySelectorAll('[data-pricing-carousel]'));
  if ('IntersectionObserver' in window) {
    const carouselBootstrap = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        initPricingCarousel(entry.target);
        carouselBootstrap.unobserve(entry.target);
      });
    }, { rootMargin: '360px 0px', threshold: 0 });
    pricingCarousels.forEach(carousel => carouselBootstrap.observe(carousel));
  } else {
    pricingCarousels.forEach(initPricingCarousel);
  }

  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  let shellFrame = 0;
  function updateShell() {
    shellFrame = 0;
    const top = window.scrollY || document.documentElement.scrollTop;
    nav?.classList.toggle('is-solid', top > 80);
    if (progress) {
      if (top <= 0) progress.style.transform = 'scaleX(0)';
      else {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        progress.style.transform = `scaleX(${Math.min(1, top / max)})`;
      }
    }
  }
  window.addEventListener('scroll', () => {
    if (!shellFrame) shellFrame = requestAnimationFrame(updateShell);
  }, { passive: true });
  updateShell();

  const navMenuButton = document.getElementById('navMenuBtn');
  const navMenu = document.getElementById('navDrop');
  if (navMenuButton && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('is-open');
      navMenuButton.setAttribute('aria-expanded', 'false');
    };
    navMenuButton.addEventListener('click', event => {
      event.stopPropagation();
      const open = navMenu.classList.toggle('is-open');
      navMenuButton.setAttribute('aria-expanded', String(open));
    });
    navMenu.addEventListener('click', event => event.stopPropagation());
    document.addEventListener('click', closeMenu);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const items = Array.from(document.querySelectorAll('.step-item'));
  const screens = Array.from(document.querySelectorAll('.step-video'));
  const dots = Array.from(document.querySelectorAll('.steps-dots button'));
  const counter = document.getElementById('stepsCounterNum');
  let step = 0;
  let stepTimer = 0;
  function showStep(index) {
    step = index;
    if (counter) counter.textContent = String(index + 1).padStart(2, '0');
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
    screens.forEach((screen, i) => screen.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-selected', String(i === index));
    });
  }
  function startSteps() {
    clearInterval(stepTimer);
    stepTimer = setInterval(() => showStep((step + 1) % Math.max(1, items.length)), 6000);
  }
  items.forEach((item, index) => item.addEventListener('click', () => { showStep(index); startSteps(); }));
  dots.forEach((dot, index) => dot.addEventListener('click', () => { showStep(index); startSteps(); }));
  const steps = document.getElementById('steps');
  if (steps && items.length && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) startSteps();
      else clearInterval(stepTimer);
    }, { threshold: .2 }).observe(steps);
  }

  /* Lightweight equivalents of the homepage's visible motion language. */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const animateIn = (element, delay = 0, distance = 34, fade = true) => {
      if (!element || typeof element.animate !== 'function') return;
      const from = { transform: `translate3d(0, ${distance}px, 0)` };
      const to = { transform: 'translate3d(0, 0, 0)' };
      if (fade) {
        from.opacity = 0;
        to.opacity = 1;
      }
      element.animate([from, to], {
        duration: 720,
        delay,
        easing: 'cubic-bezier(.22, 1, .36, 1)',
        fill: 'both',
      });
    };

    document.querySelectorAll('.hero-title .line').forEach((line, index) => {
      animateIn(line, 70 + index * 90, 46, false);
    });
    document.querySelectorAll('.hero-sub span, .hero-badges .badges-wrap').forEach((element, index) => {
      animateIn(element, 230 + index * 100, 28);
    });

    const revealSelector = [
      '.section-kicker', '.features-title', '.pricing h2', '.steps-head',
      '.exploded-head', '.reviews-title', '.review-card', '.qr-box',
      '.f-card', '.sig-row', '.i-row', '.blog-editorial-cta',
    ].join(',');
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll(revealSelector).forEach((element, index) => {
            animateIn(element, Math.min(index, 5) * 55, 30);
          });
          revealObserver.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
      document.querySelectorAll('main > section:not(.hero)').forEach(section => revealObserver.observe(section));
    }

    const drawPath = path => {
      if (path.dataset.drawReady === 'true') return;
      path.dataset.drawReady = 'true';
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);
      path.animate([
        { strokeDashoffset: length },
        { strokeDashoffset: 0 },
      ], {
        duration: 1050,
        easing: 'cubic-bezier(.22, 1, .36, 1)',
        fill: 'forwards',
      });
    };
    document.querySelectorAll('path[data-hero-draw]').forEach((path, index) => {
      window.setTimeout(() => drawPath(path), 180 + index * 55);
    });
    if ('IntersectionObserver' in window) {
      const pathObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll('path[data-draw], path[data-sdraw]').forEach(drawPath);
          pathObserver.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -5% 0px', threshold: .04 });
      document.querySelectorAll('svg:has(path[data-draw]), svg:has(path[data-sdraw])').forEach(svg => pathObserver.observe(svg));
    }

    const startPulse = (path, index = 0) => {
      if (path.dataset.pulseReady === 'true') return;
      path.dataset.pulseReady = 'true';
      const length = path.getTotalLength();
      const segment = Math.min(60, length * .18);
      path.style.strokeDasharray = `${segment} ${length}`;
      path.style.strokeDashoffset = String(segment);
      path.style.setProperty('--pulse-to', `${-length}px`);
      path.style.animation = `tracePulse ${3.2 + (index % 4) * .45}s linear ${index * .12}s infinite`;
    };
    document.querySelectorAll('.hero-visual path[data-pulse]').forEach(startPulse);
    if ('IntersectionObserver' in window) {
      const pulseObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll('path[data-pulse], .s-pulse, .i-pulse').forEach(startPulse);
          pulseObserver.unobserve(entry.target);
        });
      }, { rootMargin: '180px 0px', threshold: .01 });
      document.querySelectorAll('main > :not(.hero) svg').forEach(svg => pulseObserver.observe(svg));
    }

    document.querySelectorAll('.service-marquee-track').forEach(track => track.classList.add('is-running'));
  }
})();
