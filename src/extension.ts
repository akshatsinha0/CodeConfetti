import*as vscode from'vscode'

function html(){
  return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; img-src data:; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline';\"><style>html,body{width:100%;height:100%;margin:0;padding:0;background:transparent;overflow:hidden}</style></head><body><canvas id=\"c\"></canvas><script>(function(){var c=document.getElementById('c');var x=c.getContext('2d');var w,h;function r(){w=c.width=window.innerWidth;h=c.height=window.innerHeight}window.addEventListener('resize',r);r();var colors=['#FF3B30','#FF9500','#FFCC00','#34C759','#5856D6','#007AFF','#5AC8FA','#AF52DE','#FF2D55'];var n=220;var p=[];for(var i=0;i<n;i++){p.push({x:Math.random()*w,y:Math.random()*-h,vx:(Math.random()-0.5)*4,vy:Math.random()*4+3,s:Math.random()*6+4,a:Math.random()*Math.PI*2,va:(Math.random()-0.5)*0.3,c:colors[(Math.random()*colors.length)|0]})}function step(){x.clearRect(0,0,w,h);for(var i=0;i<p.length;i++){var o=p[i];o.x+=o.vx;o.y+=o.vy;o.vy+=0.05;o.a+=o.va;x.save();x.translate(o.x,o.y);x.rotate(o.a);x.fillStyle=o.c;x.fillRect(-o.s/2,-o.s/2,o.s,o.s);x.restore();if(o.y>h+20){o.y=-20;o.x=Math.random()*w;o.vy=Math.random()*4+3}}requestAnimationFrame(step)}step()})()</script></body></html>"
}

function showConfetti(){
  const panel=vscode.window.createWebviewPanel('codeConfetti','Code Confetti',vscode.ViewColumn.Active,{enableScripts:true})
  panel.webview.html=html()
  setTimeout(()=>{try{panel.dispose()}catch(e){}},2000)
}

export function activate(context:vscode.ExtensionContext){
  context.subscriptions.push(vscode.commands.registerCommand('codeConfetti.trigger',()=>showConfetti()))
  context.subscriptions.push(vscode.tasks.onDidEndTaskProcess(e=>{if(typeof e.exitCode==='number'&&e.exitCode===0)showConfetti()}))
  context.subscriptions.push(vscode.debug.onDidTerminateDebugSession(()=>showConfetti()))
}

export function deactivate(){}
