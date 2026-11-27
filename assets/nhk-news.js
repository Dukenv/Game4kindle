// NHK kids news page (Kindle Scribe). ES5 only: the Scribe browser is old.
// Data comes from assets/nhk-news.json, refreshed hourly by GitHub Actions
// (tools/fetch-nhk.mjs). The refresh button re-reads that JSON bypassing cache.
(function () {
  var root = document.getElementById('news-root');
  var updatedEl = document.getElementById('updated');
  var btn = document.getElementById('refresh-btn');

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    // Show in Japan time regardless of the reader's timezone setting.
    var j = new Date(d.getTime() + (9 * 60 + d.getTimezoneOffset()) * 60000);
    var hh = j.getHours(), mm = j.getMinutes();
    return j.getFullYear() + '年' + (j.getMonth() + 1) + '月' + j.getDate() + '日 ' +
      hh + ':' + (mm < 10 ? '0' : '') + mm;
  }
  function itemHtml(it, plain) {
    var h = '<a class="item' + (plain ? ' plain' : '') + '" href="' + esc(it.url) + '">';
    h += '<span class="date">' + esc(fmtDate(it.date)) + '</span>';
    if (it.section) h += '<span class="sec">' + esc(it.section) + '</span>';
    h += '<div class="title">' + esc(it.title) + '</div>';
    if (it.description) h += '<div class="desc">' + esc(it.description) + '</div>';
    h += '</a>';
    return h;
  }
  function sectionHtml(title, sub, items, plain) {
    if (!items || !items.length) return '';
    var h = '<h2>' + esc(title) + (sub ? ' <small>' + esc(sub) + '</small>' : '') + '</h2>';
    for (var i = 0; i < items.length; i++) h += itemHtml(items[i], plain);
    return h;
  }
  function render(data) {
    var h = '';
    h += sectionHtml('こどもニュース', 'NHKが子ども向けに書いた記事', data.kodomo, false);
    h += sectionHtml('最新のニュース', 'NHK 主要ニュース（新しい順）', data.latest, true);
    h += sectionHtml('スポーツ', '', data.sports, true);
    h += sectionHtml('科学・文化', '', data.science, true);
    root.innerHTML = h || '<div class="err">ニュースがまだ届いていません。少し待ってから「更新する」を押してください。</div>';
    if (data.updatedAt) updatedEl.innerHTML = '一覧の更新： ' + esc(fmtDate(data.updatedAt)) + '（日本時間）';
  }
  function load() {
    updatedEl.innerHTML = '読み込み中…';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/nhk-news.json?t=' + new Date().getTime(), true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try { render(JSON.parse(xhr.responseText)); return; } catch (e) { /* fall through */ }
      }
      root.innerHTML = '<div class="err">ニュースを読み込めませんでした。Wi-Fiを確認して、もう一度「更新する」を押してください。</div>';
      updatedEl.innerHTML = '';
    };
    xhr.send(null);
  }
  if (btn.addEventListener) btn.addEventListener('click', load, false);
  else btn.onclick = load;
  load();
})();
