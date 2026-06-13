(function() {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function() {
      mobileNav.classList.toggle("open");
    });
  }

  const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
  const prev = document.querySelector("[data-hero-prev]");
  const next = document.querySelector("[data-hero-next]");
  let heroIndex = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === heroIndex);
    });
    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === heroIndex);
    });
  }

  function restartTimer() {
    if (!slides.length) {
      return;
    }
    if (timer) {
      window.clearInterval(timer);
    }
    timer = window.setInterval(function() {
      showSlide(heroIndex + 1);
    }, 5000);
  }

  if (slides.length) {
    showSlide(0);
    restartTimer();
    if (prev) {
      prev.addEventListener("click", function() {
        showSlide(heroIndex - 1);
        restartTimer();
      });
    }
    if (next) {
      next.addEventListener("click", function() {
        showSlide(heroIndex + 1);
        restartTimer();
      });
    }
    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        showSlide(Number(dot.dataset.heroDot || 0));
        restartTimer();
      });
    });
  }

  const scope = document.querySelector("[data-filter-scope]");

  if (scope) {
    const cards = Array.from(scope.querySelectorAll("[data-movie-card]"));
    const search = scope.querySelector("[data-card-search]");
    const type = scope.querySelector("[data-type-filter]");
    const year = scope.querySelector("[data-year-filter]");
    const empty = scope.querySelector("[data-filter-empty]");

    function applyFilters() {
      const keyword = search ? search.value.trim().toLowerCase() : "";
      const typeValue = type ? type.value : "";
      const yearValue = year ? year.value : "";
      let visibleCount = 0;

      cards.forEach(function(card) {
        const haystack = [
          card.dataset.title || "",
          card.dataset.region || "",
          card.dataset.genre || "",
          card.dataset.type || "",
          card.dataset.year || ""
        ].join(" ").toLowerCase();
        const matchedKeyword = !keyword || haystack.indexOf(keyword) >= 0;
        const matchedType = !typeValue || card.dataset.type === typeValue;
        const matchedYear = !yearValue || card.dataset.year === yearValue;
        const matched = matchedKeyword && matchedType && matchedYear;
        card.hidden = !matched;
        if (matched) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.hidden = visibleCount !== 0;
      }
    }

    if (search) {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("q");
      if (query) {
        search.value = query;
      }
      search.addEventListener("input", applyFilters);
    }
    if (type) {
      type.addEventListener("change", applyFilters);
    }
    if (year) {
      year.addEventListener("change", applyFilters);
    }
    applyFilters();
  }
})();
