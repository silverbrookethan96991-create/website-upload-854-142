function initStreamPlayer(streamUrl) {
  const video = document.getElementById('movie-player');
  const cover = document.querySelector('[data-play-toggle]');
  let player = null;
  let ready = false;

  function prepare() {
    if (!video || ready) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && Hls.isSupported()) {
      player = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      player.loadSource(streamUrl);
      player.attachMedia(video);
    } else {
      video.src = streamUrl;
    }

    ready = true;
  }

  function begin() {
    prepare();
    if (cover) {
      cover.classList.add('is-hidden');
    }
    if (video) {
      const playTask = video.play();
      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function() {});
      }
    }
  }

  if (cover) {
    cover.addEventListener('click', begin);
  }

  if (video) {
    video.addEventListener('play', function() {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });
    video.addEventListener('click', function() {
      prepare();
    });
  }

  window.addEventListener('pagehide', function() {
    if (player && typeof player.destroy === 'function') {
      player.destroy();
      player = null;
    }
  });
}
