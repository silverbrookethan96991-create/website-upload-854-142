(function () {
  var header = document.querySelector('[data-header]');
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-nav]');

  function syncHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  }

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var active = 0;

  function setHero(index) {
    if (!slides.length) return;
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === active);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === active);
    });
  }

  if (slides.length) {
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        setHero(i);
      });
    });
    setHero(0);
    window.setInterval(function () {
      setHero(active + 1);
    }, 5600);
  }

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    var scope = panel.parentElement || document;
    var input = panel.querySelector('[data-search-input]');
    var selects = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-select]'));
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

    selects.forEach(function (select) {
      var attr = select.getAttribute('data-filter-select');
      var values = [];
      cards.forEach(function (card) {
        var value = (card.getAttribute(attr) || '').trim();
        if (value && values.indexOf(value) === -1) values.push(value);
      });
      values.sort(function (a, b) {
        return String(b).localeCompare(String(a), 'zh-CN');
      });
      values.slice(0, 120).forEach(function (value) {
        var option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
    });

    function apply() {
      var q = input ? input.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        var ok = true;
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        if (q && text.indexOf(q) === -1) ok = false;
        selects.forEach(function (select) {
          var attr = select.getAttribute('data-filter-select');
          var selected = select.value;
          if (selected && card.getAttribute(attr) !== selected) ok = false;
        });
        card.classList.toggle('hidden-card', !ok);
      });
    }

    if (input) input.addEventListener('input', apply);
    selects.forEach(function (select) {
      select.addEventListener('change', apply);
    });
  });
})();

function initMoviePlayer(videoId, buttonId, sourceUrl) {
  var video = document.getElementById(videoId);
  var button = document.getElementById(buttonId);
  if (!video || !button || !sourceUrl) return;

  var loaded = false;
  var hlsInstance = null;

  function bindSource() {
    if (loaded) return;
    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({ enableWorker: true });
      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = sourceUrl;
    }
  }

  function start() {
    bindSource();
    button.classList.add('is-hidden');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        button.classList.remove('is-hidden');
      });
    }
  }

  button.addEventListener('click', start);
  video.addEventListener('click', function () {
    if (!loaded) start();
  });
  video.addEventListener('play', function () {
    button.classList.add('is-hidden');
  });
  video.addEventListener('pause', function () {
    if (!video.ended && video.currentTime === 0) button.classList.remove('is-hidden');
  });
  window.addEventListener('beforeunload', function () {
    if (hlsInstance) hlsInstance.destroy();
  });
}
