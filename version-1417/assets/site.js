(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (slides.length > 0) {
        var active = 0;
        var showSlide = function (index) {
            active = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        };
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
            });
        });
        window.setInterval(function () {
            showSlide((active + 1) % slides.length);
        }, 5000);
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var genreSelect = document.querySelector('[data-genre-filter]');
    var filterItems = Array.prototype.slice.call(document.querySelectorAll('.filter-item'));
    var emptyMessage = document.querySelector('[data-empty-message]');
    var applyFilter = function () {
        var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var genre = genreSelect ? genreSelect.value : '';
        var visible = 0;
        filterItems.forEach(function (item) {
            var text = [
                item.getAttribute('data-title') || '',
                item.getAttribute('data-region') || '',
                item.getAttribute('data-genre') || '',
                item.getAttribute('data-tags') || ''
            ].join(' ').toLowerCase();
            var itemYear = item.getAttribute('data-year') || '';
            var itemGenre = item.getAttribute('data-genre') || '';
            var matched = (!keyword || text.indexOf(keyword) >= 0) && (!year || itemYear === year) && (!genre || itemGenre.indexOf(genre) >= 0);
            item.style.display = matched ? '' : 'none';
            if (matched) {
                visible += 1;
            }
        });
        if (emptyMessage) {
            emptyMessage.classList.toggle('is-visible', visible === 0);
        }
    };
    [filterInput, yearSelect, genreSelect].forEach(function (node) {
        if (node) {
            node.addEventListener('input', applyFilter);
            node.addEventListener('change', applyFilter);
        }
    });

    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (wrap) {
        var video = wrap.querySelector('video');
        var button = wrap.querySelector('[data-play-button]');
        if (!video || !button) {
            return;
        }
        var stream = video.getAttribute('data-stream');
        var started = false;
        var begin = function () {
            if (!stream) {
                return;
            }
            button.classList.add('is-hidden');
            if (!started) {
                started = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                    video.play().catch(function () {
                        button.classList.remove('is-hidden');
                    });
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls();
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {
                            button.classList.remove('is-hidden');
                        });
                    });
                } else {
                    video.src = stream;
                    video.play().catch(function () {
                        button.classList.remove('is-hidden');
                    });
                }
            } else {
                video.play().catch(function () {
                    button.classList.remove('is-hidden');
                });
            }
        };
        button.addEventListener('click', begin);
        video.addEventListener('click', function () {
            if (video.paused) {
                begin();
            }
        });
        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            if (video.currentTime === 0 || video.ended) {
                button.classList.remove('is-hidden');
            }
        });
    });
})();
