(() => {
    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    function initMobileNav() {
        const button = $('.js-mobile-toggle');
        const nav = $('.js-mobile-nav');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', () => {
            const open = nav.classList.toggle('open');
            button.setAttribute('aria-expanded', String(open));
        });
    }

    function initHero() {
        const slides = $$('[data-hero-slide]');
        const dots = $$('[data-hero-dot]');
        if (slides.length === 0) {
            return;
        }
        let index = 0;
        const setSlide = (next) => {
            index = next;
            slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        };
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => setSlide(i));
        });
        window.setInterval(() => {
            setSlide((index + 1) % slides.length);
        }, 5200);
    }

    function matchYear(cardYear, selected) {
        if (!selected) {
            return true;
        }
        const year = parseInt(cardYear, 10);
        if (selected === 'classic') {
            return Number.isFinite(year) && year < 2000;
        }
        if (selected === '2010') {
            return Number.isFinite(year) && year >= 2010 && year <= 2019;
        }
        if (selected === '2000') {
            return Number.isFinite(year) && year >= 2000 && year <= 2009;
        }
        return String(cardYear).includes(selected);
    }

    function filterTarget(targetId) {
        const container = document.getElementById(targetId);
        if (!container) {
            return;
        }
        const search = $(`.js-search-input[data-target="${targetId}"]`);
        const category = $(`.js-filter-category[data-target="${targetId}"]`);
        const year = $(`.js-filter-year[data-target="${targetId}"]`);
        const result = $(`[data-result-for="${targetId}"]`);
        const query = (search?.value || '').trim().toLowerCase();
        const categoryValue = category?.value || '';
        const yearValue = year?.value || '';
        const cards = $$('.movie-card', container);
        let visible = 0;

        cards.forEach((card) => {
            const haystack = [
                card.dataset.title || '',
                card.dataset.tags || '',
                card.dataset.category || '',
                card.dataset.year || '',
                card.textContent || ''
            ].join(' ').toLowerCase();
            const okQuery = !query || haystack.includes(query);
            const okCategory = !categoryValue || card.dataset.category === categoryValue;
            const okYear = matchYear(card.dataset.year || '', yearValue);
            const show = okQuery && okCategory && okYear;
            card.classList.toggle('is-hidden', !show);
            if (show) {
                visible += 1;
            }
        });

        if (result) {
            result.textContent = `当前显示 ${visible} / ${cards.length} 部影片`;
        }
    }

    function initFilters() {
        const controls = $$('.js-search-input, .js-filter-category, .js-filter-year');
        controls.forEach((control) => {
            const eventName = control.tagName === 'INPUT' ? 'input' : 'change';
            control.addEventListener(eventName, () => filterTarget(control.dataset.target));
            filterTarget(control.dataset.target);
        });
        $$('.js-reset-filters').forEach((button) => {
            button.addEventListener('click', () => {
                const target = button.dataset.target;
                $$(`[data-target="${target}"]`).forEach((control) => {
                    if (control.matches('input, select')) {
                        control.value = '';
                    }
                });
                filterTarget(target);
            });
        });
    }

    function attachNativeVideo(video, source) {
        video.src = source;
        video.addEventListener('loadedmetadata', () => {
            video.play().catch(() => {});
        }, { once: true });
    }

    function initPlayer() {
        const video = $('.js-player');
        const button = $('.js-player-start');
        if (!video || !button) {
            return;
        }
        const shell = video.closest('.player-shell');
        const source = video.dataset.src;
        const start = () => {
            if (!source) {
                return;
            }
            shell?.classList.add('playing');
            if (video.dataset.ready === 'true') {
                video.play().catch(() => {});
                return;
            }
            video.dataset.ready = 'true';
            if (window.Hls && window.Hls.isSupported()) {
                const hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(() => {});
                });
                window.__siteHls = hls;
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                attachNativeVideo(video, source);
            } else {
                attachNativeVideo(video, source);
            }
        };
        button.addEventListener('click', start);
        video.addEventListener('play', () => shell?.classList.add('playing'));
        video.addEventListener('pause', () => {
            if (!video.ended) {
                return;
            }
            shell?.classList.remove('playing');
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initMobileNav();
        initHero();
        initFilters();
        initPlayer();
    });
})();
