/* ==========================================================================
   PRISM64 — Main Application & SPA Engine
   --------------------------------------------------------------------------
   Handles full SPA routing, 64 types grid, detail modal, interactive
   6-dimension personality test, animated SVG radar & dimension bars,
   theme switching, and real-time i18n reactivity.
   ========================================================================== */

const PRISM = (() => {
  'use strict';

  /* ----------------------------------------------------------- DOM Helpers */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* --------------------------------------------------------- State */
  let state = {
    lang: I18N.getLang(),
    theme: localStorage.getItem('prism64-theme') || 'light',
    currentView: 'home', // 'home' | 'test' | 'result'
    filter: 'all',
    search: '',
    viewMode: 'grouped', // 'grouped' (16 แม่แบบหลัก) | 'all64' (64 เฉดสีเต็มตาราง)
    shadeFilter: 'all',  // 'all' | 'AH' | 'AC' | 'OH' | 'OC'
    selectedType: null,
    modalOpen: false,

    /* Assessment State */
    testMode: localStorage.getItem('prism64-test-mode') || 'quick', // 'quick' (18 ข้อ) | 'full' (36 ข้อ)
    testAnswers: {}, // { [qId]: weightNumber (-3 to 3) }
    testCurrentIdx: 0,
    testCompleted: false,
    lastResult: null, // { fullCode, coreCode, variantKey, scores, breakdown }
  };

  /* --------------------------------------------------------- Init */
  function init() {
    I18N.init();
    _applyTheme(state.theme);
    _loadSavedResult();

    _renderStats();
    _renderDimensions();
    _renderSpectra();
    _renderTypes();
    _renderFAQ();

    _bindEvents();
    _observeReveal();
    _initHeaderScroll();
    _initThemeToggle();
    _initLangToggle();
    _initMobileNav();
    _initTilt();
    _initHeroCast();
    _initModalGlobalEvents();

    /* Handle URL routing */
    _handleRoute();
    window.addEventListener('hashchange', _handleRoute);

    /* Reactivity on language change */
    window.addEventListener('langchange', (e) => {
      state.lang = e.detail?.lang || I18N.getLang();
      _renderStats();
      _renderDimensions();
      _renderSpectra();
      _renderTypes(state.filter, state.search);
      _renderFAQ();

      if (state.currentView === 'test') {
        _renderTestQuestion();
      } else if (state.currentView === 'result' && state.lastResult) {
        _renderResultView(state.lastResult.fullCode, state.lastResult.scores, false);
      }

      if (state.modalOpen && state.selectedType) {
        _openModal(state.selectedType.fullCode);
      }

      const langBtn = $('#lang-toggle');
      if (langBtn) {
        langBtn.textContent = state.lang === 'th' ? 'EN' : 'TH';
      }
    });
  }

  /* -------------------------------------------------------- SPA Router */
  function _handleRoute() {
    const hash = window.location.hash.slice(1);

    if (hash === 'prism-admin-gate' || hash === 'admin') {
      _showView('admin');
      if (window.PRISM_ADMIN && window.PRISM_ADMIN.openPortal) {
        window.PRISM_ADMIN.openPortal();
      }
    } else if (hash.startsWith('result=')) {
      const code = hash.replace('result=', '');
      _showView('result');
      _renderResultView(code, null, true);
    } else if (hash.startsWith('result')) {
      if (state.lastResult) {
        _showView('result');
        _renderResultView(state.lastResult.fullCode, state.lastResult.scores, false);
      } else {
        _showView('test');
        _initTest();
      }
    } else if (hash === 'test') {
      _showView('test');
      _initTest();
    } else if (hash.startsWith('type=')) {
      const code = hash.replace('type=', '');
      _showView('home');
      setTimeout(() => _openModal(code), 150);
    } else {
      _showView('home');
      if (hash && document.getElementById(hash)) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }

  function _showView(viewName) {
    state.currentView = viewName;

    const viewHome = $('#view-home');
    const viewTest = $('#view-test');
    const viewResult = $('#view-result');
    const viewAdmin = $('#view-admin');

    if (viewHome) viewHome.hidden = viewName !== 'home';
    if (viewTest) viewTest.hidden = viewName !== 'test';
    if (viewResult) viewResult.hidden = viewName !== 'result';
    if (viewAdmin) viewAdmin.hidden = viewName !== 'admin';

    window.scrollTo({ top: 0, behavior: 'smooth' });
    _observeReveal();
  }

  /* -------------------------------------------------------- Theme */
  function _applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
    localStorage.setItem('prism64-theme', theme);
    const btn = $('#theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', I18N.t(theme === 'dark' ? 'theme.light' : 'theme.dark'));
      btn.innerHTML = theme === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  function _toggleTheme() {
    _applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  function _initThemeToggle() {
    const btn = $('#theme-toggle');
    if (btn) btn.addEventListener('click', _toggleTheme);
  }

  /* -------------------------------------------------------- Language */
  function _initLangToggle() {
    const btn = $('#lang-toggle');
    if (btn) {
      btn.textContent = state.lang === 'th' ? 'EN' : 'TH';
      btn.addEventListener('click', () => {
        I18N.toggleLang();
      });
    }
  }

  /* -------------------------------------------------------- Header Scroll */
  function _initHeaderScroll() {
    const header = $('.site-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-stuck', window.scrollY > 30);
    }, { passive: true });
  }

  /* -------------------------------------------------------- Mobile Nav */
  function _initMobileNav() {
    const toggle = $('.nav-toggle');
    const nav = $('.nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------------------------------------- Tilt */
  function _initTilt() {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
      });
    });
  }

  /* -------------------------------------------------------- Hero Cast */
  function _initHeroCast() {
    $$('.cast__figure').forEach(fig => {
      fig.addEventListener('click', () => {
        const type = fig.dataset.type || 'INTJ-AH';
        _openModal(type);
      });
      fig.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const type = fig.dataset.type || 'INTJ-AH';
          _openModal(type);
        }
      });
    });
  }

  /* -------------------------------------------------------- Reveal */
  function _observeReveal() {
    if (!('IntersectionObserver' in window)) {
      $$('[data-reveal]').forEach(el => el.classList.add('is-in'));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    $$('[data-reveal]').forEach(el => obs.observe(el));
  }

  /* -------------------------------------------------------- Toast */
  function _showToast(msg) {
    const toast = $('#toast');
    const toastMsg = $('#toast-msg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2600);
  }

  /* ========================================================
     HOME SECTIONS RENDERERS
     ======================================================== */

  /* -------------------------------------------------------- Stats */
  function _renderStats() {
    const grid = $('#stats-grid');
    if (!grid) return;
    const items = [
      { num: '64', key: 'stats.types' },
      { num: '6', key: 'stats.dims' },
      { num: '4', key: 'stats.spectra' },
      { num: '∞', key: 'stats.insights' },
    ];
    grid.innerHTML = items.map(item => `
      <div class="stat" data-reveal>
        <div class="stat__num">${item.num}</div>
        <div class="stat__label" data-i18n="${item.key}">${I18N.t(item.key)}</div>
      </div>
    `).join('');
    _observeReveal();
  }

  /* -------------------------------------------------------- Dimensions */
  function _renderDimensions() {
    _observeReveal();
  }

  /* -------------------------------------------------------- Spectra */
  function _renderSpectra() {
    _observeReveal();
  }

  /* -------------------------------------------------------- Types Grid */
  function _renderTypes(filter = state.filter, search = state.search) {
    const grid = $('#types-grid');
    const count = $('#types-count');
    if (!grid) return;

    const coreTypes = window.PRISM_DATA.CORE_TYPES;
    const variants = window.PRISM_DATA.VARIANTS;
    const lang = state.lang;
    const viewMode = state.viewMode || 'grouped';
    const shadeFilter = state.shadeFilter || 'all';

    if (viewMode === 'all64') {
      // 64 Full Shade Grid with Unique Per-Shade Profiles
      grid.className = 'type-grid type-grid--all64';
      let shades = [];
      const shades64 = window.PRISM_DATA.SHADES_64 || {};

      Object.keys(coreTypes).forEach(code => {
        const ct = coreTypes[code];
        if (filter !== 'all' && ct.spectrum !== filter) return;
        ['AH', 'AC', 'OH', 'OC'].forEach(vk => {
          if (shadeFilter !== 'all' && shadeFilter !== vk) return;
          const v = variants[vk];
          const fullCode = `${code}-${vk}`;
          const shade = shades64[fullCode] || {
            title: v.name,
            shadeLabel: v.name,
            tagline: v.tagline,
            desc: v.desc
          };

          if (search) {
            const s = search.toLowerCase();
            const matchCode = fullCode.toLowerCase().includes(s);
            const matchName = ct.name[lang].toLowerCase().includes(s);
            const matchShadeTitle = (shade.title && shade.title[lang] ? shade.title[lang].toLowerCase().includes(s) : false);
            const matchShadeLabel = (shade.shadeLabel && shade.shadeLabel[lang] ? shade.shadeLabel[lang].toLowerCase().includes(s) : false);
            const matchTag = (shade.tagline && shade.tagline[lang] ? shade.tagline[lang].toLowerCase().includes(s) : false) || ct.tagline[lang].toLowerCase().includes(s);
            if (!matchCode && !matchName && !matchShadeTitle && !matchShadeLabel && !matchTag) return;
          }
          shades.push({ code, vk, fullCode, ct, v, shade });
        });
      });

      if (count) {
        count.textContent = `แสดง ${shades.length} / 64 เฉดสีบริสุทธิ์`;
      }

      if (shades.length === 0) {
        grid.innerHTML = `<div class="center" style="grid-column:1/-1;padding:3.5rem 1rem;color:var(--text-3)">
          <p style="font-size:1.5rem;margin-bottom:.5rem">🔍</p>
          <p>${I18N.t('misc.no_results')}</p>
        </div>`;
        return;
      }

      grid.innerHTML = shades.map((s, i) => {
        const imgThumb = `assets/img/characters/${s.code}.thumb.webp`;
        const imgFull = `assets/img/characters/${s.code}.webp`;
        const accent = s.ct.spectrum === 'violet' ? '#8B5CF6' : s.ct.spectrum === 'green' ? '#10B981' : s.ct.spectrum === 'blue' ? '#3B82F6' : '#F59E0B';
        const sharePerShade = (s.ct.share / 4).toFixed(2);

        return `
          <div class="shade-card-64" data-code="${s.fullCode}" data-spectrum="${s.ct.spectrum}"
               style="--c-accent: ${accent}; --delay:${(i % 12) * 25}ms"
               data-reveal tabindex="0" role="button" aria-label="${s.fullCode} — ${s.shade.title[lang]} (${s.ct.name[lang]})">
            
            <div class="shade-card-64__header">
              <span class="shade-card-64__code">${s.fullCode}</span>
              <span class="shade-card-64__badge">${s.shade.shadeLabel[lang]}</span>
            </div>

            <div class="shade-card-64__art-wrap">
              <img src="${imgThumb}" data-src="${imgFull}" class="shade-card-64__thumb" alt="${s.ct.name[lang]}" loading="lazy" />
              <div class="shade-card-64__meta">
                <div class="shade-card-64__name">${s.shade.title[lang]}</div>
                <div class="shade-card-64__shade-title">${s.ct.name[lang]} • ${s.vk}</div>
              </div>
            </div>

            <div class="shade-card-64__tagline">“${s.shade.tagline[lang]}”</div>

            <div class="shade-card-64__foot">
              <span class="dim">${sharePerShade}% ประชากร</span>
              <span class="shade-card-64__arrow">เจาะลึกเฉดนี้ →</span>
            </div>
          </div>
        `;
      }).join('');

    } else {
      // 16 Grouped Master Archetypes
      grid.className = 'type-grid';
      let cores = [];
      Object.keys(coreTypes).forEach(code => {
        const ct = coreTypes[code];
        if (filter !== 'all' && ct.spectrum !== filter) return;
        if (search) {
          const s = search.toLowerCase();
          const matchCode = code.toLowerCase().includes(s);
          const matchName = ct.name[lang].toLowerCase().includes(s);
          const matchTag = ct.tagline[lang].toLowerCase().includes(s);
          if (!matchCode && !matchName && !matchTag) return;
        }
        cores.push({ code, ct });
      });

      if (count) {
        count.textContent = `แสดง ${cores.length} แม่แบบหลัก (${cores.length * 4} / 64 เฉดสี)`;
      }

      if (cores.length === 0) {
        grid.innerHTML = `<div class="center" style="grid-column:1/-1;padding:3.5rem 1rem;color:var(--text-3)">
          <p style="font-size:1.5rem;margin-bottom:.5rem">🔍</p>
          <p>${I18N.t('misc.no_results')}</p>
        </div>`;
        return;
      }

      grid.innerHTML = cores.map((c, i) => {
        const imgPath = `assets/img/characters/${c.code}.webp`;
        const thumbPath = `assets/img/characters/${c.code}.thumb.webp`;

        return `
          <div class="type-card" data-code="${c.code}" data-spectrum="${c.ct.spectrum}"
               data-reveal style="--delay:${(i % 8) * 35}ms"
               tabindex="0" role="button" aria-label="${c.code} — ${c.ct.name[lang]}">
            <div class="type-card__art">
              <span class="type-card__code">${c.code}</span>
              <img src="${thumbPath}" data-src="${imgPath}"
                   alt="${c.ct.name[lang]}"
                   loading="lazy" width="auto" height="auto" />
            </div>
            <div class="type-card__body">
              <div class="type-card__name">${c.ct.name[lang]}</div>
              <div class="type-card__tag">“${c.ct.tagline[lang]}”</div>
              
              <div class="type-card__highlight-pill">
                <span class="pill-icon">🌟</span>
                <span class="pill-text"><b>สกิลเด่น:</b> ${c.ct.strengths[lang][0]}</span>
              </div>

              <div class="type-card__blurb">${c.ct.blurb[lang]}</div>

              <div class="type-card__shades-row">
                <span class="type-card__shade-tag ${shadeFilter === 'AH' ? 'is-highlight' : ''}" data-code="${c.code}-AH">${c.code}-AH</span>
                <span class="type-card__shade-tag ${shadeFilter === 'AC' ? 'is-highlight' : ''}" data-code="${c.code}-AC">${c.code}-AC</span>
                <span class="type-card__shade-tag ${shadeFilter === 'OH' ? 'is-highlight' : ''}" data-code="${c.code}-OH">${c.code}-OH</span>
                <span class="type-card__shade-tag ${shadeFilter === 'OC' ? 'is-highlight' : ''}" data-code="${c.code}-OC">${c.code}-OC</span>
              </div>

              <div class="type-card__foot mt-2">
                <span class="dim" style="font-size:.82rem">ประชากร ${c.ct.share}%</span>
                <span class="type-card__arrow">ดู 4 เฉดสี →</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    _observeReveal();
    _bindTypeCards();
    _lazyLoadImages();
  }

  function _lazyLoadImages() {
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            obs.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });
      $$('img[data-src]').forEach(img => obs.observe(img));
    } else {
      $$('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  function _bindTypeCards() {
    // Only bind keyboard accessibility here
    $$('.type-card, .shade-card-64').forEach(card => {
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const code = card.dataset.code;
          _openModal(code);
        }
      });
    });
  }

  /* -------------------------------------------------------- Filters */
  function _initFilters() {
    // Spectrum Filters
    const chips = $$('.filter-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');
        state.filter = chip.dataset.filter || 'all';
        _renderTypes(state.filter, state.search);
      });
    });

    // View Mode Switcher (16 Grouped vs 64 Full Shades)
    const viewTabs = $$('.view-mode-tab');
    viewTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        viewTabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        state.viewMode = tab.dataset.view || 'grouped';
        _renderTypes(state.filter, state.search);
      });
    });

    // Sub-variant Shade Filter Chips (-AH, -AC, -OH, -OC)
    const shadeChips = $$('.shade-filter-chip');
    shadeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        shadeChips.forEach(c => {
          c.classList.remove('is-active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        state.shadeFilter = chip.dataset.shade || 'all';
        
        // Auto switch to all64 view if specific shade is selected for crystal clear view
        if (state.shadeFilter !== 'all' && state.viewMode !== 'all64') {
          state.viewMode = 'all64';
          viewTabs.forEach(t => t.classList.toggle('is-active', t.dataset.view === 'all64'));
        }
        _renderTypes(state.filter, state.search);
      });
    });

    // Search input
    const search = $('#type-search');
    if (search) {
      search.addEventListener('input', e => {
        state.search = e.target.value;
        _renderTypes(state.filter, state.search);
      });
    }
  }

  /* -------------------------------------------------------- FAQ */
  function _renderFAQ() {
    const el = $('#faq-list');
    if (!el) return;

    const items = [
      { q: I18N.t('faq.q1'), a: I18N.t('faq.a1') },
      { q: I18N.t('faq.q2'), a: I18N.t('faq.a2') },
      { q: I18N.t('faq.q3'), a: I18N.t('faq.a3') },
      { q: I18N.t('faq.q4'), a: I18N.t('faq.a4') },
      { q: I18N.t('faq.q5'), a: I18N.t('faq.a5') }
    ];

    el.innerHTML = items.map((item, i) => `
      <div class="faq-item" data-reveal style="--delay:${i * 50}ms">
        <button class="faq-q" aria-expanded="false" aria-controls="faq-ans-${i}">
          <span>${item.q}</span>
          <span class="faq-q__icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-a" id="faq-ans-${i}" role="region">
          <p>${item.a}</p>
        </div>
      </div>
    `).join('');

    _observeReveal();
    _bindFAQ();
  }

  function _bindFAQ() {
    $$('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const answer = btn.nextElementSibling;
        const icon = btn.querySelector('.faq-q__icon');

        btn.setAttribute('aria-expanded', !expanded);
        if (answer) answer.classList.toggle('is-open', !expanded);
        if (icon) icon.textContent = expanded ? '+' : '−';
      });
    });
  }

  let modalJustOpened = false;

  function _initModalGlobalEvents() {
    const overlay = $('#modal-overlay');
    const modal = $('#type-modal');
    if (!overlay || !modal) return;

    overlay.addEventListener('click', (e) => {
      if (modalJustOpened) return;
      if (e.target === overlay) {
        _closeModal();
      }
    });

    modal.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.modalOpen) {
        _closeModal();
      }
    });

    // Delegation for Grid cards:
    const grid = $('#types-grid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        // Direct shade tag click
        const shadeTag = e.target.closest('.type-card__shade-tag');
        if (shadeTag) {
          e.preventDefault();
          e.stopPropagation();
          const code = shadeTag.dataset.code;
          if (code) _openModal(code);
          return;
        }

        // 64 Full Shade card click
        const shadeCard = e.target.closest('.shade-card-64');
        if (shadeCard) {
          e.preventDefault();
          e.stopPropagation();
          const code = shadeCard.dataset.code;
          if (code) _openModal(code);
          return;
        }

        // Standard Grouped card click
        const card = e.target.closest('.type-card');
        if (card) {
          e.preventDefault();
          e.stopPropagation();
          const code = card.dataset.code;
          if (code) _openModal(code);
        }
      });
    }

    // Delegation for Hero Cast:
    const cast = $('.hero__cast');
    if (cast) {
      cast.addEventListener('click', (e) => {
        const fig = e.target.closest('.cast__figure');
        if (!fig) return;
        e.preventDefault();
        e.stopPropagation();
        const type = fig.dataset.type || 'INTJ';
        _openModal(type);
      });
    }
  }

  const CAREER_CATALOG = {
    // === INTJ ===
    'นักวางกลยุทธ์ธุรกิจ': { icon: '📈', bg: '#8B5CF6', img: 'assets/img/careers/business.jpg', cat: '📈 สายกลยุทธ์ & องค์กร', benefit: 'มองทะลุอนาคตและวางแผนระยะยาวเปลี่ยนเกม' },
    'System Architect': { icon: '💻', bg: '#6366F1', img: 'assets/img/careers/tech.jpg', cat: '💻 สายสถาปัตยกรรมระบบ & AI', benefit: 'ออกแบบโครงสร้างระบบซอฟต์แวร์ระดับสูง' },
    'นักวิเคราะห์การลงทุน': { icon: '💰', bg: '#EAB308', img: 'assets/img/careers/finance.jpg', cat: '💰 สายวิเคราะห์การลงทุน', benefit: 'ประเมินมูลค่าสินทรัพย์และชี้เป้าผลตอบแทน' },
    'ผู้ก่อตั้งสตาร์ตอัป': { icon: '🚀', bg: '#EA580C', img: 'assets/img/careers/creative.jpg', cat: '🚀 สายสตาร์ตอัป & ผู้สร้างนวัตกรรม', benefit: 'ริเริ่มธุรกิจใหม่และสร้างคุณค่าที่ไม่เคยมีมาก่อน' },
    'Product Director': { icon: '🎯', bg: '#06B6D4', img: 'assets/img/careers/research.jpg', cat: '🎯 สายบริหารผลิตภัณฑ์ & R&D', benefit: 'กำหนดทิศทางผลิตภัณฑ์และส่งมอบประสบการณ์ที่ยอดเยี่ยม' },
    'Data Scientist': { icon: '📊', bg: '#0EA5E9', img: 'assets/img/careers/data.jpg', cat: '📊 สาย Data & สถิติเชิงลึก', benefit: 'วิเคราะห์โมเดลและค้นหาอินไซต์ขับเคลื่อนธุรกิจ' },
    'ที่ปรึกษาการจัดการ': { icon: '⚖️', bg: '#64748B', img: 'assets/img/careers/legal.jpg', cat: '⚖️ สายที่ปรึกษาการจัดการ & นโยบาย', benefit: 'ปรับปรุงโครงสร้างและวางระบบธรรมาภิบาลองค์กร' },

    // === INTP ===
    'Software Engineer': { icon: '💻', bg: '#6366F1', img: 'assets/img/careers/tech.jpg', cat: '💻 สายซอฟต์แวร์ & วิศวกรรม', benefit: 'พัฒนาโค้ดและสร้างระบบที่ทำงานได้จริง' },
    'นักวิจัย / นักวิทยาศาสตร์': { icon: '🔬', bg: '#06B6D4', img: 'assets/img/careers/research.jpg', cat: '🔬 สายวิจัยวิทยาศาสตร์', benefit: 'ค้นคว้าทฤษฎีและทดลองนวัตกรรมใหม่' },
    'Data Architect': { icon: '🗄️', bg: '#0284C7', img: 'assets/img/careers/data_architect.jpg', cat: '🗄️ สายสถาปัตยกรรมข้อมูล & Big Data', benefit: 'วางรากฐานคลังข้อมูลขนาดใหญ่และการไหลของ Data ให้เสถียรและทรงพลัง' },
    'Data architect': { icon: '🗄️', bg: '#0284C7', img: 'assets/img/careers/data_architect.jpg', cat: '🗄️ Data Architecture & Big Data', benefit: 'Design enterprise data pipelines and high-scale warehouse structures.' },
    'Cybersecurity Specialist': { icon: '🛡️', bg: '#059669', img: 'assets/img/careers/cybersecurity.jpg', cat: '🛡️ สายความปลอดภัยไซเบอร์ & ป้องกันข้อมูล', benefit: 'ป้องกันภัยคุกคามไซเบอร์และวางเกราะคุ้มกันระบบเครือข่าย' },
    'Cybersecurity specialist': { icon: '🛡️', bg: '#059669', img: 'assets/img/careers/cybersecurity.jpg', cat: '🛡️ Cybersecurity & Information Security', benefit: 'Defend systems from threats and enforce cyber resilience.' },
    'นักวิเคราะห์ระบบ': { icon: '📈', bg: '#8B5CF6', img: 'assets/img/careers/business.jpg', cat: '📈 สายวิเคราะห์ระบบงาน & กลยุทธ์', benefit: 'เชื่อมโยงความต้องการธุรกิจเข้ากับโซลูชันไอที' },
    'อาจารย์ / ติวเตอร์': { icon: '🎓', bg: '#3B82F6', img: 'assets/img/careers/education.jpg', cat: '🎓 สายการศึกษา & ติวเตอร์', benefit: 'ถ่ายทอดความรู้และปั้นเยาวชนสู่อนาคต' },

    // === ENTJ ===
    'ผู้บริหาร / CEO': { icon: '🏢', bg: '#F59E0B', img: 'assets/img/careers/business.jpg', cat: '🏢 สายบริหารระดับสูง', benefit: 'นำทัพองค์กรและขับเคลื่อนเป้าหมายใหญ่' },
    'Operations Director': { icon: '📊', bg: '#0EA5E9', img: 'assets/img/careers/data.jpg', cat: '📊 สายบริหารระบบปฏิบัติการ & ดาต้า', benefit: 'ควบคุมประสิทธิภาพการทำงานทั่วทั้งองค์กร' },
    'นักลงทุน / VC': { icon: '💰', bg: '#EAB308', img: 'assets/img/careers/finance.jpg', cat: '💰 สายนักลงทุน Venture Capital', benefit: 'เลือกลงทุนในสตาร์ตอัปที่มีศักยภาพเติบโตสูง' },
    'Project Manager ระดับสูง': { icon: '🔬', bg: '#06B6D4', img: 'assets/img/careers/research.jpg', cat: '🔬 ผู้จัดการโครงการวิจัย & นวัตกรรม', benefit: 'บริหารงบประมาณและนำทีมส่งมอบงานตรงเวลา' },
    'ที่ปรึกษากลยุทธ์': { icon: '⚖️', bg: '#64748B', img: 'assets/img/careers/legal.jpg', cat: '⚖️ สายที่ปรึกษากลยุทธ์ & องค์กร', benefit: 'วางทิศทางและสร้างความได้เปรียบในการแข่งขัน' },

    // === ENTP ===
    'ผู้ประกอบการ / Founder': { icon: '🏢', bg: '#F59E0B', img: 'assets/img/careers/business.jpg', cat: '🏢 ผู้ประกอบการ & ผู้ก่อตั้ง', benefit: 'บุกเบิกตลาดและสร้างทีมที่มีวิสัยทัศน์' },
    'Creative Director': { icon: '🎨', bg: '#D946EF', img: 'assets/img/careers/creative.jpg', cat: '🎨 ผู้อำนวยการฝ่ายสร้างสรรค์', benefit: 'นำทิศทางงานศิลป์และคอนเซปต์สร้างสรรค์' },
    'Product Manager': { icon: '🎯', bg: '#06B6D4', img: 'assets/img/careers/research.jpg', cat: '🎯 ผู้จัดการผลิตภัณฑ์', benefit: 'เชื่อมโยงผู้ใช้และทีมงานเพื่อส่งมอบโปรดักต์' },
    'Marketing Strategist': { icon: '📣', bg: '#F97316', img: 'assets/img/careers/marketing.jpg', cat: '📣 นักกลยุทธ์การตลาด', benefit: 'วางแผนแคมเปญการตลาดที่ตรงกลุ่มเป้าหมาย' },
    'Content Creator / นักเขียน': { icon: '✍️', bg: '#EC4899', img: 'assets/img/careers/writing.jpg', cat: '✍️ คอนเทนต์ครีเอเตอร์ & นักเขียน', benefit: 'ผลิตคอนเทนต์คุณภาพสูงอย่างต่อเนื่อง' },
    'นักพัฒนานวัตกรรม': { icon: '💻', bg: '#6366F1', img: 'assets/img/careers/tech.jpg', cat: '💻 สายพัฒนานวัตกรรม Tech', benefit: 'คิดค้นและทดลองสร้างสิ่งประดิษฐ์ใหม่' },

    // === INFJ ===
    'นักจิตวิทยา / ที่ปรึกษา': { icon: '🧠', bg: '#8B5CF6', img: 'assets/img/careers/psychology.jpg', cat: '🧠 สายจิตวิทยา & ให้คำปรึกษา', benefit: 'รับฟังและช่วยเยียวยาสภาพจิตใจ' },
    'นักเขียน / คอนเทนต์ครีเอเตอร์': { icon: '✍️', bg: '#EC4899', img: 'assets/img/careers/writing.jpg', cat: '✍️ สายงานเขียน & คอนเทนต์', benefit: 'ถ่ายทอดข้อมูลให้เข้าใจง่ายและน่าติดตาม' },
    'UX Researcher': { icon: '🔬', bg: '#06B6D4', img: 'assets/img/careers/research.jpg', cat: '🔬 สายวิจัยประสบการณ์ผู้ใช้', benefit: 'ค้นหาอินไซต์พฤติกรรมมนุษย์เพื่อปรับปรุงงาน' },
    'HR & Culture Specialist': { icon: '🤝', bg: '#10B981', img: 'assets/img/careers/hr.jpg', cat: '🤝 ผู้เชี่ยวชาญวัฒนธรรมองค์กร', benefit: 'สร้างสภาพแวดล้อมการทำงานที่มีความสุข' },
    'อาจารย์ / โค้ช': { icon: '🎓', bg: '#3B82F6', img: 'assets/img/careers/education.jpg', cat: '🎓 สายการศึกษา & โค้ชชิ่ง', benefit: 'ให้คำแนะนำและนำทางสู่ความสำเร็จ' },
    'ผู้นำองค์กรเพื่อสังคม': { icon: '🌱', bg: '#10B981', img: 'assets/img/careers/social.jpg', cat: '🌱 ผู้นำเพื่อการเปลี่ยนแปลงสังคม', benefit: 'ขับเคลื่อนโครงการเพื่อยกระดับคุณภาพชีวิตผู้คน' },

    // === INFP ===
    'นักเขียน / กวี': { icon: '✍️', bg: '#EC4899', img: 'assets/img/careers/writing.jpg', cat: '✍️ สายงานเขียน & กวีนิพนธ์', benefit: 'ร้อยเรียงคำพูดลึกซึ้งและส่งต่ออารมณ์ความรู้สึก' },
    'Graphic Designer': { icon: '🎨', bg: '#D946EF', img: 'assets/img/careers/creative.jpg', cat: '🎨 สายออกแบบกราฟิก', benefit: 'สร้างสรรค์งานภาพและการจัดวางที่สวยงาม' },
    'ศิลปิน / นักดนตรี': { icon: '🎬', bg: '#E11D48', img: 'assets/img/careers/media.jpg', cat: '🎬 สายศิลปิน & ดนตรี', benefit: 'ถ่ายทอดความรู้สึกผ่านท่วงทำนองและงานศิลป์' },
    'Art Therapist': { icon: '🧠', bg: '#8B5CF6', img: 'assets/img/careers/psychology.jpg', cat: '🧠 สายศิลปะบำบัด', benefit: 'ใช้ศิลปะเป็นสื่อกลางในการฟื้นฟูจิตใจ' },
    'นักแปล': { icon: '🎓', bg: '#3B82F6', img: 'assets/img/careers/education.jpg', cat: '🎓 สายภาษา & การแปล', benefit: 'เชื่อมโยงวัฒนธรรมและภาษาให้เข้าใจกัน' },
    'Content Creator สายสื่อสาร': { icon: '📣', bg: '#F97316', img: 'assets/img/careers/marketing.jpg', cat: '📣 คอนเทนต์ครีเอเตอร์ & สื่อสาร', benefit: 'สร้างสรรค์เรื่องราวที่เข้าถึงใจผู้คน' },
    'นักสังคมสงเคราะห์': { icon: '🌱', bg: '#10B981', img: 'assets/img/careers/social.jpg', cat: '🌱 สายสังคมสงเคราะห์', benefit: 'ช่วยเหลือกลุ่มเปราะบางและสร้างโอกาสในสังคม' },

    // === ENFJ ===
    'HR Director / People Lead': { icon: '🤝', bg: '#10B981', img: 'assets/img/careers/hr.jpg', cat: '🤝 ผู้นำสายพัฒนาคน (People Lead)', benefit: 'วางยุทธศาสตร์พัฒนาคนและวัฒนธรรมองค์กร' },
    'โค้ชพัฒนาตัวเอง': { icon: '🎤', bg: '#FB7185', img: 'assets/img/careers/stage.jpg', cat: '🎤 โค้ชสร้างแรงบันดาลใจ & พัฒนาตนเอง', benefit: 'ปลดล็อกศักยภาพสูงสุดของแต่ละบุคคล' },
    'ครู / วิทยากร': { icon: '🎓', bg: '#3B82F6', img: 'assets/img/careers/education.jpg', cat: '🎓 วิทยากร & ผู้สอน', benefit: 'สร้างแรงบันดาลใจและบรรยายให้ความรู้' },
    'PR & Communications Lead': { icon: '📣', bg: '#F97316', img: 'assets/img/careers/marketing.jpg', cat: '📣 สายประชาสัมพันธ์ & สื่อสาร', benefit: 'สื่อสารภาพลักษณ์ที่ดีและบริหารประเด็นองค์กร' },
    'ผู้จัดการฝ่ายขาย': { icon: '🏢', bg: '#F59E0B', img: 'assets/img/careers/business.jpg', cat: '🏢 ผู้จัดการฝ่ายขายและการพัฒนาธุรกิจ', benefit: 'ดูแลทีมขายและประสานงานลูกค้าสำคัญ' },

    // === ENFP ===
    'Creative / โฆษณา': { icon: '🎨', bg: '#D946EF', img: 'assets/img/careers/creative.jpg', cat: '🎨 สายครีเอทีฟโฆษณา', benefit: 'คิดค้นไอเดียสดใหม่ที่สร้างกระแสไวรัล' },
    'Content Creator / บล็อกเกอร์': { icon: '✍️', bg: '#EC4899', img: 'assets/img/careers/writing.jpg', cat: '✍️ คอนเทนต์ครีเอเตอร์ & บล็อกเกอร์', benefit: 'ถ่ายทอดเรื่องราวที่สร้างแรงบันดาลใจ' },
    'Event Producer': { icon: '🎬', bg: '#E11D48', img: 'assets/img/careers/media.jpg', cat: '🎬 โปรดิวเซอร์งานอีเวนต์', benefit: 'คุมการผลิตงานแสดงและโชว์ระดับมืออาชีพ' },
    'Brand Communicator': { icon: '📣', bg: '#F97316', img: 'assets/img/careers/marketing.jpg', cat: '📣 สายสื่อสารแบรนด์', benefit: 'บอกเล่าเรื่องราวแบรนด์ให้กินใจผู้บริโภค' },
    'เจ้าของธุรกิจ': { icon: '🏢', bg: '#F59E0B', img: 'assets/img/careers/business.jpg', cat: '🏢 สายผู้ประกอบการธุรกิจ', benefit: 'สร้างและบริหารธุรกิจของตนเองอย่างมั่นคง' },
    'Community Manager': { icon: '🤝', bg: '#10B981', img: 'assets/img/careers/hr.jpg', cat: '🤝 ผู้จัดการคอมมูนิตี้', benefit: 'ดูแลสมาชิกและสร้างชุมชนที่เข้มแข็ง' },
    'นักจัดกิจกรรม': { icon: '🎤', bg: '#FB7185', img: 'assets/img/careers/stage.jpg', cat: '🎤 สายจัดกิจกรรม & งานสังสรรค์', benefit: 'สร้างความสนุกสนานและบรรยากาศอบอุ่น' },

    // === ISTJ ===
    'ผู้ตรวจสอบบัญชี (Auditor)': { icon: '💰', bg: '#EAB308', img: 'assets/img/careers/finance.jpg', cat: '💰 สายตรวจสอบบัญชี & การเงิน', benefit: 'ตรวจสอบความถูกต้องและโปร่งใสทางการเงิน' },
    'วิศวกรโครงสร้าง': { icon: '🔬', bg: '#06B6D4', img: 'assets/img/careers/research.jpg', cat: '🔬 สายวิศวกรรมโครงสร้าง & คำนวณ', benefit: 'คำนวณและออกแบบอาคารให้แข็งแรงปลอดภัย' },
    'Operations Manager': { icon: '🏢', bg: '#F59E0B', img: 'assets/img/careers/business.jpg', cat: '🏢 ผู้จัดการฝ่ายปฏิบัติการ', benefit: 'ดูแลกระบวนการทำงานให้ลื่นไหลและมีประสิทธิภาพ' },
    'นักกฎหมาย / นิติกร': { icon: '⚖️', bg: '#64748B', img: 'assets/img/careers/legal.jpg', cat: '⚖️ สายกฎหมาย & นิติการ', benefit: 'ปกป้องสิทธิ์และให้คำปรึกษาทางกฎหมาย' },
    'Compliance Officer': { icon: '🤝', bg: '#10B981', img: 'assets/img/careers/hr.jpg', cat: '🤝 สายกำกับดูแลจริยธรรมองค์กร', benefit: 'ดูแลให้องค์กรดำเนินงานถูกต้องตามกฎหมาย' },
    'Supply Chain Manager': { icon: '📊', bg: '#0EA5E9', img: 'assets/img/careers/data.jpg', cat: '📊 สายบริหารซัพพลายเชน & โลจิสติกส์', benefit: 'เชื่อมโยงห่วงโซ่อุปทานและลดต้นทุนการขนส่ง' },
    'System Admin': { icon: '🖥️', bg: '#6366F1', img: 'assets/img/careers/tech.jpg', cat: '🖥️ สายดูแลระบบ & เซิร์ฟเวอร์', benefit: 'รักษาเสถียรภาพและความปลอดภัยของระบบ' },

    // === ISFJ ===
    'พยาบาล / แพทย์': { icon: '🏥', bg: '#14B8A6', img: 'assets/img/careers/health.jpg', cat: '🏥 สายการแพทย์ & พยาบาล', benefit: 'ตรวจรักษาและดูแลผู้ป่วยด้วยความเอื้ออาทร' },
    'ครูอาจารย์': { icon: '🎓', bg: '#3B82F6', img: 'assets/img/careers/education.jpg', cat: '🎓 ครูอาจารย์ & ผู้สอน', benefit: 'บ่มเพาะปัญญาและเป็นที่พึ่งพาทางใจ' },
    'HR Officer': { icon: '🤝', bg: '#10B981', img: 'assets/img/careers/hr.jpg', cat: '🤝 สายงานบุคคล (HR)', benefit: 'สรรหาและดูแลพนักงานอย่างอบอุ่น' },
    'ผู้จัดการสำนักงาน': { icon: '🏢', bg: '#F59E0B', img: 'assets/img/careers/business.jpg', cat: '🏢 สายบริหารสำนักงาน & ธุรการ', benefit: 'จัดระเบียบองค์กรให้ลื่นไหลไร้สะดุด' },
    'นักโภชนาการ': { icon: '🌱', bg: '#10B981', img: 'assets/img/careers/social.jpg', cat: '🌱 สายโภชนาการ & สุขภาพอาหาร', benefit: 'วางแผนโภชนาการเพื่อสร้างสุขภาพที่ดี' },
    'นักกายภาพบำบัด': { icon: '🧠', bg: '#8B5CF6', img: 'assets/img/careers/psychology.jpg', cat: '🧠 สายกายภาพบำบัด', benefit: 'ฟื้นฟูกล้ามเนื้อและการเคลื่อนไหวให้กลับมาสมบูรณ์' },
    'Customer Success Lead': { icon: '📣', bg: '#F97316', img: 'assets/img/careers/marketing.jpg', cat: '📣 สายลูกค้าสัมพันธ์ & การดูแล', benefit: 'ช่วยเหลือลูกค้าให้บรรลุเป้าหมายสูงสุด' },

    // === ESTJ ===
    'Project Manager': { icon: '🔬', bg: '#06B6D4', img: 'assets/img/careers/research.jpg', cat: '🔬 ผู้จัดการโครงการ & การวิจัย', benefit: 'วางแผนไทม์ไลน์และบริหารทรัพยากรโครงการ' },
    'ผู้จัดการทั่วไป': { icon: '🏢', bg: '#F59E0B', img: 'assets/img/careers/business.jpg', cat: '🏢 สายบริหารทั่วไป', benefit: 'ดูแลภาพรวมและประสานงานทุกฝ่ายให้บรรลุเป้าหมาย' },
    'Sales Director': { icon: '📣', bg: '#F97316', img: 'assets/img/careers/marketing.jpg', cat: '📣 ผู้อำนวยการฝ่ายขาย', benefit: 'วางกลยุทธ์การขายและขยายฐานลูกค้า' },
    'ผู้บริหารโรงงาน': { icon: '💻', bg: '#6366F1', img: 'assets/img/careers/tech.jpg', cat: '💻 สายบริหารโรงงาน & การผลิตเทคโนโลยี', benefit: 'ดูแลสายการผลิตและมาตรฐานความปลอดภัย' },
    'ผู้ตรวจสอบภายใน': { icon: '⚖️', bg: '#64748B', img: 'assets/img/careers/legal.jpg', cat: '⚖️ สายตรวจสอบภายในองค์กร', benefit: 'ป้องกันความเสี่ยงและรักษามาตรฐานจริยธรรม' },
    'ผู้จัดการสาขา': { icon: '💰', bg: '#EAB308', img: 'assets/img/careers/finance.jpg', cat: '💰 ผู้จัดการสาขา & การเงิน', benefit: 'ดูแลยอดขายและการบริหารจัดการสาขา' },

    // === ESFJ ===
    'Event Manager': { icon: '🎨', bg: '#D946EF', img: 'assets/img/careers/creative.jpg', cat: '🎨 สายออกแบบงานอีเวนต์ & กิจกรรม', benefit: 'เนรมิตบรรยากาศงานให้ตื่นตาตื่นใจ' },
    'PR & Client Relations': { icon: '📣', bg: '#F97316', img: 'assets/img/careers/marketing.jpg', cat: '📣 สัมพันธ์ลูกค้า & ประชาสัมพันธ์', benefit: 'รักษาความสัมพันธ์และสร้างความไว้วางใจ' },
    'HR & Recruiter': { icon: '🤝', bg: '#10B981', img: 'assets/img/careers/hr.jpg', cat: '🤝 สรรหาบุคลากร & ทาบทามผู้มีความสามารถ', benefit: 'เฟ้นหาคนเก่งที่ตรงกับหัวใจขององค์กร' },
    'พยาบาล / ผู้ประสานงานการแพทย์': { icon: '🏥', bg: '#14B8A6', img: 'assets/img/careers/health.jpg', cat: '🏥 การแพทย์ & ประสานงานสุขภาพ', benefit: 'ดูแลผู้ป่วยและประสานแผนการรักษาอย่างมีประสิทธิภาพ' },
    'ผู้จัดการโรงแรม': { icon: '🏨', bg: '#F59E0B', img: 'assets/img/careers/business.jpg', cat: '🏨 สายบริหารงานบริการ & โรงแรม', benefit: 'ส่งมอบประสบการณ์และบริการระดับพรีเมียม' },

    // === ISTP ===
    'Mechanical Engineer': { icon: '🔬', bg: '#06B6D4', img: 'assets/img/careers/research.jpg', cat: '🔬 สายวิศวกรรมเครื่องกล & วิจัยกลไก', benefit: 'ออกแบบและพัฒนาระบบกลไกการทำงาน' },
    'Software Developer': { icon: '💻', bg: '#6366F1', img: 'assets/img/careers/tech.jpg', cat: '💻 สายพัฒนาซอฟต์แวร์', benefit: 'สร้างสรรค์แอปพลิเคชันและแก้ปัญหาด้วยโค้ด' },
    'นักบิน / ช่างเครื่องยนต์': { icon: '✈️', bg: '#64748B', img: 'assets/img/careers/pilot.jpg', cat: '✈️ สายการบิน & ความปลอดภัยอากาศยาน', benefit: 'เชี่ยวชาญการบังคับและดูแลระบบอากาศยาน' },
    'แพทย์ฉุกเฉิน / กู้ภัย': { icon: '🏥', bg: '#14B8A6', img: 'assets/img/careers/health.jpg', cat: '🏥 สายการแพทย์ฉุกเฉิน & กู้ชีพ', benefit: 'ตัดสินใจและช่วยชีวิตในสถานการณ์วิกฤต' },
    'ช่างภาพ / ช่างวิดีโอ': { icon: '🎬', bg: '#E11D48', img: 'assets/img/careers/media.jpg', cat: '🎬 สายภาพถ่าย & วิดีโอ', benefit: 'บันทึกช่วงเวลาสำคัญและเล่าเรื่องผ่านภาพ' },
    'นักกีฬาอาชีพ': { icon: '⚡', bg: '#3B82F6', img: 'assets/img/careers/athlete.jpg', cat: '⚡ สายกีฬาอาชีพ', benefit: 'ฝึกฝนร่างกายและจิตใจสู่ความเป็นเลิศ' },

    // === ISFP ===
    'Designer / Interior': { icon: '🎨', bg: '#D946EF', img: 'assets/img/careers/creative.jpg', cat: '🎨 สายออกแบบตกแต่งภายใน', benefit: 'สร้างสรรค์พื้นที่อยู่อาศัยที่สวยงามและใช้งานได้จริง' },
    'ช่างภาพ / สไตลิสต์': { icon: '🎬', bg: '#E11D48', img: 'assets/img/careers/media.jpg', cat: '🎬 สายถ่ายภาพแฟชั่น & สไตลิสต์', benefit: 'จัดวางองค์ประกอบและสร้างสไตล์ที่เป็นเอกลักษณ์' },
    'เชฟ / Pastry Chef': { icon: '🥐', bg: '#EC4899', img: 'assets/img/careers/writing.jpg', cat: '🥐 สายศิลปะการครัว & ขนมหวาน', benefit: 'รังสรรค์เมนูและสูตรขนมหวานแสนอร่อย' },
    'นักดนตรี / ศิลปิน': { icon: '🎤', bg: '#FB7185', img: 'assets/img/careers/stage.jpg', cat: '🎤 สายศิลปิน & นักดนตรีบนเวที', benefit: 'ถ่ายทอดความรู้สึกผ่านท่วงทำนองและเสียงเพลง' },
    'ครูสอนโยคะ / กายภาพบำบัด': { icon: '🧘', bg: '#8B5CF6', img: 'assets/img/careers/psychology.jpg', cat: '🧘 สายโยคะ & บำบัดร่างกาย', benefit: 'ฝึกสมาธิและปรับสมดุลร่างกายจิตใจ' },
    'สัตวแพทย์ / ดูแลสัตว์': { icon: '🏥', bg: '#14B8A6', img: 'assets/img/careers/health.jpg', cat: '🏥 สัตวแพทย์ & บริบาลสัตว์', benefit: 'ดูแลและรักษาอาการเจ็บป่วยของสัตว์เลี้ยง' },
    'ช่างคราฟต์': { icon: '🌱', bg: '#10B981', img: 'assets/img/careers/social.jpg', cat: '🌱 สายงานหัตถศิลป์รักษ์โลก', benefit: 'รังสรรค์ชิ้นงานประณีตด้วยมือและหัวใจ' },

    // === ESTP (User Explicit Request) ===
    'ผู้บริหารฝ่ายขาย': { icon: '📣', bg: '#F97316', img: 'assets/img/careers/marketing.jpg', cat: '📣 สายบริหารฝ่ายขาย & การตลาด', benefit: 'นำทีมขายทำยอดทะลุเป้าหมายองค์กร' },
    'ผู้ประกอบการ / Trader': { icon: '💰', bg: '#EAB308', img: 'assets/img/careers/finance.jpg', cat: '💰 สายการเงิน & เทรดเดอร์', benefit: 'จับจังหวะตลาดและสร้างผลกำไรจากการลงทุน' },
    'นักเจรจาต่อรอง / Broker': { icon: '⚖️', bg: '#64748B', img: 'assets/img/careers/legal.jpg', cat: '🤝 สายเจรจาต่อรอง & สัญญาธุรกิจ', benefit: 'ปิดดีลสำคัญและรักษาผลประโยชน์สูงสุด' },
    'Site Manager': { icon: '🔬', bg: '#06B6D4', img: 'assets/img/careers/research.jpg', cat: '🔬 สายคุมโครงการ & วิศวกรรมหน้างาน', benefit: 'ควบคุมหน้างานก่อสร้างให้เสร็จตรงเวลาและปลอดภัย' },
    'นักกีฬาอาชีพ / โค้ช': { icon: '⚡', bg: '#3B82F6', img: 'assets/img/careers/education.jpg', cat: '⚡ สายกีฬา & โค้ชฟิตเนส', benefit: 'เทรนร่างกายและวางแผนกลยุทธ์การแข่งขัน' },
    'นักวางแผนธุรกิจสายลุย': { icon: '🚀', bg: '#EA580C', img: 'assets/img/careers/creative.jpg', cat: '🚀 สายกลยุทธ์ & ขยายธุรกิจเชิงรุก', benefit: 'มองหาโอกาสใหม่และลุยเจาะตลาดอย่างคล่องตัว' },

    // === ESFP ===
    'นักแสดง / พิธีกร': { icon: '🎤', bg: '#FB7185', img: 'assets/img/careers/stage.jpg', cat: '🎤 สายการแสดง & พิธีกร', benefit: 'ตรึงสายตาผู้ชมและสร้างความสุขบนเวที' },
    'Creator / Influencer': { icon: '🎬', bg: '#E11D48', img: 'assets/img/careers/media.jpg', cat: '🎬 ครีเอเตอร์ & อินฟลูเอนเซอร์', benefit: 'สร้างความบันเทิงและมีอิทธิพลเชิงบวกต่อผู้ติดตาม' },
    'Event Manager': { icon: '🎨', bg: '#D946EF', img: 'assets/img/careers/creative.jpg', cat: '🎨 สายออกแบบงานอีเวนต์ & กิจกรรม', benefit: 'เนรมิตบรรยากาศงานให้ตื่นตาตื่นใจ' },
    'Sales & PR Specialist': { icon: '📣', bg: '#F97316', img: 'assets/img/careers/marketing.jpg', cat: '📣 ผู้เชี่ยวชาญการขาย & ประชาสัมพันธ์', benefit: 'สร้างสายสัมพันธ์และปิดการขายอย่างมืออาชีพ' },
    'Fitness Coach': { icon: '⚡', bg: '#3B82F6', img: 'assets/img/careers/education.jpg', cat: '⚡ โค้ชฟิตเนส & สุขภาพ', benefit: 'ออกแบบโปรแกรมออกกำลังกายเพื่อสุขภาพที่ดี' },
    'ผู้จัดการร้านอาหาร / ผับ': { icon: '🍽️', bg: '#F59E0B', img: 'assets/img/careers/business.jpg', cat: '🍽️ สายบริหารร้านอาหาร & บันเทิง', benefit: 'สร้างบรรยากาศและบริหารจัดการร้านอย่างมีสไตล์' }
  };

  function _getCareerVisual(name) {
    if (CAREER_CATALOG[name]) {
      return CAREER_CATALOG[name];
    }
    const n = (name || '').toLowerCase();
    
    // Dynamic Fallbacks
    if (n.includes('cyber') || n.includes('security') || n.includes('ไซเบอร์') || n.includes('ความปลอดภัยข้อมูล') || n.includes('firewall')) {
      return { icon: '🛡️', bg: '#059669', img: 'assets/img/careers/cybersecurity.jpg', cat: '🛡️ สายความปลอดภัยไซเบอร์ & ป้องกันข้อมูล', benefit: 'ป้องกันภัยคุกคามไซเบอร์และวางเกราะคุ้มกันระบบเครือข่าย' };
    }
    if (n.includes('data architect') || n.includes('สถาปัตยกรรมข้อมูล') || n.includes('data engineer') || n.includes('big data') || n.includes('คลังข้อมูล')) {
      return { icon: '🗄️', bg: '#0284C7', img: 'assets/img/careers/data_architect.jpg', cat: '🗄️ สายสถาปัตยกรรมข้อมูล & Big Data', benefit: 'วางรากฐานคลังข้อมูลขนาดใหญ่และการไหลของ Data ให้เสถียรและทรงพลัง' };
    }
    if (n.includes('การเงิน') || n.includes('finance') || n.includes('ลงทุน') || n.includes('invest') || n.includes('บัญชี') || n.includes('account') || n.includes('หุ้น') || n.includes('trader') || n.includes('auditor')) {
      return { icon: '💰', bg: '#EAB308', img: 'assets/img/careers/finance.jpg', cat: '💰 สายการเงิน & การลงทุน', benefit: 'บริหารความเสี่ยงและสร้างผลตอบแทนงอกเงย' };
    }
    if (n.includes('data') || n.includes('สถิติ') || n.includes('วิเคราะห์')) {
      return { icon: '📊', bg: '#0EA5E9', img: 'assets/img/careers/data.jpg', cat: '📊 สาย Data & สถิติ', benefit: 'แปลงข้อมูลซับซ้อนให้กลายเป็นกลยุทธ์' };
    }
    if (n.includes('product') || n.includes('วิจัย') || n.includes('research') || n.includes('วิทยาศาสตร์') || n.includes('นวัตกรรม')) {
      return { icon: '🔬', bg: '#06B6D4', img: 'assets/img/careers/research.jpg', cat: '🔬 สายงานวิจัย & นวัตกรรม', benefit: 'ค้นหาอินไซต์และวิเคราะห์ข้อมูลเชิงลึก' };
    }
    if (n.includes('สตาร์ตอัป') || n.includes('startup') || n.includes('founder') || n.includes('creative') || n.includes('ออกแบบ') || n.includes('design')) {
      return { icon: '🚀', bg: '#EA580C', img: 'assets/img/careers/creative.jpg', cat: '🚀 สายสตาร์ตอัป & นวัตกรรมสร้างสรรค์', benefit: 'ริเริ่มธุรกิจใหม่และสร้างคุณค่าที่ไม่เคยมีมาก่อน' };
    }
    if (n.includes('architect') || n.includes('สถาปัตย์') || n.includes('วิศวกรโครงสร้าง') || n.includes('site') || n.includes('เครื่องยนต์')) {
      return { icon: '📐', bg: '#0284C7', img: 'assets/img/careers/architect.jpg', cat: '📐 สายสถาปัตย์ & วิศวกรรมโครงสร้าง', benefit: 'วางรากฐานและควบคุมงานโครงสร้างอย่างแม่นยำ' };
    }
    if (n.includes('soft') || n.includes('develop') || n.includes('program') || n.includes('โค้ด') || n.includes('engineer') || n.includes('tech') || n.includes('system')) {
      return { icon: '💻', bg: '#6366F1', img: 'assets/img/careers/tech.jpg', cat: '💻 สายซอฟต์แวร์ & เทคโนโลยี', benefit: 'ออกแบบระบบและแก้วิกฤตด้วยเทคโนโลยี' };
    }
    if (n.includes('จิตวิทยา') || n.includes('psycholog') || n.includes('บำบัด') || n.includes('therap') || n.includes('โยคะ')) {
      return { icon: '🧠', bg: '#8B5CF6', img: 'assets/img/careers/psychology.jpg', cat: '🧠 สายจิตวิทยา & ที่ปรึกษา', benefit: 'ใช้ความเข้าใจมนุษย์และรับฟังอย่างลึกซึ้ง' };
    }
    if (n.includes('เขียน') || n.includes('writer') || n.includes('คอนเทนต์') || n.includes('บรรณาธิการ') || n.includes('เชฟ')) {
      return { icon: '✍️', bg: '#EC4899', img: 'assets/img/careers/writing.jpg', cat: '✍️ สายงานเขียน & สร้างสรรค์', benefit: 'ถ่ายทอดเรื่องราวและสื่อสารทรงพลัง' };
    }
    if (n.includes('hr') || n.includes('บุคคล') || n.includes('people') || n.includes('community') || n.includes('recruiter')) {
      return { icon: '🤝', bg: '#10B981', img: 'assets/img/careers/hr.jpg', cat: '🤝 สายพัฒนาคน & สัมพันธ์องค์กร', benefit: 'ดึงศักยภาพคนและสร้างวัฒนธรรมที่ดี' };
    }
    if (n.includes('อาจารย์') || n.includes('ครู') || n.includes('โค้ช') || n.includes('coach') || n.includes('กีฬา') || n.includes('แปล')) {
      return { icon: '🎓', bg: '#3B82F6', img: 'assets/img/careers/education.jpg', cat: '🎓 สายการศึกษา & โค้ชชิ่ง', benefit: 'สร้างแรงบันดาลใจและพัฒนาศักยภาพผู้คน' };
    }
    if (n.includes('สังคม') || n.includes('ngo') || n.includes('เพื่อสังคม') || n.includes('สัตวแพทย์')) {
      return { icon: '🌱', bg: '#10B981', img: 'assets/img/careers/social.jpg', cat: '🌱 สายผู้นำเพื่อสังคม & ธรรมชาติ', benefit: 'ขับเคลื่อนการเปลี่ยนแปลงเพื่อสังคมที่ดีขึ้น' };
    }
    if (n.includes('กลยุทธ์') || n.includes('strateg') || n.includes('ลุย') || n.includes('ขยายธุรกิจ') || n.includes('operation')) {
      return { icon: '🚀', bg: '#EA580C', img: 'assets/img/careers/strategy.jpg', cat: '🚀 สายกลยุทธ์ & ปฏิบัติการเชิงรุก', benefit: 'มองทะลุอนาคตและวางแผนระยะยาวเปลี่ยนเกม' };
    }
    if (n.includes('การตลาด') || n.includes('market') || n.includes('แบรนด์') || n.includes('pr') || n.includes('ขาย') || n.includes('sales')) {
      return { icon: '📣', bg: '#F97316', img: 'assets/img/careers/marketing.jpg', cat: '📣 สายการตลาด & แบรนดิ้ง', benefit: 'สร้างสรรค์แคมเปญและสร้างคุณค่าแบรนด์ที่โดดเด่น' };
    }
    if (n.includes('แพทย์') || n.includes('หมอ') || n.includes('พยาบาล') || n.includes('สุขภาพ') || n.includes('health') || n.includes('คลินิก')) {
      return { icon: '🏥', bg: '#14B8A6', img: 'assets/img/careers/health.jpg', cat: '🏥 สายสุขภาพ & การแพทย์', benefit: 'รักษา ฟื้นฟู และดูแลสุขภาพชีวิตด้วยความเชี่ยวชาญ' };
    }
    if (n.includes('ทนาย') || n.includes('กฎหมาย') || n.includes('law') || n.includes('legal') || n.includes('ผู้พิพากษา') || n.includes('ตรวจสอบ') || n.includes('compliance') || n.includes('broker') || n.includes('เจรจาต่อรอง')) {
      return { icon: '⚖️', bg: '#64748B', img: 'assets/img/careers/legal.jpg', cat: '⚖️ สายกฎหมาย & นโยบาย', benefit: 'ปกป้องความถูกต้องและรักษาระเบียบวินัย' };
    }
    if (n.includes('แสดง') || n.includes('พิธีกร') || n.includes('mc') || n.includes('เพลง') || n.includes('ดนตรี') || n.includes('เวที') || n.includes('กิจกรรม')) {
      return { icon: '🎤', bg: '#FB7185', img: 'assets/img/careers/stage.jpg', cat: '🎤 สายเวที & กิจกรรม', benefit: 'สร้างบรรยากาศและดึงดูดผู้คนให้มีส่วนร่วม' };
    }
    if (n.includes('สื่อ') || n.includes('media') || n.includes('วิดีโอ') || n.includes('ช่างภาพ') || n.includes('influencer') || n.includes('producer')) {
      return { icon: '🎬', bg: '#E11D48', img: 'assets/img/careers/media.jpg', cat: '🎬 สายสื่อ & บันเทิงสร้างสรรค์', benefit: 'ถ่ายทอดอารมณ์และสร้างสรรค์ความบันเทิงแก่ผู้คน' };
    }
    return { icon: '🏢', bg: '#F59E0B', img: 'assets/img/careers/business.jpg', cat: '🏢 สายบริหาร & องค์กร', benefit: 'บทบาทที่ใช้จุดแข็งเฉพาะตัวอย่างเต็มที่' };
  }

  function _openModal(code) {
    if (!code) return;
    const parts = code.split('-');
    const coreCode = parts[0];
    let variantKey = parts[1] || 'AH';
    const ct = window.PRISM_DATA.CORE_TYPES[coreCode];
    if (!ct) return;
    const currentVariant = window.PRISM_DATA.VARIANTS[variantKey] || window.PRISM_DATA.VARIANTS['AH'];

    state.selectedType = { code: coreCode, variantKey, fullCode: `${coreCode}-${variantKey}`, ct };
    state.modalOpen = true;

    const modal = $('#type-modal');
    const overlay = $('#modal-overlay');
    if (!modal || !overlay) return;

    modalJustOpened = true;
    setTimeout(() => { modalJustOpened = false; }, 250);

    const lang = state.lang;
    const imgPath = `assets/img/characters/${coreCode}.webp`;
    const spectrum = ct.spectrum;
    const shades64 = window.PRISM_DATA.SHADES_64 || {};
    const fullCode = `${coreCode}-${variantKey}`;
    const currentShade = shades64[fullCode] || {
      title: currentVariant.name,
      shadeLabel: currentVariant.name,
      tagline: currentVariant.tagline,
      desc: currentVariant.desc,
      strengths: ct.strengths,
      growth: ct.growth
    };

    const cleanMotto = (ct.motto[lang] || '').replace(/^["“'”]+|["“'”]+$/g, '');
    const cleanTagline = (currentShade.tagline[lang] || ct.tagline[lang] || '').replace(/^["“'”]+|["“'”]+$/g, '');
    const sharePerShade = (ct.share / 4).toFixed(2);

    modal.setAttribute('data-spectrum', spectrum);
    modal.innerHTML = `
      <!-- Left Visual Column (No Scrolling needed) -->
      <div class="modal__visual">
        <div>
          <div class="modal__code-badge" id="modal-display-code">${coreCode}-${variantKey}</div>
          <div class="row" style="justify-content:center;gap:.4rem;margin-bottom:.4rem">
            <span class="badge" style="background:var(--surface-2);border-color:var(--line)">ประชากร ${sharePerShade}% (แม่แบบ ${ct.share}%)</span>
          </div>
        </div>

        <div class="modal__art-frame">
          <img src="${imgPath}" alt="${ct.name[lang]}" />
        </div>

        <div class="modal__visual-footer">
          <div class="modal__motto">“${cleanMotto}”</div>
        </div>
      </div>

      <!-- Right Content Column (User-Centric & Actionable) -->
      <div class="modal__main">
        <div class="modal__head">
          <div class="modal__title-wrap" id="modal-title-wrap">
            <h2>${currentShade.title[lang]} <small style="font-size:.95rem;color:var(--text-3);font-weight:600">(${ct.name[lang]})</small></h2>
            <div class="modal__tagline-text">“${cleanTagline}”</div>
          </div>
          <button class="modal__close" id="modal-close" aria-label="${I18N.t('modal.close')}">✕</button>
        </div>

        <!-- 4 Sub-Variants Selector (64 Shades Interactive Switcher) -->
        <div class="modal__variant-selector">
          <div class="variant-selector-title">💎 เลือก 4 เฉดย่อยของ ${coreCode}:</div>
          <div class="variant-chips-bar">
            ${['AH', 'AC', 'OH', 'OC'].map(vk => {
              const v = window.PRISM_DATA.VARIANTS[vk];
              const sProfile = shades64[`${coreCode}-${vk}`] || { title: v.name };
              const isActive = vk === variantKey;
              return `
                <button class="variant-chip ${isActive ? 'is-active' : ''}" data-variant="${vk}" type="button">
                  <span class="variant-chip__code">-${vk}</span>
                  <span class="variant-chip__label">${sProfile.title[lang]}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Active Sub-Variant Insight Card -->
        <div class="variant-insight-card" id="modal-variant-insight">
          <div class="variant-insight-card__badge">${coreCode}-${variantKey} • ${currentShade.shadeLabel[lang]}</div>
          <div style="font-size:.84rem;line-height:1.5">
            <b>${currentShade.title[lang]}:</b> “${currentShade.tagline[lang]}” — <span style="color:var(--text-2)">${currentShade.desc[lang]}</span>
          </div>
        </div>

        <!-- 6 Interactive Tabs -->
        <div class="modal__tabs">
          <div class="tabs" role="tablist">
            <button role="tab" aria-selected="true" data-tab="modal-strengths">🌟 จุดเด่น</button>
            <button role="tab" aria-selected="false" data-tab="modal-growth">⚠️ จุดระวัง</button>
            <button role="tab" aria-selected="false" data-tab="modal-careers">💼 อาชีพ</button>
            <button role="tab" aria-selected="false" data-tab="modal-work">⚡ การทำงาน</button>
            <button role="tab" aria-selected="false" data-tab="modal-love">💖 ความรัก</button>
            <button role="tab" aria-selected="false" data-tab="modal-stress">🔋 ฮีลใจ</button>
          </div>

          <div class="modal__tab-content">
            <div class="tabpanel" id="modal-tab-modal-strengths">
              <ul class="tick-list" id="modal-strengths-list">
                ${(currentShade.strengths && currentShade.strengths[lang] ? currentShade.strengths[lang] : ct.strengths[lang].slice(0, 4)).map(s => `<li>${s}</li>`).join('')}
              </ul>
            </div>
            <div class="tabpanel" id="modal-tab-modal-growth" hidden>
              <ul class="tick-list tick-list--warn" id="modal-growth-list">
                ${currentShade.growth && currentShade.growth[lang] ? `<li><b>เฉพาะเฉดนี้:</b> ${currentShade.growth[lang]}</li>` : ''}
                ${ct.growth[lang].slice(0, 3).map(g => `<li>${g}</li>`).join('')}
              </ul>
            </div>
            <div class="tabpanel" id="modal-tab-modal-careers" hidden>
              <div class="pill-list pill-list--careers">
                ${ct.careers[lang].map(c => {
                  const vis = _getCareerVisual(c);
                  return `
                    <div class="career-pill" style="--c-accent: ${vis.bg}">
                      <span class="career-pill__icon">${vis.icon}</span>
                      <span class="career-pill__name">${c}</span>
                      <div class="career-hover-popup" role="tooltip">
                        <div class="career-hover-popup__img-wrap">
                          <img src="${vis.img}" alt="${c}" loading="lazy" />
                          <span class="career-hover-popup__tag">${vis.cat}</span>
                        </div>
                        <div class="career-hover-popup__info">
                          <div class="career-hover-popup__title">${c}</div>
                          <div class="career-hover-popup__desc">${vis.benefit}</div>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            <div class="tabpanel" id="modal-tab-modal-work" hidden>
              <p style="font-size:.92rem;color:var(--text-2);line-height:1.6">${ct.work[lang]}</p>
            </div>
            <div class="tabpanel" id="modal-tab-modal-love" hidden>
              <p style="font-size:.92rem;color:var(--text-2);line-height:1.6">${ct.love[lang]}</p>
            </div>
            <div class="tabpanel" id="modal-tab-modal-stress" hidden>
              <p style="font-size:.92rem;color:var(--text-2);line-height:1.6">${ct.stress[lang]}</p>
            </div>
          </div>
        </div>

        <!-- Compatibility Matches -->
        <div>
          <div style="font-size:.82rem;font-weight:700;color:var(--text-3);margin-bottom:.4rem">
            💖 เข้ากันได้ดีกับ:
          </div>
          <div class="row" style="gap:.5rem;flex-wrap:wrap">
            ${(ct.matches || []).map(m => {
              const mc = window.PRISM_DATA.CORE_TYPES[m];
              if (!mc) return '';
              return `
                <button class="chip match-chip" data-match="${m}" style="padding:.28rem .7rem;font-size:.82rem">
                  <img src="assets/img/characters/${m}.thumb.webp" style="width:20px;height:20px;border-radius:50%" alt="" />
                  <span><b>${m}</b> ${mc.name[lang]}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    /* Bind Variant Chips */
    modal.querySelectorAll('.variant-chip').forEach(vChip => {
      vChip.addEventListener('click', (e) => {
        e.stopPropagation();
        const vk = vChip.dataset.variant;
        if (!vk) return;
        modal.querySelectorAll('.variant-chip').forEach(c => c.classList.remove('is-active'));
        vChip.classList.add('is-active');

        const targetFullCode = `${coreCode}-${vk}`;
        const sProfile = shades64[targetFullCode] || {
          title: currentVariant.name,
          shadeLabel: currentVariant.name,
          tagline: currentVariant.tagline,
          desc: currentVariant.desc
        };

        const codeBadge = $('#modal-display-code', modal);
        if (codeBadge) codeBadge.textContent = targetFullCode;

        const titleWrap = $('#modal-title-wrap', modal);
        if (titleWrap) {
          titleWrap.innerHTML = `
            <h2>${sProfile.title[lang]} <small style="font-size:.95rem;color:var(--text-3);font-weight:600">(${ct.name[lang]})</small></h2>
            <div class="modal__tagline-text">“${(sProfile.tagline[lang] || '').replace(/^["“'”]+|["“'”]+$/g, '')}”</div>
          `;
        }

        const insightCard = $('#modal-variant-insight', modal);
        if (insightCard) {
          insightCard.innerHTML = `
            <div class="variant-insight-card__badge">${targetFullCode} • ${sProfile.shadeLabel[lang]}</div>
            <div style="font-size:.84rem;line-height:1.5">
              <b>${sProfile.title[lang]}:</b> “${sProfile.tagline[lang]}” — <span style="color:var(--text-2)">${sProfile.desc[lang]}</span>
            </div>
          `;
        }

        const strList = $('#modal-strengths-list', modal);
        if (strList && sProfile.strengths && sProfile.strengths[lang]) {
          strList.innerHTML = sProfile.strengths[lang].map(s => `<li>${s}</li>`).join('');
        }

        const growthList = $('#modal-growth-list', modal);
        if (growthList) {
          growthList.innerHTML = `
            ${sProfile.growth && sProfile.growth[lang] ? `<li><b>เฉพาะเฉดนี้:</b> ${sProfile.growth[lang]}</li>` : ''}
            ${ct.growth[lang].slice(0, 3).map(g => `<li>${g}</li>`).join('')}
          `;
        }

        state.selectedType.variantKey = vk;
        state.selectedType.fullCode = targetFullCode;
      });
    });

    /* Bind Close button */
    const closeBtn = $('#modal-close', modal);
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        _closeModal();
      });
    }

    /* Bind Tabs */
    modal.querySelectorAll('.tabs [role="tab"]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        modal.querySelectorAll('.tabs [role="tab"]').forEach(t => t.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');
        modal.querySelectorAll('.tabpanel').forEach(p => p.hidden = true);
        const panel = modal.querySelector('#modal-tab-' + tab.dataset.tab) || modal.querySelector('#' + tab.dataset.tab) || modal.querySelector('#tab-' + tab.dataset.tab);
        if (panel) panel.hidden = false;
      });
    });

    /* Bind Match chips */
    modal.querySelectorAll('.match-chip').forEach(mc => {
      mc.addEventListener('click', (e) => {
        e.stopPropagation();
        _openModal(mc.dataset.match);
      });
    });

    overlay.classList.remove('hidden');
    overlay.classList.add('is-open');
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function _closeModal() {
    const modal = $('#type-modal');
    const overlay = $('#modal-overlay');
    if (!modal || !overlay) return;
    modal.classList.remove('is-open');
    overlay.classList.remove('is-open');
    setTimeout(() => {
      overlay.classList.add('hidden');
      modal.innerHTML = '';
    }, 350);
    document.body.style.overflow = '';
    state.modalOpen = false;
  }

  /* ========================================================
     ASSESSMENT / TEST FLOW ENGINE (Quick 18 & Full 36 Modes)
     ======================================================== */

  function _getQuestions() {
    return I18N.getQuestions(state.testMode);
  }

  /* Persistence for In-Progress Assessment */
  function _saveInProgressTest() {
    try {
      if (state.testCompleted) return;
      const data = {
        mode: state.testMode,
        answers: state.testAnswers,
        idx: state.testCurrentIdx,
        timestamp: Date.now()
      };
      localStorage.setItem('prism64-test-progress', JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save test progress', e);
    }
  }

  function _loadInProgressTest() {
    try {
      const saved = localStorage.getItem('prism64-test-progress');
      if (saved) {
        const data = JSON.parse(saved);
        if (data && data.answers && Object.keys(data.answers).length > 0) {
          state.testMode = data.mode || state.testMode;
          state.testAnswers = data.answers || {};
          state.testCurrentIdx = typeof data.idx === 'number' ? data.idx : 0;
          return true;
        }
      }
    } catch (e) {
      console.warn('Could not load test progress', e);
    }
    return false;
  }

  function _clearInProgressTest() {
    try {
      localStorage.removeItem('prism64-test-progress');
      state.testAnswers = {};
      state.testCurrentIdx = 0;
    } catch (e) {
      console.warn('Could not clear test progress', e);
    }
  }

  function _renderResumeNotice() {
    const noticeEl = $('#test-resume-notice');
    if (!noticeEl) return;

    const questions = _getQuestions();
    const answeredCount = Object.keys(state.testAnswers || {}).length;

    if (answeredCount > 0 && answeredCount < questions.length) {
      const title = I18N.t('test.resume_title');
      const desc = (I18N.t('test.resume_desc') || '')
        .replace('{count}', answeredCount)
        .replace('{total}', questions.length)
        .replace('{current}', state.testCurrentIdx + 1);
      const resetText = I18N.t('test.reset_btn');

      noticeEl.hidden = false;
      noticeEl.innerHTML = `
        <div class="test-resume-notice__left">
          <span class="test-resume-notice__icon">⚡</span>
          <div class="test-resume-notice__text">
            <span class="test-resume-notice__title">${title}</span>
            <span class="test-resume-notice__sub">${desc}</span>
          </div>
        </div>
        <button type="button" class="test-resume-notice__reset-btn" id="btn-test-reset" title="${resetText}">
          ${resetText}
        </button>
      `;

      const resetBtn = $('#btn-test-reset', noticeEl);
      if (resetBtn) {
        resetBtn.onclick = () => {
          if (confirm(I18N.t('test.reset_confirm'))) {
            _clearInProgressTest();
            noticeEl.hidden = true;
            _renderTestProgress();
            _renderTestQuestion();
          }
        };
      }
    } else {
      noticeEl.hidden = true;
      noticeEl.innerHTML = '';
    }
  }

  function _initTest() {
    _loadInProgressTest();
    state.testCompleted = false;
    _renderResumeNotice();
    _renderTestModeTabs();
    _renderTestProgress();
    _renderTestQuestion();
    _bindTestControls();
  }

    function _renderTestModeTabs() {
    const btnQuick = $('#mode-btn-quick');
    const btnFull = $('#mode-btn-full');
    if (!btnQuick || !btnFull) return;

    const isQuick = state.testMode === 'quick';
    btnQuick.classList.toggle('is-active', isQuick);
    btnFull.classList.toggle('is-active', !isQuick);

    btnQuick.onclick = () => {
      if (state.testMode !== 'quick') {
        state.testMode = 'quick';
        localStorage.setItem('prism64-test-mode', 'quick');
        _clearInProgressTest();
        _renderResumeNotice();
        _renderTestModeTabs();
        _renderTestProgress();
        _renderTestQuestion();
      }
    };

    btnFull.onclick = () => {
      if (state.testMode !== 'full') {
        state.testMode = 'full';
        localStorage.setItem('prism64-test-mode', 'full');
        _clearInProgressTest();
        _renderResumeNotice();
        _renderTestModeTabs();
        _renderTestProgress();
        _renderTestQuestion();
      }
    };
  }

  function _renderTestProgress() {
    const questions = _getQuestions();
    const total = questions.length;
    const answeredCount = Object.keys(state.testAnswers).length;
    const pct = Math.round((answeredCount / total) * 100);

    const currentEl = $('#test-q-current');
    const totalEl = $('#test-q-total');
    const pctEl = $('#test-progress-pct');
    const fillEl = $('#test-progress-fill');

    if (currentEl) currentEl.textContent = state.testCurrentIdx + 1;
    if (totalEl) totalEl.textContent = total;
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (fillEl) fillEl.style.width = `${pct}%`;

    const prevBtn = $('#test-btn-prev');
    const nextBtn = $('#test-btn-next');
    const nextText = $('#test-btn-next-text');

    if (prevBtn) prevBtn.disabled = state.testCurrentIdx === 0;

    const isLast = state.testCurrentIdx === total - 1;
    const allAnswered = answeredCount === total;

    if (nextText) {
      nextText.textContent = isLast || allAnswered ? I18N.t('test.finish') : I18N.t('test.next');
    }
  }

  function _renderTestQuestion() {
    const container = $('#test-card-container');
    if (!container) return;

    const questions = _getQuestions();
    const q = questions[state.testCurrentIdx];
    if (!q) return;

    const lang = state.lang;
    const currentVal = state.testAnswers[q.id];

    const dimMeta = window.PRISM_DATA.DIMENSIONS.find(d => d.key === q.dimension) || { spectrum: 'violet', label: { th: 'มิติ', en: 'Dimension' } };

    /* 7 Likert weights: -3, -2, -1, 0, 1, 2, 3 */
    const likertWeights = [-3, -2, -1, 0, 1, 2, 3];
    const likertKeys = ['likert.sd', 'likert.d', 'likert.sld', 'likert.n', 'likert.sla', 'likert.a', 'likert.sa'];

    container.innerHTML = `
      <div class="q-card card--edge" data-spectrum="${dimMeta.spectrum}">
        <div class="q-card__dim">
          <i></i>
          <span>${dimMeta.label[lang]}</span>
        </div>
        <div class="q-card__text">${q.text[lang]}</div>

        <div class="likert" role="radiogroup" aria-label="${q.text[lang]}">
          <div class="likert__end">${I18N.t('likert.sd')}</div>
          <div class="likert__opts">
            ${likertWeights.map((w, idx) => {
              const isChecked = currentVal === w;
              return `
                <button class="likert__btn ${isChecked ? 'is-selected' : ''}" data-val="${w}" role="radio"
                        aria-checked="${isChecked ? 'true' : 'false'}"
                        aria-label="${I18N.t(likertKeys[idx])}" tabindex="0">
                  <div class="likert__circle">
                    ${isChecked ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                  </div>
                  <span class="likert__label">${I18N.t(likertKeys[idx])}</span>
                </button>
              `;
            }).join('')}
          </div>
          <div class="likert__end likert__end--r">${I18N.t('likert.sa')}</div>
        </div>
      </div>
    `;

    /* Bind Likert options */
    container.querySelectorAll('.likert__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        state.testAnswers[q.id] = val;
        _saveInProgressTest();
        _renderResumeNotice();

        container.querySelectorAll('.likert__btn').forEach(b => {
          b.classList.remove('is-selected');
          b.setAttribute('aria-checked', 'false');
          b.querySelector('.likert__circle').innerHTML = '';
        });
        btn.classList.add('is-selected');
        btn.setAttribute('aria-checked', 'true');
        btn.querySelector('.likert__circle').innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>';

        _renderTestProgress();

        /* Auto-advance smoothly */
        setTimeout(() => {
          const qs = _getQuestions();
          if (state.testCurrentIdx < qs.length - 1) {
            state.testCurrentIdx++;
            _saveInProgressTest();
            _renderResumeNotice();
            _renderTestProgress();
            _renderTestQuestion();
          } else if (Object.keys(state.testAnswers).length === qs.length) {
            _calculateAndShowResult();
          }
        }, 260);
      });
    });

    _renderTestProgress();
  }

  function _bindTestControls() {
    const prevBtn = $('#test-btn-prev');
    const nextBtn = $('#test-btn-next');

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (state.testCurrentIdx > 0) {
          state.testCurrentIdx--;
          _saveInProgressTest();
          _renderResumeNotice();
          _renderTestProgress();
          _renderTestQuestion();
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        const qs = _getQuestions();
        const total = qs.length;
        const currentQ = qs[state.testCurrentIdx];

        /* If current question unanswered, prompt selection */
        if (state.testAnswers[currentQ.id] === undefined) {
          state.testAnswers[currentQ.id] = 0; // Default neutral if user skips ahead
        }

        if (state.testCurrentIdx < total - 1) {
          state.testCurrentIdx++;
          _saveInProgressTest();
          _renderResumeNotice();
          _renderTestProgress();
          _renderTestQuestion();
        } else {
          _calculateAndShowResult();
        }
      };
    }
  }

  /* -------------------------------------------------------- Scoring Engine */
  function _calculateAndShowResult() {
    state.testCompleted = true;
    _clearInProgressTest();
    _renderResumeNotice();

    const questions = _getQuestions();
    const answers = state.testAnswers;

    /* Show calculating screen */
    const container = $('#test-card-container');
    if (container) {
      container.innerHTML = `
        <div class="test-done">
          <div class="spinner"></div>
          <h2 class="display-sm grad-text">${I18N.t('test.calculating')}</h2>
          <p class="muted mt-2">${I18N.t('test.calculating_sub')}</p>
        </div>
      `;
    }

    /* Tally dimensions dynamically */
    const rawScores = { energy: 0, input: 0, deciding: 0, structure: 0, identity: 0, relating: 0 };
    const maxWeights = { energy: 0, input: 0, deciding: 0, structure: 0, identity: 0, relating: 0 };

    questions.forEach(q => {
      const ans = answers[q.id] !== undefined ? answers[q.id] : 0;
      rawScores[q.dimension] += ans * q.weight;
      maxWeights[q.dimension] += 3;
    });

    /* Normalize to percentages (0 - 100%) for each pole */
    const calcPct = (raw, max) => {
      if (!max) max = 18;
      return Math.min(100, Math.max(0, Math.round(((raw + max) / (max * 2)) * 100)));
    };

    const scores = {
      energy: { pole1: 'E', pole2: 'I', score: calcPct(rawScores.energy, maxWeights.energy) }, // >=50 => E, <50 => I
      input: { pole1: 'S', pole2: 'N', score: calcPct(rawScores.input, maxWeights.input) },   // >=50 => S, <50 => N
      deciding: { pole1: 'T', pole2: 'F', score: calcPct(rawScores.deciding, maxWeights.deciding) }, // >=50 => T, <50 => F
      structure: { pole1: 'J', pole2: 'P', score: calcPct(rawScores.structure, maxWeights.structure) }, // >=50 => J, <50 => P
      identity: { pole1: 'A', pole2: 'O', score: calcPct(rawScores.identity, maxWeights.identity) }, // >=50 => A, <50 => O
      relating: { pole1: 'H', pole2: 'C', score: calcPct(rawScores.relating, maxWeights.relating) }, // >=50 => H, <50 => C
    };

    const l1 = scores.energy.score >= 50 ? 'E' : 'I';
    const l2 = scores.input.score >= 50 ? 'S' : 'N';
    const l3 = scores.deciding.score >= 50 ? 'T' : 'F';
    const l4 = scores.structure.score >= 50 ? 'J' : 'P';
    const l5 = scores.identity.score >= 50 ? 'A' : 'O';
    const l6 = scores.relating.score >= 50 ? 'H' : 'C';

    const coreCode = `${l1}${l2}${l3}${l4}`;
    const variantKey = `${l5}${l6}`;
    const fullCode = `${coreCode}-${variantKey}`;

    state.lastResult = { fullCode, coreCode, variantKey, scores, testMode: state.testMode };
    localStorage.setItem('prism64-last-result', JSON.stringify(state.lastResult));

    /* Send comprehensive telemetry to server & Geo database */
    _sendAssessmentTelemetry(fullCode, coreCode, variantKey, scores, state.testMode);

    setTimeout(() => {
      window.location.hash = `result=${fullCode}`;
    }, 700);
  }

    async function _sendAssessmentTelemetry(fullCode, coreCode, variantKey, scores, testMode) {
    try {
      const shade = window.PRISM_DATA?.SHADES_64?.[fullCode];
      const title = shade?.title?.th || coreCode;

      // Extract client device details
      const ua = navigator.userAgent;
      let os = "Windows";
      if (/Macintosh|Mac OS X/.test(ua)) os = "macOS";
      else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
      else if (/Android/.test(ua)) os = "Android";
      else if (/Linux/.test(ua)) os = "Linux";

      let browser = "Chrome";
      if (/Firefox/.test(ua)) browser = "Firefox";
      else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
      else if (/Edg/.test(ua)) browser = "Edge";

      const deviceType = /Mobile|Android|iPhone|iPad/i.test(ua) ? "Mobile" : "Desktop";
      const screenRes = `${window.screen.width}x${window.screen.height}`;

      // Fetch real public IP & Location silently in the background (No browser popups)
      let realGeo = null;
      try {
        const ipRes = await fetch('https://ipwho.is/?fields=ip,city,region,country,country_code,latitude,longitude,connection.isp,timezone.id', { cache: 'no-store' });
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData && ipData.success !== false && ipData.latitude) {
            realGeo = {
              ip: ipData.ip,
              city: ipData.city || 'Bangkok',
              region: ipData.region || 'Bangkok',
              country: ipData.country || 'Thailand',
              countryCode: ipData.country_code || 'TH',
              lat: ipData.latitude,
              lng: ipData.longitude,
              org: ipData.connection?.isp || ipData.connection?.org || 'ISP',
              source: 'IP_SILENT'
            };
          }
        }
      } catch (e) {}

      if (!realGeo) {
        try {
          const ipRes = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            if (ipData && ipData.latitude) {
              realGeo = {
                ip: ipData.ip,
                city: ipData.city || 'Bangkok',
                region: ipData.region || 'Bangkok',
                country: ipData.country_name || 'Thailand',
                countryCode: ipData.country_code || 'TH',
                lat: ipData.latitude,
                lng: ipData.longitude,
                org: ipData.org || 'ISP',
                source: 'IP_SILENT'
              };
            }
          }
        } catch (e) {}
      }

      const telemetryPayload = {
        fullCode,
        coreCode,
        variantKey,
        title,
        scores,
        testMode,
        geo: realGeo || {
          city: "Bangkok",
          region: "Bangkok",
          country: "Thailand",
          countryCode: "TH",
          lat: 13.7563,
          lng: 100.5018,
          org: "Direct Connection",
          source: 'IP_SILENT'
        },
        device: {
          os,
          browser,
          screen: screenRes,
          type: deviceType,
          language: navigator.language,
          colorDepth: window.screen.colorDepth,
          pixelRatio: window.devicePixelRatio || 1,
          hardwareConcurrency: navigator.hardwareConcurrency || 4
        }
      };

      await fetch('/api/telemetry/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telemetryPayload)
      });
    } catch (err) {
      console.warn('Telemetry sync error:', err);
    }
  }

  function _loadSavedResult() {
    try {
      const saved = localStorage.getItem('prism64-last-result');
      if (saved) {
        state.lastResult = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse saved result', e);
    }
  }

  /* ========================================================
     RESULT PAGE RENDERER
     ======================================================== */

  function _renderResultView(fullCode, scores = null, isDirectLink = false) {
    const container = $('#result-container');
    if (!container) return;

    const parts = (fullCode || 'INTJ-AH').split('-');
    const coreCode = parts[0];
    const variantKey = parts[1] || 'AH';

    const ct = window.PRISM_DATA.CORE_TYPES[coreCode] || window.PRISM_DATA.CORE_TYPES['INTJ'];
    const variant = window.PRISM_DATA.VARIANTS[variantKey] || window.PRISM_DATA.VARIANTS['AH'];
    const lang = state.lang;
    const imgPath = `assets/img/characters/${coreCode}.webp`;
    const spectrum = ct.spectrum;

    /* Generate default normalized scores if opened directly via URL */
    if (!scores) {
      scores = {
        energy: { pole1: 'E', pole2: 'I', score: coreCode[0] === 'E' ? 74 : 26 },
        input: { pole1: 'S', pole2: 'N', score: coreCode[1] === 'S' ? 70 : 30 },
        deciding: { pole1: 'T', pole2: 'F', score: coreCode[2] === 'T' ? 78 : 22 },
        structure: { pole1: 'J', pole2: 'P', score: coreCode[3] === 'J' ? 82 : 18 },
        identity: { pole1: 'A', pole2: 'O', score: variantKey[0] === 'A' ? 76 : 24 },
        relating: { pole1: 'H', pole2: 'C', score: variantKey[1] === 'H' ? 72 : 28 },
      };
    }

    container.innerHTML = `
      <!-- Verdict Banner -->
      <div class="verdict" data-spectrum="${spectrum}">
        <div class="verdict__inner">
          <div>
            <div class="verdict__code">
              ${coreCode}<sup>${variantKey}</sup>
            </div>
            <div class="verdict__name">${ct.name[lang]} — ${variant.name[lang]}</div>
            <div class="verdict__tagline">${ct.tagline[lang]}</div>
            <div class="verdict__meta">
              <span><strong>${I18N.t('modal.population')}:</strong> ${ct.share}%</span>
              <span><strong>${I18N.t('modal.motto')}:</strong> ${ct.motto[lang]}</span>
              <span><strong>${I18N.t('stats.spectra')}:</strong> ${ct.spectrum.toUpperCase()}</span>
            </div>
          </div>
          <div class="verdict__art">
            <img src="${imgPath}" alt="${ct.name[lang]}" />
          </div>
          <div class="verdict__rarity">
            ${I18N.t('modal.population')}
            <b>${ct.share}%</b>
          </div>
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="row row-between mt-3 mb-3">
        <div class="row">
          <a href="#test" class="btn btn--primary">
            🔄 <span>${I18N.t('result.retake')}</span>
          </a>
          <a href="#types" class="btn btn--ghost">
            ✨ <span>${I18N.t('result.explore_all')}</span>
          </a>
        </div>
        <div class="row">
          <button class="btn btn--ghost" id="btn-save-story" style="background:linear-gradient(100deg, rgba(236,72,153,0.15), rgba(139,92,246,0.15)); border-color:var(--p-fuchsia);">
            📸 <span>บันทึกรูป Story (IG/TikTok)</span>
          </button>
          <button class="btn btn--ghost" id="btn-share-link">
            🔗 <span>${I18N.t('result.copy_link')}</span>
          </button>
        </div>
      </div>

      <!-- Result Layout: 2 Columns -->
      <div class="result-layout mt-4">

        <!-- Column 1: Detailed Trait Tabs & Breakdown -->
        <div class="stack" style="--gap:1.8rem">

          <!-- Overview Card -->
          <div class="card card--edge" data-spectrum="${spectrum}">
            <h3 class="display-sm mb-2">${I18N.t('modal.overview')}</h3>
            <p style="color:var(--text-2);line-height:1.8">${ct.overview[lang]}</p>
          </div>

          <!-- Variant Deep Dive Card -->
          <div class="card card--edge" data-spectrum="${spectrum}">
            <h3 class="display-sm mb-2">${I18N.t('modal.variant')}: ${variant.name[lang]}</h3>
            <p style="color:var(--text-2);line-height:1.75;margin-bottom:1.2rem">${variant.desc[lang]}</p>
            <div class="kv">
              <div class="kv__row">
                <span class="kv__k">${I18N.t('modal.identity')}</span>
                <span class="kv__v">${variant.identity[lang]}</span>
              </div>
              <div class="kv__row">
                <span class="kv__k">${I18N.t('modal.relating')}</span>
                <span class="kv__v">${variant.relating[lang]}</span>
              </div>
              <div class="kv__row">
                <span class="kv__k">${I18N.t('modal.watch')}</span>
                <span class="kv__v" style="color:var(--p-amber);font-weight:600">${variant.watch[lang]}</span>
              </div>
            </div>
          </div>

          <!-- Tabs for Strengths, Careers, Love, etc. -->
          <div class="card">
            <div class="tabs" role="tablist">
              <button role="tab" aria-selected="true" data-tab="tab-res-strengths">${I18N.t('modal.strengths')}</button>
              <button role="tab" aria-selected="false" data-tab="tab-res-growth">${I18N.t('modal.growth')}</button>
              <button role="tab" aria-selected="false" data-tab="tab-res-careers">${I18N.t('modal.careers')}</button>
              <button role="tab" aria-selected="false" data-tab="tab-res-work">${I18N.t('modal.work')}</button>
              <button role="tab" aria-selected="false" data-tab="tab-res-love">${I18N.t('modal.love')}</button>
              <button role="tab" aria-selected="false" data-tab="tab-res-stress">${I18N.t('modal.stress')}</button>
            </div>

            <div class="tabpanel" id="tab-res-strengths">
              <ul class="tick-list">
                ${ct.strengths[lang].map(s => `<li><b>${s}</b></li>`).join('')}
              </ul>
            </div>
            <div class="tabpanel" id="tab-res-growth" hidden>
              <ul class="tick-list tick-list--warn">
                ${ct.growth[lang].map(g => `<li><b>${g}</b></li>`).join('')}
              </ul>
            </div>
            <div class="tabpanel" id="tab-res-careers" hidden>
              <div class="pill-list pill-list--careers">
                ${ct.careers[lang].map(c => {
                  const vis = _getCareerVisual(c);
                  return `
                    <div class="career-pill" style="--c-accent: ${vis.bg}">
                      <span class="career-pill__icon">${vis.icon}</span>
                      <span class="career-pill__name">${c}</span>
                      
                      <!-- 3D Artwork Hover Popup -->
                      <div class="career-hover-popup" role="tooltip">
                        <div class="career-hover-popup__img-wrap">
                          <img src="${vis.img}" alt="${c}" loading="lazy" />
                          <span class="career-hover-popup__tag">${vis.cat}</span>
                        </div>
                        <div class="career-hover-popup__info">
                          <div class="career-hover-popup__title">${c}</div>
                          <div class="career-hover-popup__desc">${vis.benefit}</div>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
            <div class="tabpanel" id="tab-res-work" hidden>
              <div class="prose"><p>${ct.work[lang]}</p></div>
            </div>
            <div class="tabpanel" id="tab-res-love" hidden>
              <div class="prose"><p>${ct.love[lang]}</p></div>
            </div>
            <div class="tabpanel" id="tab-res-stress" hidden>
              <div class="prose"><p>${ct.stress[lang]}</p></div>
            </div>
          </div>

          <!-- Compatibility Matches -->
          <div class="card" data-spectrum="${spectrum}">
            <h4 style="font-family:var(--font-display);font-size:1.1rem;margin-bottom:1rem">
              ${I18N.t('modal.matches')}
            </h4>
            <div class="match-grid">
              ${(ct.matches || []).map(m => {
                const mc = window.PRISM_DATA.CORE_TYPES[m];
                if (!mc) return '';
                return `
                  <div class="match" data-match="${m}" tabindex="0" role="button" title="${mc.name[lang]}">
                    <img src="assets/img/characters/${m}.thumb.webp" alt="${mc.name[lang]}" loading="lazy" />
                    <div>
                      <div class="match__code">${m}</div>
                      <div class="match__why">${mc.name[lang]}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>

        <!-- Column 2: Sticky Visuals (Radar Chart & Dimension Bars) -->
        <div class="result-side">

          <!-- Radar Chart Card -->
          <div class="card" data-spectrum="${spectrum}">
            <h4 style="font-family:var(--font-display);font-size:1rem;margin-bottom:.4rem">
              ${I18N.t('result.radar_title')}
            </h4>
            <p class="dim" style="font-size:.82rem;margin-bottom:1rem">${I18N.t('result.radar_sub')}</p>
            <div class="radar-wrap">
              ${_generateRadarSVG(scores, spectrum)}
            </div>
          </div>

          <!-- Dimension Breakdown Bars Card -->
          <div class="card" data-spectrum="${spectrum}">
            <h4 style="font-family:var(--font-display);font-size:1rem;margin-bottom:1.2rem">
              ${I18N.t('result.dbars_title')}
            </h4>
            <div class="dbars">
              ${_renderDimensionBars(scores, lang)}
            </div>
          </div>

        </div>
      </div>
    `;

    /* Bind tab switching in result view */
    container.querySelectorAll('.tabs [role="tab"]').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.tabs [role="tab"]').forEach(t => t.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');
        container.querySelectorAll('.tabpanel').forEach(p => p.hidden = true);
        const targetId = tab.dataset.tab;
        const panel = container.querySelector('#' + targetId) || container.querySelector('#tab-' + targetId);
        if (panel) panel.hidden = false;
      });
    });

    /* Bind matches to open modal */
    container.querySelectorAll('.match').forEach(m => {
      m.addEventListener('click', () => {
        _openModal(`${m.dataset.match}-${variantKey}`);
      });
    });

    /* Bind Story Card export button */
    const storyBtn = $('#btn-save-story');
    if (storyBtn) {
      storyBtn.addEventListener('click', () => {
        _openStoryCardModal(fullCode, ct, variant, scores, lang);
      });
    }

    /* Bind copy link button */
    const shareBtn = $('#btn-share-link');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}#result=${fullCode}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareUrl).then(() => {
            _showToast(I18N.t('result.copied'));
          }).catch(() => {
            _showToast(I18N.t('result.copied'));
          });
        } else {
          _showToast(I18N.t('result.copied'));
        }
      });
    }
  }

  /* -------------------------------------------------------- Ultra-Luxury Story Card Modal & Canvas Generator */
  let _storyCardState = { theme: 'light', currentDataUrl: null };

  function _openStoryCardModal(fullCode, ct, variant, scores, lang) {
    let modal = document.getElementById('modal-story-card');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-story-card';
      modal.className = 'story-card-modal-backdrop';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="story-card-modal-box">
        <div class="story-card-modal-header">
          <div>
            <h3 style="margin:0;font-size:1.25rem;font-weight:700;color:var(--text)">📸 การ์ดบันทึกผลลัพธ์ (Story Card)</h3>
            <p style="margin:0;font-size:.85rem;color:var(--text-2)">ขนาดมาตรฐาน 9:16 คมชัดระดับ 1080×1920 สำหรับแชร์ลง IG & TikTok Story</p>
          </div>
          <button class="story-card-close-btn" id="btn-close-story-modal">✕</button>
        </div>

        <div class="story-theme-selector-bar">
          <span style="font-size:.9rem;font-weight:600;color:var(--text)">เลือกสไตล์การ์ด:</span>
          <div class="story-theme-tabs">
            <button class="story-theme-btn ${_storyCardState.theme === 'light' ? 'is-active' : ''}" data-theme="light">
              ✨ ธีมขาวคลีน (Light Pearl)
            </button>
            <button class="story-theme-btn ${_storyCardState.theme === 'dark' ? 'is-active' : ''}" data-theme="dark">
              🌌 ธีมมืดพรีเมียม (Midnight Dark)
            </button>
          </div>
        </div>

        <div class="story-card-preview-area">
          <div class="story-card-loading-spinner" id="story-card-loading">
            <div class="spin-circle"></div>
            <span style="margin-top:.8rem;font-size:.9rem;color:var(--text-2)">กำลังเรนเดอร์การ์ดความละเอียดสูง...</span>
          </div>
          <img id="story-card-preview-img" class="story-card-preview-img" style="display:none" alt="PRISM64 Story Card Preview" />
        </div>

        <div class="story-card-modal-footer">
          <button class="btn btn--ghost" id="btn-cancel-story-modal">ปิดหน้าต่าง</button>
          <button class="btn btn--primary" id="btn-download-story-canvas" style="padding:.7rem 1.8rem;font-weight:700">
            ⬇️ ดาวน์โหลดรูปภาพความละเอียดสูง (1080×1920)
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    const closeBtn = modal.querySelector('#btn-close-story-modal');
    const cancelBtn = modal.querySelector('#btn-cancel-story-modal');
    const downloadBtn = modal.querySelector('#btn-download-story-canvas');
    const previewImg = modal.querySelector('#story-card-preview-img');
    const loadingSpinner = modal.querySelector('#story-card-loading');

    const _close = () => { modal.style.display = 'none'; };
    closeBtn.onclick = _close;
    cancelBtn.onclick = _close;
    modal.onclick = (e) => { if (e.target === modal) _close(); };

    modal.querySelectorAll('.story-theme-btn').forEach(btn => {
      btn.onclick = () => {
        modal.querySelectorAll('.story-theme-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        _storyCardState.theme = btn.dataset.theme;
        _renderCard();
      };
    });

    const _renderCard = async () => {
      loadingSpinner.style.display = 'flex';
      previewImg.style.display = 'none';

      const dataUrl = await _generateHighResStoryCard(fullCode, ct, variant, scores, lang, _storyCardState.theme);
      _storyCardState.currentDataUrl = dataUrl;

      previewImg.src = dataUrl;
      previewImg.onload = () => {
        loadingSpinner.style.display = 'none';
        previewImg.style.display = 'block';
      };
    };

    downloadBtn.onclick = () => {
      if (_storyCardState.currentDataUrl) {
        const link = document.createElement('a');
        link.download = `PRISM64-${fullCode}-${_storyCardState.theme}-Story.png`;
        link.href = _storyCardState.currentDataUrl;
        link.click();
        _showToast('บันทึกรูป Story Card สำเร็จแล้ว! 🎉');
      }
    };

    _renderCard();
  }

  function _generateHighResStoryCard(fullCode, ct, variant, scores, lang, theme = 'light') {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const width = 1080;
      const height = 1920;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      const isLight = theme === 'light';
      const coreCode = fullCode.split('-')[0];
      const variantKey = fullCode.split('-')[1] || 'AH';
      const shade = window.PRISM_DATA?.SHADES_64?.[fullCode];
      const title = shade?.title?.[lang] || `${ct.name[lang]} — ${variant.name[lang]}`;
      const tagline = shade?.tagline?.[lang] || ct.tagline[lang] || '';
      const spectrum = ct.spectrum || 'violet';

      // Spectrum metadata
      const specColorMap = {
        violet: { main: '#8B5CF6', light: '#EDE9FE', border: '#C4B5FD', darkBg: 'rgba(139,92,246,0.2)', nameTh: 'VIOLET • สายม่วง สื่อสาร & เชื่อมคน' },
        green: { main: '#10B981', light: '#D1FAE5', border: '#A7F3D0', darkBg: 'rgba(16,185,129,0.2)', nameTh: 'GREEN • สายเขียว วางแผน & คิดระบบ' },
        blue: { main: '#3B82F6', light: '#DBEAFE', border: '#93C5FD', darkBg: 'rgba(59,130,246,0.2)', nameTh: 'BLUE • สายน้ำเงิน ลงมือทำ & แก้ปัญหา' },
        orange: { main: '#F59E0B', light: '#FEF3C7', border: '#FDE68A', darkBg: 'rgba(245,158,11,0.2)', nameTh: 'ORANGE • สายส้ม นำทีม & ไปถึงเป้า' }
      };
      const specInfo = specColorMap[spectrum] || specColorMap.violet;

      /* ==================== 1. Background & Ambient Glows ==================== */
      if (isLight) {
        // Ultra-Clean Pearl Glass Background
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#FFFFFF');
        bgGrad.addColorStop(0.3, '#F8FAFC');
        bgGrad.addColorStop(0.7, '#F1F5F9');
        bgGrad.addColorStop(1, '#FFFFFF');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Soft Iridescent Glow Orbs
        const glow1 = ctx.createRadialGradient(180, 260, 20, 180, 260, 520);
        glow1.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
        glow1.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = glow1; ctx.fillRect(0, 0, width, height);

        const glow2 = ctx.createRadialGradient(900, 520, 20, 900, 520, 560);
        glow2.addColorStop(0, 'rgba(236, 72, 153, 0.10)');
        glow2.addColorStop(1, 'rgba(236, 72, 153, 0)');
        ctx.fillStyle = glow2; ctx.fillRect(0, 0, width, height);

        const glow3 = ctx.createRadialGradient(width / 2, 1450, 20, width / 2, 1450, 650);
        glow3.addColorStop(0, 'rgba(56, 189, 248, 0.10)');
        glow3.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = glow3; ctx.fillRect(0, 0, width, height);

        // Outer Minimalist Frame
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.65)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(40, 40, width - 80, height - 80, 44);
        ctx.stroke();

        // Inner crisp hairline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(43, 43, width - 86, height - 86, 42);
        ctx.stroke();

      } else {
        // Deep Midnight Dark Space
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#06050C');
        bgGrad.addColorStop(0.35, '#0E0A1D');
        bgGrad.addColorStop(0.75, '#120E26');
        bgGrad.addColorStop(1, '#06050C');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const glow1 = ctx.createRadialGradient(width / 2, 450, 40, width / 2, 450, 600);
        glow1.addColorStop(0, 'rgba(139, 92, 246, 0.26)');
        glow1.addColorStop(0.6, 'rgba(236, 72, 153, 0.10)');
        glow1.addColorStop(1, 'transparent');
        ctx.fillStyle = glow1; ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(40, 40, width - 80, height - 80, 44);
        ctx.stroke();
      }

      /* ==================== 2. Elegant Top Bar (Brand & Spectrum) ==================== */
      const topBarY = 115;
      const marginX = 90;

      // Brand Logo on Left
      ctx.fillStyle = isLight ? '#0F172A' : '#FFFFFF';
      ctx.font = '800 32px "Sora", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('PRISM', marginX, topBarY);
      
      const prismW = ctx.measureText('PRISM').width;
      const numGrad = ctx.createLinearGradient(marginX + prismW + 2, 0, marginX + prismW + 50, 0);
      numGrad.addColorStop(0, '#8B5CF6');
      numGrad.addColorStop(1, '#EC4899');
      ctx.fillStyle = numGrad;
      ctx.fillText('64', marginX + prismW + 2, topBarY);

      // Spectrum Pill on Right
      const pillW = 380;
      const pillH = 46;
      const pillX = width - marginX - pillW;
      const pillY = topBarY - 33;

      ctx.fillStyle = isLight ? specInfo.light : specInfo.darkBg;
      ctx.strokeStyle = isLight ? specInfo.border : specInfo.main;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 23);
      ctx.fill();
      ctx.stroke();

      // Colored dot in pill
      ctx.fillStyle = specInfo.main;
      ctx.beginPath();
      ctx.arc(pillX + 22, pillY + 23, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isLight ? '#1E293B' : '#FFFFFF';
      ctx.font = '700 18px "Sora", "Anuphan", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(specInfo.nameTh, pillX + 38, pillY + 30);

      /* ==================== 3. Archetype Hero Block ==================== */
      const codeY = 270;

      // Main Code ESTJ-AH
      if (isLight) {
        ctx.fillStyle = '#0F172A';
        ctx.font = '900 115px "JetBrains Mono", "Sora", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(fullCode, width / 2, codeY);
      } else {
        const textGrad = ctx.createLinearGradient(width / 2 - 240, 0, width / 2 + 240, 0);
        textGrad.addColorStop(0, '#C084FC');
        textGrad.addColorStop(0.5, '#F472B6');
        textGrad.addColorStop(1, '#60A5FA');
        ctx.fillStyle = textGrad;
        ctx.font = '900 115px "JetBrains Mono", "Sora", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(fullCode, width / 2, codeY);
      }

      // Title
      ctx.fillStyle = isLight ? '#1E293B' : '#FFFFFF';
      ctx.font = 'bold 48px "Sora", "Anuphan", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, codeY + 68);

      // Motto / Quote Pill
      if (tagline) {
        const quoteW = 780;
        const quoteH = 62;
        const quoteX = (width - quoteW) / 2;
        const quoteY = codeY + 104;

        ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.05)';
        ctx.strokeStyle = isLight ? 'rgba(226, 232, 240, 0.95)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(quoteX, quoteY, quoteW, quoteH, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isLight ? '#475569' : '#C4B5FD';
        ctx.font = '500 24px "Inter", "IBM Plex Sans Thai", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`“${tagline}”`, width / 2, quoteY + 40);
      }

      /* ==================== 4. 3D Character Hero Presentation ==================== */
      const charY = codeY + 205;
      const charImg = new Image();
      charImg.crossOrigin = 'anonymous';
      charImg.src = `assets/img/characters/${coreCode}.webp`;

      charImg.onload = () => {
        // Podium Circle Aura Behind Character
        const podiumGrad = ctx.createRadialGradient(width / 2, charY + 240, 20, width / 2, charY + 240, 280);
        if (isLight) {
          podiumGrad.addColorStop(0, 'rgba(241, 245, 249, 0.95)');
          podiumGrad.addColorStop(0.5, 'rgba(226, 232, 240, 0.55)');
          podiumGrad.addColorStop(1, 'rgba(241, 245, 249, 0)');
        } else {
          podiumGrad.addColorStop(0, 'rgba(139, 92, 246, 0.28)');
          podiumGrad.addColorStop(0.6, 'rgba(236, 72, 153, 0.10)');
          podiumGrad.addColorStop(1, 'transparent');
        }
        ctx.fillStyle = podiumGrad;
        ctx.beginPath();
        ctx.arc(width / 2, charY + 240, 280, 0, Math.PI * 2);
        ctx.fill();

        // Soft Contact Floor Shadow under feet
        ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.09)' : 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(width / 2, charY + 460, 180, 24, 0, 0, Math.PI * 2);
        ctx.fill();

        // Character Image
        const cW = 490;
        const cH = 490;
        ctx.drawImage(charImg, (width - cW) / 2, charY, cW, cH);

        /* ==================== 5. Balanced 6-Dimension Bento Card ==================== */
        const bentoY = charY + 520;
        const bentoW = width - 180; // 900
        const bentoH = 590;
        const bentoX = 90;

        // Bento card background
        ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.05)';
        ctx.strokeStyle = isLight ? 'rgba(203, 213, 225, 0.9)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bentoX, bentoY, bentoW, bentoH, 36);
        ctx.fill();
        ctx.stroke();

        // Bento Header
        ctx.fillStyle = isLight ? '#0F172A' : '#FFFFFF';
        ctx.font = '800 28px "Sora", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('📊 6-DIMENSION PROFILE', bentoX + 44, bentoY + 54);

        ctx.fillStyle = isLight ? '#64748B' : '#94A3B8';
        ctx.font = '600 19px "Inter", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('HEXACO × MBTI HYBRID', bentoX + bentoW - 44, bentoY + 54);

        // 6 Dimensions Progress Bars
        const dims = [
          { p1: 'E (เปิดตี้)', p2: 'I (เก็บพลัง)', score: scores.energy.score },
          { p1: 'S (ข้อเท็จจริง)', p2: 'N (ภาพในหัว)', score: scores.input.score },
          { p1: 'T (ตรรกะ)', p2: 'F (แคร์ใจ)', score: scores.deciding.score },
          { p1: 'J (วางแผน)', p2: 'P (ด้นสด)', score: scores.structure.score },
          { p1: 'A (มั่นใจมูฟออน)', p2: 'O (คิดมากใส่ใจ)', score: scores.identity.score },
          { p1: 'H (แคร์คนรอบข้าง)', p2: 'C (รักสงบสันโดษ)', score: scores.relating.score },
        ];

        const barStartX = bentoX + 44;
        const barW = bentoW - 88;

        dims.forEach((d, i) => {
          const rowY = bentoY + 112 + (i * 76);

          // Labels
          const isPole1 = d.score >= 50;
          const displayPct = isPole1 ? Math.round(d.score) : Math.round(100 - d.score);

          ctx.font = isPole1 ? 'bold 22px "Sora", "Anuphan", sans-serif' : '500 21px "Sora", "Anuphan", sans-serif';
          ctx.fillStyle = isLight ? (isPole1 ? '#0F172A' : '#64748B') : (isPole1 ? '#FFFFFF' : '#94A3B8');
          ctx.textAlign = 'left';
          ctx.fillText(d.p1, barStartX, rowY);

          ctx.font = !isPole1 ? 'bold 22px "Sora", "Anuphan", sans-serif' : '500 21px "Sora", "Anuphan", sans-serif';
          ctx.fillStyle = isLight ? (!isPole1 ? '#0F172A' : '#64748B') : (!isPole1 ? '#FFFFFF' : '#94A3B8');
          ctx.textAlign = 'right';
          ctx.fillText(d.p2, barStartX + barW, rowY);

          // Track
          const trackY = rowY + 14;
          const trackH = 15;
          ctx.fillStyle = isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.12)';
          ctx.beginPath();
          ctx.roundRect(barStartX, trackY, barW, trackH, 8);
          ctx.fill();

          // Bar Fill
          const fillWidth = (displayPct / 100) * (barW / 2);
          let fillX;
          if (isPole1) {
            fillX = barStartX + (barW / 2) - fillWidth;
          } else {
            fillX = barStartX + (barW / 2);
          }

          const fillGrad = ctx.createLinearGradient(barStartX, 0, barStartX + barW, 0);
          fillGrad.addColorStop(0, '#8B5CF6');
          fillGrad.addColorStop(0.5, '#EC4899');
          fillGrad.addColorStop(1, '#3B82F6');
          ctx.fillStyle = fillGrad;

          ctx.beginPath();
          ctx.roundRect(fillX, trackY, Math.max(fillWidth, 10), trackH, 8);
          ctx.fill();

          // Center divider dot
          ctx.fillStyle = isLight ? '#94A3B8' : '#FFFFFF';
          ctx.beginPath();
          ctx.arc(barStartX + (barW / 2), trackY + 7.5, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        /* ==================== 6. Minimalist Balanced Bottom ==================== */
        const footerY = height - 80;
        ctx.fillStyle = isLight ? '#94A3B8' : '#64748B';
        ctx.font = '600 20px "Sora", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PRISM64.APP • 64 SHADES OF PERSONALITY', width / 2, footerY);

        resolve(canvas.toDataURL('image/png'));
      };

      charImg.onerror = () => {
        resolve(canvas.toDataURL('image/png'));
      };
    });
  }

  /* -------------------------------------------------------- SVG Radar Generator */
  function _generateRadarSVG(scores, spectrum) {
    const center = 130;
    const radius = 90;
    const dims = [
      { key: 'energy', label: 'E/I', val: scores.energy.score / 100 },
      { key: 'input', label: 'S/N', val: scores.input.score / 100 },
      { key: 'deciding', label: 'T/F', val: scores.deciding.score / 100 },
      { key: 'structure', label: 'J/P', val: scores.structure.score / 100 },
      { key: 'identity', label: 'A/O', val: scores.identity.score / 100 },
      { key: 'relating', label: 'H/C', val: scores.relating.score / 100 },
    ];

    const angleStep = (Math.PI * 2) / 6;

    // Grid circles
    const gridCircles = [0.25, 0.5, 0.75, 1.0].map(r => {
      const points = dims.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + radius * r * Math.cos(angle);
        const y = center + radius * r * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      return `<polygon points="${points}" class="radar__grid" />`;
    }).join('');

    // Axis lines and labels
    const axes = dims.map((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const lx = center + (radius + 20) * Math.cos(angle);
      const ly = center + (radius + 20) * Math.sin(angle);
      return `
        <line x1="${center}" y1="${center}" x2="${x}" y2="${y}" class="radar__axis" />
        <text x="${lx}" y="${ly + 4}" text-anchor="middle" class="radar__label">${d.label}</text>
      `;
    }).join('');

    // Polygon points
    const polyPoints = dims.map((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const normalizedDist = 0.2 + d.val * 0.8; // scale between 0.2 and 1.0
      const x = center + radius * normalizedDist * Math.cos(angle);
      const y = center + radius * normalizedDist * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    // Polygon dots
    const dots = dims.map((d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const normalizedDist = 0.2 + d.val * 0.8;
      const x = center + radius * normalizedDist * Math.cos(angle);
      const y = center + radius * normalizedDist * Math.sin(angle);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" class="radar__dot" />`;
    }).join('');

    return `
      <svg class="radar" viewBox="0 0 260 260">
        ${gridCircles}
        ${axes}
        <polygon points="${polyPoints}" class="radar__area" />
        ${dots}
      </svg>
    `;
  }

  /* -------------------------------------------------------- Dimension Bars */
  function _renderDimensionBars(scores, lang) {
    const dimList = [
      { key: 'energy', p1: 'E', p2: 'I', label: { th: 'พลังงาน (สายชาร์จพลัง)', en: 'Energy' }, val: scores.energy.score },
      { key: 'input', p1: 'S', p2: 'N', label: { th: 'การรับข้อมูล (สายมองโลก)', en: 'Input' }, val: scores.input.score },
      { key: 'deciding', p1: 'T', p2: 'F', label: { th: 'การตัดสินใจ (สายเลือก)', en: 'Deciding' }, val: scores.deciding.score },
      { key: 'structure', p1: 'J', p2: 'P', label: { th: 'การใช้ชีวิต (สายจัดการ)', en: 'Structure' }, val: scores.structure.score },
      { key: 'identity', p1: 'A', p2: 'O', label: { th: 'ความมั่นคงทางใจ (สายฟีลลิ่ง)', en: 'Identity' }, val: scores.identity.score },
      { key: 'relating', p1: 'H', p2: 'C', label: { th: 'การเข้าสังคม (สายปรับตัว)', en: 'Relating' }, val: scores.relating.score },
    ];

    return dimList.map(d => {
      const isPole1 = d.val >= 50;
      const pct = isPole1 ? d.val : (100 - d.val);
      const leadingPole = isPole1 ? d.p1 : d.p2;

      // Track fill styling from center (50%)
      const left = isPole1 ? '50%' : `${d.val}%`;
      const width = isPole1 ? `${d.val - 50}%` : `${50 - d.val}%`;

      return `
        <div>
          <div class="dbar__head">
            <span class="dbar__label">${d.label[lang]}</span>
            <span class="dbar__pct">${pct}% ${leadingPole}</span>
          </div>
          <div class="dbar__poles">
            <span class="${isPole1 ? 'bold' : 'dim'}">${d.p1}</span>
            <span class="${!isPole1 ? 'bold' : 'dim'}">${d.p2}</span>
          </div>
          <div class="dbar__track mt-1">
            <div class="dbar__mid"></div>
            <div class="dbar__fill" style="left:${left}; width:${width};"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ========================================================
     GLOBAL EVENT BINDINGS
     ======================================================== */

  function _bindEvents() {
    _initFilters();

    /* Global hash links smooth scrolling if on home */
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#test') {
          e.preventDefault();
          window.location.hash = 'test';
        } else if (href === '#home' || href === '#') {
          e.preventDefault();
          window.location.hash = 'home';
        } else if (href.startsWith('#type=')) {
          // Handled by router
        } else if (href.startsWith('#result')) {
          // Handled by router
        } else {
          const id = href.slice(1);
          if (state.currentView !== 'home') {
            _showView('home');
          }
          const target = document.getElementById(id);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    /* Prevent accidental data loss when taking assessment */
    window.addEventListener('beforeunload', (e) => {
      const answeredCount = Object.keys(state.testAnswers || {}).length;
      if (state.currentView === 'test' && !state.testCompleted && answeredCount > 0) {
        _saveInProgressTest();
        e.preventDefault();
        e.returnValue = I18N.t('test.leave_prompt') || '';
        return e.returnValue;
      }
    });
  }

  /* --------------------------------------------------------- Public API */
  return {
    init,
    openModal: _openModal,
    closeModal: _closeModal,
    renderTypes: _renderTypes,
    showView: _showView,
  };
})();

/* ------------------------------------------------------------- Boot */
document.addEventListener('DOMContentLoaded', () => {
  PRISM.init();
});