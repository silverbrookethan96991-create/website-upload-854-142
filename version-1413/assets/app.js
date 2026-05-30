(function() {
  var body = document.body;
  var header = document.querySelector("[data-header]");
  var menuToggle = document.querySelector("[data-menu-toggle]");

  function refreshHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 18) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  refreshHeader();
  window.addEventListener("scroll", refreshHeader, { passive: true });

  if (menuToggle) {
    menuToggle.addEventListener("click", function() {
      body.classList.toggle("is-menu-open");
    });
  }

  document.querySelectorAll(".mobile-nav a").forEach(function(link) {
    link.addEventListener("click", function() {
      body.classList.remove("is-menu-open");
    });
  });

  document.querySelectorAll("[data-hero]").forEach(function(hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        var on = slideIndex === active;
        slide.classList.toggle("is-active", on);
        slide.setAttribute("aria-hidden", on ? "false" : "true");
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }

    function advance(direction) {
      show(active + direction);
    }

    function resetTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function() {
        advance(1);
      }, 6200);
    }

    if (prev) {
      prev.addEventListener("click", function() {
        advance(-1);
        resetTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function() {
        advance(1);
        resetTimer();
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        resetTimer();
      });
    });

    show(0);
    resetTimer();
  });

  document.querySelectorAll("[data-search-scope]").forEach(function(scope) {
    var input = scope.querySelector("[data-search-input]");
    var yearSelect = scope.querySelector("[data-filter-year]");
    var regionSelect = scope.querySelector("[data-filter-region]");
    var cardRoot = scope.parentElement || document;
    var cards = Array.prototype.slice.call(cardRoot.querySelectorAll("[data-movie-card]"));

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function applyFilters() {
      var keyword = normalize(input ? input.value : "");
      var year = yearSelect ? yearSelect.value : "";
      var region = regionSelect ? regionSelect.value : "";

      cards.forEach(function(card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" "));
        var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchYear = !year || card.getAttribute("data-year") === year;
        var matchRegion = !region || card.getAttribute("data-region") === region;
        card.classList.toggle("is-hidden", !(matchKeyword && matchYear && matchRegion));
      });
    }

    if (input) {
      input.addEventListener("input", applyFilters);
    }
    if (yearSelect) {
      yearSelect.addEventListener("change", applyFilters);
    }
    if (regionSelect) {
      regionSelect.addEventListener("change", applyFilters);
    }
  });
}());
