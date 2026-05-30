(function () {
  function initMoviePlayer(options) {
    var video = document.querySelector('.movie-video');
    var cover = document.querySelector('.player-cover');
    var stream = options && options.stream;
    var hls = null;
    var ready = false;

    if (!video || !stream) {
      return;
    }

    function attachStream() {
      if (ready) {
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        });
        return;
      }

      video.src = stream;
    }

    function playVideo() {
      attachStream();
      video.controls = true;
      if (cover) {
        cover.classList.add('is-hidden');
      }
      video.play().catch(function () {});
    }

    if (cover) {
      cover.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (!ready) {
        playVideo();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
