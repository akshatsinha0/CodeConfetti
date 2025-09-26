import*as vscode from'vscode'

let enabled=true

type Intensity='low'|'medium'|'high'
type Style='classic'|'circles'|'triangles'|'stars'|'emoji'|'ribbons'
type Theme='rainbow'|'warm'|'cool'|'mono'
type Pattern='fall'|'burst'|'fireworks'
type Spawn='top'|'center'|'bottom'|'random'

function getConfig(){const c=vscode.workspace.getConfiguration('codeConfetti');return{enableOnTaskSuccess:c.get('enableOnTaskSuccess',true),enableOnDebugEnd:c.get('enableOnDebugEnd',true),enableOnProblemsCleared:c.get('enableOnProblemsCleared',true),enableOnSave:c.get('enableOnSave',false),durationMs:c.get('durationMs',2000),intensity:c.get('intensity','medium'),style:c.get('style','classic'),theme:c.get('theme','rainbow'),pattern:c.get('pattern','fall'),spawn:c.get('spawn','top'),emojiList:c.get('emojiList','🎉✨🎊⭐🔥💥'),showMessage:c.get('showMessage',false),messageText:c.get('messageText','Great job! 🎉'),gravity:c.get('gravity',0.05),wind:c.get('wind',0),overlayOpacity:c.get('overlayOpacity',0),enableSound:c.get('enableSound',false),soundVolume:c.get('soundVolume',0.5)}}

function countFromIntensity(i:Intensity|string){if(i==='low')return 120;if(i==='high')return 300;return 220}

function html(o:{count:number,duration:number,style:Style,theme:Theme,pattern:Pattern,spawn:Spawn,emojiList:string,showMessage:boolean,messageText:string,gravity:number,wind:number,overlayOpacity:number,enableSound:boolean,soundVolume:number}){
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; media-src data:; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline';"><style>html,body{width:100%;height:100%;margin:0;padding:0;background:transparent;overflow:hidden}</style></head><body><canvas id="c"></canvas><script>(function(){var O=${JSON.stringify(o)};var c=document.getElementById('c');var x=c.getContext('2d');var w,h;function r(){w=c.width=window.innerWidth;h=c.height=window.innerHeight}window.addEventListener('resize',r);r();function th(t){if(t==='warm')return ['#FF3B30','#FF9500','#FFCC00','#FF2D55'];if(t==='cool')return ['#34C759','#5856D6','#007AFF','#5AC8FA','#AF52DE'];if(t==='mono')return ['#ffffff','#e0e0e0','#c0c0c0','#a0a0a0'];return ['#FF3B30','#FF9500','#FFCC00','#34C759','#5856D6','#007AFF','#5AC8FA','#AF52DE','#FF2D55']}var colors=th(O.theme);var emojis=String(O.emojiList||'').split('');var n=O.count;var p=[];var rs=[];function spawn(){if(O.spawn==='center')return {x:w/2,y:h/2};if(O.spawn==='bottom')return {x:Math.random()*w,y:h-10};if(O.spawn==='random')return {x:Math.random()*w,y:Math.random()*h*0.5};return {x:Math.random()*w,y:-20}}function mk(){for(var i=0;i<n;i++){var s=Math.random()*6+4;var base=spawn();var vx=(Math.random()-0.5)*4+O.wind*0.5;var vy=(O.pattern==='burst'?Math.random()*6-3:Math.random()*4+3);var a=Math.random()*Math.PI*2;var va=(Math.random()-0.5)*0.3;var sh=O.style;var em=emojis.length?emojis[(Math.random()*emojis.length)|0]:'🎉';p.push({x:base.x,y:base.y,vx:vx,vy:vy,s:s,a:a,va:va,c:colors[(Math.random()*colors.length)|0],style:sh,emoji:em})}}function rockets(){rs=[];for(var i=0;i<4;i++){rs.push({x:Math.random()*w*0.8+w*0.1,y:h+20,vx:(Math.random()-0.5)*1.2,vy:-(Math.random()*4+6),life:40+Math.random()*30})}}var g=O.gravity||0.05;var ov=O.overlayOpacity||0;var snd=O.enableSound;var vol=O.soundVolume||0.5;if(snd){try{var AC=window.AudioContext||window.webkitAudioContext;var ac=new AC();var oac=ac.createOscillator();var gn=ac.createGain();oac.connect(gn);gn.connect(ac.destination);oac.type='triangle';oac.frequency.value=880;gn.gain.value=vol;var t=ac.currentTime;oac.start();gn.gain.exponentialRampToValueAtTime(0.0001,t+0.25);oac.stop(t+0.26)}catch(e){}}
  if(O.pattern==='fireworks')rockets();else mk();
  function draw(o){x.save();x.translate(o.x,o.y);x.rotate(o.a);x.fillStyle=o.c;if(o.style==='circles'){x.beginPath();x.arc(0,0,o.s/2,0,Math.PI*2);x.fill()}else if(o.style==='triangles'){x.beginPath();x.moveTo(0,-o.s/2);x.lineTo(o.s/2,o.s/2);x.lineTo(-o.s/2,o.s/2);x.closePath();x.fill()}else if(o.style==='stars'){x.beginPath();var R=o.s/2,r=R*0.5;for(var k=0;k<10;k++){var ang=Math.PI/5*k;var rad=(k%2===0)?R:r;x.lineTo(Math.cos(ang)*rad,Math.sin(ang)*rad)}x.closePath();x.fill()}else if(o.style==='emoji'){x.font=o.s+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(o.emoji,0,0)}else if(o.style==='ribbons'){x.fillRect(-o.s/2,-o.s*0.1,o.s,o.s*0.2)}else{x.fillRect(-o.s/2,-o.s/2,o.s,o.s)}x.restore()}
  function step(){x.clearRect(0,0,w,h);if(ov>0){x.fillStyle='rgba(0,0,0,'+ov+')';x.fillRect(0,0,w,h)}if(O.pattern==='fireworks'){for(var i=rs.length-1;i>=0;i--){var ro=rs[i];ro.x+=ro.vx;ro.y+=ro.vy;ro.vy+=g*0.5;ro.life-=1;if(ro.life<=0||ro.vy> -1){for(var m=0;m<Math.max(20,Math.floor(n/4));m++){var ang=Math.random()*Math.PI*2;var sp=Math.random()*4+2;p.push({x:ro.x,y:ro.y,vx:Math.cos(ang)*sp+O.wind*0.5,vy:Math.sin(ang)*sp,s:Math.random()*6+4,a:Math.random()*Math.PI*2,va:(Math.random()-0.5)*0.3,c:colors[(Math.random()*colors.length)|0],style:O.style,emoji:emojis.length?emojis[(Math.random()*emojis.length)|0]:'🎉'})}rs.splice(i,1);rs.push({x:Math.random()*w*0.8+w*0.1,y:h+20,vx:(Math.random()-0.5)*1.2,vy:-(Math.random()*4+6),life:40+Math.random()*30})}}
  }
  for(var i=0;i<p.length;i++){var o=p[i];o.x+=o.vx+(O.wind||0);o.y+=o.vy;o.vy+=g;o.a+=o.va;draw(o);if(O.pattern==='burst'){o.vx*=0.992}if(o.y>h+40||o.x<-60||o.x>w+60){if(O.pattern==='burst'){var b=spawn();o.x=b.x;o.y=b.y;o.vx=(Math.random()-0.5)*6;o.vy=(Math.random()-0.5)*6}else{o.y=-20;o.x=Math.random()*w;o.vy=Math.random()*4+3}}}
  if(O.showMessage){x.save();x.font='24px sans-serif';x.fillStyle='rgba(255,255,255,0.9)';x.textAlign='center';x.fillText(O.messageText||'',w/2,Math.max(30,h*0.15));x.restore()}
  requestAnimationFrame(step)}step()})()</script></body></html>`
}

function showConfetti(over?:Partial<{duration:number,count:number,style:Style,theme:Theme,pattern:Pattern,spawn:Spawn,emojiList:string,showMessage:boolean,messageText:string,gravity:number,wind:number,overlayOpacity:number,enableSound:boolean,soundVolume:number}>){
  const cfg=getConfig()
  const count=over&&over.count?over.count:countFromIntensity(cfg.intensity as any)
  const duration=over&&over.duration?over.duration:cfg.durationMs
  const panel=vscode.window.createWebviewPanel('codeConfetti','Code Confetti',vscode.ViewColumn.Active,{enableScripts:true})
  const opt={count:count,duration:duration,style:(over&&over.style?over.style:cfg.style) as Style,theme:(over&&over.theme?over.theme:cfg.theme) as Theme,pattern:(over&&over.pattern?over.pattern:cfg.pattern) as Pattern,spawn:(over&&over.spawn?over.spawn:cfg.spawn) as Spawn,emojiList:(over&&over.emojiList?over.emojiList:cfg.emojiList) as string,showMessage:over&&typeof over.showMessage==='boolean'?over.showMessage:cfg.showMessage,messageText:over&&over.messageText?over.messageText:cfg.messageText,gravity:over&&over.gravity?over.gravity:cfg.gravity,wind:over&&over.wind?over.wind:cfg.wind,overlayOpacity:over&&over.overlayOpacity?over.overlayOpacity:cfg.overlayOpacity,enableSound:over&&typeof over.enableSound==='boolean'?over.enableSound:cfg.enableSound,soundVolume:over&&over.soundVolume?over.soundVolume:cfg.soundVolume}
  panel.webview.html=html(opt)
  setTimeout(()=>{try{panel.dispose()}catch(e){}},duration)
}

function getAllErrorCount(){let n=0;for(const e of vscode.languages.getDiagnostics()){for(const d of e[1]){if(d.severity===vscode.DiagnosticSeverity.Error)n++}}return n}

function getDocErrorCount(u:vscode.Uri){let n=0;for(const d of vscode.languages.getDiagnostics(u)){if(d.severity===vscode.DiagnosticSeverity.Error)n++}return n}

export function activate(context:vscode.ExtensionContext){
  const status=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right,1000)
  status.command='codeConfetti.toggle'
  function update(){status.text=enabled?'$(sparkle) Confetti':'$(circle-slash) Confetti';status.show()}
  update()
  function celebrate(over?:Parameters<typeof showConfetti>[0]){if(enabled)showConfetti(over);const k='ccount';const n=(context.globalState.get(k,0) as number)+1;context.globalState.update(k,n);if(n===10||n===50||n===100)vscode.window.showInformationMessage('Milestone '+n)}
  context.subscriptions.push(status)
  context.subscriptions.push(vscode.commands.registerCommand('codeConfetti.trigger',()=>celebrate()))
  context.subscriptions.push(vscode.commands.registerCommand('codeConfetti.toggle',()=>{enabled=!enabled;update()}))
  context.subscriptions.push(vscode.commands.registerCommand('codeConfetti.burst',()=>celebrate({pattern:'burst'})))
  context.subscriptions.push(vscode.commands.registerCommand('codeConfetti.pickStyle',async()=>{const choice=await vscode.window.showQuickPick(['classic','circles','triangles','stars','emoji','ribbons'],{placeHolder:'Confetti style'});if(!choice)return;await vscode.workspace.getConfiguration('codeConfetti').update('style',choice,true);celebrate()}))
  context.subscriptions.push(vscode.commands.registerCommand('codeConfetti.pickPattern',async()=>{const choice=await vscode.window.showQuickPick(['fall','burst','fireworks'],{placeHolder:'Pattern'});if(!choice)return;await vscode.workspace.getConfiguration('codeConfetti').update('pattern',choice,true);celebrate()}))
  context.subscriptions.push(vscode.commands.registerCommand('codeConfetti.pickTheme',async()=>{const choice=await vscode.window.showQuickPick(['rainbow','warm','cool','mono'],{placeHolder:'Theme'});if(!choice)return;await vscode.workspace.getConfiguration('codeConfetti').update('theme',choice,true);celebrate()}))
context.subscriptions.push(vscode.commands.registerCommand('codeConfetti.cycleIntensity',async()=>{const cur=String(vscode.workspace.getConfiguration('codeConfetti').get('intensity','medium'));const ns=cur==='low'?'medium':cur==='medium'?'high':'low';await vscode.workspace.getConfiguration('codeConfetti').update('intensity',ns,true);celebrate()}))
  context.subscriptions.push(vscode.commands.registerCommand('codeConfetti.random',()=>{const styles=['classic','circles','triangles','stars','emoji','ribbons'];const themes=['rainbow','warm','cool','mono'];const pats=['fall','burst','fireworks'];const cfg=vscode.workspace.getConfiguration('codeConfetti');cfg.update('style',styles[(Math.random()*styles.length)|0],true);cfg.update('theme',themes[(Math.random()*themes.length)|0],true);cfg.update('pattern',pats[(Math.random()*pats.length)|0],true);celebrate()}))
  const cfg=getConfig()
  if(cfg.enableOnTaskSuccess){context.subscriptions.push(vscode.tasks.onDidEndTaskProcess(e=>{if(typeof e.exitCode==='number'&&e.exitCode===0)celebrate()}))}
  if(cfg.enableOnDebugEnd){context.subscriptions.push(vscode.debug.onDidTerminateDebugSession(()=>celebrate()))}
  let lastErrors=getAllErrorCount()
  if(cfg.enableOnProblemsCleared){context.subscriptions.push(vscode.languages.onDidChangeDiagnostics(()=>{const cur=getAllErrorCount();if(cur===0&&lastErrors>0)celebrate();lastErrors=cur}))}
  if(cfg.enableOnSave){context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(doc=>{const c=getDocErrorCount(doc.uri);if(c===0)celebrate()}))}
}

export function deactivate(){}
