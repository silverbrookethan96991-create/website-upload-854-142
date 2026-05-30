document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      img.classList.add("image-hidden");
    }, { once: true });
  });

  var toggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-hero]").forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var index = 0;
    var timer = null;

    function show(next) {
      if (!slides.length) return;
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        var active = current === index;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle("is-active", current === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  });

  document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
    var input = scope.querySelector("[data-search-input]");
    var selects = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-field]"));
    var list = scope.parentElement.querySelector("[data-card-list]") || document.querySelector("[data-card-list]");
    if (!list) return;
    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-card]"));

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : "";
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-tags") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-genre") || "",
          card.getAttribute("data-year") || ""
        ].join(" ").toLowerCase();
        var visible = !query || haystack.indexOf(query) !== -1;

        selects.forEach(function (select) {
          var field = select.getAttribute("data-filter-field");
          var selected = select.value;
          if (selected && card.getAttribute("data-" + field) !== selected) {
            visible = false;
          }
        });

        card.hidden = !visible;
      });
    }

    if (input) input.addEventListener("input", apply);
    selects.forEach(function (select) {
      select.addEventListener("change", apply);
    });
    apply();
  });

  document.querySelectorAll("[data-player]").forEach(function (player) {
    var video = player.querySelector("video");
    var layer = player.querySelector(".play-layer");
    var stream = player.getAttribute("data-stream");
    var loaded = false;
    var hlsInstance = null;

    function startPlayback() {
      if (!video || !stream) return;
      if (!loaded) {
        loaded = true;
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
        } else {
          video.src = stream;
        }
      }
      if (layer) layer.classList.add("is-hidden");
      var playRequest = video.play();
      if (playRequest && typeof playRequest.catch === "function") {
        playRequest.catch(function () {});
      }
    }

    if (layer) layer.addEventListener("click", startPlayback);
    if (video) {
      video.addEventListener("click", function () {
        if (!loaded) startPlayback();
      });
      video.addEventListener("play", function () {
        if (layer) layer.classList.add("is-hidden");
      });
      video.addEventListener("emptied", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
          loaded = false;
        }
      });
    }
  });
});
