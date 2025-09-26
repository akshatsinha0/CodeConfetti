import*as vscode from'vscode'

let enabled=true

type Intensity='low'|'medium'|'high'

function getConfig(){const c=vscode.workspace.getConfiguration('codeConfetti');return{enableOnTaskSuccess:c.get('enableOnTaskSuccess',true),enableOnDebugEnd:c.get('enableOnDebugEnd',true),enableOnProblemsCleared:c.get('enableOnProblemsCleared',true),enableOnSave:c.get('enableOnSave',false),durationMs:c.get('durationMs',2000),intensity:c.get('intensity','medium')}}

function countFromIntensity(i:Intensity|string){if(i==='low')return 120;if(i==='high')return 300;return 220}

function html(count:number){
  return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; img-src data:; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline';\"><style>html,body{width:100%;height:100%;margin:0;padding:0;background:transparent;overflow:hidden}</style></head><body><canvas id=\"c\"></canvas><script>(function(){var c=document.getElementById('c');var x=c.getContext('2d');var w,h;function r(){w=c.width=window.innerWidth;h=c.height=window.innerHeight}window.addEventListener('resize',r);r();var colors=['#FF3B30','#FF9500','#FFCC00','#34C759','#5856D6','#007AFF','#5AC8FA','#AF52DE','#FF2D55'];var n="+count+";var p=[];for(var i=0;i<n;i++){p.push({x:Math.random()*w,y:Math.random()*-h,vx:(Math.random()-0.5)*4,vy:Math.random()*4+3,s:Math.random()*6+4,a:Math.random()*Math.PI*2,va:(Math.random()-0.5)*0.3,c:colors[(Math.random()*colors.length)|0]})}function step(){x.clearRect(0,0,w,h);for(var i=0;i<p.length;i++){var o=p[i];o.x+=o.vx;o.y+=o.vy;o.vy+=0.05;o.a+=o.va;x.save();x.translate(o.x,o.y);x.rotate(o.a);x.fillStyle=o.c;x.fillRect(-o.s/2,-o.s/2,o.s,o.s);x.restore();if(o.y>h+20){o.y=-20;o.x=Math.random()*w;o.vy=Math.random()*4+3}}requestAnimationFrame(step)}step()})()</script></body></html>"
}

function showConfetti(opts?:{duration?:number,count?:number}){
  const cfg=getConfig()
  const count=opts&&opts.count?opts.count:countFromIntensity(cfg.intensity as any)
  const duration=opts&&opts.duration?opts.duration:cfg.durationMs
  const panel=vscode.window.createWebviewPanel('codeConfetti','Code Confetti',vscode.ViewColumn.Active,{enableScripts:true})
  panel.webview.html=html(count)
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
  const cfg=getConfig()
  if(cfg.enableOnTaskSuccess){context.subscriptions.push(vscode.tasks.onDidEndTaskProcess(e=>{if(!enabled)return;if(typeof e.exitCode==='number'&&e.exitCode===0)showConfetti()}))}
  if(cfg.enableOnDebugEnd){context.subscriptions.push(vscode.debug.onDidTerminateDebugSession(()=>{if(!enabled)return;showConfetti()}))}
  let lastErrors=getAllErrorCount()
  if(cfg.enableOnProblemsCleared){context.subscriptions.push(vscode.languages.onDidChangeDiagnostics(()=>{if(!enabled)return;const cur=getAllErrorCount();if(cur===0&&lastErrors>0)showConfetti();lastErrors=cur}))}
  if(cfg.enableOnSave){context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(doc=>{if(!enabled)return;const c=getDocErrorCount(doc.uri);if(c===0)showConfetti()}))}
}

export function deactivate(){}
