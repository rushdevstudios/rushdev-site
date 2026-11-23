(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const languageButtons = [...document.querySelectorAll('[data-language]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let language = 'tr';
  try {
    language = localStorage.getItem('rushdev-language') === 'en' ? 'en' : 'tr';
  } catch (_) { /* Use Turkish if browser storage is unavailable. */ }

  const activeTrailer = () => document.querySelector('.trailer-option.is-active');

  const renderTrailerCover = () => {
    const option = activeTrailer();
    const stage = document.querySelector('#trailer-screen');
    if (!option || !stage) return;

    const id = option.dataset.trailer;
    const title = option.dataset[`title${language === 'tr' ? 'Tr' : 'En'}`];
    const label = option.dataset[`label${language === 'tr' ? 'Tr' : 'En'}`];
    stage.dataset.video = id;
    stage.replaceChildren();

    const cover = document.createElement('button');
    cover.type = 'button';
    cover.className = 'video-cover';
    cover.setAttribute('aria-label', `${language === 'tr' ? 'Oynat' : 'Play'}: ${title}`);
    cover.innerHTML = `<img src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" alt="" loading="lazy"><span class="video-vignette"></span><span class="play-button"><span></span></span><span class="video-caption"><small></small><strong></strong></span>`;
    cover.querySelector('.video-caption small').textContent = label;
    cover.querySelector('.video-caption strong').textContent = title;
    cover.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
      frame.title = `Coco Place — ${title}`;
      frame.loading = 'lazy';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      stage.replaceChildren(frame);
    }, { once: true });
    stage.append(cover);
  };

  const setLanguage = (nextLanguage) => {
    language = nextLanguage;
    root.lang = language;
    document.querySelectorAll('[data-tr][data-en]').forEach((element) => {
      element.innerHTML = element.dataset[language];
    });
    languageButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
    if (menuButton) menuButton.setAttribute('aria-label', language === 'tr' ? 'Menüyü aç' : 'Open menu');
    try { localStorage.setItem('rushdev-language', language); } catch (_) { /* Keep language for this visit if storage is unavailable. */ }
    renderTrailerCover();
  };

  languageButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  setLanguage(language);

  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', language === 'tr' ? 'Menüyü aç' : 'Open menu');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening
      ? (language === 'tr' ? 'Menüyü kapat' : 'Close menu')
      : (language === 'tr' ? 'Menüyü aç' : 'Open menu'));
    mobileMenu.classList.toggle('is-open', opening);
    mobileMenu.setAttribute('aria-hidden', String(!opening));
    document.body.classList.toggle('menu-open', opening);
  });
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  let previousY = window.scrollY;
  let scrollQueued = false;
  const progress = document.querySelector('#scroll-progress');
  const updateOnScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 24);
    if (y < 100 || y < previousY - 4 || mobileMenu?.classList.contains('is-open')) {
      header?.classList.remove('header-hidden');
    } else if (y > previousY + 5 && y > 180) {
      header?.classList.add('header-hidden');
    }
    previousY = y;

    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateOnScroll);
    }
  }, { passive: true });
  updateOnScroll();

  document.querySelectorAll('.trailer-option').forEach((option) => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.trailer-option').forEach((item) => {
        const selected = item === option;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      renderTrailerCover();
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('.spotlight').forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      item.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      item.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });

  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty('--tilt-x', `${x * 3.2}deg`);
        card.style.setProperty('--tilt-y', `${y * -3.2}deg`);
        card.classList.add('is-tilting');
      });
      card.addEventListener('pointerleave', () => card.classList.remove('is-tilting'));
    });

    const cursor = document.querySelector('#custom-cursor');
    if (cursor) {
      root.classList.add('has-custom-cursor');
      window.addEventListener('pointermove', (event) => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
        cursor.classList.add('is-visible');
      }, { passive: true });
      document.querySelectorAll('a, button').forEach((item) => {
        item.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
        item.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
      });
      document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    }

    document.querySelectorAll('.magnetic').forEach((item) => {
      item.addEventListener('pointermove', (event) => {
        const rect = item.getBoundingClientRect();
        item.style.setProperty('--mag-x', `${(event.clientX - rect.left - rect.width / 2) * .08}px`);
        item.style.setProperty('--mag-y', `${(event.clientY - rect.top - rect.height / 2) * .08}px`);
      });
      item.addEventListener('pointerleave', () => {
        item.style.setProperty('--mag-x', '0px');
        item.style.setProperty('--mag-y', '0px');
      });
    });
  }

  document.querySelectorAll('.hero').forEach((hero) => {
    hero.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--light-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      hero.style.setProperty('--light-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    }, { passive: true });
  });

  const intro = document.querySelector('.site-intro');
  window.setTimeout(() => intro?.classList.add('is-done'), reduceMotion ? 0 : 1050);
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();