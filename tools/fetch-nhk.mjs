// NHK news fetcher for the Kindle Scribe kids-news page (nhk.html).
// Runs in GitHub Actions (hourly) and locally:  node tools/fetch-nhk.mjs
// Writes assets/nhk-news.json. Never overwrites good data with an empty result:
// if every source fails, it exits non-zero and leaves the old JSON in place.
//
// Sources (all official NHK feeds first):
//   latest  : NHK RSS cat0  (new n-data endpoint, legacy www3 mirror as fallback)
//   sports  : NHK RSS cat5
//   science : NHK RSS cat6
//   kodomo  : the "こどもニュース" topic page HTML when NHK lets us read it,
//             then Google News search results for NHK kids news,
//             then tools/kodomo-seed.json (hand-verified article URLs).
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'assets', 'nhk-news.json');
const SEED = join(root, 'tools', 'kodomo-seed.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const TOPIC_URL = 'https://news.web.nhk/newsweb/pl/news-nwa-topic-nationwide-E0000000520';

async function fetchText(url, ms = 25000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': '*/*' }, signal: ctl.signal, redirect: 'follow' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.text();
  } finally { clearTimeout(t); }
}

function decodeEntities(s) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}
function cleanText(s) {
  return decodeEntities(String(s || '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}
function tag(block, name) {
  const m = block.match(new RegExp('<' + name + '[^>]*>([\\s\\S]*?)</' + name + '>', 'i'));
  return m ? m[1] : '';
}
function parseRSS(xml, limit) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml)) && items.length < limit) {
    const b = m[1];
    const title = cleanText(tag(b, 'title'));
    const link = cleanText(tag(b, 'link'));
    const date = cleanText(tag(b, 'pubDate'));
    const desc = cleanText(tag(b, 'description'));
    if (title && link) items.push({ title, url: link, date: date ? new Date(date).toISOString() : '', description: desc });
  }
  return items;
}
async function rssFirst(urls, limit) {
  for (const u of urls) {
    try {
      const xml = await fetchText(u);
      if (!xml.includes('<rss')) throw new Error('not rss');
      const items = parseRSS(xml, limit);
      if (items.length) { console.log('OK', u, items.length); return items; }
    } catch (e) { console.log('NG', u, e.message); }
  }
  return [];
}
const rssUrls = (cat) => [
  `https://news.web.nhk/n-data/conf/na/rss/cat${cat}.xml`,
  `https://www3.nhk.or.jp/rss/news/cat${cat}.xml`,
];

async function kodomoFromTopic() {
  try {
    const html = await fetchText(TOPIC_URL);
    if (html.includes('403 Forbidden') || !html.includes('nd-')) throw new Error('blocked');
    const seen = new Map();
    const re = /href="(?:https:\/\/news\.web\.nhk)?(\/newsweb\/na\/(nd-[a-z0-9]+))"[^>]*>([\s\S]*?)<\/a>/gi;
    let m;
    while ((m = re.exec(html))) {
      const title = cleanText(m[3]);
      if (title.length < 8 || seen.has(m[2])) continue;
      seen.set(m[2], { title, url: 'https://news.web.nhk/newsweb/na/' + m[2], date: '', section: 'こどもニュース' });
    }
    const list = [...seen.values()];
    console.log('topic page items:', list.length);
    return list;
  } catch (e) { console.log('topic page NG:', e.message); return []; }
}

async function kodomoFromGoogleNews() {
  const q = encodeURIComponent('site:news.web.nhk "こどもニュース"');
  const url = `https://news.google.com/rss/search?q=${q}&hl=ja&gl=JP&ceid=JP:ja`;
  try {
    const items = parseRSS(await fetchText(url), 20);
    const deny = ['こどもニュース', 'オトナも気になる！こどもニュース', 'ニュース一覧', '関連リンク', '速報・最新情報', 'NHK ONE'];
    return items
      .map(it => ({ ...it, title: it.title.replace(/\s*[-|]\s*NHK.*$/, '').trim(), section: 'こどもニュース' }))
      .filter(it => it.title.length >= 8 && !deny.some(d => it.title.includes(d)));
  } catch (e) { console.log('google news NG:', e.message); return []; }
}

async function main() {
  const [latest, sports, science, topicItems, googleItems, seedRaw] = await Promise.all([
    rssFirst(rssUrls(0), 20),
    rssFirst(rssUrls(5), 6),
    rssFirst(rssUrls(6), 6),
    kodomoFromTopic(),
    kodomoFromGoogleNews(),
    readFile(SEED, 'utf8').catch(() => '[]'),
  ]);
  const seed = JSON.parse(seedRaw);

  // Merge kodomo: seed (verified NHK URLs) first, then topic, then Google News; dedupe by title.
  const byTitle = new Map();
  for (const it of [...seed, ...topicItems, ...googleItems]) {
    const key = it.title.replace(/\s+/g, '');
    if (!byTitle.has(key)) byTitle.set(key, it);
  }
  const kodomo = [...byTitle.values()].slice(0, 20);

  if (!latest.length && !kodomo.length) {
    console.error('All sources failed; keeping previous nhk-news.json');
    process.exit(1);
  }
  const data = { updatedAt: new Date().toISOString(), topicUrl: TOPIC_URL, kodomo, latest, sports, science };
  await writeFile(OUT, JSON.stringify(data, null, 1) + '\n', 'utf8');
  console.log('wrote', OUT, 'kodomo:', kodomo.length, 'latest:', latest.length, 'sports:', sports.length, 'science:', science.length);
}
main().catch(e => { console.error(e); process.exit(1); });
