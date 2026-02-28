/**
 * 产业布局轮播：#industryImageSwiper 与 .cards-container 配套联动（仅首页）
 * 首页产品中心轮播：initHomeProductCarousel 针对 #productImageSwiper，多张一屏、>3 张时自动轮播、一张一张、无限循环
 * 产品中心页专用：initProductCenterCarousel 仅针对 .product-center-swiper，一张一屏（仅产品页）
 * 新闻动态 tab：全部、企业新闻、媒体报道、通知公告
 * 关于/科研平台：锚点高亮 + page-sidebar 距顶 100px 固定、滚回取消固定
 */
(function () {
  function initAnchorNav(blockSelector, linkSelector, navSelector, fixThreshold) {
    fixThreshold = fixThreshold == null ? 100 : fixThreshold;
    var blocks = document.querySelectorAll(blockSelector);
    var links = document.querySelectorAll(linkSelector);
    var nav = document.querySelector(navSelector);
    var sidebarWrap = nav ? nav.closest('.page-sidebar') : null;

    if (!blocks.length || !links.length) return;

    function setActive(id) {
      links.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    blocks.forEach(function (block) {
      if (block.id) observer.observe(block);
    });
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        var href = link.getAttribute('href');
        if (href && href.startsWith('#')) setActive(href.slice(1));
      });
    });

    if (nav && sidebarWrap) {
      function updateNavFixed() {
        var wrapRect = sidebarWrap.getBoundingClientRect();
        if (wrapRect.top <= fixThreshold) {
          nav.classList.add('is-fixed');
          nav.style.left = wrapRect.left + 'px';
          nav.style.width = wrapRect.width + 'px';
        } else {
          nav.classList.remove('is-fixed');
          nav.style.left = '';
          nav.style.width = '';
        }
      }
      window.addEventListener('scroll', updateNavFixed, { passive: true });
      window.addEventListener('resize', updateNavFixed);
      updateNavFixed();
    }
  }

  function initAboutPage() {
    initAnchorNav('.about-content-block', '.about-anchor-link', '.about-anchor-nav');
  }

  function initResearchPage() {
    initAnchorNav('.research-content-block', '.research-anchor-link', '.research-anchor-nav');
  }

  function initNewsTabs() {
    var tabsEl = document.getElementById('newsTabs');
    var sectionEl = document.getElementById('newsSection');
    if (!tabsEl || !sectionEl) return;

    var tabs = tabsEl.querySelectorAll('.news-tab');
    var cards = sectionEl.querySelectorAll('.news-card');
    if (!tabs.length || !cards.length) return;

    function setActiveTab(activeBtn) {
      tabs.forEach(function (btn) {
        btn.classList.toggle('active', btn === activeBtn);
      });
    }

    function filterByCategory(category) {
      cards.forEach(function (card) {
        var cardCategory = card.getAttribute('data-news-category');
        var show = category === '全部' || cardCategory === category;
        card.style.display = show ? '' : 'none';
      });
    }

    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = btn.getAttribute('data-tab');
        setActiveTab(btn);
        filterByCategory(category);
      });
    });

    setActiveTab(tabs[0]);
    filterByCategory('全部');
  }

  /**
   * 产品中心页专用：一张一屏轮播，仅当存在 .product-center-swiper 时执行（产品页独有，首页无此 class，不会误触）
   */
  function initProductCenterCarousel() {
    var el = document.querySelector('.product-center-swiper');
    if (!el) return;

    var paginationEl = document.getElementById('productPagination');
    var slides = el.querySelectorAll('.swiper-slide');
    var total = slides ? slides.length : 5;

    var swiper = new Swiper(el, {
      loop: true,
      speed: 600,
      slidesPerView: 1,
      spaceBetween: 0,
      navigation: {
        nextEl: '.product-center-swiper .swiper-button-next',
        prevEl: '.product-center-swiper .swiper-button-prev'
      },
      autoplay: {
        delay: 2000,
        disableOnInteraction: false
      },
      on: {
        init: function () {
          setProductCenterPagination(this.realIndex);
        },
        slideChangeTransitionEnd: function () {
          setProductCenterPagination(this.realIndex);
        }
      }
    });

    function setProductCenterPagination(realIndex) {
      if (paginationEl) {
        var dots = paginationEl.querySelectorAll('.product-dot');
        var nums = paginationEl.querySelectorAll('.product-dot-num');
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === realIndex);
        });
        nums.forEach(function (num, i) {
          num.classList.toggle('active', i === realIndex);
        });
      }
      var tabSets = document.querySelectorAll('.product-tab-set');
      tabSets.forEach(function (set) {
        var idx = parseInt(set.getAttribute('data-slide-index'), 10);
        set.classList.toggle('active', idx === realIndex);
      });
    }

    if (paginationEl) {
      paginationEl.querySelectorAll('.product-dot').forEach(function (dot) {
        dot.addEventListener('click', function () {
          var index = parseInt(dot.getAttribute('data-index'), 10);
          swiper.slideToLoop(index);
        });
      });
      paginationEl.querySelectorAll('.product-dot-num').forEach(function (num) {
        num.addEventListener('click', function () {
          var index = parseInt(num.getAttribute('data-index'), 10);
          swiper.slideToLoop(index);
        });
      });
    }
  }

  function initNewsSideSwipers() {
    var sides = document.querySelectorAll('.news-side');
    sides.forEach(function (side) {
      var swiperEl = side.querySelector('.news-side-swiper');
      var paginationEl = side.querySelector('.news-side-pagination');
      if (!swiperEl || !paginationEl) return;

      var swiper = new Swiper(swiperEl, {
        loop: true,
        speed: 600,
        slidesPerView: 1,
        spaceBetween: 0,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false
        },
        on: {
          init: function () {
            setNewsSidePaginationActive(paginationEl, this.realIndex);
          },
          slideChangeTransitionEnd: function () {
            setNewsSidePaginationActive(paginationEl, this.realIndex);
          }
        }
      });

      function setNewsSidePaginationActive(el, realIndex) {
        var total = 5;
        var dots = el.querySelectorAll('.product-dot');
        var nums = el.querySelectorAll('.product-dot-num');
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === realIndex);
        });
        nums.forEach(function (num, i) {
          num.classList.toggle('active', i === realIndex);
        });
      }

      paginationEl.querySelectorAll('.product-dot').forEach(function (dot) {
        dot.addEventListener('click', function () {
          var index = parseInt(dot.getAttribute('data-index'), 10);
          swiper.slideToLoop(index);
        });
      });
      paginationEl.querySelectorAll('.product-dot-num').forEach(function (num) {
        num.addEventListener('click', function () {
          var index = parseInt(num.getAttribute('data-index'), 10);
          swiper.slideToLoop(index);
        });
      });
    });
  }

  function initIndustryCarousel() {
    var container = document.getElementById('industryImageSwiper');
    var cardsContainer = document.getElementById('industryCardsContainer');
    if (!container || !cardsContainer) return;

    var cards = cardsContainer.querySelectorAll('.card');
    if (!cards.length) return;

    var swiper = new Swiper('#industryImageSwiper', {
      loop: true,
      speed: 500,
      navigation: {
        nextEl: '.image_4-swiper .swiper-button-next',
        prevEl: '.image_4-swiper .swiper-button-prev'
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      on: {
        init: function () {
          setActiveCard(this.realIndex);
        },
        slideChangeTransitionEnd: function () {
          setActiveCard(this.realIndex);
        }
      }
    });

    function setActiveCard(realIndex) {
      cards.forEach(function (card, i) {
        card.classList.toggle('card-active', i === realIndex);
      });
    }

    cards.forEach(function (card, index) {
      card.addEventListener('click', function () {
        swiper.slideToLoop(index);
      });
    });
  }

  /**
   * 首页产品中心轮播：多张一屏（非一张一屏），仅当 >4 张时开启自动轮播，每次移动一张，无限循环
   * 容器 #productImageSwiper（.image-wrapper_2），分页 #productPagination .product-pagination-dots
   */
  function initHomeProductCarousel() {
    var el = document.getElementById('productImageSwiper');
    if (!el || el.classList.contains('product-center-swiper')) return;

    var paginationWrap = document.getElementById('productPagination');
    var dotsContainer = paginationWrap ? paginationWrap.querySelector('.product-pagination-dots') : null;
    var slides = el.querySelectorAll('.swiper-slide');
    var total = slides ? slides.length : 0;
    var enableAutoplay = total > 3;

    if (dotsContainer) {
      var existingDots = dotsContainer.querySelectorAll('.product-dot');
      if (existingDots.length !== total) {
        dotsContainer.innerHTML = '';
        for (var i = 0; i < total; i++) {
          var dot = document.createElement('span');
          dot.className = 'product-dot' + (i === 0 ? ' active' : '');
          dot.setAttribute('data-index', String(i));
          dot.setAttribute('aria-hidden', 'true');
          dotsContainer.appendChild(dot);
        }
      }
    }

    var swiper = new Swiper('#productImageSwiper', {
      loop: true,
      speed: 500,
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      spaceBetween: 0,
      navigation: {
        nextEl: '#productImageSwiper .swiper-button-next',
        prevEl: '#productImageSwiper .swiper-button-prev'
      },
      autoplay: enableAutoplay
        ? { delay: 2000, disableOnInteraction: false }
        : false,
      on: {
        init: function () {
          syncHomeProductDots(this.realIndex, total);
        },
        slideChangeTransitionEnd: function () {
          syncHomeProductDots(this.realIndex, total);
        }
      }
    });

    function syncHomeProductDots(realIndex, count) {
      if (!dotsContainer) return;
      var dots = dotsContainer.querySelectorAll('.product-dot');
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === realIndex);
      });
    }

    if (dotsContainer) {
      var dots = dotsContainer.querySelectorAll('.product-dot');
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          var index = parseInt(dot.getAttribute('data-index'), 10);
          if (!isNaN(index)) swiper.slideToLoop(index);
        });
      });
    }
  }

  /**
   * 移动端汉堡菜单：点击汉堡图标打开导航抽屉，点击遮罩或关闭按钮关闭
   */
  function initMobileNav() {
    var hamburger = document.querySelector('.hamburger-icon');
    var overlay = document.getElementById('mobileNavOverlay');
    var closeBtn = document.getElementById('mobileNavClose');
    var drawer = document.getElementById('mobileNavDrawer');
    if (!hamburger || !overlay) return;

    function openNav() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);

    overlay.addEventListener('click', function (e) {
      if (drawer && !drawer.contains(e.target)) closeNav();
    });

    /* 点击移动端导航链接后自动关闭 */
    var mobileLinks = overlay ? overlay.querySelectorAll('.mobile-nav-link') : [];
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    /* ESC 键关闭 */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /**
   * 移动端社交图标：触控设备改用点击显示/隐藏二维码弹窗
   */
  function initMobileSocialPopup() {
    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    var links = document.querySelectorAll('.social-icon-link');
    links.forEach(function (link) {
      var popup = link.querySelector('.social-popup');
      if (!popup) return;

      link.addEventListener('click', function (e) {
        e.preventDefault();
        var isOpen = popup.style.display === 'block';
        /* 先关闭所有弹窗 */
        document.querySelectorAll('.social-popup').forEach(function (p) {
          p.style.display = '';
        });
        if (!isOpen) popup.style.display = 'block';
      });
    });

    /* 点击空白处关闭弹窗 */
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.social-icon-link')) {
        document.querySelectorAll('.social-popup').forEach(function (p) {
          p.style.display = '';
        });
      }
    });
  }

  function init() {
    initIndustryCarousel();
    initHomeProductCarousel();
    initProductCenterCarousel();
    initNewsSideSwipers();
    initNewsTabs();
    initAboutPage();
    initResearchPage();
    initMobileNav();
    initMobileSocialPopup();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
