(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var button = document.querySelector(".menu-toggle");
    var menu = document.querySelector(".mobile-nav");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  function setupSearch() {
    var input = document.querySelector(".site-search");
    var grid = document.querySelector(".filter-grid");
    if (!input || !grid) {
      return;
    }
    var items = Array.prototype.slice.call(grid.children);
    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      items.forEach(function (item) {
        var content = item.textContent.toLowerCase() + " " + Array.prototype.map.call(item.attributes, function (attribute) {
          return attribute.value;
        }).join(" ").toLowerCase();
        item.classList.toggle("is-hidden", query && content.indexOf(query) === -1);
      });
    });
  }

  function setupHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }
    function next() {
      show(current + 1);
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(next, 5200);
      });
    });
    timer = window.setInterval(next, 5200);
  }

  window.setupMoviePlayer = function (videoId, buttonId, sourceUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    if (!video || !button || !sourceUrl) {
      return;
    }
    var hls = null;
    var started = false;
    function attach() {
      if (started) {
        return;
      }
      started = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
      } else if (typeof Hls !== "undefined" && Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }
    }
    function play() {
      attach();
      button.classList.add("hidden");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          button.classList.remove("hidden");
        });
      }
    }
    button.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (!started) {
        play();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  ready(function () {
    setupMenu();
    setupSearch();
    setupHero();
  });
})();
