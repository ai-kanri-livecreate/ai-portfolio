// @ts-check
/* ============================================================
   AI Works Portfolio — interactions
   各機能を init*() に分割（単一責任）。型は JSDoc + @ts-check で担保。
   ============================================================ */
(function () {
  'use strict';

  /** CSS .lightbox の transition 時間(ms)に合わせる。CSSを変えたらここも合わせる。 */
  var LIGHTBOX_TRANSITION_MS = 300;
  /** ナビの影を出すスクロール量(px) */
  var NAV_SHADOW_AT = 8;
  /** 「トップへ戻る」を表示するスクロール量(px) */
  var TO_TOP_AT = 600;

  /** @param {string} id @returns {HTMLElement|null} */
  function byId(id) { return document.getElementById(id); }

  initNav();
  initToTop();
  initMobileNav();
  initReveal();
  initFilter();
  initLightbox();

  /* ---- ナビ：スクロールで影 ---- */
  function initNav() {
    var nav = byId('nav');
    if (!nav) return;
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      nav.classList.toggle('is-scrolled', y > NAV_SHADOW_AT);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- トップへ戻る ---- */
  function initToTop() {
    var toTop = byId('toTop');
    if (!toTop) return;
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      toTop.classList.toggle('is-show', y > TO_TOP_AT);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- モバイルナビ開閉 ---- */
  function initMobileNav() {
    var toggle = byId('navToggle');
    var menu = byId('navMenu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    // リンク内に子要素があっても閉じられるよう closest('a') で判定
    menu.addEventListener('click', function (e) {
      var target = /** @type {Element} */ (e.target);
      if (target && target.closest && target.closest('a')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- スクロール連動フェードイン ---- */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Works フィルタ ---- */
  function initFilter() {
    var filters = byId('filters');
    var empty = byId('gridEmpty');
    var cards = Array.prototype.slice.call(document.querySelectorAll('#grid .card'));
    if (!filters) return;
    filters.addEventListener('click', function (e) {
      var target = /** @type {Element} */ (e.target);
      var btn = target && target.closest ? target.closest('.chip') : null;
      if (!btn) return;
      filters.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var f = btn.getAttribute('data-filter');
      var shown = 0;
      cards.forEach(function (card) {
        var match = f === 'all' || card.getAttribute('data-category') === f;
        card.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    });
  }

  /* ---- ライトボックス ---- */
  function initLightbox() {
    var lb = byId('lightbox');
    var lbImg = /** @type {HTMLImageElement|null} */ (byId('lightboxImg'));
    var lbCap = byId('lightboxCap');
    var lbClose = byId('lightboxClose');
    var cards = Array.prototype.slice.call(document.querySelectorAll('#grid .card'));
    if (!lb || !lbImg || !lbCap || !lbClose) return;

    /** @type {HTMLElement|null} 開く前のフォーカス要素（閉じたら戻す） */
    var lastFocused = null;

    /**
     * 画像URLが安全か（相対の assets/img 配下の画像のみ許可）。
     * data:/javascript:/外部オリジンを弾く。
     * @param {string|null} src
     * @returns {boolean}
     */
    function isSafeImgSrc(src) {
      return !!src && /^assets\/img\/[\w\-.]+\.(jpe?g|png|gif|webp|avif)$/i.test(src);
    }

    /** @param {string|null} src @param {string|null} caption */
    function open(src, caption) {
      if (!isSafeImgSrc(src)) return;
      lastFocused = /** @type {HTMLElement|null} */ (document.activeElement);
      lbImg.src = /** @type {string} */ (src);
      lbImg.alt = caption || '';
      lbCap.textContent = caption || '';
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }

    function close() {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      setTimeout(function () { lbImg.src = ''; }, LIGHTBOX_TRANSITION_MS);
    }

    cards.forEach(function (card) {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('click', function () {
        open(card.getAttribute('data-img'), card.getAttribute('data-title'));
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(card.getAttribute('data-img'), card.getAttribute('data-title'));
        }
      });
    });
    lbClose.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) close();
    });
  }
})();
