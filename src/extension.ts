import*as vscode from'vscode'

let enabled=true

type Intensity='low'|'medium'|'high'
type Style='classic'|'circles'|'triangles'|'stars'|'emoji'
type Theme='rainbow'|'warm'|'cool'|'mono'
type Pattern='fall'|'burst'
type Spawn='top'|'center'|'bottom'|'random'

function getConfig(){const c=vscode.workspace.getConfiguration('codeConfetti');return{enableOnTaskSuccess:c.get('enableOnTaskSuccess',true),enableOnDebugEnd:c.get('enableOnDebugEnd',true),enableOnProblemsCleared:c.get('enableOnProblemsCleared',true),enableOnSave:c.get('enableOnSave',false),durationMs:c.get('durationMs',2000),intensity:c.get('intensity','medium'),style:c.get('style','classic'),theme:c.get('theme','rainbow'),pattern:c.get('pattern','fall'),spawn:c.get('spawn','top'),emojiList:c.get('emojiList','🎉✨🎊⭐🔥💥'),showMessage:c.get('showMessage',false),messageText:c.get('messageText','Great job! 🎉')}}

function countFromIntensity(i:Intensity|string){if(i==='low')return 120;if(i==='high')return 300;return 220}

function html(o:{count:number,duration:number,style:Style,theme:Theme,pattern:Pattern,spawn:Spawn,emojiList:string,showMessage:boolean,messageText:string}){
  return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; img-src data:; media-src data:; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline';\"><style>html,body{width:100%;height:100%;margin:0;padding:0;background:transparent;overflow:hidden}</style></head><body><canvas id=\"c\"></canvas><script>(function(){var O="+JSON.stringify(o)+";var c=document.getElementById('c');var x=c.getContext('2d');var w,h;function r(){w=c.width=window.innerWidth;h=c.height=window.innerHeight}window.addEventListener('resize',r);r();function th(t){if(t==='warm')return ['#FF3B30','#FF9500','#FFCC00','#FF2D55'];if(t==='cool')return ['#34C759','#5856D6','#007AFF','#5AC8FA','#AF52DE'];if(t==='mono')return ['#ffffff','#e0e0e0','#c0c0c0','#a0a0a0'];return ['#FF3B30','#FF9500','#FFCC00','#34C759','#5856D6','#007AFF','#5AC8FA','#AF52DE','#FF2D55']}var colors=th(O.theme);var emojis=String(O.emojiList||'').split('');var n=O.count;var p=[];function spawn(){if(O.spawn==='center')return {x:w/2,y:h/2};if(O.spawn==='bottom')return {x:Math.random()*w,y:h-10};if(O.spawn==='random')return {x:Math.random()*w,y:Math.random()*h*0.5};return {x:Math.random()*w,y:-20}}for(var i=0;i<n;i++){var s=Math.random()*6+4;var base=spawn();var vx=(Math.random()-0.5)*4;var vy=(O.pattern==='burst'?Math.random()*6-3:Math.random()*4+3);var a=Math.random()*Math.PI*2;var va=(Math.random()-0.5)*0.3;var sh=O.style;var em=emojis.length?emojis[(Math.random()*emojis.length)|0]:'🎉';p.push({x:base.x,y:base.y,vx:vx,vy:vy,s:s,a:a,va:va,c:colors[(Math.random()*colors.length)|0],style:sh,emoji:em})}var g=0.05;function draw(o){x.save();x.translate(o.x,o.y);x.rotate(o.a);x.fillStyle=o.c;if(o.style==='circles'){x.beginPath();x.arc(0,0,o.s/2,0,Math.PI*2);x.fill()}else if(o.style==='triangles'){x.beginPath();x.moveTo(0,-o.s/2);x.lineTo(o.s/2,o.s/2);x.lineTo(-o.s/2,o.s/2);x.closePath();x.fill()}else if(o.style==='stars'){x.beginPath();var R=o.s/2,r=R*0.5;for(var k=0;k<10;k++){var ang=Math.PI/5*k;var rad=(k%2===0)?R:r;x.lineTo(Math.cos(ang)*rad,Math.sin(ang)*rad)}x.closePath();x.fill()}else if(o.style==='emoji'){x.font=o.s+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(o.emoji,0,0)}else{x.fillRect(-o.s/2,-o.s/2,o.s,o.s)}x.restore()}function step(){x.clearRect(0,0,w,h);for(var i=0;i<p.length;i++){var o=p[i];o.x+=o.vx;o.y+=o.vy;o.vy+=g;o.a+=o.va;draw(o);if(O.pattern==='burst'){o.vx*=0.992}if(o.y>h+40||o.x<-40||o.x>w+40){if(O.pattern==='burst'){var b=spawn();o.x=b.x;o.y=b.y;o.vx=(Math.random()-0.5)*6;o.vy=(Math.random()-0.5)*6}else{o.y=-20;o.x=Math.random()*w;o.vy=Math.random()*4+3}}}if(O.showMessage){x.save();x.font='24px sans-serif';x.fillStyle='rgba(255,255,255,0.9)';x.textAlign='center';x.fillText(O.messageText||'',w/2,Math.max(30,h*0.15));x.restore()}requestAnimationFrame(step)}step()})()</script></body></html>"
}

function showConfetti(over?:Partial<{duration:number,count:number,style:Style,theme:Theme,pattern:Pattern,spawn:Spawn,emojiList:string,showMessage:boolean,messageText:string}>){
  const cfg=getConfig()
  const count=over&&over.count?over.count:countFromIntensity(cfg.intensity as any)
  const duration=over&&over.duration?over.duration:cfg.durationMs
  const panel=vscode.window.createWebviewPanel('codeConfetti','Code Confetti',vscode.ViewColumn.Active,{enableScripts:true})
  const opt={count:count,duration:duration,style:(over&&over.style?over.style:cfg.style) as Style,theme:(over&&over.theme?over.theme:cfg.theme) as Theme,pattern:(over&&over.pattern?over.pattern:cfg.pattern) as Pattern,spawn:(over&&over.spawn?over.spawn:cfg.spawn) as Spawn,emojiList:(over&&over.emojiList?over.emojiList:cfg.emojiList) as string,showMessage:over&&typeof over.showMessage==='boolean'?over.showMessage:cfg.showMessage,messageText:over&&over.messageText?over.messageText:cfg.messageText}
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
  context.subscriptions.push(status)
  context.subscriptions.push(vscode.commands.registerCommand('codeConfetti.trigger',()=>{if(enabled)showConfetti()}))
  context.subscriptions.push(vscode.commands.registerCommand('codeConfetti.toggle',()=>{enabled=!enabled;update()}))
  context.subscriptions.push(vscode.commands.registerCommand('codeConfetti.burst',()=>{if(enabled)showConfetti({pattern:'burst'})}))
  context.subscriptions.push(vscode.commands.registerCommand('codeConfetti.pickStyle',async()=>{const choice=await vscode.window.showQuickPick(['classic','circles','triangles','stars','emoji'],{placeHolder:'Confetti style'});if(!choice)return;await vscode.workspace.getConfiguration('codeConfetti').update('style',choice,true);if(enabled)showConfetti()}))
  const cfg=getConfig()
  if(cfg.enableOnTaskSuccess){context.subscriptions.push(vscode.tasks.onDidEndTaskProcess(e=>{if(!enabled)return;if(typeof e.exitCode==='number'&&e.exitCode===0)showConfetti()}))}
  if(cfg.enableOnDebugEnd){context.subscriptions.push(vscode.debug.onDidTerminateDebugSession(()=>{if(!enabled)return;showConfetti()}))}
  let lastErrors=getAllErrorCount()
  if(cfg.enableOnProblemsCleared){context.subscriptions.push(vscode.languages.onDidChangeDiagnostics(()=>{if(!enabled)return;const cur=getAllErrorCount();if(cur===0&&lastErrors>0)showConfetti();lastErrors=cur}))}
  if(cfg.enableOnSave){context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(doc=>{if(!enabled)return;const c=getDocErrorCount(doc.uri);if(c===0)showConfetti()}))}
}

export function deactivate(){}
