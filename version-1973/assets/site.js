(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function initMobileMenu() {
    var button = document.querySelector("[data-menu-button]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function initHeroCarousel() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var tabs = Array.prototype.slice.call(root.querySelectorAll("[data-hero-tab]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle("is-active", current === index);
      });
      tabs.forEach(function (tab, current) {
        tab.classList.toggle("is-active", current === index);
      });
    }

    function play() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    tabs.forEach(function (tab, current) {
      tab.addEventListener("click", function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(current);
        play();
      });
    });

    show(0);
    play();
  }

  function initSearchForms() {
    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input");
        var query = input ? input.value.trim() : "";
        var target = form.getAttribute("action") || "search.html";
        window.location.href = target + (query ? "?q=" + encodeURIComponent(query) : "");
      });
    });
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function initInlineFilters() {
    document.querySelectorAll("[data-filter-input]").forEach(function (input) {
      var targetSelector = input.getAttribute("data-filter-input");
      var items = Array.prototype.slice.call(document.querySelectorAll(targetSelector));
      var empty = document.querySelector(input.getAttribute("data-empty-target") || "");

      function apply() {
        var value = normalize(input.value);
        var visible = 0;
        items.forEach(function (item) {
          var haystack = normalize(item.getAttribute("data-search"));
          var matched = !value || haystack.indexOf(value) !== -1;
          item.classList.toggle("is-filtered-out", !matched);
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      input.addEventListener("input", apply);
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q");
      if (initialQuery && !input.value) {
        input.value = initialQuery;
      }
      apply();
    });
  }

  function initMoviePlayers() {
    document.querySelectorAll("[data-player]").forEach(function (shell) {
      var video = shell.querySelector("video");
      var overlay = shell.querySelector("[data-play-button]");
      var source = video ? video.querySelector("source") : null;
      var src = source ? source.getAttribute("src") : "";
      var started = false;

      function loadAndPlay() {
        if (!video || !src) {
          return;
        }
        if (!started) {
          started = true;
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
          } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true
            });
            hls.loadSource(src);
            hls.attachMedia(video);
            shell.hlsInstance = hls;
          } else {
            video.src = src;
          }
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }

      if (overlay) {
        overlay.addEventListener("click", loadAndPlay);
      }
      if (video) {
        video.addEventListener("play", function () {
          if (overlay) {
            overlay.classList.add("is-hidden");
          }
        });
        video.addEventListener("pause", function () {
          if (overlay && video.currentTime === 0) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    });
  }

  window.initMoviePlayers = initMoviePlayers;

  ready(function () {
    initMobileMenu();
    initHeroCarousel();
    initSearchForms();
    initInlineFilters();
    initMoviePlayers();
  });
})();
