/* Ink & Play — 国語クイズバトル (Kokugo Quiz Battle).
   Plain ES5, no modules: loaded with a normal script tag after games.js,
   only on japanese.html.
   One round = 10 questions: questions 1-9 are drawn at random (no repeats)
   from QZ_DATA, filtered by grade and mixed across types; question 10 is
   always the fixed cooperative question QZ_FINAL.
   Each entry: t = type label, g = grade (4 or 5), q = question text,
   c = the 3 choices, a = index of the correct choice in c,
   e = one-line explanation shown after the question is resolved.
   The choice order is shuffled every time a question is shown. */
var QZ_DATA=[
 /* ---- 部首合体 (8) ---- */
 {t:"部首合体",g:5,q:"「忄（りっしんべん）＋ 青」でできる漢字は？",c:["晴","清","情"],a:2,e:"りっしんべんと青で「情（ジョウ）」。友情（ゆうじょう）などに使うよ。"},
 {t:"部首合体",g:4,q:"「木（きへん）＋ 公」でできる漢字は？",c:["松","村","林"],a:0,e:"きへんと公で「松（まつ）」。松竹梅（しょうちくばい）の松だよ。"},
 {t:"部首合体",g:4,q:"「氵（さんずい）＋ 青」でできる漢字は？",c:["晴","清","情"],a:1,e:"さんずいと青で「清（セイ）」。清い（きよい）水などに使うよ。"},
 {t:"部首合体",g:4,q:"「言（ごんべん）＋ 売」でできる漢字は？",c:["語","話","読"],a:2,e:"ごんべんと売で「読（ドク）」。読書（どくしょ）の読だよ。"},
 {t:"部首合体",g:4,q:"「亻（にんべん）＋ 動」でできる漢字は？",c:["休","働","体"],a:1,e:"にんべんと動で「働（ドウ）」。労働（ろうどう）の働だよ。"},
 {t:"部首合体",g:4,q:"「糸（いとへん）＋ 及」でできる漢字は？",c:["級","結","約"],a:0,e:"いとへんと及で「級（キュウ）」。学級（がっきゅう）の級だよ。"},
 {t:"部首合体",g:4,q:"「竹（たけかんむり）＋ 官」でできる漢字は？",c:["節","笛","管"],a:2,e:"たけかんむりと官で「管（カン）」。水道管（すいどうかん）の管だよ。"},
 {t:"部首合体",g:4,q:"「氵（さんずい）＋ 去」でできる漢字は？",c:["法","泣","汽"],a:0,e:"さんずいと去で「法（ホウ）」。法律（ほうりつ）の法だよ。"},
 /* ---- 読み方 (7) ---- */
 {t:"読み方",g:5,q:"「選手が試合で活躍する」活躍の読みは？",c:["かつどう","かっやく","かつりょく"],a:1,e:"活躍は「かっやく」と読むよ。目立って働くことだね。"},
 {t:"読み方",g:4,q:"「今日は晴天だ」晴天の読みは？",c:["せいてん","はれてん","せいそら"],a:0,e:"晴天は「せいてん」。よく晴れた空のことだよ。"},
 {t:"読み方",g:4,q:"「野菜を食べる」野菜の読みは？",c:["のさい","やな","やさい"],a:2,e:"野菜は「やさい」と読むよ。キャベツやニンジンなどだね。"},
 {t:"読み方",g:5,q:"「電車が停車する」停車の読みは？",c:["とまりしゃ","ていしゃ","ていくるま"],a:1,e:"停車は「ていしゃ」。電車や車が止まることだよ。"},
 {t:"読み方",g:4,q:"「友達と協力する」協力の読みは？",c:["きょうりょく","ともりょく","きょうちから"],a:0,e:"協力は「きょうりょく」。力を合わせることだよ。"},
 {t:"読み方",g:5,q:"「試合に勝利する」勝利の読みは？",c:["かちり","しょうかつ","しょうり"],a:2,e:"勝利は「しょうり」。試合に勝つことだよ。"},
 {t:"読み方",g:4,q:"「運動会」の読みは？",c:["うんどうかい","うんどうえ","うんどかい"],a:0,e:"運動会は「うんどうかい」。秋の大きな行事だね。"},
 /* ---- 対義語 (7) ---- */
 {t:"対義語",g:5,q:"「複雑」の反対の言葉は？",c:["簡単","安全","丁寧"],a:0,e:"複雑（ふくざつ）の反対は簡単（かんたん）だよ。"},
 {t:"対義語",g:4,q:"「安全」の反対の言葉は？",c:["安心","危険","平和"],a:1,e:"安全（あんぜん）の反対は危険（きけん）だよ。"},
 {t:"対義語",g:4,q:"「増える」の反対の言葉は？",c:["減る","多くなる","足す"],a:0,e:"増えるの反対は減る（へる）だよ。"},
 {t:"対義語",g:4,q:"「暑い」の反対の言葉は？",c:["熱い","温かい","寒い"],a:2,e:"暑い（あつい）の反対は寒い（さむい）だよ。"},
 {t:"対義語",g:5,q:"「重い」の反対の言葉は？",c:["太い","軽い","厚い"],a:1,e:"重い（おもい）の反対は軽い（かるい）だよ。"},
 {t:"対義語",g:4,q:"「便利」の反対の言葉は？",c:["簡単","安全","不便"],a:2,e:"便利（べんり）の反対は不便（ふべん）だよ。"},
 {t:"対義語",g:5,q:"「成功」の反対の言葉は？",c:["失敗","勝利","安全"],a:0,e:"成功（せいこう）の反対は失敗（しっぱい）だよ。"},
 /* ---- ことわざ (7) ---- */
 {t:"ことわざ",g:4,q:"「石の上にも三年」の意味は？",c:["石は3年で温かくなる","辛抱して続ければうまくいく","3年たつと石が動き出す"],a:1,e:"冷たい石の上でも3年座れば温まるように、辛抱して続けることが大切だよ。"},
 {t:"ことわざ",g:4,q:"「ちりも積もれば山となる」の意味は？",c:["小さなものでも積み重なれば大きくなる","ちりは山に捨てるものだ","山はちりでできている"],a:0,e:"小さな努力でも、積み重ねれば大きな力になるということだよ。"},
 {t:"ことわざ",g:5,q:"「急がば回れ」の意味は？",c:["急いで回り道をする","走って回ると速い","急ぐときほど安全な道を選ぶ方が早く着く"],a:2,e:"急ぐときこそ、危ない近道より安全な道を行く方がよいということだよ。"},
 {t:"ことわざ",g:4,q:"「花より団子」の意味は？",c:["花の方が団子よりきれいだ","見た目より実用的なものがよい","団子は花の形をしている"],a:1,e:"きれいな花より食べられる団子、というように、見た目より役に立つものがよいということだよ。"},
 {t:"ことわざ",g:4,q:"「猿も木から落ちる」の意味は？",c:["得意な人でも失敗することがある","猿は木登りが苦手だ","木から落ちると猿になる"],a:0,e:"木登りが得意な猿でも落ちることがあるように、名人でも失敗はあるということだよ。"},
 {t:"ことわざ",g:5,q:"「七転び八起き」の意味は？",c:["七回転んで八回寝る","転ぶと体が強くなる","何度失敗してもあきらめず立ち上がる"],a:2,e:"何度転んでも起き上がるように、あきらめない心を表すことわざだよ。"},
 {t:"ことわざ",g:5,q:"「雨降って地固まる」の意味は？",c:["雨が降ると地面が固くなる","もめごとの後、かえって仲が良くなる","雨の日は外に出ない方がいい"],a:1,e:"雨の後の地面が固くなるように、もめごとの後はかえって仲が深まるということだよ。"},
 /* ---- 慣用句 (7) ---- */
 {t:"慣用句",g:5,q:"「あの人には頭が上がらない」の意味は？",c:["眠くて頭が下がる","頭が痛い","恩があったりして相手にかなわない"],a:2,e:"お世話になった恩などがあり、相手にかなわないときに使う言い方だよ。"},
 {t:"慣用句",g:4,q:"「甘いものに目がない」の意味は？",c:["大好きでたまらない","目が見えない","眠くて目が開かない"],a:0,e:"「目がない」は、大好きでたまらないという意味だよ。"},
 {t:"慣用句",g:5,q:"「手を焼く」の意味は？",c:["手を温める","扱いに困る","料理を作る"],a:1,e:"「手を焼く」は、どう扱ってよいか困るという意味だよ。"},
 {t:"慣用句",g:4,q:"「耳が痛い」の意味は？",c:["耳が病気だ","音が大きすぎる","聞くのがつらいほど図星だ"],a:2,e:"自分の弱点を言い当てられて、聞くのがつらいときに使うよ。"},
 {t:"慣用句",g:5,q:"「足を洗う」の意味は？",c:["足を水できれいにする","悪い行いをやめる","泥を落とす"],a:1,e:"「足を洗う」は、悪い行いや良くない仕事をやめるという意味だよ。"},
 {t:"慣用句",g:4,q:"「腹が立つ」の意味は？",c:["怒る","お腹がすく","立ち上がる"],a:0,e:"「腹が立つ」は、怒る（おこる）という意味だよ。"},
 {t:"慣用句",g:4,q:"「口が軽い」の意味は？",c:["よくしゃべって秘密を話してしまう","口が小さい","早口だ"],a:0,e:"「口が軽い」は、うっかり秘密を話してしまうという意味だよ。"},
 /* ---- 同音異義語 (7) ---- */
 {t:"同音異義語",g:5,q:"「カブトムシをかんさつする」正しい漢字は？",c:["感察","観察","関察"],a:1,e:"よく見て調べることは「観察（かんさつ）」と書くよ。"},
 {t:"同音異義語",g:4,q:"「雨で試合がちゅうしになる」正しい漢字は？",c:["中子","注止","中止"],a:2,e:"途中でやめることは「中止（ちゅうし）」と書くよ。"},
 {t:"同音異義語",g:5,q:"「ピアノをえんそうする」正しい漢字は？",c:["演奏","遠奏","円奏"],a:0,e:"楽器を演じることは「演奏（えんそう）」と書くよ。"},
 {t:"同音異義語",g:5,q:"「荷物をうんぱんする」正しい漢字は？",c:["運般","雲搬","運搬"],a:2,e:"荷物を運ぶことは「運搬（うんぱん）」と書くよ。"},
 {t:"同音異義語",g:5,q:"「テストのせいせきがよい」正しい漢字は？",c:["成積","成績","生績"],a:1,e:"テストなどの結果は「成績（せいせき）」と書くよ。"},
 {t:"同音異義語",g:4,q:"「きかいを使って作る」正しい漢字は？",c:["機界","器械","機械"],a:2,e:"モーターなどで動く道具は「機械（きかい）」と書くよ。"},
 {t:"同音異義語",g:4,q:"「はしでごはんをたべる」正しい漢字は？",c:["橋","箸","端"],a:1,e:"ごはんを食べる道具は「箸（はし）」。川にかかるのは「橋」だよ。"},
 /* ---- 部首名 (7) ---- */
 {t:"部首名",g:4,q:"「清・海・泳」に共通する部首の名前は？",c:["さんずい","にすい","くさかんむり"],a:0,e:"清・海・泳はどれも「氵（さんずい）」。水に関係する漢字だよ。"},
 {t:"部首名",g:4,q:"「松・桜・枝」に共通する部首の名前は？",c:["さんずい","きへん","くさかんむり"],a:1,e:"松・桜・枝はどれも「木（きへん）」。木に関係する漢字だよ。"},
 {t:"部首名",g:4,q:"「話・読・語」に共通する部首の名前は？",c:["いとへん","にんべん","ごんべん"],a:2,e:"話・読・語はどれも「言（ごんべん）」。言葉に関係する漢字だよ。"},
 {t:"部首名",g:4,q:"「健・働・仲」に共通する部首の名前は？",c:["にんべん","てへん","さんずい"],a:0,e:"健・働・仲はどれも「亻（にんべん）」。人に関係する漢字だよ。"},
 {t:"部首名",g:4,q:"「花・草・芽」に共通する部首の名前は？",c:["たけかんむり","くさかんむり","うかんむり"],a:1,e:"花・草・芽はどれも「艹（くさかんむり）」。草や花に関係する漢字だよ。"},
 {t:"部首名",g:5,q:"「投・打・捕」に共通する部首の名前は？",c:["きへん","さんずい","てへん"],a:2,e:"投・打・捕はどれも「扌（てへん）」。手の動作を表す漢字だよ。"},
 {t:"部首名",g:4,q:"「銀・銅・鉄」に共通する部首の名前は？",c:["かねへん","きへん","てへん"],a:0,e:"銀・銅・鉄はどれも「金（かねへん）」。金属に関係する漢字だよ。"},
 /* ---- 四字熟語 (7) ---- */
 {t:"四字熟語",g:4,q:"「全力○球」○に入る漢字は？",c:["投","打","走"],a:0,e:"「全力投球（ぜんりょくとうきゅう）」。全力で取り組むことにも使うよ。"},
 {t:"四字熟語",g:4,q:"「一石二○」○に入る漢字は？",c:["石","鳥","山"],a:1,e:"「一石二鳥（いっせきにちょう）」。一度で二つの得をすることだよ。"},
 {t:"四字熟語",g:5,q:"「一生○命」○に入る漢字は？",c:["県","件","懸"],a:2,e:"「一生懸命（いっしょうけんめい）」。命がけでがんばることだよ。"},
 {t:"四字熟語",g:4,q:"「十人十○」○に入る漢字は？",c:["色","食","足"],a:0,e:"「十人十色（じゅうにんといろ）」。人によって好みや考えが違うことだよ。"},
 {t:"四字熟語",g:5,q:"「以心○心」○に入る漢字は？",c:["電","伝","田"],a:1,e:"「以心伝心（いしんでんしん）」。言葉にしなくても気持ちが伝わることだよ。"},
 {t:"四字熟語",g:5,q:"「一期一○」○に入る漢字は？",c:["回","開","会"],a:2,e:"「一期一会（いちごいちえ）」。一度きりの出会いを大切にすることだよ。"},
 {t:"四字熟語",g:5,q:"「日進月○」○に入る漢字は？",c:["歩","走","行"],a:0,e:"「日進月歩（にっしんげっぽ）」。日ごとにどんどん進歩することだよ。"},
 /* ---- バラバラ文 (2) ---- */
 {t:"バラバラ文",g:4,q:"「ぼくは / 森で / 大きなカブトムシ / を拾った」の正しい順番は？",c:["ぼくは→森で→大きなカブトムシ→を拾った","森で→ぼくは→を拾った→大きなカブトムシ","ぼくは→大きなカブトムシ→森で→を拾った"],a:0,e:"「ぼくは森で大きなカブトムシを拾った」が正しい文だよ。"},
 {t:"バラバラ文",g:4,q:"「わたしは / 公園で / ボールを / けった」の正しい順番は？",c:["公園で→わたしは→けった→ボールを","わたしは→公園で→ボールを→けった","わたしは→ボールを→けった→公園で"],a:1,e:"「わたしは公園でボールをけった」が正しい文だよ。"},
 /* ---- 仲間外れ (1) ---- */
 {t:"仲間外れ",g:4,q:"仲間外れはどれ？「走・泳・跳・読」",c:["走","読","跳"],a:1,e:"走・泳・跳は体を動かす動作で、読だけが本を読むことだから。"}
];
/* Fixed cooperative final question: always question 10, never in the pool. */
var QZ_FINAL={t:"仲間外れ",g:0,q:"仲間外れはどれ？「投・打・捕・泳」",c:["投","捕","泳"],a:2,e:"投・打・捕は「てへん」で野球の動作、泳だけ「さんずい」だよ。"};

var qzMode=1, qzGrade=0;
var qzRound=[], qzIdx=0, qzScores=[0,0], qzTurn=0;
var qzAttempts=0, qzOrder=[], qzWrongPos=-1, qzLocked=false, qzMsg="";

function qzShuffle(arr){
  var i, j, tmp;
  for(i=arr.length-1;i>0;i--){
    j=Math.floor(Math.random()*(i+1));
    tmp=arr[i]; arr[i]=arr[j]; arr[j]=tmp;
  }
  return arr;
}
function qzIsFinal(){ return qzIdx>=9; }
function qzStatus(){
  var el=document.getElementById('quiz-status');
  if(!el) return;
  if(qzRound.length===0){
    el.innerHTML='スタート<small>モードと学年をえらんでね</small>';
    return;
  }
  if(qzMode===2){
    var who;
    if(qzIsFinal()) who='協力問題・2人で相談してね';
    else if(qzAttempts===1&&!qzLocked) who='プレイヤー'+(qzTurn===0?2:1)+'のお助けチャンス';
    else who='プレイヤー'+(qzTurn+1)+'の番';
    el.innerHTML='P1 '+qzScores[0]+'点 · P2 '+qzScores[1]+'点<small>もんだい '+(qzIdx+1)+' / 10 · '+who+'</small>';
  } else {
    el.innerHTML='もんだい '+(qzIdx+1)+' / 10<small>スコア '+qzScores[0]+'点'+(qzIsFinal()?' · 協力問題':'')+'</small>';
  }
}
/* ---------- start screen ---------- */
function qzShowStart(){
  qzRound=[]; qzIdx=0; qzScores=[0,0]; qzTurn=0; qzAttempts=0; qzLocked=false; qzMsg="";
  var html='';
  html+='<div class="switcher-label" style="margin-bottom:8px">モード — 何人であそぶ？</div>';
  html+='<div class="level-row" role="group" aria-label="モード" style="margin-bottom:16px">'
    +'<button class="level-btn" id="qz-mode-1" aria-pressed="'+(qzMode===1?'true':'false')+'" onclick="qzSetMode(1)"><strong>1人</strong><span>ひとりで10問に挑戦</span></button>'
    +'<button class="level-btn" id="qz-mode-2" aria-pressed="'+(qzMode===2?'true':'false')+'" onclick="qzSetMode(2)"><strong>2人</strong><span>交代で答える対戦バトル</span></button></div>';
  html+='<div class="switcher-label" style="margin-bottom:8px">学年 — 問題のむずかしさ</div>';
  html+='<div class="level-row" role="group" aria-label="学年" style="margin-bottom:16px">'
    +'<button class="level-btn" id="qz-grade-4" aria-pressed="'+(qzGrade===4?'true':'false')+'" onclick="qzSetGrade(4)"><strong>4年生</strong><span>小4までの国語</span></button>'
    +'<button class="level-btn" id="qz-grade-5" aria-pressed="'+(qzGrade===5?'true':'false')+'" onclick="qzSetGrade(5)"><strong>5年生</strong><span>小5までの国語</span></button>'
    +'<button class="level-btn" id="qz-grade-mix" aria-pressed="'+(qzGrade===0?'true':'false')+'" onclick="qzSetGrade(0)"><strong>まぜる</strong><span>4・5年生ぜんぶ</span></button></div>';
  html+='<p class="qz-rules">1ラウンド10問。1回目で正解すると100点。'
    +(qzMode===2?'外すと相手に50点の「お助けチャンス」が回るよ。':'外しても、もう一度だけ50点で挑戦できるよ。')
    +'最後の10問目は協力問題で200点！</p>';
  html+='<button class="btn primary qz-wide" onclick="qzStartRound()">スタート！</button>';
  document.getElementById('qz-main').innerHTML=html;
  qzStatus();
}
function qzSetMode(n){ qzMode=n; qzShowStart(); }
function qzSetGrade(g){ qzGrade=g; qzShowStart(); }
/* ---------- round building ---------- */
function qzBuildRound(){
  var pool=[], i;
  for(i=0;i<QZ_DATA.length;i++) if(qzGrade===0||QZ_DATA[i].g===qzGrade) pool.push(QZ_DATA[i]);
  var picked=null, tries=0, j, seen, types;
  while(tries<100){
    var shuffled=qzShuffle(pool.slice());
    picked=shuffled.slice(0,9);
    seen={}; types=0;
    for(j=0;j<picked.length;j++) if(!seen[picked[j].t]){ seen[picked[j].t]=true; types++; }
    if(types>=5) break;
    tries++;
  }
  picked.push(QZ_FINAL);
  return picked;
}
function qzStartRound(){
  qzRound=qzBuildRound();
  qzIdx=0; qzScores=[0,0]; qzTurn=0;
  qzNewQuestion();
}
function qzNewQuestion(){
  qzAttempts=0; qzWrongPos=-1; qzLocked=false; qzMsg="";
  qzTurn=(qzIdx%2===0)?0:1;
  qzOrder=qzShuffle([0,1,2]);
  qzRender();
}
/* ---------- question screen ---------- */
function qzRender(){
  var q=qzRound[qzIdx], i, pos, actual;
  var html='';
  if(qzIsFinal()){
    html+='<div class="qz-type-row"><span class="qz-type qz-type-final">協力問題</span><span class="qz-type">'+q.t+'</span></div>';
  } else {
    html+='<div class="qz-type-row"><span class="qz-type">'+q.t+'</span></div>';
  }
  html+='<div class="qz-question">'+q.q+'</div>';
  if(qzMode===2&&!qzIsFinal()&&!qzLocked){
    if(qzAttempts===1) html+='<div class="qz-turn">プレイヤー'+(qzTurn===0?2:1)+'のお助けチャンス！（50点）</div>';
    else html+='<div class="qz-turn">プレイヤー'+(qzTurn+1)+'の番</div>';
  }
  if(qzIsFinal()&&!qzLocked) html+='<div class="qz-turn">2人で相談して、どちらがタップしてもOK！</div>';
  html+='<div class="qz-choices">';
  for(i=0;i<3;i++){
    pos=i; actual=qzOrder[pos];
    var cls='qz-choice';
    var mark='';
    if(qzLocked&&actual===q.a){ cls+=' qz-correct'; mark=' ○'; }
    else if(pos===qzWrongPos){ cls+=' qz-wrong'; mark=' ×'; }
    var dis=(qzLocked||pos===qzWrongPos)?' disabled':'';
    html+='<button class="'+cls+'" onclick="qzAnswer('+pos+')"'+dis+'><span class="qz-choice-label">'+'ABC'.charAt(pos)+'</span>'+q.c[actual]+mark+'</button>';
  }
  html+='</div>';
  html+='<div class="qz-msg" id="qz-msg">'+qzMsg+'</div>';
  if(qzLocked){
    html+='<div class="qz-explain"><strong>こたえ：'+q.c[q.a]+'</strong><br>'+q.e+'</div>';
    html+='<button class="btn primary qz-wide" onclick="qzNext()">'+(qzIdx>=9?'けっかを見る →':'次へ →')+'</button>';
  }
  document.getElementById('qz-main').innerHTML=html;
  qzStatus();
}
function qzAnswer(pos){
  if(qzLocked||pos===qzWrongPos) return;
  var q=qzRound[qzIdx];
  var actual=qzOrder[pos];
  var correct=(actual===q.a);
  if(qzIsFinal()){
    var fpoints=(qzAttempts===0)?200:100;
    if(correct){
      qzScores[0]+=fpoints;
      if(qzMode===2) qzScores[1]+=fpoints;
      qzMsg='せいかい！協力問題クリア（+'+fpoints+'点'+(qzMode===2?'ずつ':'')+'）';
      qzLocked=true;
    } else if(qzAttempts===0){
      qzAttempts=1; qzWrongPos=pos;
      qzMsg='ちがうよ。あと1回だけ挑戦できるよ（100点）';
    } else {
      qzWrongPos=pos;
      qzMsg='ざんねん…。こたえを見てみよう';
      qzLocked=true;
    }
    qzRender();
    return;
  }
  var points=(qzAttempts===0)?100:50;
  if(correct){
    var scorer;
    if(qzMode===2) scorer=(qzAttempts===1)?(1-qzTurn):qzTurn;
    else scorer=0;
    qzScores[scorer]+=points;
    if(qzMode===2&&qzAttempts===1) qzMsg='お助け成功！プレイヤー'+(scorer+1)+' ＋'+points+'点';
    else if(qzMode===2) qzMsg='せいかい！プレイヤー'+(scorer+1)+' ＋'+points+'点';
    else qzMsg='せいかい！ ＋'+points+'点';
    qzLocked=true;
  } else if(qzAttempts===0){
    qzAttempts=1; qzWrongPos=pos;
    if(qzMode===2) qzMsg='ちがうよ。プレイヤー'+(qzTurn===0?2:1)+'のお助けチャンス！（50点）';
    else qzMsg='ちがうよ。もう一度かんがえてみよう（50点）';
  } else {
    qzWrongPos=pos;
    qzMsg='ざんねん…。こたえを見てみよう';
    qzLocked=true;
  }
  qzRender();
}
function qzNext(){
  qzIdx++;
  if(qzIdx>=10) qzResult();
  else qzNewQuestion();
}
/* ---------- result screen ---------- */
function qzResult(){
  var html='<div class="qz-result">';
  if(qzMode===2){
    var verdict;
    if(qzScores[0]>qzScores[1]) verdict='プレイヤー1の勝ち！';
    else if(qzScores[1]>qzScores[0]) verdict='プレイヤー2の勝ち！';
    else verdict='引き分け！';
    html+='<div class="qz-result-main">'+verdict+'</div>'
      +'<div class="qz-result-score">プレイヤー1：'+qzScores[0]+'点　プレイヤー2：'+qzScores[1]+'点</div>';
  } else {
    var msg;
    if(qzScores[0]>=1100) msg='かんぺき！国語マスター！';
    else if(qzScores[0]>=800) msg='すごい！よくできました';
    else if(qzScores[0]>=500) msg='よくがんばったね';
    else msg='つぎはもっとできるよ';
    html+='<div class="qz-result-main">おわり！ スコア '+qzScores[0]+'点</div>'
      +'<div class="qz-result-score">'+msg+'</div>';
  }
  html+='<div class="actions" style="justify-content:center"><button class="btn primary" onclick="qzShowStart()">もう一度（モード・学年えらびへ）</button></div></div>';
  document.getElementById('qz-main').innerHTML=html;
  var el=document.getElementById('quiz-status');
  if(el){
    if(qzMode===2) el.innerHTML='おわり！<small>P1 '+qzScores[0]+'点 · P2 '+qzScores[1]+'点</small>';
    else el.innerHTML='おわり！<small>スコア '+qzScores[0]+'点</small>';
  }
}
qzShowStart();
