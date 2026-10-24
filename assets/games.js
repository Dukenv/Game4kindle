/* Ink & Play — shared page code plus Word Guess, Mini Sudoku and Othello.
   Plain ES5, no modules: loaded with a normal script tag before beetle-quest.js. */
function showGame(name){
  var games=['word','sudoku','othello','adventure'];
  for(var i=0;i<games.length;i++){
    var p=document.getElementById('panel-'+games[i]);
    var t=document.getElementById('tab-'+games[i]);
    if(games[i]===name){ p.className=p.className.replace(' hidden',''); t.setAttribute('aria-selected','true'); }
    else{ if(p.className.indexOf('hidden')===-1) p.className+=' hidden'; t.setAttribute('aria-selected','false'); }
  }
}

/* ---------- WORD GUESS ---------- */
var WORDS=["APPLE","BRAVE","CRANE","DELTA","EAGLE","FLAME","GRAPE","HOUSE","IVORY","JUMBO","KNEEL","LEMON","MANGO","NOBLE","OCEAN","PIANO","QUEEN","RIVER","STONE","TIGER","UMBRA","VIVID","WALTZ","YOUTH","ZEBRA","ABOUT","BRICK","CLOUD","DANCE","EARTH","FROST","GIANT","HEART","INDEX","JOINT","KOALA","LIGHT","MOUSE","NIGHT","OPERA","PLANT","QUILT","ROBOT","SOLAR","TRAIN","URBAN","VOICE","WATER","YIELD","BREAD","CHAIR","DREAM","ELBOW","FABLE","GLOBE","PUPPY","KITTY","BUNNY","HORSE","SHEEP","SNAKE","WHALE","SHARK","PANDA","FROGS","CHICK","PIZZA","CANDY","HONEY","CAKES","PEACH","MELON","BERRY","PASTA","SALAD","SWEET","BOOKS","PAPER","CLOCK","PHONE","WATCH","SHOES","SHIRT","PANTS","DRESS","TABLE","BEACH","SUNNY","RAINY","SNOWY","WINDY","TREES","GRASS","MUSIC","SONGS","STORY","MOVIE","HAPPY","SMILE","LAUGH","FUNNY","YUMMY","GAMES","MOMMY","DADDY","HELLO","COLOR","GREEN","BLACK","WHITE","BROWN","THREE","SEVEN","EIGHT","FIRST","LEARN","TEACH","SLEEP","BRUSH","CLEAN","DIRTY","WRITE","COUNT","SWIMS","JUMPS","READS","TRUCK","PLANE","ABOVE","ACTOR","ADULT","AFTER","AGAIN","ALARM","ALBUM","ALERT","ALIEN","ALIVE","ALLEY","ALLOW","ALONE","ALONG","ALOUD","ANGEL","ANGER","ANGLE","ANGRY","ANKLE","APART","APRIL","ARENA","ARGUE","ARMOR","ARROW","ASIDE","AVOID","AWAKE","AWARD","AWARE","AWFUL","BACON","BADGE","BAGEL","BAKER","BANJO","BASIN","BATCH","BEADS","BEANS","BEARD","BEARS","BEAST","BEGIN","BEING","BELLS","BELLY","BELOW","BENCH","BIBLE","BIKES","BILLS","BINGO","BIRDS","BIRTH","BITES","BLADE","BLAME","BLANK","BLAST","BLAZE","BLEED","BLEND","BLESS","BLIND","BLINK","BLOCK","BLOOD","BLOOM","BLUES","BLUFF","BLUSH","BOARD","BOATS","BOLTS","BOMBS","BONDS","BONES","BONUS","BOOST","BOOTS","BORED","BOSSY","BRAIN","BRAND","BRASS","BRIBE","BRIDE","BRIEF","BRING","BROAD","BROKE","BROOK","BROOM","BUCKS","BUDDY","BUILT","BULLS","BUMPS","BUNCH","BURNT","BUSES","BUSHY","BUYER","CABIN","CABLE","CADET","CAGES","CAMEL","CAMPS","CANAL","CANOE","CARDS","CARGO","CARRY","CARVE","CASES","CASTS","CATCH","CHARM","CHASE","CHECK","CHEEK","CHEER","CHESS","CHEST","CHILD"];
var WORDS6=["ANIMAL","BANANA","ORANGE","PURPLE","SCHOOL","ROCKET","CASTLE","DRAGON","TURTLE","RABBIT","MONKEY","PIRATE","PLANET","GARDEN","WINTER","SUMMER","AUTUMN","SPRING","FRIEND","FAMILY","FATHER","MOTHER","BUTTER","CHEESE","COOKIE","PENCIL","WINDOW","BRIDGE","ISLAND","KITTEN","HAMMER","LADDER","MIRROR","CANDLE","BOTTLE","YELLOW","SILVER","GOLDEN","SOCCER","TENNIS","GUITAR","CAMERA","LETTER","NUMBER","PICNIC","NATURE","ACTION","ARTIST","AUTHOR","BAKERY","BASKET","BATTLE","BEAUTY","BECOME","BEFORE","BEHIND","BELONG","BINDER","BOTTOM","BOUNCE","BRANCH","BREEZE","BRIGHT","BROKEN","BRONZE","BUBBLE","BUCKET","BUDGET","BUNDLE","BURGER","BUTTON","CAMPUS","CANADA","CANCEL","CANVAS","CARBON","CAREER","CARPET","CARROT","CARTON","CASUAL","CATTLE","CAUGHT","CENTER","CHANCE","CHANGE","CHARGE","CHERRY","CHOICE","CHOOSE","CIRCLE","CIRCUS"];
var WORDS7=["RAINBOW","DOLPHIN","PENGUIN","GIRAFFE","OCTOPUS","CHICKEN","KITCHEN","BEDROOM","MORNING","EVENING","HOLIDAY","LIBRARY","TEACHER","STUDENT","WEATHER","THUNDER","SNOWMAN","POPCORN","PANCAKE","CUPCAKE","BALLOON","BICYCLE","UNICORN","AIRPORT","COMPASS","JOURNEY","MYSTERY","CAPTAIN","DESSERT","VOLCANO","PYRAMID","DIAMOND","EMERALD","HARVEST","LANTERN","FEATHER","BLANKET","TOASTER","FREEZER","COSTUME","MONSTER","VAMPIRE","WHISPER","BANANAS","BATTERY","BROTHER","BUFFALO","CABBAGE","CARTOON","CHIMNEY","COLLECT","COLLEGE","COMFORT","CRICKET","CULTURE","CURIOUS","CURTAIN","DANCING","DAYTIME","DESKTOP","DIAGRAM","DIARIES","DIGITAL","DINNERS","DISCUSS","DISEASE","DISLIKE","DISPLAY","DISTANT","DIVIDED","DOODLES","DOORMAT","DOUBLES","DRAWING","DRESSES","DRIVERS","DROPLET","DRUMMER","DUSTBIN","EARLIER","EASTERN","ECLIPSE","ECONOMY","EDITORS","EFFORTS","ELASTIC"];
var WORDS8=["BASEBALL","FOOTBALL","AIRPLANE","ELEPHANT","COMPUTER","KEYBOARD","MOUNTAIN","DINOSAUR","SANDWICH","BIRTHDAY","SATURDAY","TOMORROW","QUESTION","LANGUAGE","KANGAROO","SNOWBALL","FIREWORK","STARFISH","SUNSHINE","TREASURE","NOTEBOOK","BACKPACK","HOSPITAL","SEASHORE","PRINCESS","BOOKWORM","UMBRELLA","SKELETON","RAINCOAT","LOLLIPOP","CUPBOARD","COLORFUL","HOMEWORK","MIDNIGHT","DAYLIGHT","SWIMMING","FOOTSTEP","ALPHABET","BATHROOM","BEDROOMS","BEHAVIOR","BLUEBIRD","BROCCOLI","BUILDING","CALENDAR","CAMPFIRE","CARNIVAL","CATCHERS","CHAMPION","CHERRIES","CONCERTS","COOKBOOK","DAUGHTER","DAYDREAM","DECEMBER","DISCOVER","DOLPHINS","DOORBELL","DREAMING","DUMBBELL","ELECTRIC","ELEVATOR","ENVELOPE","EVERYDAY","EVERYONE","EXERCISE","EXPLORER","FAMILIES","FAREWELL","FAVORITE","FEBRUARY","FESTIVAL","FIGHTING","FRIENDLY"];
var wordTarget="", wordGuesses=[], wordCurrent="", wordOver=false, keyState={}, wordLen=5;
function wordList(){ return wordLen===6?WORDS6 : wordLen===7?WORDS7 : wordLen===8?WORDS8 : WORDS; }
function pickWord(){ var list=wordList(); return list[Math.floor(Math.random()*list.length)]; }
function setWordLen(n){
  wordLen=n;
  for(var i=5;i<=8;i++){ var b=document.getElementById('wlen-'+i); if(b) b.setAttribute('aria-pressed', i===n?'true':'false'); }
  newWordGame();
}
function renderWordGrid(){
  var g=document.getElementById('word-grid'); g.innerHTML="";
  for(var r=0;r<5;r++){
    var row=document.createElement('div'); row.className='word-row';
    var guess=wordGuesses[r]||"";
    var isCurrent=(r===wordGuesses.length && !wordOver);
    var text=isCurrent?wordCurrent:guess;
    var result=(r<wordGuesses.length)?scoreGuess(guess,wordTarget):null;
    for(var c=0;c<wordLen;c++){
      var d=document.createElement('div'); d.className='tile';
      var ch=text.charAt(c)||""; d.textContent=ch;
      if(ch) d.className+=' filled';
      if(result) d.className+=' '+result[c];
      row.appendChild(d);
    }
    g.appendChild(row);
  }
  var st=document.getElementById('word-status');
  if(wordOver){
    var last=wordGuesses[wordGuesses.length-1];
    if(last===wordTarget) st.innerHTML='You got it in '+wordGuesses.length+'!<small>The word was '+wordTarget+'</small>';
    else st.innerHTML='Out of guesses<small>The word was '+wordTarget+' — tap New word</small>';
  } else {
    st.innerHTML='Guess '+(wordGuesses.length+1)+' of 5<small>'+(wordCurrent?wordCurrent+' — press ENTER':'Start typing')+'</small>';
  }
  renderKeyboard();
}
function scoreGuess(guess,target){
  var n=target.length; var res=[]; var rem={};
  for(var i=0;i<n;i++){ res.push('absent'); if(guess.charAt(i)===target.charAt(i)) res[i]='correct'; else { var t=target.charAt(i); rem[t]=(rem[t]||0)+1; } }
  for(var j=0;j<n;j++){ if(res[j]==='correct') continue; var ch=guess.charAt(j); if(rem[ch]>0){ res[j]='present'; rem[ch]--; } }
  return res;
}
function renderKeyboard(){
  var rows=["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"]; var kb=document.getElementById('keyboard'); kb.innerHTML="";
  for(var r=0;r<rows.length;r++){
    var rowEl=document.createElement('div'); rowEl.className='kb-row';
    if(r===2){
      var enter=document.createElement('button'); enter.className='key wide'; enter.textContent='ENTER'; enter.onclick=submitWord; rowEl.appendChild(enter);
    }
    var letters=rows[r];
    for(var i=0;i<letters.length;i++){
      (function(ch){
        var b=document.createElement('button'); b.className='key'+(keyState[ch]?' '+keyState[ch]:''); b.textContent=ch; b.onclick=function(){ pressKey(ch); };
        rowEl.appendChild(b);
      })(letters.charAt(i));
    }
    if(r===2){
      var del=document.createElement('button'); del.className='key wide'; del.textContent='⌫ DEL'; del.onclick=function(){ pressKey('DEL'); }; rowEl.appendChild(del);
    }
    kb.appendChild(rowEl);
  }
}
function pressKey(k){
  if(wordOver) return;
  if(k==='DEL'){ wordCurrent=wordCurrent.slice(0,-1); }
  else if(wordCurrent.length<wordLen){ wordCurrent+=k; }
  renderWordGrid();
}
function submitWord(){
  if(wordOver) return;
  if(wordCurrent.length!==wordLen){ var st=document.getElementById('word-status'); st.innerHTML='Need '+wordLen+' letters<small>You have '+wordCurrent.length+' — keep typing</small>'; return; }
  var guess=wordCurrent; var res=scoreGuess(guess,wordTarget);
  var rank={absent:0,present:1,correct:2};
  for(var i=0;i<wordLen;i++){ var ch=guess.charAt(i); if(!keyState[ch]||rank[res[i]]>rank[keyState[ch]]) keyState[ch]=res[i]; }
  wordGuesses.push(guess); wordCurrent="";
  if(guess===wordTarget||wordGuesses.length>=5) wordOver=true;
  renderWordGrid();
}
function newWordGame(){ wordTarget=pickWord(); wordGuesses=[]; wordCurrent=""; wordOver=false; keyState={}; renderWordGrid(); }
function giveUpWord(){ if(!wordOver){ wordOver=true; renderWordGrid(); } }
document.addEventListener('keydown',function(e){
  if(document.getElementById('panel-word').className.indexOf('hidden')!==-1) return;
  if(e.key==='Enter') submitWord();
  else if(e.key==='Backspace') pressKey('DEL');
  else if(/^[a-zA-Z]$/.test(e.key)) pressKey(e.key.toUpperCase());
});

/* ---------- SUDOKU 6x6 & 9x9 ---------- */
var SUDOKU=[
 {sol:[1,2,3,4,5,6,4,5,6,1,2,3,2,3,1,5,6,4,5,6,4,2,3,1,3,1,2,6,4,5,6,4,5,3,1,2], puz:[1,0,3,0,5,0,0,5,0,1,0,3,2,0,0,0,6,0,0,6,4,0,0,1,3,0,2,0,0,0,0,4,0,3,0,2]},
 {sol:[2,1,4,3,6,5,3,6,5,2,1,4,1,4,2,5,3,6,5,3,6,1,4,2,4,2,1,6,5,3,6,5,3,4,2,1], puz:[0,1,0,3,0,5,3,0,5,0,0,4,1,0,0,5,0,0,0,3,6,0,4,0,4,0,1,0,0,3,0,5,0,4,0,0]},
 {sol:[5,3,6,1,4,2,1,4,2,5,3,6,3,6,5,2,1,4,2,1,4,6,5,3,6,5,3,4,2,1,4,2,1,3,6,5], puz:[5,0,6,0,0,2,0,4,0,5,0,0,3,0,0,0,1,0,0,1,4,0,0,3,6,0,3,0,2,0,0,2,0,3,0,5]}
];
/* 9x9 puzzles: 81 chars, row by row, "0" = blank; sol is the matching 81 digits. */
var SUDOKU9_STR=[
 {puz:"308501906690080074120609000814750200000294010250060703073016090902000800401000607", sol:"348571926695382174127649385814753269736294518259168743573816492962437851481925637"},
 {puz:"908451700136907800050000192002745681005200370740083009510030007200070036070000400", sol:"928451763136927845457368192392745681865219374741683259514836927289174536673592418"},
 {puz:"800752390923810500005093812208030601300520089501004003000200007000370008039100205", sol:"814752396923816574675493812248937651367521489591684723186245937452379168739168245"}
];
function sudokuStrToNums(s){ var a=[]; for(var i=0;i<s.length;i++) a.push(parseInt(s.charAt(i),10)); return a; }
var SUDOKU9=[];
for(var s9i=0;s9i<SUDOKU9_STR.length;s9i++) SUDOKU9.push({sol:sudokuStrToNums(SUDOKU9_STR[s9i].sol), puz:sudokuStrToNums(SUDOKU9_STR[s9i].puz)});
var sudokuSize=6, sudokuIdx=0, sudokuIdx9=0, sudokuVals=[], sudokuSelected=-1;
function sudokuData(){ return sudokuSize===9?SUDOKU9:SUDOKU; }
function sudokuCurIdx(){ return sudokuSize===9?sudokuIdx9:sudokuIdx; }
function sudokuTotal(){ return sudokuSize*sudokuSize; }
function setSudokuSize(n){
  if(n===sudokuSize) return;
  sudokuSize=n;
  document.getElementById('ssize-6').setAttribute('aria-pressed', n===6?'true':'false');
  document.getElementById('ssize-9').setAttribute('aria-pressed', n===9?'true':'false');
  var d=document.getElementById('sudoku-desc');
  if(d) d.textContent = n===9
    ? 'Fill every row, column and 3×3 box with 1–9. Tap a white cell, then tap a number. Dark cells are given and can\u2019t be changed.'
    : 'Fill every row, column and 2×3 box with 1–6. Tap a white cell, then tap a number. Dark cells are given and can\u2019t be changed.';
  loadSudoku();
}
function loadSudoku(){
  sudokuVals=sudokuData()[sudokuCurIdx()].puz.slice(); sudokuSelected=-1; renderSudoku();
  var total=sudokuTotal(), left=0; for(var i=0;i<total;i++) if(sudokuVals[i]===0) left++;
  document.getElementById('sudoku-status').innerHTML='Puzzle '+(sudokuCurIdx()+1)+' of 3<small>'+left+' cells to fill</small>';
}
function renderSudoku(){
  var n=sudokuSize, data=sudokuData()[sudokuCurIdx()];
  var board=document.getElementById('sudoku-board'); board.innerHTML="";
  board.className='sudoku-board'+(n===9?' s9':'');
  for(var r=0;r<n;r++){
    var row=document.createElement('div'); row.className='s-row';
    for(var c=0;c<n;c++){
      (function(idx){
        var given=data.puz[idx]!==0;
        var b=document.createElement('button'); b.className='s-cell'+(given?' given':'')+(idx===sudokuSelected?' selected':'');
        b.textContent=sudokuVals[idx]||''; b.setAttribute('aria-label','Row '+(Math.floor(idx/n)+1)+' column '+((idx%n)+1));
        b.onclick=function(){ if(!given){ sudokuSelected=idx; renderSudoku(); } };
        row.appendChild(b);
      })(r*n+c);
    }
    board.appendChild(row);
  }
  var pad=document.getElementById('numpad'); pad.innerHTML="";
  for(var k=1;k<=n;k++){ (function(num){ var b=document.createElement('button'); b.className='num'; b.textContent=num; b.onclick=function(){ setSudoku(num); }; pad.appendChild(b); })(k); }
  var er=document.createElement('button'); er.className='num wide'; er.textContent='✕ Erase'; er.onclick=function(){ setSudoku(0); }; pad.appendChild(er);
}
function setSudoku(num){ if(sudokuSelected===-1) return; sudokuVals[sudokuSelected]=num; renderSudoku(); }
function checkSudoku(){
  var sol=sudokuData()[sudokuCurIdx()].sol; var total=sudokuTotal(); var wrong=0, empty=0;
  for(var i=0;i<total;i++){ if(sudokuVals[i]===0) empty++; else if(sudokuVals[i]!==sol[i]) wrong++; }
  var st=document.getElementById('sudoku-status');
  if(wrong===0&&empty===0) st.innerHTML='Solved! Well done<small>Tap Next puzzle for another</small>';
  else if(wrong>0) st.innerHTML=wrong+' wrong<small>Wrong cells are the ones that don\u2019t match — try again</small>';
  else st.innerHTML='So far, so good<small>'+empty+' cells left to fill</small>';
  // mark wrong cells visually
  var cells=document.querySelectorAll('.s-cell');
  for(var j=0;j<total;j++){ if(sudokuVals[j]!==0&&sudokuVals[j]!==sol[j]) cells[j].className+=' wrong'; }
}
function clearSudoku(){ var puz=sudokuData()[sudokuCurIdx()].puz; var total=sudokuTotal(); for(var i=0;i<total;i++) if(puz[i]===0) sudokuVals[i]=0; sudokuSelected=-1; renderSudoku(); loadSudokuStatusOnly(); }
function loadSudokuStatusOnly(){ var total=sudokuTotal(), left=0; for(var i=0;i<total;i++) if(sudokuVals[i]===0) left++; document.getElementById('sudoku-status').innerHTML='Puzzle '+(sudokuCurIdx()+1)+' of 3<small>'+left+' cells to fill</small>'; }
function nextSudoku(){ if(sudokuSize===9) sudokuIdx9=(sudokuIdx9+1)%SUDOKU9.length; else sudokuIdx=(sudokuIdx+1)%SUDOKU.length; loadSudoku(); }

/* ---------- OTHELLO ---------- */
/* board: 0 empty, 1 black (you), 2 white (device). Index = row*8+col */
var othelloBoard=[], othelloLevel=1, othelloOver=false, othelloLast=-1, othelloBusy=false;
var O_DIRS=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
var O_WEIGHTS=[120,-20,20,5,5,20,-20,120,-20,-40,-5,-5,-5,-5,-40,-20,20,-5,15,3,3,15,-5,20,5,-5,3,3,3,3,-5,5,5,-5,3,3,3,3,-5,5,20,-5,15,3,3,15,-5,20,-20,-40,-5,-5,-5,-5,-40,-20,120,-20,20,5,5,20,-20,120];
var O_LEVEL_NAMES={1:'1 · Easy',2:'2 · Medium',3:'3 · Hard'};
function oFlips(board,idx,player){
  if(board[idx]!==0) return [];
  var opp=player===1?2:1, r=Math.floor(idx/8), c=idx%8, all=[];
  for(var d=0;d<8;d++){
    var dr=O_DIRS[d][0], dc=O_DIRS[d][1], line=[], nr=r+dr, nc=c+dc;
    while(nr>=0&&nr<8&&nc>=0&&nc<8&&board[nr*8+nc]===opp){ line.push(nr*8+nc); nr+=dr; nc+=dc; }
    if(line.length&&nr>=0&&nr<8&&nc>=0&&nc<8&&board[nr*8+nc]===player){ for(var k=0;k<line.length;k++) all.push(line[k]); }
  }
  return all;
}
function oLegal(board,player){ var m=[]; for(var i=0;i<64;i++){ if(board[i]===0&&oFlips(board,i,player).length) m.push(i); } return m; }
function oApply(board,idx,player){ var f=oFlips(board,idx,player); board[idx]=player; for(var i=0;i<f.length;i++) board[f[i]]=player; return f.length; }
function oCounts(board){ var b=0,w=0,e=0; for(var i=0;i<64;i++){ if(board[i]===1)b++; else if(board[i]===2)w++; else e++; } return {b:b,w:w,e:e}; }
function oSetStatus(main,sub){ document.getElementById('othello-status').innerHTML=main+'<small>'+sub+'</small>'; }
function renderOthello(){
  var el=document.getElementById('othello-board'); el.innerHTML="";
  var legal=(!othelloOver&&!othelloBusy)?oLegal(othelloBoard,1):[];
  for(var i=0;i<64;i++){
    (function(idx){
      var b=document.createElement('button'); var isLegal=legal.indexOf(idx)!==-1;
      b.className='o-cell'+(isLegal?' valid':'')+(idx===othelloLast?' last':'');
      var r=Math.floor(idx/8)+1, c=(idx%8)+1;
      b.setAttribute('aria-label','Row '+r+' column '+c+(othelloBoard[idx]===1?': black':othelloBoard[idx]===2?': white':isLegal?': you can play here':': empty'));
      if(othelloBoard[idx]!==0){ var s=document.createElement('span'); s.className='disc '+(othelloBoard[idx]===1?'black':'white'); b.appendChild(s); }
      b.onclick=function(){ playOthello(idx); };
      el.appendChild(b);
    })(i);
  }
  var ct=oCounts(othelloBoard);
  document.getElementById('othello-you').textContent=ct.b;
  document.getElementById('othello-cpu').textContent=ct.w;
  document.getElementById('othello-empty').textContent=ct.e;
  document.getElementById('othello-level-label').textContent=O_LEVEL_NAMES[othelloLevel];
}
function newOthello(){
  othelloBoard=[]; for(var i=0;i<64;i++) othelloBoard.push(0);
  othelloBoard[27]=2; othelloBoard[28]=1; othelloBoard[35]=1; othelloBoard[36]=2;
  othelloOver=false; othelloLast=-1; othelloBusy=false;
  renderOthello(); oSetStatus('Your turn — Level '+othelloLevel,'Tap a dotted square to start');
}
function setOthelloLevel(n){
  othelloLevel=n;
  for(var i=1;i<=3;i++) document.getElementById('level-'+i).setAttribute('aria-pressed', i===n?'true':'false');
  newOthello();
}
function playOthello(idx){
  if(othelloOver||othelloBusy) return;
  if(oFlips(othelloBoard,idx,1).length===0) return;
  oApply(othelloBoard,idx,1); othelloLast=idx;
  if(oCheckEnd()) { renderOthello(); return; }
  var cpuMoves=oLegal(othelloBoard,2);
  if(cpuMoves.length===0){
    renderOthello();
    if(oLegal(othelloBoard,1).length===0){ oFinish(); }
    else oSetStatus('Device has no move — you go again','White passes this turn');
    return;
  }
  oDeviceChain();
}
function oDeviceChain(){
  othelloBusy=true; renderOthello(); oSetStatus('Device is thinking…','Level '+othelloLevel+' · White to play');
  setTimeout(function(){
    var mv=oCpuPick();
    if(mv!==-1){ oApply(othelloBoard,mv,2); othelloLast=mv; }
    if(oCheckEnd()){ othelloBusy=false; renderOthello(); return; }
    if(oLegal(othelloBoard,1).length===0){
      // Player still has no move — player passes again.
      // Only finish when neither side can move (handled by oCheckEnd above);
      // otherwise the device keeps playing.
      if(oLegal(othelloBoard,2).length===0){ othelloBusy=false; oFinish(); return; }
      renderOthello();
      oSetStatus('You have no move — device plays again','Black passes this turn');
      // Loop: device plays another move, then re-checks the player.
      setTimeout(function(){ oDeviceChain(); },350);
      return;
    }
    othelloBusy=false;
    renderOthello(); oSetStatus('Your turn','Tap a dotted square');
  },350);
}
function oCheckEnd(){
  var ct=oCounts(othelloBoard);
  if(ct.e===0||(oLegal(othelloBoard,1).length===0&&oLegal(othelloBoard,2).length===0)){ oFinish(); return true; }
  return false;
}
function oFinish(){
  othelloOver=true; renderOthello();
  var ct=oCounts(othelloBoard);
  if(ct.b>ct.w) oSetStatus('You win '+ct.b+' – '+ct.w+'!','Well played — tap New game');
  else if(ct.w>ct.b) oSetStatus('Device wins '+ct.w+' – '+ct.b,'Tap New game to try again');
  else oSetStatus('It\u2019s a draw '+ct.b+' – '+ct.w,'Tap New game to play again');
}
function oEval(board,player){
  var opp=player===1?2:1, score=0, i;
  for(i=0;i<64;i++){ if(board[i]===player) score+=O_WEIGHTS[i]; else if(board[i]===opp) score-=O_WEIGHTS[i]; }
  var my=oLegal(board,player).length, op=oLegal(board,opp).length;
  score+=(my-op)*5;
  var ct=oCounts(board);
  if(ct.e===0) score+=( (player===1?ct.b-ct.w:ct.w-ct.b) )*10;
  else if(ct.e<10) score+=( (player===1?ct.b-ct.w:ct.w-ct.b) )*2;
  return score;
}
function oMinimax(board,depth,alpha,beta,isMax){
  var player=isMax?2:1;
  var moves=oLegal(board,player);
  var other=oLegal(board,player===1?2:1);
  if(depth===0||(moves.length===0&&other.length===0)) return oEval(board,2);
  if(moves.length===0) return oMinimax(board,depth-1,alpha,beta,!isMax);
  var i, copy, v;
  if(isMax){ v=-999999; for(i=0;i<moves.length;i++){ copy=board.slice(); oApply(copy,moves[i],2); v=Math.max(v,oMinimax(copy,depth-1,alpha,beta,false)); alpha=Math.max(alpha,v); if(beta<=alpha) break; } return v; }
  v=999999; for(i=0;i<moves.length;i++){ copy=board.slice(); oApply(copy,moves[i],1); v=Math.min(v,oMinimax(copy,depth-1,alpha,beta,true)); beta=Math.min(beta,v); if(beta<=alpha) break; } return v;
}
function oCpuPick(){
  var moves=oLegal(othelloBoard,2); if(!moves.length) return -1;
  var i, copy;
  if(othelloLevel===1){
    // Easy: random move, but takes a corner if one is offered
    var corners=[0,7,56,63];
    for(i=0;i<moves.length;i++) if(corners.indexOf(moves[i])!==-1 && Math.random()<0.5) return moves[i];
    return moves[Math.floor(Math.random()*moves.length)];
  }
  if(othelloLevel===2){
    // Medium: best immediate result by flips + position
    var best=-999999, pick=moves[0];
    for(i=0;i<moves.length;i++){ copy=othelloBoard.slice(); var f=oApply(copy,moves[i],2); var s=f*2+O_WEIGHTS[moves[i]]; if(s>best){ best=s; pick=moves[i]; } }
    return pick;
  }
  // Hard: look ahead
  var empt=oCounts(othelloBoard).e;
  var depth=empt<=10?empt:4;
  var bestV=-999999, pickH=moves[0];
  for(i=0;i<moves.length;i++){ copy=othelloBoard.slice(); oApply(copy,moves[i],2); var val=oMinimax(copy,depth-1,-999999,999999,false); val+=O_WEIGHTS[moves[i]]*0.1; if(val>bestV){ bestV=val; pickH=moves[i]; } }
  return pickH;
}

