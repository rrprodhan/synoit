/* Lightweight shared shell for editorial pages. */
(() => {
  'use strict';
  window.__synoitRuntime = 'shell';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  let frame = 0;

  function updateShell() {
    frame = 0;
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
    if (!frame) frame = window.requestAnimationFrame(updateShell);
  }, { passive: true });
  window.addEventListener('resize', updateShell, { passive: true });
  updateShell();

  const menuButton = document.getElementById('navMenuBtn');
  const menu = document.getElementById('navDrop');
  if (menuButton && menu) {
    const closeMenu = () => {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menu.querySelectorAll('details[open]').forEach(item => { item.open = false; });
    };
    menuButton.addEventListener('click', event => {
      event.stopPropagation();
      const open = menu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', event => event.stopPropagation());
    document.addEventListener('click', closeMenu);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches && !reducedMotion.matches) {
    window.addEventListener('pointermove', event => {
      cursor.style.transform = `translate(${event.clientX - 19}px, ${event.clientY - 19}px)`;
    }, { passive: true });
    document.addEventListener('pointerover', event => {
      cursor.classList.toggle('is-hover', Boolean(event.target.closest('a, button, summary')));
    });
    document.addEventListener('pointerleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('pointerenter', () => { cursor.style.opacity = '1'; });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const selector = link.getAttribute('href');
      const target = selector && selector.length > 1 ? document.querySelector(selector) : null;
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', selector);
    });
  });
})();
