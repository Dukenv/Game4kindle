/* Ink & Play — バラバラ文修復 (Sentence Repair).
Plain ES5, no modules: loaded with a normal script tag after games.js.
A phantom thief has scrambled the sentences of a 10-stage story.
Tap the word cards in the right order to rebuild each sentence:
tapped cards line up in the answer box in tap order, and tapping a
placed card sends it back. Each stage: title = stage name,
intro = story text shown in the terminal-style strip,
parts = the sentence pieces in their CORRECT order (shuffled on show). */
var SR_DATA=[
{title:"挑戦状", intro:"ある夜、博物館に怪盗からの挑戦状が届いた。バラバラになった文を、正しい順番になおそう！",
parts:["こんや","十二時に","ほしのしずくを","いただきに","まいります"]},
{title:"博物館をかためろ", intro:"知らせを聞いて、けいさつが博物館にかけつけた。文を直して、物語を進めよう。",
parts:["けいさつは","すぐに","博物館の","まわりを","かためました"]},
{title:"屋上の人かげ", intro:"その時、屋上に白い人かげが現れた！",
parts:["まっしろな","マントの","人が","屋上から","にげました"]},
{title:"小さな足あと", intro:"ショーケースのそばに、何か残っている…。よく見てみよう。",
parts:["小さな","足あとが","ショーケースの","そばに","のこっていました"]},
{title:"カメラの正体", intro:"ぼうはんカメラの映像を確認しよう。何がうつっているかな？",
parts:["ぼうはんカメラには","ネコの","すがたが","うつっていました"]},
{title:"図書室の手がかり", intro:"怪盗は手がかりを残していったようだ。どこにあるのだろう？",
parts:["つぎの","手がかりは","図書室に","かくされています"]},
{title:"本のあいだのメモ", intro:"図書室の本を一冊ずつ調べていくと…何かはさまっている！",
parts:["本の","あいだに","小さな","メモが","はさまっていました"]},
{title:"にせものの真実", intro:"メモを読んで、ほしのしずくをよく見ると、ようすがおかしい…。",
parts:["じつは","ほしのしずくは","にせものと","すりかえられていました"]},
{title:"ネコの大脱走", intro:"本物のほしのしずくを持ったネコが、あわてて逃げ出した！",
parts:["ネコは","すばやく","かべを","のぼって","にげました"]},
{title:"星のしずくはもどった", intro:"事件は終わりに近づいている。最後の文を直して、物語を完成させよう。",
parts:["さいごに","ほしのしずくは","博物館に","もどされました"]}
];
var SR_ENDING="怪盗の正体は、博物館に住むネコだった！ ほしのしずくは無事に博物館へもどり、事件は解決した。おわり。";

var srIdx=0, srScore=0, srCorrectCount=0, srAttempts=0;
var srCards=[], srPicked=[], srLocked=false, srMsg="";

function srShuffle(arr){
var i, j, tmp;
for(i=arr.length-1;i>0;i--){
j=Math.floor(Math.random()*(i+1));
tmp=arr[i]; arr[i]=arr[j]; arr[j]=tmp;
}
return arr;
}
function srStartRound(){
srIdx=0; srScore=0; srCorrectCount=0;
srNewStage();
}
function srNewStage(){
var q=SR_DATA[srIdx], i;
srAttempts=0; srPicked=[]; srLocked=false; srMsg="";
srCards=[];
for(i=0;i<q.parts.length;i++) srCards.push({text:q.parts[i], pos:i, used:false});
/* Shuffle the cards, but never leave them already in the correct order. */
var guard=0;
do{
srShuffle(srCards);
guard++;
var inOrder=true;
for(i=0;i<srCards.length;i++) if(srCards[i].pos!==i){ inOrder=false; break;}
}while(inOrder && guard<20);
srRender();
}
function srStatus(){
document.getElementById('sentence-status').innerHTML='ステージ '+(srIdx+1)+' / 10<small>スコア '+srScore+'</small>';
}
function srBuiltText(){
var out="", i;
for(i=0;i<srPicked.length;i++) out+=srCards[srPicked[i]].text;
return out;
}
function srRender(){
var q=SR_DATA[srIdx], i;
var html='';
/* Stage progress: 10 steps, done / now / upcoming */
html+='<div class="adv-progress" aria-label="ステージの進みぐあい">';
for(i=0;i<SR_DATA.length;i++){
html+='<div class="adv-step'+(i<srIdx||srLocked&&i===srIdx?' done':i===srIdx?' now':'')+'">'+(i+1)+'</div>';
}
html+='</div>';
/* Story text, terminal style (same strip as Beetle Quest) */
html+='<div class="adv-log"><p>'+q.title+'</p><p>'+q.intro+'</p></div>';
/* Answer box: the sentence built so far, in tap order */
html+='<div class="sr-rowlabel">組み上がった文（タップでカードをもどせるよ）</div>';
html+='<div class="sr-answer" aria-label="組み上がった文">';
if(srLocked){
html+='<span class="sr-answer-done">'+q.parts.join('')+'。</span>';
} else if(srPicked.length===0){
html+='<span class="sr-answer-empty">下のカードを正しい順番にタップしてね</span>';
} else {
for(i=0;i<srPicked.length;i++){
html+='<button class="sr-chip" onclick="srUnpick('+i+')">'+srCards[srPicked[i]].text+'</button>';
}
}
html+='</div>';
/* Word cards */
if(!srLocked){
html+='<div class="sr-rowlabel">言葉カード</div><div class="sr-cards">';
for(i=0;i<srCards.length;i++){
(function(n){
html+='<button class="sr-card" onclick="srPick('+n+')"'+(srCards[n].used?' disabled':'')+'>'+srCards[n].text+'</button>';
})(i);
}
html+='</div>';
}
html+='<div class="sr-msg" id="sr-msg">'+srMsg+'</div>';
if(srLocked){
html+='<button class="btn primary sr-wide" onclick="srNext()">'+(srIdx>=9?'けっかを見る →':'つぎのステージへ →')+'</button>';
} else {
html+='<button class="btn primary sr-wide" id="sr-decide" onclick="srCheck()"'+(srPicked.length===srCards.length?'':' disabled')+'>これで決定！</button>';
}
document.getElementById('sr-main').innerHTML=html;
srStatus();
}
function srPick(n){
if(srLocked || srCards[n].used) return;
srCards[n].used=true;
srPicked.push(n);
srRender();
}
function srUnpick(at){
if(srLocked) return;
var n=srPicked[at];
srPicked.splice(at,1);
srCards[n].used=false;
srRender();
}
function srCheck(){
if(srPicked.length!==srCards.length) return;
var q=SR_DATA[srIdx], correct=true, i;
for(i=0;i<srPicked.length;i++) if(srCards[srPicked[i]].pos!==i){ correct=false; break;}
if(correct){
var points=srAttempts===0?100:50;
srScore+=points;
srCorrectCount++;
srMsg='せいかい！「'+q.parts.join('')+'。」（+'+points+'点）';
srLocked=true;
} else if(srAttempts===0){
srAttempts=1;
for(i=0;i<srCards.length;i++) srCards[i].used=false;
srPicked=[];
srMsg='ちがうよ。主語と述語のつながりを考えて、もう一度ならべてみよう';
} else {
srAttempts=2;
srMsg='こたえは「'+q.parts.join('')+'。」だったよ';
srLocked=true;
}
srRender();
}
function srNext(){
srIdx++;
if(srIdx>=SR_DATA.length) srResult();
else srNewStage();
}
function srResult(){
var msg;
if(srScore>=1000) msg='かんぺき！文法マスター！';
else if(srScore>=700) msg='すごい！事件解決に大活やく！';
else if(srScore>=400) msg='よくがんばったね';
else msg='つぎはもっと直せるよ';
document.getElementById('sentence-status').innerHTML='おわり！<small>スコア '+srScore+'点</small>';
document.getElementById('sr-main').innerHTML='<div class="adv-log"><p>'+SR_ENDING+'</p></div>'
+'<div class="sr-result">'
+'<div class="sr-result-main">事件解決！ 10ステージ中 '+srCorrectCount+'ステージ せいかい　スコア '+srScore+'点</div>'
+'<div class="sr-result-msg">'+msg+'</div>'
+'<div class="actions" style="justify-content:center"><button class="btn primary" onclick="srStartRound()">もう一度あそぶ</button></div></div>';
}
srStartRound();
