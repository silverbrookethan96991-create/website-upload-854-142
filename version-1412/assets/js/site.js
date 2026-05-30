(function() {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function one(selector, root) {
    return (root || document).querySelector(selector);
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  document.addEventListener("DOMContentLoaded", function() {
    var header = one("[data-header]");
    var mobileNav = one("[data-mobile-nav]");
    var menuButton = one("[data-menu-button]");

    function updateHeader() {
      if (!header) {
        return;
      }
      if (window.scrollY > 24) {
        header.classList.add("is-solid");
      } else {
        header.classList.remove("is-solid");
      }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function() {
        mobileNav.classList.toggle("is-open");
      });
    }

    all("[data-hero]").forEach(function(hero) {
      var slides = all("[data-hero-slide]", hero);
      var dots = all("[data-hero-dot]", hero);
      var prev = one("[data-hero-prev]", hero);
      var next = one("[data-hero-next]", hero);
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function(slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === current);
        });
        dots.forEach(function(dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === current);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function() {
          show(current + 1);
        }, 5200);
      }

      if (prev) {
        prev.addEventListener("click", function() {
          show(current - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function() {
          show(current + 1);
          restart();
        });
      }

      dots.forEach(function(dot) {
        dot.addEventListener("click", function() {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          restart();
        });
      });

      show(0);
      restart();
    });

    all("[data-catalog]").forEach(function(catalog) {
      var input = one("[data-search-input]", catalog);
      var type = one("[data-filter-type]", catalog);
      var region = one("[data-filter-region]", catalog);
      var year = one("[data-filter-year]", catalog);
      var cards = all("[data-movie-card]", catalog);

      function applyFilters() {
        var query = normalize(input && input.value);
        var selectedType = normalize(type && type.value);
        var selectedRegion = normalize(region && region.value);
        var selectedYear = normalize(year && year.value);

        cards.forEach(function(card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-tags"),
            card.textContent
          ].join(" "));
          var ok = true;

          if (query && haystack.indexOf(query) === -1) {
            ok = false;
          }
          if (selectedType && normalize(card.getAttribute("data-type")) !== selectedType) {
            ok = false;
          }
          if (selectedRegion && normalize(card.getAttribute("data-region")) !== selectedRegion) {
            ok = false;
          }
          if (selectedYear && normalize(card.getAttribute("data-year")) !== selectedYear) {
            ok = false;
          }

          card.classList.toggle("is-hidden", !ok);
        });
      }

      [input, type, region, year].forEach(function(control) {
        if (control) {
          control.addEventListener("input", applyFilters);
          control.addEventListener("change", applyFilters);
        }
      });
    });
  });
})();
