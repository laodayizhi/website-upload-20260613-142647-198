(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupPlayer() {
    var video = document.getElementById('movie-player');
    var overlay = document.getElementById('play-overlay');
    if (!video || !overlay) {
      return;
    }
    var stream = video.getAttribute('data-stream');
    var initialized = false;
    var hls = null;

    function hideOverlay() {
      overlay.classList.add('is-hidden');
    }

    function attachStream() {
      if (initialized || !stream) {
        return;
      }
      initialized = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else {
        video.src = stream;
      }
    }

    function playVideo() {
      attachStream();
      hideOverlay();
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          overlay.classList.remove('is-hidden');
        });
      }
    }

    overlay.addEventListener('click', playVideo);
    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });
    video.addEventListener('play', hideOverlay);
    video.addEventListener('ended', function () {
      overlay.classList.remove('is-hidden');
    });
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  ready(setupPlayer);
})();
