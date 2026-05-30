(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mainNav = document.querySelector('[data-main-nav]');

  if (menuButton && mainNav) {
    menuButton.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  function restartSlider() {
    if (!slides.length) {
      return;
    }

    clearInterval(timer);
    timer = setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  if (slides.length) {
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        restartSlider();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        restartSlider();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        restartSlider();
      });
    }

    restartSlider();
  }

  var filterForm = document.querySelector('[data-filter-form]');
  var filterList = document.querySelector('[data-filter-list]');

  if (filterForm && filterList) {
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));

    function applyFilter() {
      var keyword = (filterForm.keyword && filterForm.keyword.value || '').trim().toLowerCase();
      var region = filterForm.region && filterForm.region.value || '';
      var year = filterForm.year && filterForm.year.value || '';
      var type = filterForm.type && filterForm.type.value || '';

      cards.forEach(function (card) {
        var matchesKeyword = !keyword || (card.dataset.search || '').toLowerCase().indexOf(keyword) !== -1;
        var matchesRegion = !region || card.dataset.region === region;
        var matchesYear = !year || card.dataset.year === year;
        var matchesType = !type || card.dataset.type === type;
        card.style.display = matchesKeyword && matchesRegion && matchesYear && matchesType ? '' : 'none';
      });
    }

    filterForm.addEventListener('input', applyFilter);
    filterForm.addEventListener('change', applyFilter);
  }

  var searchForm = document.querySelector('[data-search-form]');
  var searchResults = document.getElementById('search-results');
  var searchTitle = document.querySelector('[data-search-title]');
  var searchDesc = document.querySelector('[data-search-desc]');

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function resultCard(item) {
    return [
      '<article class="movie-card">',
      '<a class="movie-card-link" href="' + escapeHtml(item.url) + '">',
      '<div class="poster-wrap">',
      '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy" decoding="async">',
      '<span class="play-badge">▶</span>',
      '</div>',
      '<div class="movie-card-body">',
      '<div class="movie-meta-line"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.year) + '</span></div>',
      '<h3>' + escapeHtml(item.title) + '</h3>',
      '<p>' + escapeHtml(item.oneLine) + '</p>',
      '<div class="movie-tags"><span>' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.genre) + '</span></div>',
      '</div>',
      '</a>',
      '</article>'
    ].join('');
  }

  function renderSearch(query) {
    if (!searchResults || !window.SITE_SEARCH_ITEMS) {
      return;
    }

    var normalized = (query || '').trim().toLowerCase();
    var items = window.SITE_SEARCH_ITEMS;
    var matches = normalized ? items.filter(function (item) {
      return item.search.indexOf(normalized) !== -1;
    }) : items.slice(0, 24);

    if (searchTitle) {
      searchTitle.textContent = normalized ? '搜索结果' : '热门推荐';
    }

    if (searchDesc) {
      searchDesc.textContent = normalized ? '以下影片与关键词匹配。' : '输入关键词即可筛选影片。';
    }

    searchResults.innerHTML = matches.slice(0, 80).map(resultCard).join('');
  }

  if (searchForm && searchResults) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    if (searchForm.q) {
      searchForm.q.value = initial;
    }

    renderSearch(initial);

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var query = searchForm.q ? searchForm.q.value : '';
      var nextUrl = window.location.pathname + (query ? '?q=' + encodeURIComponent(query) : '');
      window.history.replaceState(null, '', nextUrl);
      renderSearch(query);
    });
  }
})();
