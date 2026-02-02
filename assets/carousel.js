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

    var swiper = new Swiper('#productImageSwiper', {
      loop: true,
      speed: 600,
      slidesPerView: 'auto',
      spaceBetween: 0,
      navigation: {
        nextEl: '.product-pagination-next',
        prevEl: '.product-pagination-prev'
      },
      autoplay: {
        delay: 2000,
        disableOnInteraction: false
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
      var dots = paginationEl.querySelectorAll('.product-dot');
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === realIndex);
      });
    }

    paginationEl.querySelectorAll('.product-dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(dot.getAttribute('data-index'), 10);
        swiper.slideToLoop(index);
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
