/**
 * 产业布局轮播：.image_4-swiper 与 .cards-container 配套联动
 * 产品中心轮播：.image-wrapper_2 一直往右、2 秒一张、无限轮播
 * 新闻动态 tab：全部、企业新闻、行业动态、通知公告
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

  function initProductSwiper() {
    var el = document.getElementById('productImageSwiper');
    var paginationEl = document.getElementById('productPagination');
    if (!el) return;

    var slides = el.querySelectorAll('.swiper-slide');
    var total = slides ? slides.length : 4;

    var swiper = new Swiper('#productImageSwiper', {
      loop: true,
      speed: 600,
      slidesPerView: 4,
      spaceBetween: 0,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false
      },
      navigation: {
        nextEl: '.product-pagination-next',
        prevEl: '.product-pagination-prev'
      },
      on: {
        init: function () {
          setProductPaginationActive(this.realIndex);
        },
        slideChangeTransitionEnd: function () {
          setProductPaginationActive(this.realIndex);
        }
      }
    });

    if (!paginationEl) return;

    function setProductPaginationActive(realIndex) {
      var prev2 = (realIndex - 2 + total) % total;
      var prev1 = (realIndex - 1 + total) % total;
      var next1 = (realIndex + 1) % total;
      var next2 = (realIndex + 2) % total;
      var orderMap = {};
      orderMap[prev2] = 1;
      orderMap[prev1] = 2;
      orderMap[realIndex] = 3;
      orderMap[next1] = 4;
      if (total > 4) orderMap[next2] = 5;

      var dots = paginationEl.querySelectorAll('.product-dot');
      var nums = paginationEl.querySelectorAll('.product-dot-num');
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === realIndex);
        dot.style.order = orderMap[i] || 0;
      });
      nums.forEach(function (num, i) {
        num.classList.toggle('active', i === realIndex);
        num.style.order = orderMap[i] || 0;
      });

      var tabSets = document.querySelectorAll('.product-tab-set');
      tabSets.forEach(function (set) {
        var idx = parseInt(set.getAttribute('data-slide-index'), 10);
        set.classList.toggle('active', idx === realIndex);
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

  function init() {
    initIndustryCarousel();
    initProductSwiper();
    initNewsSideSwipers();
    initNewsTabs();
    initAboutPage();
    initResearchPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
