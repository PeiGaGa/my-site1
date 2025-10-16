(function () {
  function initHeroSlider(root) {
    var wrapper = root.querySelector('.swiper-wrapper');
    if (!wrapper) return;
    var slides = Array.prototype.slice.call(wrapper.children).filter(function (el) {
      return el.classList && el.classList.contains('swiper-slide');
    });
    if (slides.length === 0) return;

    var prevBtn = root.parentElement.querySelector('.hero-prev');
    var nextBtn = root.parentElement.querySelector('.hero-next');
    var counterEl = root.parentElement.querySelector('.hero-counter');

    var index = 0;

    function render() {
      for (var i = 0; i < slides.length; i++) {
        var show = i === index;
        slides[i].style.display = show ? 'block' : 'none';
      }
      if (counterEl) {
        var curr = (index + 1).toString().padStart(2, '0');
        var total = slides.length.toString().padStart(2, '0');
        counterEl.textContent = curr + '/' + total;
      }
    }

    function go(delta) {
      index = (index + delta + slides.length) % slides.length;
      render();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });

    render();
  }

  // Minimal generic swiper for news lists with dots pagination
  function initNewsSwipers() {
    if (typeof Swiper === 'undefined') return;
    var swipers = document.querySelectorAll('.news-page .sec-body .swiper');
    swipers.forEach(function (swiperEl) {
      new Swiper(swiperEl, {
        speed: 400,
        autoHeight: true,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: swiperEl.querySelector('.swiper-pagination'),
          clickable: true
        }
      });
    });
  }

  // Product page: sync two swipers and custom pagination (dots + numbers)
  function initProductSwipers() {
    if (typeof Swiper === 'undefined') return;
    var containers = document.querySelectorAll('.product-swiper-container');
    containers.forEach(function (container) {
      var imageEl = container.querySelector('.image-swiper');
      var contentEl = container.querySelector('.content-swiper');
      if (!imageEl || !contentEl) return;

      var thumbs = new Swiper(imageEl, {
        speed: 400,
        effect: 'slide',
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        }
      });

      var main = new Swiper(contentEl, {
        speed: 400,
        autoHeight: true,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        thumbs: { swiper: thumbs }
      });

      // Custom dots and numbers updating
      var pagination = container.querySelector('.swiper-pagination-custom');
      var dotsWrap = pagination ? pagination.querySelector('.dots') : null;
      var numsWrap = pagination ? pagination.querySelector('.numbers') : null;
      function updateCustom(i) {
        if (dotsWrap) {
          var dots = dotsWrap.children;
          for (var d = 0; d < dots.length; d++) {
            if (d === i) dots[d].classList.add('swiper-pagination-bullet-active-custom');
            else dots[d].classList.remove('swiper-pagination-bullet-active-custom');
          }
        }
        if (numsWrap) {
          var nums = numsWrap.children;
          for (var n = 0; n < nums.length; n++) {
            if (n === i) nums[n].classList.add('active');
            else nums[n].classList.remove('active');
          }
        }
      }
      thumbs.on('slideChange', function () { updateCustom(thumbs.realIndex || thumbs.activeIndex || 0); });
      main.on('slideChange', function () { updateCustom(main.realIndex || main.activeIndex || 0); });

      if (dotsWrap) {
        for (var j = 0; j < dotsWrap.children.length; j++) {
          (function (to) { dotsWrap.children[j].addEventListener('click', function () { thumbs.slideTo(to); main.slideTo(to); }); })(j);
        }
      }
      if (numsWrap) {
        for (var m = 0; m < numsWrap.children.length; m++) {
          (function (to2) { numsWrap.children[m].addEventListener('click', function () { thumbs.slideTo(to2); main.slideTo(to2); }); })(m);
        }
      }
      updateCustom(0);
    });
  }

  function initLanguageSwitch() {
    var switches = document.querySelectorAll('.language-switch');
    switches.forEach(function (sw) {
      var btns = sw.querySelectorAll('.lang-btn');
      if (btns.length < 2) return;
      var cnBtn = btns[0];
      var enBtn = btns[1];
      function resolveCounterpartPath(targetLang) {
        var loc = window.location;
        var path = loc.pathname || '';
        var search = loc.search || '';
        var hash = loc.hash || '';

        // Inside language subfolder -> swap folder keep filename
        var subMatch = path.match(/\/(zh-cn|en)\/([^\/]+\.html)$/);
        if (subMatch) {
          var filename = subMatch[2];
          return '../' + targetLang + '/' + filename + search + hash;
        }

        // On root language file -> swap root file
        var rootLangMatch = path.match(/\/(zh-cn|en)\.html$/);
        if (rootLangMatch) {
          return './' + targetLang + '.html' + search + hash;
        }

        // Otherwise (e.g., index.html or bare root) -> go to target root language file
        return './' + targetLang + '.html' + search + hash;
      }

      function detectCurrentLang() {
        var path = window.location.pathname || '';
        if (/\/(en)(\/|\.html)/.test(path)) return 'en';
        if (/\/(zh-cn)(\/|\.html)/.test(path)) return 'zh-cn';
        // Fallback to stored preference or default zh-cn
        var stored = null;
        try { stored = localStorage.getItem('preferredLang'); } catch (e) {}
        return stored === 'en' ? 'en' : 'zh-cn';
      }

      function setActive(lang) {
        if (!cnBtn || !enBtn) return;
        cnBtn.classList.toggle('active', lang === 'zh-cn');
        enBtn.classList.toggle('active', lang === 'en');
      }

      // Initialize active state based on URL/preference and persist if URL encodes a lang
      var currentLang = detectCurrentLang();
      setActive(currentLang);
      if (/\/(en|zh-cn)(\/|\.html)/.test(window.location.pathname || '')) {
        try { localStorage.setItem('preferredLang', currentLang); } catch (e) {}
      }

      if (cnBtn) cnBtn.addEventListener('click', function () {
        try { localStorage.setItem('preferredLang', 'zh-cn'); } catch (e) {}
        window.location.href = resolveCounterpartPath('zh-cn');
      });
      if (enBtn) enBtn.addEventListener('click', function () {
        try { localStorage.setItem('preferredLang', 'en'); } catch (e) {}
        window.location.href = resolveCounterpartPath('en');
      });
    });
  }

  function maybeRedirectToPreferredLang() {
    var path = window.location.pathname || '';
    // If not already on a language-specific page/file, redirect to stored preference
    var isLangPage = /(\/(zh-cn|en)(\/|\.html))/.test(path);
    if (isLangPage) return;
    var preferred = null;
    try { preferred = localStorage.getItem('preferredLang'); } catch (e) {}
    if (preferred === 'en' || preferred === 'zh-cn') {
      var dest = './' + preferred + '.html' + (window.location.search || '') + (window.location.hash || '');
      // Avoid redirect loop if already there (defensive)
      if (!/(\/(zh-cn|en)\.html)$/.test(path)) {
        window.location.replace(dest);
      }
    }
  }

  function init() {
    var heroSwipers = document.querySelectorAll('.hero-swiper');
    heroSwipers.forEach(function (root) { initHeroSlider(root); });
    initLanguageSwitch();
    initNewsSwipers();
    initProductSwipers();
    maybeRedirectToPreferredLang();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


