(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const languageButton = document.querySelector('.language-toggle');
  let language = localStorage.getItem('rushdev-language') || 'tr';

  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const setLanguage = (nextLanguage) => {
    language = nextLanguage;
    document.documentElement.lang = language;
    document.querySelectorAll('[data-tr][data-en]').forEach((element) => {
      element.innerHTML = element.dataset[language];
    });
    languageButton.textContent = language === 'tr' ? 'EN' : 'TR';
    languageButton.setAttribute('aria-label', language === 'tr' ? 'Switch language' : 'Dili değiştir');
    localStorage.setItem('rushdev-language', language);
  };
  setLanguage(language);
  languageButton.addEventListener('click', () => setLanguage(language === 'tr' ? 'en' : 'tr'));

  const closeMenu = () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', language === 'tr' ? 'Menüyü aç' : 'Open menu');
    document.body.classList.remove('menu-open');
  };
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? (language === 'tr' ? 'Menüyü aç' : 'Open menu') : (language === 'tr' ? 'Menüyü kapat' : 'Close menu'));
    nav.classList.toggle('open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      event.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${targetId}`);
    });
  });

  const ticker = document.querySelector('.ticker-track');
  const tickerGroup = ticker?.querySelector('.ticker-group');
  if (ticker && tickerGroup && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let loopWidth = tickerGroup.getBoundingClientRect().width;
    const fillTrack = () => {
      loopWidth = tickerGroup.getBoundingClientRect().width;
      while (ticker.scrollWidth < window.innerWidth + loopWidth * 2) {
        ticker.appendChild(tickerGroup.cloneNode(true));
      }
    };
    fillTrack();
    let position = Math.max(0, window.innerWidth - 220);
    let previousTime = performance.now();
    const moveTicker = (time) => {
      position -= (time - previousTime) * 0.075;
      previousTime = time;
      if (position <= -loopWidth) position += loopWidth;
      ticker.style.transform = `translate3d(${position}px, 0, 0)`;
      requestAnimationFrame(moveTicker);
    };
    requestAnimationFrame(moveTicker);
    window.addEventListener('resize', fillTrack, { passive: true });
  }
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  document.getElementById('year').textContent = new Date().getFullYear();
})();

