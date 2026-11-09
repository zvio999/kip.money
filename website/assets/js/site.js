(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.getElementById('site-menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open
      ? (toggle.getAttribute('data-close-label') || 'Close menu')
      : (toggle.getAttribute('data-open-label') || 'Open menu');
    menu.classList.toggle('is-open', open);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });
  }

  var langSwitch = document.querySelector('[data-lang-switch]');
  if (langSwitch) {
    document.addEventListener('click', function (event) {
      if (!langSwitch.contains(event.target)) langSwitch.removeAttribute('open');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') langSwitch.removeAttribute('open');
    });
  }

  var items = document.querySelectorAll('[data-reveal]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  items.forEach(function (el) { observer.observe(el); });
})();
