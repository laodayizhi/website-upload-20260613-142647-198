(function () {
  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function normalize(value) {
    return String(value || '').toLowerCase();
  }

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>#' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<a class="movie-card" href="' + escapeHtml(movie.url) + '">',
      '  <span class="poster-frame">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="poster-overlay"><span class="play-chip">播放</span></span>',
      '    <span class="region-chip">' + escapeHtml(movie.region) + '</span>',
      '  </span>',
      '  <span class="card-body">',
      '    <span class="card-title">' + escapeHtml(movie.title) + '</span>',
      '    <span class="card-meta">' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.type) + ' · ' + escapeHtml(movie.genre) + '</span>',
      '    <span class="card-desc">' + escapeHtml(movie.oneLine || movie.summary) + '</span>',
      '    <span class="tag-row">' + tags + '</span>',
      '  </span>',
      '</a>'
    ].join('');
  }

  function runSearch() {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var input = document.getElementById('search-page-input');
    var status = document.getElementById('search-status');
    var results = document.getElementById('search-results');
    var index = window.SEARCH_INDEX || [];
    if (input) {
      input.value = query;
    }
    if (!status || !results) {
      return;
    }
    if (!query) {
      status.textContent = '请输入关键词开始搜索。';
      results.innerHTML = index.slice(0, 12).map(card).join('');
      return;
    }
    var words = query.toLowerCase().split(/\s+/).filter(Boolean);
    var matched = index.filter(function (movie) {
      var text = normalize([
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        (movie.tags || []).join(' '),
        movie.oneLine,
        movie.summary
      ].join(' '));
      return words.every(function (word) {
        return text.indexOf(word) !== -1;
      });
    });
    status.textContent = matched.length ? '已为你匹配到以下影片。' : '暂无匹配影片，可尝试更换关键词。';
    results.innerHTML = matched.slice(0, 120).map(card).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runSearch);
  } else {
    runSearch();
  }
})();
