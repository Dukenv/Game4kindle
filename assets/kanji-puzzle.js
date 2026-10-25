/* Ink & Play — 部首合体パズル (Kanji Radical Puzzle).
   Plain ES5, no modules: loaded with a normal script tag after games.js.
   Each entry: k = kanji, g = grade (4 or 5), t = "lr" (left+right) or "tb"
   (top+bottom), y = reading shown as the prompt, h = hint word, hr = hint
   reading, p1/p2 = [glyph, name] of the two parts. */
var KJ_DATA=[
 {k:"健",g:4,t:"lr",y:"ケン",h:"健康",hr:"けんこう",p1:["亻","にんべん"],p2:["建","たて"]},
 {k:"冷",g:4,t:"lr",y:"レイ",h:"冷蔵庫",hr:"れいぞうこ",p1:["冫","にすい"],p2:["令","れい"]},
 {k:"初",g:4,t:"lr",y:"ハツ",h:"初詣",hr:"はつもうで",p1:["衤","ころもへん"],p2:["刀","かたな"]},
 {k:"利",g:4,t:"lr",y:"リ",h:"利用",hr:"りよう",p1:["禾","のぎへん"],p2:["刂","りっとう"]},
 {k:"果",g:4,t:"tb",y:"カ",h:"結果",hr:"けっか",p1:["日","ひ"],p2:["木","き"]},
 {k:"菜",g:4,t:"tb",y:"サイ",h:"野菜",hr:"やさい",p1:["艹","くさかんむり"],p2:["采","さい"]},
 {k:"英",g:4,t:"tb",y:"エイ",h:"英語",hr:"えいご",p1:["艹","くさかんむり"],p2:["央","おう"]},
 {k:"芽",g:4,t:"tb",y:"ガ",h:"発芽",hr:"はつが",p1:["艹","くさかんむり"],p2:["牙","きば"]},
 {k:"梅",g:4,t:"lr",y:"バイ",h:"梅雨",hr:"ばいう",p1:["木","きへん"],p2:["毎","まい"]},
 {k:"松",g:4,t:"lr",y:"ショウ",h:"松竹梅",hr:"しょうちくばい",p1:["木","きへん"],p2:["公","こう"]},
 {k:"材",g:4,t:"lr",y:"ザイ",h:"木材",hr:"もくざい",p1:["木","きへん"],p2:["才","さい"]},
 {k:"札",g:4,t:"lr",y:"サツ",h:"千円札",hr:"せんえんさつ",p1:["木","きへん"],p2:["乙","おつ"]},
 {k:"標",g:4,t:"lr",y:"ヒョウ",h:"標識",hr:"ひょうしき",p1:["木","きへん"],p2:["票","ひょう"]},
 {k:"機",g:4,t:"lr",y:"キ",h:"飛行機",hr:"ひこうき",p1:["木","きへん"],p2:["幾","き"]},
 {k:"城",g:4,t:"lr",y:"ジョウ",h:"名古屋城",hr:"なごやじょう",p1:["土","つちへん"],p2:["成","せい"]},
 {k:"課",g:4,t:"lr",y:"カ",h:"課題",hr:"かだい",p1:["言","ごんべん"],p2:["果","か"]},
 {k:"説",g:4,t:"lr",y:"セツ",h:"説明",hr:"せつめい",p1:["言","ごんべん"],p2:["兑","だ"]},
 {k:"清",g:4,t:"lr",y:"セイ",h:"清流",hr:"せいりゅう",p1:["氵","さんずい"],p2:["青","あお"]},
 {k:"積",g:4,t:"lr",y:"セキ",h:"面積",hr:"めんせき",p1:["禾","のぎへん"],p2:["責","せき"]},
 {k:"続",g:4,t:"lr",y:"ゾク",h:"連続",hr:"れんぞく",p1:["糸","いとへん"],p2:["売","ばい"]},
 {k:"桜",g:5,t:"lr",y:"さくら",h:"桜の花",hr:"さくらのはな",p1:["木","きへん"],p2:["女","おんな"]},
 {k:"停",g:5,t:"lr",y:"テイ",h:"停車",hr:"ていしゃ",p1:["亻","にんべん"],p2:["亭","てい"]},
 {k:"察",g:5,t:"tb",y:"サツ",h:"警察",hr:"けいさつ",p1:["宀","うかんむり"],p2:["祭","さい"]},
 {k:"編",g:5,t:"lr",y:"ヘン",h:"編集",hr:"へんしゅう",p1:["糸","いとへん"],p2:["扁","へん"]},
 {k:"統",g:5,t:"lr",y:"トウ",h:"統計",hr:"とうけい",p1:["糸","いとへん"],p2:["充","じゅう"]},
 {k:"枝",g:5,t:"lr",y:"えだ",h:"木の枝",hr:"きのえだ",p1:["木","きへん"],p2:["支","し"]},
 {k:"査",g:5,t:"lr",y:"サ",h:"調査",hr:"ちょうさ",p1:["木","きへん"],p2:["且","そ"]},
 {k:"銅",g:5,t:"lr",y:"ドウ",h:"銅像",hr:"どうぞう",p1:["金","かねへん"],p2:["同","どう"]},
 {k:"防",g:5,t:"lr",y:"ボウ",h:"消防",hr:"しょうぼう",p1:["阝","こざとへん"],p2:["方","ほう"]},
 {k:"限",g:5,t:"lr",y:"ゲン",h:"限界",hr:"げんかい",p1:["阝","こざとへん"],p2:["艮","ごん"]},
 {k:"際",g:5,t:"lr",y:"サイ",h:"実際",hr:"じっさい",p1:["阝","こざとへん"],p2:["祭","さい"]},
 {k:"情",g:5,t:"lr",y:"ジョウ",h:"友情",hr:"ゆうじょう",p1:["忄","りっしんべん"],p2:["青","あお"]},
 {k:"精",g:5,t:"lr",y:"セイ",h:"精一杯",hr:"せいいっぱい",p1:["米","こめへん"],p2:["青","あお"]},
 {k:"混",g:5,t:"lr",y:"コン",h:"混雑",hr:"こんざつ",p1:["氵","さんずい"],p2:["昆","こん"]},
 {k:"減",g:5,t:"lr",y:"ゲン",h:"減少",hr:"げんしょう",p1:["氵","さんずい"],p2:["咸","かん"]},
 {k:"演",g:5,t:"lr",y:"エン",h:"演技",hr:"えんぎ",p1:["氵","さんずい"],p2:["寅","いん"]},
 {k:"液",g:5,t:"lr",y:"エキ",h:"液体",hr:"えきたい",p1:["氵","さんずい"],p2:["夜","よる"]},
 {k:"河",g:5,t:"lr",y:"カ",h:"河川",hr:"かせん",p1:["氵","さんずい"],p2:["可","か"]},
 {k:"準",g:5,t:"lr",y:"ジュン",h:"準備",hr:"じゅんび",p1:["氵","さんずい"],p2:["隼","はやぶさ"]},
 {k:"税",g:5,t:"lr",y:"ゼイ",h:"消費税",hr:"しょうひぜい",p1:["禾","のぎへん"],p2:["兑","だ"]}
];

var kjGrade=4, kjRound=[], kjIdx=0, kjScore=0, kjCorrectCount=0, kjAttempts=0;
var kjSelA=-1, kjSelB=-1, kjOptsA=[], kjOptsB=[], kjLocked=false, kjMsg="";

function kjShuffle(arr){
  var i, j, tmp;
  for(i=arr.length-1;i>0;i--){
    j=Math.floor(Math.random()*(i+1));
    tmp=arr[i]; arr[i]=arr[j]; arr[j]=tmp;
  }
  return arr;
}
function kjPool(){
  var out=[], i;
  if(kjGrade===0) return KJ_DATA.slice();
  for(i=0;i<KJ_DATA.length;i++) if(KJ_DATA[i].g===kjGrade) out.push(KJ_DATA[i]);
  return out;
}
function kjSetGrade(g){
  kjGrade=g;
  document.getElementById('kj-grade-4').setAttribute('aria-pressed', g===4?'true':'false');
  document.getElementById('kj-grade-5').setAttribute('aria-pressed', g===5?'true':'false');
  document.getElementById('kj-grade-mix').setAttribute('aria-pressed', g===0?'true':'false');
  kjStartRound();
}
function kjStartRound(){
  var pool=kjPool();
  kjRound=kjShuffle(pool.slice()).slice(0,10);
  kjIdx=0; kjScore=0; kjCorrectCount=0;
  kjNewQuestion();
}
function kjDistractors(q, which){
  var correct=(which===1?q.p1:q.p2)[0];
  var seen={}, out=[], i, pair, list;
  function collect(entries){
    var n;
    for(n=0;n<entries.length;n++){
      if(entries[n].t!==q.t) continue;
      pair=(which===1?entries[n].p1:entries[n].p2);
      if(pair[0]===correct) continue;
      if(seen[pair[0]]) continue;
      seen[pair[0]]=true;
      out.push(pair);
    }
  }
  collect(kjPool());
  if(out.length<2) collect(KJ_DATA);
  kjShuffle(out);
  return out.slice(0,2);
}
function kjNewQuestion(){
  var q=kjRound[kjIdx];
  kjAttempts=0; kjSelA=-1; kjSelB=-1; kjLocked=false; kjMsg="";
  kjOptsA=kjShuffle([q.p1].concat(kjDistractors(q,1)));
  kjOptsB=kjShuffle([q.p2].concat(kjDistractors(q,2)));
  kjRender();
}
function kjStatus(){
  document.getElementById('kanji-status').innerHTML='もんだい '+(kjIdx+1)+' / 10<small>スコア '+kjScore+'</small>';
}
function kjTilesHtml(opts, sel, row){
  var html='<div class="kj-tiles">', i;
  for(i=0;i<opts.length;i++){
    html+='<button class="kj-tile'+(sel===i?' kj-sel':'')+'" onclick="kjPick(\''+row+'\','+i+')"'+(kjLocked?' disabled':'')+'>'
      +'<span class="kj-glyph">'+opts[i][0]+'</span>'
      +'<span class="kj-name">'+opts[i][1]+'</span></button>';
  }
  html+='</div>';
  return html;
}
function kjRender(){
  var q=kjRound[kjIdx];
  var gA=kjSelA>=0?kjOptsA[kjSelA][0]:'？';
  var gB=kjSelB>=0?kjOptsB[kjSelB][0]:'？';
  var html='';
  html+='<div class="kj-topic"><span class="kj-topic-main">『'+q.y+'』と読む漢字</span>'
    +'<span class="kj-topic-hint">ヒント：'+q.h+'（'+q.hr+'）</span></div>';
  if(kjLocked){
    html+='<div class="kj-preview"><span class="kj-done">'+q.k+'</span></div>';
  } else if(q.t==='tb'){
    html+='<div class="kj-preview kj-tb"><span class="kj-slot">'+gA+'</span><span class="kj-slot">'+gB+'</span></div>';
  } else {
    html+='<div class="kj-preview"><span class="kj-slot">'+gA+'</span><span class="kj-plus">＋</span><span class="kj-slot">'+gB+'</span></div>';
  }
  html+='<div class="kj-rowlabel">'+(q.t==='tb'?'うえのパーツ':'ひだりのパーツ')+'</div>';
  html+=kjTilesHtml(kjOptsA, kjSelA, 'a');
  html+='<div class="kj-rowlabel">'+(q.t==='tb'?'したのパーツ':'みぎのパーツ')+'</div>';
  html+=kjTilesHtml(kjOptsB, kjSelB, 'b');
  html+='<div class="kj-msg" id="kj-msg">'+kjMsg+'</div>';
  if(kjLocked){
    html+='<button class="btn primary kj-next" onclick="kjNext()">つぎへ →</button>';
  } else {
    html+='<button class="btn primary kj-decide" id="kj-decide" onclick="kjCheck()"'+((kjSelA>=0&&kjSelB>=0)?'':' disabled')+'>これで決定！</button>';
  }
  document.getElementById('kj-main').innerHTML=html;
  kjStatus();
}
function kjPick(row, i){
  if(kjLocked) return;
  if(row==='a') kjSelA=(kjSelA===i?-1:i);
  else kjSelB=(kjSelB===i?-1:i);
  kjRender();
}
function kjCheck(){
  if(kjSelA<0||kjSelB<0) return;
  var q=kjRound[kjIdx];
  var correct=kjOptsA[kjSelA][0]===q.p1[0] && kjOptsB[kjSelB][0]===q.p2[0];
  if(correct){
    var points=kjAttempts===0?100:50;
    kjScore+=points;
    kjCorrectCount++;
    kjMsg='せいかい！『'+q.k+'』＝ '+q.p1[1]+' ＋ '+q.p2[1];
    kjLocked=true;
  } else if(kjAttempts===0){
    kjAttempts=1;
    kjMsg='ちがうよ。もう一度かんがえてみよう';
  } else {
    kjAttempts=2;
    kjMsg='こたえは『'+q.k+'』（'+q.p1[1]+'＋'+q.p2[1]+'）だったよ';
    kjLocked=true;
  }
  kjRender();
}
function kjNext(){
  kjIdx++;
  if(kjIdx>=10) kjResult();
  else kjNewQuestion();
}
function kjResult(){
  var msg;
  if(kjScore>=1000) msg='かんぺき！漢字マスター！';
  else if(kjScore>=700) msg='すごい！よくできました';
  else if(kjScore>=400) msg='よくがんばったね';
  else msg='つぎはもっとできるよ';
  document.getElementById('kanji-status').innerHTML='おわり！<small>スコア '+kjScore+'点</small>';
  document.getElementById('kj-main').innerHTML='<div class="kj-result">'
    +'<div class="kj-result-main">おわり！ 10問中 '+kjCorrectCount+'問 せいかい　スコア '+kjScore+'点</div>'
    +'<div class="kj-result-msg">'+msg+'</div>'
    +'<div class="actions" style="justify-content:center"><button class="btn primary" onclick="kjStartRound()">もう一度あそぶ</button></div>'
    +'<p style="font-size:14px;color:var(--muted)">学年を変えたいときは、上の「4年生」「5年生」「まぜる」をタップしてね。</p></div>';
}
kjStartRound();
