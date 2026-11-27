// NHK kids news page (Kindle Scribe). ES5 only: the Scribe browser is old.
// List data: assets/nhk-news.json (refreshed hourly by GitHub Actions).
// Tapping an article opens an in-page reader: it shows the stored summary,
// then tries to fetch the full text from NHK through public CORS proxies
// and swaps it in when that works. The reader never navigates away;
// "NHK公式で開く" is there as a fallback.
(function () {
  var root = document.getElementById('news-root');
  var updatedEl = document.getElementById('updated');
  var btn = document.getElementById('refresh-btn');
  var readerEl = document.getElementById('reader');
  var listWrap = document.getElementById('list-wrap');
  var DATA = null;
  var FLAT = [];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    var j = new Date(d.getTime() + (9 * 60 + d.getTimezoneOffset()) * 60000);
    var hh = j.getHours(), mm = j.getMinutes();
    return j.getFullYear() + '年' + (j.getMonth() + 1) + '月' + j.getDate() + '日 ' +
      hh + ':' + (mm < 10 ? '0' : '') + mm;
  }
  function itemHtml(it, idx, plain) {
    var h = '<a class="item' + (plain ? ' plain' : '') + '" href="#" data-idx="' + idx + '">';
    h += '<span class="date">' + esc(fmtDate(it.date)) + '</span>';
    if (it.section) h += '<span class="sec">' + esc(it.section) + '</span>';
    h += '<div class="title">' + esc(it.title) + '</div>';
    if (it.description) h += '<div class="desc">' + esc(it.description) + '</div>';
    h += '<div class="read">このページで読む →</div>';
    h += '</a>';
    return h;
  }
  function sectionHtml(title, sub, items, plain) {
    if (!items || !items.length) return '';
    var h = '<h2>' + esc(title) + (sub ? ' <small>' + esc(sub) + '</small>' : '') + '</h2>';
    for (var i = 0; i < items.length; i++) { FLAT.push(items[i]); h += itemHtml(items[i], FLAT.length - 1, plain); }
    return h;
  }
  function render(data) {
    DATA = data; FLAT = [];
    var h = '';
    h += sectionHtml('こどもニュース', 'NHKが子ども向けに書いた記事', data.kodomo, false);
    h += sectionHtml('最新のニュース', 'NHK 主要ニュース（新しい順）', data.latest, true);
    h += sectionHtml('スポーツ', '', data.sports, true);
    h += sectionHtml('科学・文化', '', data.science, true);
    root.innerHTML = h || '<div class="err">ニュースがまだ届いていません。少し待ってから「更新する」を押してください。</div>';
    if (data.updatedAt) updatedEl.innerHTML = '一覧の更新： ' + esc(fmtDate(data.updatedAt)) + '（日本時間）';
    var cards = root.getElementsByTagName('a');
    for (var i = 0; i < cards.length; i++) {
      (function (a) {
        a.onclick = function (ev) {
          if (ev && ev.preventDefault) ev.preventDefault();
          openReader(FLAT[parseInt(a.getAttribute('data-idx'), 10)]);
          return false;
        };
      })(cards[i]);
    }
  }

  // ---------- in-page reader ----------
  function clean(s) {
    return String(s || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
  }
  var BAD = ['関連リンク', 'プライバシー', '利用規約', 'NHKについて', '受信料', 'ご意見・お問い合わせ',
    'Copyright', 'All rights reserved', '天気予報・防災情報', '新着ニュース', '深掘りコンテンツ', '動画を見る'];
  function goodPara(p, title) {
    if (p.length < 40) return false;
    if (p === title) return false;
    for (var i = 0; i < BAD.length; i++) if (p.indexOf(BAD[i]) >= 0) return false;
    return true;
  }
  function extractFromHtml(html, title) {
    var out = [], seen = {}, m, re = /<p[^>]*>([\s\S]*?)<\/p>/gi, total = 0;
    while ((m = re.exec(html))) {
      var p = clean(m[1]);
      if (!goodPara(p, title) || seen[p]) continue;
      seen[p] = 1; out.push(p); total += p.length;
      if (out.length >= 60) break;
    }
    return total >= 300 ? out : null;
  }
  function extractFromText(text, title) {
    var lines = String(text || '').split(/\n+/, 200), out = [], total = 0;
    for (var i = 0; i < lines.length; i++) {
      var p = clean(lines[i]);
      if (!goodPara(p, title)) continue;
      if (p.charAt(0) === '#' || p.charAt(0) === '[' || p.charAt(0) === '!') continue;
      out.push(p); total += p.length;
    }
    return total >= 300 ? out : null;
  }
  function xhrGet(url, ms, cb) {
    var xhr = new XMLHttpRequest(), done = false;
    var timer = setTimeout(function () { if (!done) { done = true; try { xhr.abort(); } catch (e) {} cb(null); } }, ms);
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4 || done) return;
      done = true; clearTimeout(timer);
      cb(xhr.status === 200 ? xhr.responseText : null);
    };
    try { xhr.send(null); } catch (e) { if (!done) { done = true; clearTimeout(timer); cb(null); } }
  }
  function tryFetchBody(it, statusEl, bodyEl) {
    var enc = encodeURIComponent(it.url);
    var steps = [
      { u: 'https://api.allorigins.win/raw?url=' + enc, f: extractFromHtml },
      { u: 'https://api.codetabs.com/v1/proxy?quest=' + it.url, f: extractFromHtml },
      { u: 'https://r.jina.ai/' + it.url, f: extractFromText }
    ];
    var i = 0;
    function next() {
      if (i >= steps.length) {
        statusEl.innerHTML = '本文を自動で取り込めませんでした。上の要約と、NHK公式ページで続きが読めます。';
        return;
      }
      var st = steps[i++];
      xhrGet(st.u, 9000, function (text) {
        var paras = null;
        if (text) { try { paras = st.f(text, it.title); } catch (e) { paras = null; } }
        if (paras && paras.length) {
          var h = '';
          for (var k = 0; k < paras.length; k++) h += '<p>' + esc(paras[k]) + '</p>';
          bodyEl.innerHTML = h;
          statusEl.innerHTML = '出典：NHK（公式記事をこのページで表示しています）';
          window.scrollTo(0, 0);
        } else { next(); }
      });
    }
    next();
  }
  function openReader(it) {
    if (!it) return;
    var h = '<button class="backbtn" id="reader-back" type="button">← 一覧にもどる</button>';
    h += '<div class="rdate">' + esc(fmtDate(it.date)) +
      (it.section ? '　' + esc(it.section) : '') + '</div>';
    h += '<h1 class="rtitle">' + esc(it.title) + '</h1>';
    h += '<div class="rstatus" id="reader-status">本文を読み込み中…</div>';
    h += '<div class="rbody" id="reader-body">';
    if (it.body && it.body.length) {
      for (var b = 0; b < it.body.length; b++) h += '<p>' + esc(it.body[b]) + '</p>';
    } else if (it.description) h += '<p>' + esc(it.description) + '</p>';
    h += '</div>';
    h += '<a class="official" href="' + esc(it.url) + '">NHK公式で開く →</a>';
    h += '<button class="backbtn" id="reader-back2" type="button">← 一覧にもどる</button>';
    readerEl.innerHTML = h;
    listWrap.style.display = 'none';
    readerEl.style.display = 'block';
    window.scrollTo(0, 0);
    var back = function () {
      readerEl.style.display = 'none';
      readerEl.innerHTML = '';
      listWrap.style.display = 'block';
      window.scrollTo(0, 0);
    };
    document.getElementById('reader-back').onclick = back;
    document.getElementById('reader-back2').onclick = back;
    if (it.body && it.body.length) {
      document.getElementById('reader-status').innerHTML = '出典：NHK（記事の冒頭・要約をこのページで表示しています。全文は公式で読めます）';
    } else {
      tryFetchBody(it, document.getElementById('reader-status'), document.getElementById('reader-body'));
    }
  }

  // ---------- list loading ----------
  function load() {
    updatedEl.innerHTML = '読み込み中…';
    xhrGet('assets/nhk-news.json?t=' + new Date().getTime(), 20000, function (text) {
      if (text) {
        try { render(JSON.parse(text)); return; } catch (e) { /* fall through */ }
      }
      root.innerHTML = '<div class="err">ニュースを読み込めませんでした。Wi-Fiを確認して、もう一度「更新する」を押してください。</div>';
      updatedEl.innerHTML = '';
    });
  }
  if (btn.addEventListener) btn.addEventListener('click', load, false);
  else btn.onclick = load;
  load();
})();
