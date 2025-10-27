(function () {
  function initHeroSlider(root) {
    if (!root) return;

    var swiper = new Swiper(root, {
      loop: true,
      speed: 800,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  }

  function initIndustrySlider() {
    if (typeof Swiper === 'undefined') return;
    var el = document.querySelector('.industry-hero .swiper');
    if (!el) return;
    new Swiper(el, {
      speed: 600,
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      navigation: {
        nextEl: '.industry-hero .swiper-buttons-wrap .swiper-button-next',
        prevEl: '.industry-hero .swiper-buttons-wrap .swiper-button-prev'
      },
      pagination: {
        el: '.industry-hero .swiper-pagination',
        clickable: true
      }
    });
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

  // 产品中心轮播初始化
  function initProductsSwiper() {
    if (typeof Swiper === 'undefined') {
      console.log('Swiper not loaded');
      return;
    }
    var productsSwiper = document.querySelector('.products-swiper');
    if (!productsSwiper) {
      console.log('Products swiper element not found');
      return;
    }
    
    console.log('Initializing products swiper');
    
    new Swiper(productsSwiper, {
      slidesPerView: 4,
      spaceBetween: 0,
      loop: false,
      centeredSlides: false,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: ".swiper-pagination",
        dynamicBullets: true,
      },
      breakpoints: {
        "@0.00": {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        "@0.75": {
          slidesPerView: 2,
          spaceBetween: 0,
        },
        "@1.00": {
          slidesPerView: 3,
          spaceBetween: 0,
        },
        "@1.25": {
          slidesPerView: 4,
          spaceBetween: 0,
        },
        "@1.50": {
          slidesPerView: 4,
          spaceBetween: 0,
        },
        "@2.00": {
          slidesPerView: 4,
          spaceBetween: 0,
        },
      },
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

  function initHeaderScroll() {
    
    var pcHeader = document.querySelector('.pc-header');
    var mHeader = document.querySelector('.m-header');

    var scrollThreshold = 100; // 滚动阈值，可以根据需要调整
    
    function updateHeaderBackground() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      
      if (scrollTop > scrollThreshold) {
        
        if (pcHeader) {
          pcHeader.classList.remove('is-transparent');
        }
        if (mHeader) {
          mHeader.classList.remove('is-transparent');
        }
      } else {
        if (pcHeader) {
          pcHeader.classList.add('is-transparent');
        }
        if (mHeader) {
          mHeader.classList.add('is-transparent');
        }
      }
    }

    // 使用 requestAnimationFrame 优化滚动处理
    var ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateHeaderBackground();
          ticking = false;
        });
        ticking = true;
      }
    }

    // 添加多个滚动事件监听
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });
    document.body.addEventListener('scroll', onScroll, { passive: true });
    
    // 初始化状态
    updateHeaderBackground();
    
    // 100ms 后再次检查状态
    setTimeout(updateHeaderBackground, 100);
  }

  function init() {
    var heroSwipers = document.querySelectorAll('.hero-swiper');
    heroSwipers.forEach(function (root) { initHeroSlider(root); });
    initIndustrySlider();
    initProductsSwiper(); // 初始化产品中心轮播
    initHeaderScroll(); // 初始化导航栏滚动效果
    // mobile drawer
    try {
      var mNavs = document.querySelectorAll('.m-nav');
      mNavs.forEach(function (nav) {
        var root = nav.closest('.m-container') || document;
        var hamburger = nav.querySelector('.hamburger');
        var overlay = root.querySelector('.drawer-overlay');
        var drawer = root.querySelector('.drawer');
        if (!hamburger || !overlay || !drawer) return;

        var open = false;
        function setOpen(v) {
          open = !!v;
          if (open) {
            drawer.classList.add('is-open');
            overlay.classList.add('is-open');
            document.body.classList.add('no-scroll');
          } else {
            drawer.classList.remove('is-open');
            overlay.classList.remove('is-open');
            document.body.classList.remove('no-scroll');
          }
        }

        hamburger.addEventListener('click', function () { setOpen(true); });
        overlay.addEventListener('click', function () { setOpen(false); });
        var closeBtn = root.querySelector('.drawer__close');
        if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
        // ESC to close
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') setOpen(false);
        });
      });
    } catch (e) {}
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


