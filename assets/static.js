(function () {
  var GLOBAL_SCOPE = typeof window !== 'undefined' ? window : {};
  var DOC = typeof document !== 'undefined' ? document : null;
  var AMAP_KEY = 'bf4becc879f5b42fbc73246f516cac3a';
  var MAP_ICON_URL =
    (GLOBAL_SCOPE && GLOBAL_SCOPE.MAP_ICON_URL) || '../assets/mapicon.png';
  var amapLoaderPromise = null;

  function loadAmapSdk() {
    if (typeof window === 'undefined' || !DOC) {
      return Promise.reject(new Error('AMap SDK cannot load outside browser'));
    }
    if (typeof window.AMap !== 'undefined') {
      return Promise.resolve(window.AMap);
    }
    if (!AMAP_KEY || AMAP_KEY === 'REPLACE_WITH_YOUR_AMAP_WEB_KEY') {
      console.warn('AMap key is missing. Set window.AMAP_KEY or update static.js');
      return Promise.reject(new Error('Missing AMap key'));
    }
    if (amapLoaderPromise) {
      return amapLoaderPromise;
    }

    amapLoaderPromise = new Promise(function (resolve, reject) {
      var script = DOC.createElement('script');
      script.type = 'text/javascript';
      script.src =
        'https://webapi.amap.com/maps?v=2.0&key=' +
        encodeURIComponent(AMAP_KEY) +
        '&plugin=AMap.Geocoder';
      script.async = true;
      script.defer = true;
      script.onload = function () {
        if (window.AMap) {
          resolve(window.AMap);
        } else {
          amapLoaderPromise = null;
          reject(new Error('AMap loaded without exposing API'));
        }
      };
      script.onerror = function (err) {
        amapLoaderPromise = null;
        reject(err || new Error('Failed to load AMap SDK'));
      };
      DOC.head.appendChild(script);
    });

    return amapLoaderPromise;
  }

  function initHeroSlider(root) {
    if (!root) return;

    var swiperInstance = new Swiper(root, {
      loop: true,
      speed: 800,
      autoplay: {
        delay: 2500,
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

  function initContactMaps() {
    if (!DOC) return;
    var mapContainers = DOC.querySelectorAll('.contact-card .map');
    if (!mapContainers.length) return;

    loadAmapSdk()
      .then(function (AMap) {
        if (!AMap) return;

        function bootstrapMaps() {
          mapContainers.forEach(function (container) {
            if (container.getAttribute('data-amap-ready') === 'true') return;
            container.setAttribute('data-amap-ready', 'true');

            var zoomAttr = parseInt(container.getAttribute('data-map-zoom'), 10);
            var zoom = !isNaN(zoomAttr) ? zoomAttr : 14;
            var title = container.getAttribute('data-map-title') || '';
            var address = container.getAttribute('data-map-address') || '';
            var lat = parseFloat(container.getAttribute('data-map-lat'));
            var lng = parseFloat(container.getAttribute('data-map-lng'));
            var city = container.getAttribute('data-map-city') || '';
            var hasCoords = !isNaN(lat) && !isNaN(lng);
            var center = hasCoords ? [lng, lat] : undefined;

            var map = new AMap.Map(container, {
              zoom: hasCoords ? zoom : 12,
              viewMode: '2D',
              center: center,
            });

            var markerIcon = null;
            if (MAP_ICON_URL) {
              markerIcon = new AMap.Icon({
                image: MAP_ICON_URL,
                imageSize: new AMap.Size(64, 64),
                size: new AMap.Size(64, 64),
              });
            }

            function placeMarker(position) {
              if (!position) return;
              map.setZoom(zoom);
              map.setCenter(position);
              // 使用默认图标创建标记
              var marker = new AMap.Marker({
                position: position,
                title: title || address || '',
                icon: markerIcon || undefined,
                anchor: 'bottom-center',
              });
              map.add(marker);
            }

            if (hasCoords) {
              placeMarker(center);
              return;
            }

            if (!address || !AMap.Geocoder) {
              console.warn(
                'Map container missing address or Geocoder support',
                container
              );
              return;
            }

            var geocoderOptions = {};
            if (city) {
              geocoderOptions.city = city;
            }
            var geocoder = new AMap.Geocoder(geocoderOptions);

            geocoder.getLocation(address, function (status, result) {
              if (
                status === 'complete' &&
                result &&
                result.geocodes &&
                result.geocodes.length
              ) {
                var loc = result.geocodes[0].location;
                placeMarker([loc.lng, loc.lat]);
              } else {
                console.warn('AMap geocode failed', address, result);
              }
            });
          });
        }

        if (AMap.plugin && typeof AMap.plugin === 'function') {
          AMap.plugin('AMap.Geocoder', bootstrapMaps);
        } else {
          bootstrapMaps();
        }
      })
      .catch(function (err) {
        console.warn('Unable to initialize contact maps', err);
      });
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
      autoplay: { delay: 2500, disableOnInteraction: false },
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
    
    // 添加轮播切换事件监听，更新模块状态
    swiperInstance.on('slideChange', function() {
      updateIndustryModuleState(swiperInstance);
    });
    
    // 初始化时设置模块状态
    updateIndustryModuleState(swiperInstance);
    
    // 返回 swiper 实例，供其他函数使用
    return swiperInstance;
  }

  // 更新产业模块的选中状态
  function updateIndustryModuleState(swiperInstance) {
    if (!swiperInstance) return;
    
    // 获取当前轮播的真实索引（考虑loop模式）
    var realIndex = swiperInstance.realIndex !== undefined ? swiperInstance.realIndex : swiperInstance.activeIndex;
    
    // 查找对应的industry-layout容器
    var industryLayout = swiperInstance.el.closest('.industry-layout');
    if (!industryLayout) return;
    
    // 获取所有industry-module
    var modules = industryLayout.querySelectorAll('.industry-modules .industry-module');
    
    // 更新所有模块的状态
    modules.forEach(function(module, index) {
      if (index === realIndex) {
        module.classList.add('active');
      } else {
        module.classList.remove('active');
      }
    });
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
      
      // 设置初始状态
      if (swiperInstance) {
        updateIndustryModuleState(swiperInstance);
      }
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
        // 更新模块状态（slideChange事件也会触发，但这里确保立即更新）
        updateIndustryModuleState(swiperInstance);
      });
    });
  }

  function countRealSlides(swiperEl) {
    if (!swiperEl) return 0;
    var slides = swiperEl.querySelectorAll('.swiper-slide');
    var realCount = 0;
    for (var i = 0; i < slides.length; i++) {
      var slide = slides[i];
      if (!slide || !slide.classList) continue;
      if (!slide.classList.contains('swiper-slide-duplicate')) realCount++;
    }
    return realCount || slides.length || 0;
  }

  // Minimal generic swiper for news lists with dots pagination
  function initNewsSwipers() {
    if (typeof Swiper === 'undefined') return;
    var swipers = document.querySelectorAll('.news-page .sec-body .swiper');
    swipers.forEach(function (swiperEl) {
      var realSlideCount = countRealSlides(swiperEl);
      var hasMultipleSlides = realSlideCount > 1;
      var paginationEl = swiperEl.querySelector('.swiper-pagination');
      if (!hasMultipleSlides && paginationEl) {
        paginationEl.style.display = 'none';
      } else if (paginationEl) {
        paginationEl.style.removeProperty('display');
      }
      var swiperInstance = new Swiper(swiperEl, {
        speed: 400,
        autoHeight: true,
        loop: hasMultipleSlides,
        allowTouchMove: hasMultipleSlides,
        autoplay: hasMultipleSlides ? { delay: 2500, disableOnInteraction: false } : false,
        pagination: hasMultipleSlides
          ? {
              el: paginationEl,
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
          : false
      });
      if (hasMultipleSlides && paginationEl) {
        paginationEl.addEventListener('click', function (e) {
          var t = e.target;
          if (!t || !t.getAttribute) return;
          var idx = parseInt(t.getAttribute('data-index'));
          if (!idx || !swiperInstance) return;
          if (typeof swiperInstance.slideToLoop === 'function') {
            swiperInstance.slideToLoop(idx - 1);
          } else if (typeof swiperInstance.slideTo === 'function') {
            swiperInstance.slideTo(idx - 1);
          }
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
          delay: 2500,
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
      loop: true,
      centeredSlides: false,
      speed: 800,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.products-custom-pagination',
        type: 'custom',
        clickable: true,
        renderCustom: function (swiper, current, total) {
          // 所有屏幕尺寸下，分页器都基于slide索引，每次只移动一张图
          // 确保 current 和 total 都在有效范围内
          var maxTotal = Math.max(1, total); // 确保至少为1
          var currentIndex = Math.max(1, Math.min(current, maxTotal)); // 确保 current 在 1 到 maxTotal 之间
          
          var maxVisible = 5; // 最多显示5个圆点和数字
          var html = '<div class="pagination-bullets">';
          
          // 计算显示范围（基于slide索引）
          var start, end;
          if (maxTotal <= maxVisible) {
            // 总数不超过最大显示数，显示全部
            start = 1;
            end = maxTotal;
          } else {
            // 总数超过最大显示数，计算显示范围
            var halfVisible = Math.floor(maxVisible / 2);
            start = Math.max(1, currentIndex - halfVisible);
            end = Math.min(maxTotal, start + maxVisible - 1);
            
            // 调整起始位置，确保始终显示maxVisible个（但不超过总数）
            if (end - start + 1 < maxVisible) {
              // 如果显示的数量不足，调整起始位置
              start = Math.max(1, end - maxVisible + 1);
              // 再次确保 end 不超过总数
              end = Math.min(maxTotal, start + maxVisible - 1);
            }
          }
          
          // 最终确保 end 不超过实际总数
          end = Math.min(end, maxTotal);
          start = Math.max(1, Math.min(start, maxTotal));
          
          // 生成圆点（只显示范围内的）
          for (var i = start; i <= end; i++) {
            if (i === currentIndex) {
              html += '<span class="pagination-bullet active" data-index="' + i + '"></span>';
            } else {
              html += '<span class="pagination-bullet" data-index="' + i + '"></span>';
            }
          }
          
          html += '</div><div class="pagination-numbers">';
          
          // 生成数字（只显示范围内的）
          for (var j = start; j <= end; j++) {
            var numStr = j < 10 ? '0' + j : '' + j;
            if (j === currentIndex) {
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
        // 所有机型都显示4个产品，与CSS保持一致
        "@0.00": {
          slidesPerView: 4,
          spaceBetween: 0,
        },
        "@0.75": {
          slidesPerView: 4,
          spaceBetween: 0,
        },
        "@1.00": {
          slidesPerView: 4,
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
            // 获取实际的 slide 总数
            var totalSlides = swiperInstance.slides ? swiperInstance.slides.length : 0;
            // 排除重复的 slide（如果有 loop 模式）
            var realSlides = 0;
            if (swiperInstance.slides) {
              for (var s = 0; s < swiperInstance.slides.length; s++) {
                if (!swiperInstance.slides[s].classList.contains('swiper-slide-duplicate')) {
                  realSlides++;
                }
              }
            }
            if (realSlides > 0) {
              totalSlides = realSlides;
            }
            
            // 确保索引在有效范围内
            var slideIndex = index - 1; // index 是从1开始的，slideTo 的索引从0开始
            slideIndex = Math.max(0, Math.min(slideIndex, totalSlides - 1));
            
            // 所有屏幕尺寸下，都只移动一张图（一个slide）
            // Swiper 会根据当前屏幕尺寸下的 slide 实际宽度自动计算移动距离
            swiperInstance.slideTo(slideIndex);
          }
        }
      });
    }
    
    // 监听窗口大小改变，确保 Swiper 能正确更新 slide 宽度
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (swiperInstance) {
          swiperInstance.update();
        }
      }, 100);
    });
  }

  // Language switching is now handled by <a> tags, no JavaScript needed
  // function initLanguageSwitch() {
  //   var switches = document.querySelectorAll('.language-switch');
  //   switches.forEach(function (sw) {
  //     var btns = sw.querySelectorAll('.lang-btn');
  //     if (btns.length < 2) return;
  //     var cnBtn = btns[0];
  //     var enBtn = btns[1];
  //     function resolveCounterpartPath(targetLang) {
  //       var loc = window.location;
  //       var path = loc.pathname || '';
  //       var search = loc.search || '';
  //       var hash = loc.hash || '';

  //       // Inside language subfolder -> swap folder keep filename
  //       var subMatch = path.match(/\/(zh-cn|en)\/([^\/]+\.html)$/);
  //       if (subMatch) {
  //         var filename = subMatch[2];
  //         return '../' + targetLang + '/' + filename + search + hash;
  //       }

  //       // On root language file -> swap root file
  //       var rootLangMatch = path.match(/\/(zh-cn|en)\.html$/);
  //       if (rootLangMatch) {
  //         return './' + targetLang + '.html' + search + hash;
  //       }

  //       // Otherwise (e.g., index.html or bare root) -> go to target root language file
  //       return './' + targetLang + '.html' + search + hash;
  //     }

  //     function detectCurrentLang() {
  //       var path = window.location.pathname || '';
  //       if (/\/(en)(\/|\.html)/.test(path)) return 'en';
  //       if (/\/(zh-cn)(\/|\.html)/.test(path)) return 'zh-cn';
  //       // Fallback to stored preference or default zh-cn
  //       var stored = null;
  //       try { stored = localStorage.getItem('preferredLang'); } catch (e) {}
  //       return stored === 'en' ? 'en' : 'zh-cn';
  //     }

  //     function setActive(lang) {
  //       if (!cnBtn || !enBtn) return;
  //       cnBtn.classList.toggle('active', lang === 'zh-cn');
  //       enBtn.classList.toggle('active', lang === 'en');
  //     }

  //     // Initialize active state based on URL/preference and persist if URL encodes a lang
  //     var currentLang = detectCurrentLang();
  //     setActive(currentLang);
  //     if (/\/(en|zh-cn)(\/|\.html)/.test(window.location.pathname || '')) {
  //       try { localStorage.setItem('preferredLang', currentLang); } catch (e) {}
  //     }

  //     if (cnBtn) cnBtn.addEventListener('click', function () {
  //       try { localStorage.setItem('preferredLang', 'zh-cn'); } catch (e) {}
  //       window.location.href = resolveCounterpartPath('zh-cn');
  //     });
  //     if (enBtn) enBtn.addEventListener('click', function () {
  //       try { localStorage.setItem('preferredLang', 'en'); } catch (e) {}
  //       window.location.href = resolveCounterpartPath('en');
  //     });
  //   });
  // }

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

    // 检查是否是新闻详情页面
    var isNewsDetailPage = document.querySelector('.news-detail-page') !== null;
    
    var scrollThreshold = 100; // 滚动阈值，可以根据需要调整
    
    function updateHeaderBackground() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      
      // 如果是新闻详情页面，始终显示导航栏
      if (isNewsDetailPage) {
        if (pcHeader) {
          pcHeader.classList.remove('is-transparent');
        }
        if (mHeader) {
          mHeader.classList.remove('is-transparent');
        }
        return;
      }
      
      // 其他页面的逻辑
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
    var newsGrid = newsSection.querySelector('.news-grid');
    var newsCards = newsSection.querySelectorAll('.news-card');
    
    if (!navButtons.length || !newsCards.length || !newsGrid) return;

    // 将新闻卡片转换为数组并添加排序信息
    var cardsArray = Array.from(newsCards).map(function(card) {
      return {
        element: card,
        category: card.getAttribute('data-category'),
        isPinned: card.getAttribute('data-pinned') === 'true',
        date: card.querySelector('.news-date') ? card.querySelector('.news-date').textContent.trim() : '',
        originalIndex: Array.from(newsCards).indexOf(card)
      };
    });

    // 排序函数：置顶优先,然后按日期排序
    function sortCards(cards) {
      return cards.sort(function(a, b) {
        // 首先按置顶排序
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        // 如果置顶状态相同,按日期排序(最新的在前)
        if (a.date && b.date) {
          return b.date.localeCompare(a.date);
        }
        
        // 如果没有日期,保持原顺序
        return a.originalIndex - b.originalIndex;
      });
    }

    // 显示卡片函数
    function displayCards(category) {
      var filteredCards = cardsArray;
      
      // 如果不是"全部",进行筛选
      if (category !== '全部' && category !== 'All') {
        filteredCards = cardsArray.filter(function(card) {
          return card.category === category;
        });
      }
      
      // 排序
      var sortedCards = sortCards(filteredCards.slice());
      
      // 只显示前3个
      var displayCards = sortedCards.slice(0, 3);
      
      // 清空网格
      newsGrid.innerHTML = '';
      
      // 添加卡片
      displayCards.forEach(function(card) {
        newsGrid.appendChild(card.element.cloneNode(true));
      });
      
      // 如果没有卡片,显示提示
      if (displayCards.length === 0) {
        var emptyMsg = document.createElement('div');
        emptyMsg.className = 'news-empty-message';
        emptyMsg.textContent = '暂无相关新闻';
        emptyMsg.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 40px; color: #999;';
        newsGrid.appendChild(emptyMsg);
      }
    }

    // 为每个按钮添加点击事件
    navButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var category = btn.getAttribute('data-category') || btn.textContent.trim();
        
        // 切换按钮的 active 状态
        navButtons.forEach(function(b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        
        // 显示筛选后的卡片
        displayCards(category);
      });
    });

    // 初始化显示"全部"
    displayCards('全部');
  }

  function initNewsListTabs() {
    // 新闻列表页的标签切换
    var tabsContainer = document.querySelector('.news-tabs-container');
    if (!tabsContainer) return;
    
    var tabButtons = tabsContainer.querySelectorAll('.tab-btn');
    var newsSections = document.querySelectorAll('.news-section');
    
    if (!tabButtons.length || !newsSections.length) return;
    
    tabButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var category = btn.getAttribute('data-category');
        
        // 切换按钮状态
        tabButtons.forEach(function(b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        
        // 显示/隐藏对应的新闻区块
        newsSections.forEach(function(section) {
          var sectionTitle = section.querySelector('.sec-title');
          if (!sectionTitle) return;
          
          var sectionCategory = sectionTitle.textContent.trim();
          
          // "全部"显示所有区块
          if (category === '全部' || category === 'All') {
            section.style.display = 'block';
          } else if (sectionCategory === category) {
            section.style.display = 'block';
          } else {
            section.style.display = 'none';
          }
        });
      });
    });
  }

  function initSidebarNav() {
    console.log('初始化侧边栏导航...');
    var sidebarNav = document.querySelector('.sidebar-nav');
    if (!sidebarNav) {
      console.log('未找到 .sidebar-nav 元素');
      return;
    }
    console.log('找到侧边栏导航元素');
    
    var navItems = sidebarNav.querySelectorAll('.sidebar-nav-item');
    var sections = ['#intro', '#honors', '#duty'];
    
    console.log('找到', navItems.length, '个导航项');
    
    // 检查页面是否可滚动
    var bodyHeight = document.body.scrollHeight;
    var windowHeight = window.innerHeight;
    console.log('页面高度:', bodyHeight, '窗口高度:', windowHeight, '可滚动:', bodyHeight > windowHeight);
    
    // 平滑滚动处理
    navItems.forEach(function(item, index) {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var targetId = item.getAttribute('href');
        var targetElement = document.querySelector(targetId);
        
        console.log('点击导航项:', targetId, '目标元素:', targetElement);
        
        if (targetElement) {
          // 更新激活状态
          navItems.forEach(function(nav) {
            nav.classList.remove('active');
          });
          item.classList.add('active');
          
          // 使用 scrollIntoView 方法
          try {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // 调整偏移量（因为有固定头部）
            setTimeout(function() {
              var scrolledY = window.pageYOffset || document.documentElement.scrollTop;
              if (scrolledY > 0) {
                window.scrollTo({
                  top: scrolledY - 120,
                  behavior: 'smooth'
                });
              }
            }, 100);
            
            console.log('滚动到:', targetId);
          } catch (err) {
            console.log('滚动失败:', err);
          }
        } else {
          console.log('未找到目标元素:', targetId);
        }
      });
    });
    
    // 滚动时更新激活状态
    function updateActiveNav() {
      var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      
      // 添加一个偏移量,当section进入视口上方时激活
      var offset = 200;
      var currentScrollPos = scrollPos + offset;
      
      var currentSection = -1;
      
      // 遍历所有section,找到当前应该激活的
      for (var i = 0; i < sections.length; i++) {
        var sectionId = sections[i];
        var section = document.querySelector(sectionId);
        if (!section) continue;
        
        // 获取section相对于文档的位置
        var rect = section.getBoundingClientRect();
        var sectionTop = rect.top + scrollPos;
        var sectionBottom = sectionTop + section.offsetHeight;
        
        // 如果当前滚动位置在这个section范围内
        if (currentScrollPos >= sectionTop && currentScrollPos < sectionBottom) {
          currentSection = i;
          break;
        }
      }
      
      // 如果没有找到匹配的section,检查是否在第一个section之前
      if (currentSection === -1) {
        var firstSection = document.querySelector(sections[0]);
        if (firstSection) {
          var firstRect = firstSection.getBoundingClientRect();
          var firstTop = firstRect.top + scrollPos;
          if (currentScrollPos < firstTop) {
            currentSection = 0;
          } else {
            // 默认激活最后一个
            currentSection = sections.length - 1;
          }
        }
      }
      
      // 更新导航激活状态
      navItems.forEach(function(nav, index) {
        if (index === currentSection) {
          nav.classList.add('active');
        } else {
          nav.classList.remove('active');
        }
      });
    }
    
    // 滚动时更新激活状态 - 使用节流
    var scrollTimer = null;
    var lastScrollPos = -1;
    
    function handleScroll() {
      var currentScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      
      // 只有当滚动位置真的改变时才更新
      if (Math.abs(currentScrollPos - lastScrollPos) > 5) {
        lastScrollPos = currentScrollPos;
        
        if (scrollTimer) {
          clearTimeout(scrollTimer);
        }
        
        scrollTimer = setTimeout(function() {
          updateActiveNav();
        }, 50);
      }
    }
    
    // 绑定多个滚动事件
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    
    // 初始更新
    setTimeout(function() {
      updateActiveNav();
      console.log('侧边栏导航初始化完成');
      
      // 强制触发一次滚动检测
      handleScroll();
    }, 500);
  }

  function init() {
    var heroSwipers = document.querySelectorAll('.hero-swiper');
    heroSwipers.forEach(function (root) { initHeroSlider(root); });
    initIndustrySlider();
    initIndustryModules(); // 初始化产业模块点击切换功能
    initProductsSwiper(); // 初始化产品中心轮播
    initContactMaps(); // 初始化联系页面地图
    // initHeaderScroll(); // 初始化导航栏滚动效果 - 已禁用头部滚动变色功能
    initNewsTabs(); // 初始化新闻动态tab切换
    initNewsListTabs(); // 初始化新闻列表页tab切换
    initSidebarNav(); // 初始化侧边栏导航
    // mobile drawer
    try {
      var mContainer = document.querySelector('.m-container');
      if (!mContainer) return;
      
      var overlay = mContainer.querySelector('.drawer-overlay');
      var drawer = mContainer.querySelector('.drawer');
      if (!overlay || !drawer) return;

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

      // 绑定所有 hamburger 按钮
      var hamburgers = document.querySelectorAll('.hamburger');
      hamburgers.forEach(function (hamburger) {
        hamburger.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        });
      });

      // 绑定关闭事件
      overlay.addEventListener('click', function () { setOpen(false); });
      var closeBtn = mContainer.querySelector('.drawer__close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () { setOpen(false); });
      }
      
      // ESC to close
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && open) {
          setOpen(false);
        }
      });
    } catch (e) {
      console.error('Drawer init error:', e);
    }
    // initLanguageSwitch(); // Language switching now handled by <a> tags
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


