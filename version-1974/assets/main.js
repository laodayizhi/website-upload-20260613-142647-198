(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMobileNav() {
    var button = document.querySelector('.mobile-toggle');
    var nav = document.querySelector('.mobile-nav');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  }

  function setupBackTop() {
    document.querySelectorAll('.back-top').forEach(function (button) {
      button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  function setupCardFilters() {
    document.querySelectorAll('.card-filter').forEach(function (input) {
      var section = input.closest('.content-section') || document;
      var scope = section.querySelector('.filter-scope') || section;
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-text]'));
      input.addEventListener('input', function () {
        var query = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = (card.getAttribute('data-filter-text') || '').toLowerCase();
          card.classList.toggle('is-filtered-out', query && text.indexOf(query) === -1);
        });
      });
    });
  }

  function setupHeroSlider() {
    var root = document.querySelector('[data-hero-slider]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.hero-dot'));
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer = null;

    function activate(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        activate(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        activate(i);
        start();
      });
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    start();
  }

  ready(function () {
    setupMobileNav();
    setupBackTop();
    setupCardFilters();
    setupHeroSlider();
  });
})();
