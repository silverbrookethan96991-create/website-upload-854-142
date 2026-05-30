(function() {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      mobileNav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let activeIndex = 0;
    let timer = null;

    function activate(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    }

    function startTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function() {
        activate(activeIndex + 1);
      }, 5200);
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        activate(index);
        startTimer();
      });
    });

    startTimer();
  }

  const filterForm = document.querySelector('[data-filter-form]');
  const searchGrid = document.querySelector('[data-search-grid]');
  const emptyState = document.querySelector('[data-empty-state]');

  if (filterForm && searchGrid) {
    const cards = Array.from(searchGrid.querySelectorAll('.movie-card'));

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function cardText(card) {
      return normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.year,
        card.dataset.type,
        card.dataset.genre,
        card.dataset.tags
      ].join(' '));
    }

    function applyFilter() {
      const formData = new FormData(filterForm);
      const keyword = normalize(formData.get('q'));
      const category = normalize(formData.get('category'));
      const year = normalize(formData.get('year'));
      const region = normalize(formData.get('region'));
      let visible = 0;

      cards.forEach(function(card) {
        const matchesKeyword = !keyword || cardText(card).includes(keyword);
        const matchesCategory = !category || normalize(card.dataset.category) === category;
        const matchesYear = !year || normalize(card.dataset.year) === year;
        const matchesRegion = !region || normalize(card.dataset.region) === region;
        const show = matchesKeyword && matchesCategory && matchesYear && matchesRegion;
        card.classList.toggle('is-filter-hidden', !show);
        if (show) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    }

    filterForm.addEventListener('input', applyFilter);
    filterForm.addEventListener('change', applyFilter);
    filterForm.addEventListener('submit', function(event) {
      event.preventDefault();
      applyFilter();
    });
  }
})();
