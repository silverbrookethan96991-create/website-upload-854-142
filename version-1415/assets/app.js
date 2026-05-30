function setupMenu() {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-mobile-nav]');

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
  });
}

function setupHero() {
  var carousel = document.querySelector('[data-hero-carousel]');

  if (!carousel) {
    return;
  }

  var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
  var index = 0;

  function show(next) {
    if (!slides.length) {
      return;
    }

    index = (next + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === index);
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      show(Number(dot.getAttribute('data-hero-dot')) || 0);
    });
  });

  setInterval(function () {
    show(index + 1);
  }, 5200);
}

function setupCatalogFilters() {
  var catalogs = Array.prototype.slice.call(document.querySelectorAll('[data-catalog]'));

  catalogs.forEach(function (catalog) {
    var textInput = catalog.querySelector('[data-filter-text]');
    var yearSelect = catalog.querySelector('[data-filter-year]');
    var typeSelect = catalog.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(catalog.querySelectorAll('.movie-card, .rank-item'));
    var emptyState = catalog.querySelector('[data-empty-state]');

    function match(card) {
      var text = textInput ? textInput.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var haystack = [
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags')
      ].join(' ').toLowerCase();
      var yearOk = !year || card.getAttribute('data-year') === year;
      var typeOk = !type || card.getAttribute('data-type') === type;
      var textOk = !text || haystack.indexOf(text) !== -1;

      return yearOk && typeOk && textOk;
    }

    function filter() {
      var visible = 0;

      cards.forEach(function (card) {
        var ok = match(card);
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('show', visible === 0);
      }
    }

    [textInput, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', filter);
        control.addEventListener('change', filter);
      }
    });
  });
}

function initMoviePlayer(streamUrl) {
  var video = document.getElementById('movie-player');
  var overlay = document.getElementById('play-overlay');
  var hls;

  if (!video || !streamUrl) {
    return;
  }

  function bindStream() {
    if (video.src) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
  }

  function start() {
    bindStream();

    var playPromise = video.play();

    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(function () {
        if (overlay) {
          overlay.classList.add('hidden');
        }
      }).catch(function () {
        if (overlay) {
          overlay.classList.remove('hidden');
        }
      });
    } else if (overlay) {
      overlay.classList.add('hidden');
    }
  }

  if (overlay) {
    overlay.addEventListener('click', start);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (overlay && video.currentTime === 0) {
      overlay.classList.remove('hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}

window.initMoviePlayer = initMoviePlayer;

document.addEventListener('DOMContentLoaded', function () {
  setupMenu();
  setupHero();
  setupCatalogFilters();
});
