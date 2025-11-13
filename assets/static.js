(function () {
  function initHeroSlider(root) {
    if (!root) return;

    var swiperInstance = new Swiper(root, {
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
        el: '.hero-custom-pagination',
        type: 'custom',
        clickable: true,
        renderCustom: function (swiper, current, total) {
          var maxVisible = 5; // 最多显示5个圆点和数字
          var html = '<div class="pagination-bullets">';
          
          // 计算显示范围
          var start, end;
          if (total <= maxVisible) {
            start = 1;
            end = total;
          } else {
            var halfVisible = Math.floor(maxVisible / 2);
            start = Math.max(1, current - halfVisible);
            end = Math.min(total, start + maxVisible - 1);
            
            if (end - start + 1 < maxVisible) {
              start = Math.max(1, end - maxVisible + 1);
            }
          }
          
          // 生成圆点
          for (var i = start; i <= end; i++) {
            if (i === current) {
              html += '<span class="pagination-bullet active" data-index="' + i + '"></span>';
            } else {
              html += '<span class="pagination-bullet" data-index="' + i + '"></span>';
            }
          }
          
          html += '</div><div class="pagination-numbers">';
          
          // 生成数字
          for (var j = start; j <= end; j++) {
            var numStr = j < 10 ? '0' + j : '' + j;
            if (j === current) {
              html += '<span class="pagination-number active" data-index="' + j + '">' + numStr + '</span>';
            } else {
              html += '<span class="pagination-number" data-index="' + j + '">' + numStr + '</span>';
            }
          }
          
          html += '</div>';
          return html;
        }
      }
    });
    
    // 添加点击事件监听
    var paginationEl = document.querySelector('.hero-custom-pagination');
    if (paginationEl) {
      paginationEl.addEventListener('click', function(e) {
        var target = e.target;
        
        if (target.classList.contains('pagination-bullet') || 
            target.classList.contains('pagination-number')) {
          var index = parseInt(target.getAttribute('data-index'));
          if (index && swiperInstance) {
            swiperInstance.slideToLoop(index - 1); // 使用slideToLoop因为是loop模式
          }
        }
      });
    }
  }

  function initIndustrySlider() {
    if (typeof Swiper === 'undefined') return;
    var el = document.querySelector('.industry-hero .swiper');
    if (!el) return;
    
    // 查找按钮元素，优先使用带特定类的按钮
    var nextBtn = el.querySelector('.industry-swiper-button-next') || 
                  el.closest('.industry-hero').querySelector('.swiper-buttons-wrap .swiper-button-next') ||
                  el.closest('.industry-hero').querySelector('.swiper-button-next');
    var prevBtn = el.querySelector('.industry-swiper-button-prev') || 
                  el.closest('.industry-hero').querySelector('.swiper-buttons-wrap .swiper-button-prev') ||
                  el.closest('.industry-hero').querySelector('.swiper-button-prev');
    
    var swiperInstance = new Swiper(el, {
      speed: 600,
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn
      },
      pagination: {
        el: '.industry-hero .industry-custom-pagination',
        type: 'custom',
        clickable: true,
        renderCustom: function (swiper, current, total) {
          var maxVisible = 5; // 最多显示5个圆点和数字
          var html = '<div class="pagination-bullets">';
          
          // 计算显示范围
          var start, end;
          if (total <= maxVisible) {
            start = 1;
            end = total;
          } else {
            var halfVisible = Math.floor(maxVisible / 2);
            start = Math.max(1, current - halfVisible);
            end = Math.min(total, start + maxVisible - 1);
            
            if (end - start + 1 < maxVisible) {
              start = Math.max(1, end - maxVisible + 1);
            }
          }
          
          // 生成圆点
          for (var i = start; i <= end; i++) {
            if (i === current) {
              html += '<span class="pagination-bullet active" data-index="' + i + '"></span>';
            } else {
              html += '<span class="pagination-bullet" data-index="' + i + '"></span>';
            }
          }
          
          html += '</div><div class="pagination-numbers">';
          
          // 生成数字
          for (var j = start; j <= end; j++) {
            var numStr = j < 10 ? '0' + j : '' + j;
            if (j === current) {
              html += '<span class="pagination-number active" data-index="' + j + '">' + numStr + '</span>';
            } else {
              html += '<span class="pagination-number" data-index="' + j + '">' + numStr + '</span>';
            }
          }
          
          html += '</div>';
          return html;
        }
      }
    });
    
    // 添加点击事件监听
    var paginationEl = el.closest('.industry-hero').querySelector('.industry-custom-pagination');
    if (paginationEl) {
      paginationEl.addEventListener('click', function(e) {
        var target = e.target;
        
        if (target.classList.contains('pagination-bullet') || 
            target.classList.contains('pagination-number')) {
          var index = parseInt(target.getAttribute('data-index'));
          if (index && swiperInstance) {
            swiperInstance.slideToLoop(index - 1); // 使用slideToLoop因为是loop模式
          }
        }
      });
    }
    
    // 返回 swiper 实例，供其他函数使用
    return swiperInstance;
  }

  // 初始化产业模块点击切换功能（支持所有首页）
  function initIndustryModules() {
    // 查找所有包含 industry-modules 的容器（支持多个页面）
    var industryLayouts = document.querySelectorAll('.industry-layout');
    
    if (!industryLayouts.length) return;
    
    industryLayouts.forEach(function(layout) {
      var industryModules = layout.querySelectorAll('.industry-modules .industry-module');
      var industryHero = layout.querySelector('.industry-hero .swiper');
      
      if (!industryModules.length || !industryHero) return;
      
      // 获取 swiper 实例，Swiper 会在初始化后将实例存储在 DOM 元素的 swiper 属性上
      function getSwiperInstance() {
        return industryHero.swiper || null;
      }
      
      // 尝试获取 swiper 实例
      var swiperInstance = getSwiperInstance();
      
      // 如果还没有初始化，等待一下再试（最多等待500ms）
      if (!swiperInstance) {
        var attempts = 0;
        var maxAttempts = 10;
        var checkInterval = setInterval(function() {
          attempts++;
          swiperInstance = getSwiperInstance();
          if (swiperInstance || attempts >= maxAttempts) {
            clearInterval(checkInterval);
            if (swiperInstance) {
              bindModuleClickEvents(industryModules, swiperInstance);
            }
          }
        }, 50);
        return;
      }
      
      bindModuleClickEvents(industryModules, swiperInstance);
    });
  }
  
  function bindModuleClickEvents(modules, swiperInstance) {
    modules.forEach(function(module, index) {
      // 避免重复绑定事件
      if (module.hasAttribute('data-module-click-bound')) return;
      module.setAttribute('data-module-click-bound', 'true');
      
      // 设置鼠标样式为指针，提示可点击
      module.style.cursor = 'pointer';
      
      // 添加点击事件
      module.addEventListener('click', function() {
        // 点击模块时切换到对应的图片（索引从0开始）
        // 使用 slideToLoop 因为 swiper 是 loop 模式
        if (swiperInstance && typeof swiperInstance.slideToLoop === 'function') {
          swiperInstance.slideToLoop(index);
        } else if (swiperInstance && typeof swiperInstance.slideTo === 'function') {
          // 如果 slideToLoop 不可用，使用 slideTo
          swiperInstance.slideTo(index);
        }
      });
    });
  }

  // Minimal generic swiper for news lists with dots pagination
  function initNewsSwipers() {
    if (typeof Swiper === 'undefined') return;
    var swipers = document.querySelectorAll('.news-page .sec-body .swiper');
    swipers.forEach(function (swiperEl) {
      var swiperInstance = new Swiper(swiperEl, {
        speed: 400,
        autoHeight: true,
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        pagination: {
          el: swiperEl.querySelector('.swiper-pagination'),
          clickable: true,
          type: 'custom',
          renderCustom: function (swiper, current, total) {
            var maxVisible = 5;
            var start, end;
            if (total <= maxVisible) {
              start = 1; end = total;
            } else {
              var half = Math.floor(maxVisible / 2);
              start = Math.max(1, current - half);
              end = Math.min(total, start + maxVisible - 1);
              if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
            }
            var html = '<div class="dots" data-v-c8ca6fd6="">';
            for (var i = start; i <= end; i++) {
              if (i === current) html += '<span class="dot swiper-pagination-bullet-active-custom" data-index="' + i + '" data-v-c8ca6fd6=""></span>';
              else html += '<span class="dot" data-index="' + i + '" data-v-c8ca6fd6=""></span>';
            }
            html += '</div><div class="numbers" data-v-c8ca6fd6="">';
            for (var j = start; j <= end; j++) {
              var numStr = j < 10 ? '0' + j : '' + j;
              if (j === current) html += '<span class="active" data-index="' + j + '" data-v-c8ca6fd6="">' + numStr + '</span>';
              else html += '<span data-index="' + j + '" data-v-c8ca6fd6="">' + numStr + '</span>';
            }
            html += '</div>';
            return html;
          }
        }
      });
      var paginationEl = swiperEl.querySelector('.swiper-pagination');
      if (paginationEl) {
        paginationEl.addEventListener('click', function (e) {
          var t = e.target;
          if (!t || !t.getAttribute) return;
          var idx = parseInt(t.getAttribute('data-index'));
          if (!idx || !swiperInstance) return;
          swiperInstance.slideToLoop(idx - 1);
        });
      }
    });
  }

  // Product page: only image swiper, content is static
  function initProductSwipers() {
    if (typeof Swiper === 'undefined') return;
    var containers = document.querySelectorAll('.product-swiper-container');
    containers.forEach(function (container) {
      var imageEl = container.querySelector('.image-swiper');
      if (!imageEl) return;

      var imageSwiper = new Swiper(imageEl, {
        speed: 400,
        effect: 'slide',
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        }
      });

      // Custom pagination (windowed like homepage hero)
      var pagination = container.querySelector('.swiper-pagination-custom');
      function getRealTotal() {
        var slides = imageEl.querySelectorAll('.swiper-slide');
        var count = 0;
        for (var k = 0; k < slides.length; k++) {
          if (!slides[k].classList.contains('swiper-slide-duplicate')) count++;
        }
        return Math.max(count, 1);
      }
      function renderCustom(current) {
        if (!pagination) return;
        var total = getRealTotal();
        var maxVisible = 5;
        var start, end;
        if (total <= maxVisible) {
          start = 1; end = total;
        } else {
          var half = Math.floor(maxVisible / 2);
          start = Math.max(1, current - half);
          end = Math.min(total, start + maxVisible - 1);
          if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
        }
        var html = '<div class="dots" data-v-872c3d89="">';
        for (var i = start; i <= end; i++) {
          if (i === current) html += '<span class="dot swiper-pagination-bullet-active-custom" data-index="' + i + '" data-v-872c3d89=""></span>';
          else html += '<span class="dot" data-index="' + i + '" data-v-872c3d89=""></span>';
        }
        html += '</div><div class="numbers" data-v-872c3d89="">';
        for (var j = start; j <= end; j++) {
          var numStr = j < 10 ? '0' + j : '' + j;
          if (j === current) html += '<span class="active" data-index="' + j + '" data-v-872c3d89="">' + numStr + '</span>';
          else html += '<span data-index="' + j + '" data-v-872c3d89="">' + numStr + '</span>';
        }
        html += '</div>';
        pagination.innerHTML = html;
      }
      function updateFromSwiper(sw) {
        var idx = typeof sw.realIndex === 'number' ? sw.realIndex : (sw.activeIndex || 0);
        var current = (idx % getRealTotal()) + 1;
        renderCustom(current);
      }
      imageSwiper.on('slideChange', function () { updateFromSwiper(imageSwiper); });
      if (pagination) {
        pagination.addEventListener('click', function (e) {
          var t = e.target;
          if (!t || !t.getAttribute) return;
          var idx = parseInt(t.getAttribute('data-index'));
          if (!idx || !imageSwiper) return;
          var to = idx - 1;
          if (imageSwiper.slideToLoop) imageSwiper.slideToLoop(to);
        });
      }
      renderCustom(1);
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
    
    var swiperInstance = new Swiper(productsSwiper, {
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
        el: '.products-custom-pagination',
        type: 'custom',
        clickable: true,
        renderCustom: function (swiper, current, total) {
          var maxVisible = 5; // 最多显示5个圆点和数字
          var html = '<div class="pagination-bullets">';
          
          // 计算显示范围
          var start, end;
          if (total <= maxVisible) {
            // 总数不超过最大显示数，显示全部
            start = 1;
            end = total;
          } else {
            // 总数超过最大显示数，计算显示范围
            var halfVisible = Math.floor(maxVisible / 2);
            start = Math.max(1, current - halfVisible);
            end = Math.min(total, start + maxVisible - 1);
            
            // 调整起始位置，确保始终显示maxVisible个
            if (end - start + 1 < maxVisible) {
              start = Math.max(1, end - maxVisible + 1);
            }
          }
          
          // 生成圆点（只显示范围内的）
          for (var i = start; i <= end; i++) {
            if (i === current) {
              html += '<span class="pagination-bullet active" data-index="' + i + '"></span>';
            } else {
              html += '<span class="pagination-bullet" data-index="' + i + '"></span>';
            }
          }
          
          html += '</div><div class="pagination-numbers">';
          
          // 生成数字（只显示范围内的）
          for (var j = start; j <= end; j++) {
            var numStr = j < 10 ? '0' + j : '' + j;
            if (j === current) {
              html += '<span class="pagination-number active" data-index="' + j + '">' + numStr + '</span>';
            } else {
              html += '<span class="pagination-number" data-index="' + j + '">' + numStr + '</span>';
            }
          }
          
          html += '</div>';
          return html;
        }
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
    
    // 添加点击事件监听（使用事件委托）
    var paginationEl = document.querySelector('.products-custom-pagination');
    if (paginationEl) {
      paginationEl.addEventListener('click', function(e) {
        var target = e.target;
        
        // 检查是否点击了圆点或数字
        if (target.classList.contains('pagination-bullet') || 
            target.classList.contains('pagination-number')) {
          var index = parseInt(target.getAttribute('data-index'));
          if (index && swiperInstance) {
            swiperInstance.slideTo(index - 1); // 注意：slideTo的索引从0开始
          }
        }
      });
    }
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

  // 新闻动态 tab 切换功能
  function initNewsTabs() {
    var newsSection = document.querySelector('.news-section');
    if (!newsSection) return;

    var navButtons = newsSection.querySelectorAll('.news-nav .nav-btn');
    var newsCards = newsSection.querySelectorAll('.news-card');
    
    if (!navButtons.length || !newsCards.length) return;

    // 为每个按钮添加点击事件
    navButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var category = btn.textContent.trim();
        
        // 切换按钮的 active 状态
        navButtons.forEach(function(b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        
        // 筛选新闻卡片
        newsCards.forEach(function(card) {
          var cardCategory = card.getAttribute('data-category');
          
          // 如果点击"全部"，显示所有卡片
          // 否则只显示匹配的分类
          if (category === '全部' || cardCategory === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  function init() {
    var heroSwipers = document.querySelectorAll('.hero-swiper');
    heroSwipers.forEach(function (root) { initHeroSlider(root); });
    initIndustrySlider();
    initIndustryModules(); // 初始化产业模块点击切换功能
    initProductsSwiper(); // 初始化产品中心轮播
    initHeaderScroll(); // 初始化导航栏滚动效果
    initNewsTabs(); // 初始化新闻动态tab切换
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


