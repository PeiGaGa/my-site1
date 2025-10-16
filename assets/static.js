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

  function initLanguageSwitch() {
    var switches = document.querySelectorAll('.language-switch');
    switches.forEach(function (sw) {
      var btns = sw.querySelectorAll('.lang-btn');
      if (btns.length < 2) return;
      var cnBtn = btns[0];
      var enBtn = btns[1];
      function getRootPathFor(lang) {
        var path = window.location.pathname;
        var isSub = /\/(zh-cn|en)\//.test(path);
        if (isSub) return '../' + lang + '.html';
        return './' + lang + '.html';
      }
      if (cnBtn) cnBtn.addEventListener('click', function () {
        window.location.href = getRootPathFor('zh-cn');
      });
      if (enBtn) enBtn.addEventListener('click', function () {
        window.location.href = getRootPathFor('en');
      });
    });
  }

  function initActiveNav() {
    try {
      var currentPath = window.location.pathname;
      var links = document.querySelectorAll('.pc-nav__menu a, .m-links a');
      if (!links || links.length === 0) return;

      // Clear previous states
      links.forEach(function (a) {
        a.classList.remove('router-link-active');
        a.classList.remove('router-link-exact-active');
      });

      // Choose best match by pathname (ignore hash/query), prefer exact match
      var best = null;
      var exactPaths = [];
      links.forEach(function (a) {
        var href = a.getAttribute('href');
        if (!href || href === '#') return;
        var url;
        try {
          url = new URL(href, window.location.href);
        } catch (e) {
          return;
        }
        var path = url.pathname;

        // Exact match
        if (path === currentPath) {
          exactPaths.push(a);
          // keep first exact match as best (likely the top nav link)
          if (!best || !best.exact) {
            best = { a: a, exact: true };
          }
          return;
        }
        // Fallback: tolerate relative path differences (e.g., ../en/about.html vs /en/about.html)
        var currTail = currentPath.split('/').slice(-2).join('/');
        var pathTail = path.split('/').slice(-2).join('/');
        if (!best && currTail && pathTail && currTail === pathTail) {
          best = { a: a, exact: false };
        }
      });

      if (exactPaths.length > 0) {
        exactPaths.forEach(function (a) {
          a.classList.add('router-link-active');
          a.classList.add('router-link-exact-active');
        });
      } else if (best && best.a) {
        best.a.classList.add('router-link-active');
        if (best.exact) best.a.classList.add('router-link-exact-active');
      }
    } catch (err) {
      // noop
    }
  }

  function init() {
    var heroSwipers = document.querySelectorAll('.hero-swiper');
    heroSwipers.forEach(function (root) { initHeroSlider(root); });
    initLanguageSwitch();
    initActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


