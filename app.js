(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const navLinks = nav ? Array.from(nav.querySelectorAll('a[href^="#"]')) : [];
  const navAllLinks = nav ? Array.from(nav.querySelectorAll('a')) : [];

  const setScrolled = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });

  const homepageNotice = document.getElementById('homepage-notice');
  const homepageNoticeText = document.getElementById('homepage-notice-text');
  const homepageNoticeLink = document.getElementById('homepage-notice-link');
  const homepageWelcomeVideo = document.getElementById('homepage-welcome-video');
  const homepageNews = document.getElementById('homepage-news');
  const homepageNewsCarousel = document.getElementById('homepage-news-carousel');
  const homepageNewsControls = document.getElementById('homepage-news-controls');
  const homepageNewsPosition = document.getElementById('homepage-news-position');
  const homepageNewsPrev = document.getElementById('homepage-news-prev');
  const homepageNewsNext = document.getElementById('homepage-news-next');

  let welcomeStarted = false;
  function startWelcomeVideo(url) {
    const v = homepageWelcomeVideo;
    if (!v || welcomeStarted) return;
    welcomeStarted = true;
    const btn = document.getElementById('hero-sound-btn');
    const showIcon = () => {
      if (!btn) return;
      btn.textContent = v.muted ? '🔇' : '🔊';
      btn.classList.add('show');
      clearTimeout(btn._t);
      btn._t = setTimeout(() => btn.classList.remove('show'), 900);
    };
    v.src = url;
    v.muted = false;
    v.play().catch(() => {
      // Browser blocked sound before any interaction: play muted, unmute on first interaction.
      v.muted = true;
      v.play().catch(() => {});
      const unlock = (e) => {
        if (e.target && e.target.closest && e.target.closest('.hero-video-wrap')) return;
        v.muted = false; v.play().catch(() => {});
        ['pointerdown','keydown','touchstart','scroll'].forEach((t) => window.removeEventListener(t, unlock, true));
      };
      ['pointerdown','keydown','touchstart','scroll'].forEach((t) => window.addEventListener(t, unlock, true));
    });
    const muteBtn = document.getElementById('hero-mute-btn');
    const syncMute = () => { if (muteBtn) { muteBtn.textContent = v.muted ? '🔇' : '🔊'; muteBtn.setAttribute('aria-label', v.muted ? 'Unmute video' : 'Mute video'); } };
    v.addEventListener('volumechange', syncMute); syncMute();
    if (muteBtn) muteBtn.addEventListener('click', (e) => { e.stopPropagation(); v.muted = !v.muted; syncMute(); });
    const togglePlay = () => {
      if (v.paused) { v.play().catch(() => {}); if (btn) btn.textContent = '▶'; }
      else { v.pause(); if (btn) btn.textContent = '❚❚'; }
      if (btn) { btn.classList.add('show'); clearTimeout(btn._t); btn._t = setTimeout(() => btn.classList.remove('show'), 900); }
    };
    v.addEventListener('click', togglePlay);
  }
  if (homepageWelcomeVideo) setTimeout(() => { if (!welcomeStarted) startWelcomeVideo('assets/hero-video.mp4'); }, 2500);

  let newsItems = [];
  let newsIndex = 0;

  function renderNews() {
    const item = newsItems[newsIndex];
    if (!item) return;
    const figure = document.createElement('figure');
    figure.className = 'news-card';
    const image = document.createElement('img');
    image.src = item.url;
    image.alt = item.caption || 'Recent school event at Em-Desh';
    image.loading = 'lazy';
    const caption = document.createElement('figcaption');
    caption.textContent = item.caption || 'Recent school event';
    figure.append(image, caption);
    homepageNewsCarousel.replaceChildren(figure);
    homepageNewsPosition.textContent = `${newsIndex + 1} / ${newsItems.length}`;
  }

  function showNews(index) {
    newsIndex = (index + newsItems.length) % newsItems.length;
    renderNews();
  }

  homepageNewsPrev?.addEventListener('click', () => showNews(newsIndex - 1));
  homepageNewsNext?.addEventListener('click', () => showNews(newsIndex + 1));

  async function loadHomepage() {
    try {
      const response = await fetch((/lovable\.app$|localhost/.test(location.hostname) ? '/school-api' : 'https://project--cf4a80e7-8301-450b-b19f-d5fb82508f21.lovable.app/api/public/school') + '/homepage', { headers: { accept: 'application/json' } });
      if (!response.ok) return;
      const data = await response.json();
      const settings = data.settings ?? {};
      if (settings.notificationEnabled && settings.notificationText) {
        homepageNoticeText.textContent = settings.notificationText;
        if (settings.notificationLinkText && settings.notificationLinkUrl) {
          homepageNoticeLink.textContent = settings.notificationLinkText;
          homepageNoticeLink.href = settings.notificationLinkUrl;
          homepageNoticeLink.hidden = false;
        }
        homepageNotice.hidden = false;
      }
      startWelcomeVideo(data.welcomeVideo?.url || 'assets/hero-video.mp4');
      const allImages = Array.isArray(data.news) ? data.news : [];
      const heroImage = data.hero ?? allImages.find((item) => item.role === 'hero');
      const heroSection = document.querySelector('.hero');
      if (heroImage?.url && heroSection) {
        heroSection.style.setProperty('--hero-bg-image', `url("${heroImage.url.replace(/"/g, '%22')}")`);
        heroSection.classList.add('has-bg');
      }
      newsItems = allImages.filter((item) => item.role !== 'hero');
      if (newsItems.length) {
        homepageNews.hidden = false;
        homepageNewsControls.hidden = false;
        renderNews();
      }
    } catch {
      // The static hero and rest of the landing page remain usable offline.
    }
  }

  loadHomepage();

  const closeNav = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    nav.classList.remove('is-open');
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      nav.classList.toggle('is-open', !open);
    });

    navAllLinks.forEach((link) => link.addEventListener('click', closeNav));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeNav();
    });

    document.addEventListener('pointerdown', (event) => {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      closeNav();
    });
  }

  const reveals = Array.from(document.querySelectorAll('.reveal'));

  const revealCheck = () => {
    const limit = window.innerHeight * 0.94;
    reveals.forEach((el) => {
      if (el.classList.contains('is-visible')) return;
      if (el.getBoundingClientRect().top < limit) el.classList.add('is-visible');
    });
  };

  revealCheck();
  window.addEventListener('scroll', revealCheck, { passive: true });
  window.addEventListener('resize', revealCheck);

  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const current = link.getAttribute('href') === `#${entry.target.id}`;
            if (current) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
