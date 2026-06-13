(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector(".mobile-toggle");
    var panel = document.querySelector(".mobile-panel");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var activeIndex = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle("active", current === activeIndex);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle("active", current === activeIndex);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var index = Number(dot.getAttribute("data-slide"));
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5000);
    }

    var searchParams = new URLSearchParams(window.location.search);
    var queryText = searchParams.get("q") || "";
    var searchInputs = Array.prototype.slice.call(document.querySelectorAll(".grid-search"));

    searchInputs.forEach(function (input) {
      if (queryText) {
        input.value = queryText;
      }
    });

    function applyFilters(container) {
      var section = container.closest(".content-section") || document;
      var cards = Array.prototype.slice.call(section.querySelectorAll(".movie-card, .ranking-row"));
      var searchInput = section.querySelector(".grid-search");
      var yearFilter = section.querySelector(".year-filter");
      var typeFilter = section.querySelector(".type-filter");
      var searchValue = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var yearValue = yearFilter ? yearFilter.value : "";
      var typeValue = typeFilter ? typeFilter.value : "";

      cards.forEach(function (card) {
        var haystack = (card.getAttribute("data-search") || "").toLowerCase();
        var year = card.getAttribute("data-year") || "";
        var type = card.getAttribute("data-type") || "";
        var visible = true;

        if (searchValue && haystack.indexOf(searchValue) === -1) {
          visible = false;
        }
        if (yearValue && year !== yearValue) {
          visible = false;
        }
        if (typeValue && type !== typeValue) {
          visible = false;
        }

        card.classList.toggle("hidden", !visible);
      });
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll(".filter-panel"));
    panels.forEach(function (panel) {
      var controls = Array.prototype.slice.call(panel.querySelectorAll("input, select"));
      controls.forEach(function (control) {
        control.addEventListener("input", function () {
          applyFilters(panel);
        });
        control.addEventListener("change", function () {
          applyFilters(panel);
        });
      });
      applyFilters(panel);
    });

    var forms = Array.prototype.slice.call(document.querySelectorAll(".nav-search, .mobile-search"));
    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
        }
      });
    });
  });

  window.initMoviePlayer = function (playerId, streamUrl) {
    var shell = document.getElementById(playerId);

    if (!shell) {
      return;
    }

    var video = shell.querySelector("video");
    var button = shell.querySelector(".play-overlay");
    var prepared = false;
    var hlsPlayer = null;

    function attachStream() {
      if (prepared || !video) {
        return;
      }

      prepared = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsPlayer = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hlsPlayer.loadSource(streamUrl);
        hlsPlayer.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function playVideo() {
      attachStream();
      shell.classList.add("is-playing");
      if (button) {
        button.setAttribute("aria-hidden", "true");
      }
      if (video) {
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }
    }

    if (button) {
      button.addEventListener("click", playVideo);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          playVideo();
        }
      });
      video.addEventListener("play", function () {
        shell.classList.add("is-playing");
      });
      video.addEventListener("emptied", function () {
        if (hlsPlayer) {
          hlsPlayer.destroy();
          hlsPlayer = null;
          prepared = false;
        }
      });
    }
  };
})();
