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
