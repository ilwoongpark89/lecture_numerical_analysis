(function(){
  var screens=Array.prototype.slice.call(document.querySelectorAll('.screen'));
  var stage=document.getElementById('stage'), stepbar=document.getElementById('stepbar'), chrail=document.getElementById('chrail');
  var prevBtn=document.getElementById('prevBtn'), nextBtn=document.getElementById('nextBtn');
  var N=screens.length, active=0;
  var chapters=[]; screens.forEach(function(s){var c=s.getAttribute('data-ch'); if(chapters.indexOf(c)<0)chapters.push(c);});
  function chOf(i){return screens[i].getAttribute('data-ch');} function stOf(i){return screens[i].getAttribute('data-stage');}

  function fitActive(){ var u=screens[active]; if(!u)return; u.style.transform='none'; var avail=stage.clientHeight, nat=u.offsetHeight; if(nat<=0||avail<=0)return; if(nat>avail){u.style.transformOrigin='top center'; u.style.transform='scale('+(avail/nat)+')';} else {u.style.transformOrigin='top center'; var _st=u.getAttribute('data-stage'); var _cap=(_st==='점검'||_st==='연습')?44:(avail-nat)/2; u.style.transform='translateY('+Math.min((avail-nat)/2,_cap)+'px)';} }

  function buildChrail(){ chrail.innerHTML=''; chapters.forEach(function(c){ var d=document.createElement('span'); d.className='chdot'; d.textContent=c; d.addEventListener('click',function(){ for(var k=0;k<N;k++){ if(chOf(k)===c){show(k);break;} } }); chrail.appendChild(d); }); }
  function buildStepper(){ var ch=chOf(active); var list=[]; for(var i=0;i<N;i++){ if(chOf(i)===ch) list.push(i); } stepbar.innerHTML=''; list.forEach(function(idx,k){ var el=document.createElement('div'); var cls='step'; if(idx===active)cls+=' cur'; else if(idx<active)cls+=' done'; el.className=cls; el.innerHTML='<span class="ix">'+(k+1)+'</span>'+stOf(idx); el.addEventListener('click',function(){show(idx);}); stepbar.appendChild(el); if(k<list.length-1){var ln=document.createElement('span'); ln.className='link'; el.appendChild(ln);} }); }

  function render(){ for(var i=0;i<N;i++) screens[i].classList.toggle('active', i===active); var ch=chOf(active); Array.prototype.forEach.call(chrail.children,function(d){ d.classList.toggle('cur', d.textContent===ch); }); buildStepper(); prevBtn.disabled=(active===0); if(active>=N-1){ nextBtn.textContent='✓ 완료 · 목록으로'; } else { var nx=active+1; nextBtn.textContent=(chOf(nx)===ch)?('다음 · '+stOf(nx)+' →'):('다음 챕터 '+chOf(nx)+' →'); } fitActive(); }
  function show(i){ if(i<0)i=0; if(i>N-1)i=N-1; active=i; render(); }

  function toggleReveal(btn){ var scope=btn.closest('.prob')||btn.closest('.screen'); var t=scope?scope.querySelector('.revealable.solution'):null; if(!t)return; var open=t.classList.toggle('open'); btn.classList.toggle('is-open',open); var sp=btn.querySelector('span'); if(sp)sp.textContent=open?'풀이 숨기기':'풀이 보기'; fitActive(); }

  document.addEventListener('click',function(e){
    var opt=e.target.closest?e.target.closest('.opt'):null;
    if(opt){ var wrap=opt.parentElement; Array.prototype.forEach.call(wrap.children,function(o){o.classList.remove('sel');}); opt.classList.add('sel'); return; }
    var sub=e.target.closest?e.target.closest('.cp-submit'):null;
    if(sub){ var cq=sub.closest('.cq')||sub.closest('.screen'); var sel=cq.querySelector('.opt.sel'); var fb=cq.querySelector('.cp-fb'); var prof=cq.querySelector('.cp-exp')||cq.querySelector('.cp-prof'); if(!sel){ if(fb){fb.textContent='먼저 보기를 선택하세요'; fb.style.color='var(--gray2)';} return; } var ok=sel.getAttribute('data-correct')==='1'; if(fb){fb.textContent=ok?'✓ 제출됨 — 정답':'제출됨 — 학급 응답에 반영'; fb.style.color='var(--accent)';} Array.prototype.forEach.call(cq.querySelectorAll('.opt'),function(o){if(o.getAttribute('data-correct')==='1')o.classList.add('correct');}); if(prof)prof.classList.add('show'); fitActive(); return; }
    var chk=e.target.closest?e.target.closest('.pr-check'):null;
    if(chk){ var pb=chk.closest('.prob')||chk.closest('.screen'); var input=pb.querySelector('.ans-input'); var pf=pb.querySelector('.pr-fb'); if(!input||!pf)return; var ans=parseFloat(input.getAttribute('data-answer')), tol=parseFloat(input.getAttribute('data-tol')||'0.02'), atol=parseFloat(input.getAttribute('data-atol')||'0'); var raw=(input.value||'').replace(/[,\s]/g,''); if(raw===''){pf.textContent='먼저 답을 입력하세요'; pf.className='check-fb pr-fb no'; return;} var v=parseFloat(raw), good=window.NA_grade(v,ans,tol,atol); pf.textContent=good?'✓ 정답입니다 — 풀이로 과정 확인':'✗ 다시 — 풀이로 과정 확인'; pf.className='check-fb pr-fb '+(good?'ok':'no'); fitActive(); return; }
    var rb=e.target.closest?e.target.closest('.reveal-btn'):null; if(rb){ toggleReveal(rb); return; }
  });
  document.addEventListener('keydown',function(e){ if(e.target&&e.target.classList&&e.target.classList.contains('ans-input')){ if(e.key==='Enter'){var b=e.target.closest('.prob').querySelector('.pr-check'); if(b)b.click();} return; } if(e.key==='ArrowRight')show(active+1); else if(e.key==='ArrowLeft')show(active-1); });
  prevBtn.addEventListener('click',function(){show(active-1);}); nextBtn.addEventListener('click',function(){ if(active>=N-1){location.href='/';} else {show(active+1);} });
  window.addEventListener('resize',fitActive);

  // ── interactive calc widgets ──
  function _sup(n){var m={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};return String(n).split('').map(function(c){return m[c]||c;}).join('');} function fnum(x){ if(!isFinite(x))return '—'; var a=Math.abs(x); if(a!==0&&(a<0.01||a>=1e5)){ var e=Math.floor(Math.log10(a)); var mn=x/Math.pow(10,e); return (Math.round(mn*100)/100)+' × 10'+_sup(e); } return (Math.round(x*1000)/1000).toLocaleString(); }
  function initCalcs(){ Array.prototype.forEach.call(document.querySelectorAll('.calc:not([data-init])'),function(c){ c.setAttribute('data-init','1'); var vars; try{vars=JSON.parse(c.getAttribute('data-vars')||'[]');}catch(e){vars=[];} var expr=c.getAttribute('data-expr')||'0'; var outSym=c.getAttribute('data-out')||''; var outUnit=c.getAttribute('data-out-unit')||''; var barmax=parseFloat(c.getAttribute('data-barmax')||'0'); var title=c.getAttribute('data-title')||''; var desc=c.getAttribute('data-desc')||''; var note=c.getAttribute('data-note')||'';
    var html='<div class="calc-title">'+title+'</div>'; if(desc)html+='<div class="calc-desc">'+desc+'</div>'; html+='<div class="calc-rows"></div><div class="calc-out"><span class="calc-os">'+outSym+'</span><span>=</span><b class="calc-num">—</b><span class="calc-ou">'+outUnit+'</span></div>'; if(barmax>0)html+='<div class="calc-outbar"><div class="bar"><span class="calc-bar" style="width:0%"></span></div></div>'; if(note)html+='<div class="calc-note">'+note+'</div>'; c.innerHTML=html;
    var rowsEl=c.querySelector('.calc-rows'); var inputs={}; var fn; try{ fn=Function.apply(null, vars.map(function(v){return v.sym;}).concat(['return ('+expr+');'])); }catch(e){ fn=function(){return NaN;}; }
    vars.forEach(function(v){ var row=document.createElement('div'); row.className='calc-row'; row.innerHTML='<span class="calc-lab">'+(v.label||v.sym)+'</span><input type="range" min="'+v.min+'" max="'+v.max+'" step="'+(v.step||((v.max-v.min)/100))+'" value="'+v.val+'"><span class="calc-val"></span>'; rowsEl.appendChild(row); var rng=row.querySelector('input'); inputs[v.sym]={rng:rng, val:row.querySelector('.calc-val'), unit:v.unit||''}; rng.addEventListener('input',recompute); });
    function recompute(){ var args=vars.map(function(v){return parseFloat(inputs[v.sym].rng.value);}); vars.forEach(function(v){ var o=inputs[v.sym]; o.val.textContent=fnum(parseFloat(o.rng.value))+(o.unit?(' '+o.unit):''); }); var y; try{y=fn.apply(null,args);}catch(e){y=NaN;} c.querySelector('.calc-num').textContent=fnum(y); if(barmax>0){ var w=Math.max(0,Math.min(100, y/barmax*100)); var b=c.querySelector('.calc-bar'); if(b)b.style.width=w+'%'; } }
    recompute();
  }); }

  // 코드 복사 버튼 (R4) — 정적 codeblock 에 1회 배선
  function initCopy(){ Array.prototype.forEach.call(document.querySelectorAll('.codeblock:not([data-copy])'),function(bl){ bl.setAttribute('data-copy','1'); var cap=bl.querySelector('.code-cap'); var pre=bl.querySelector('pre'); if(!pre)return; var btn=document.createElement('button'); btn.type='button'; btn.className='code-copy'; btn.textContent='복사'; btn.addEventListener('click',function(){ var t=(bl.querySelector('code')||pre).innerText; if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(function(){ btn.textContent='복사됨 ✓'; setTimeout(function(){btn.textContent='복사';},1400); },function(){ btn.textContent='실패'; }); } }); if(cap){ cap.classList.add('code-cap-row'); cap.appendChild(btn); } else { bl.insertBefore(btn,bl.firstChild); } }); }

  function renderMath(){ initCalcs(); initCopy(); if(window.renderMathInElement){ renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false}); } fitActive(); if(window.requestAnimationFrame)requestAnimationFrame(fitActive); }

  function applyDeep(){ var p=new URLSearchParams(location.search), idx=0; var s=parseInt(p.get('slide'),10); if(!isNaN(s))idx=Math.min(Math.max(s,0),N-1); var u=p.get('unit'); if(u){ for(var i=0;i<N;i++){ if(chOf(i)===u){idx=i;break;} } } var rev=p.get('reveal')==='all'; show(idx); if(rev){ Array.prototype.forEach.call(screens[idx].querySelectorAll('.reveal-btn'),function(b){toggleReveal(b);}); Array.prototype.forEach.call(screens[idx].querySelectorAll('.cq'),function(cq){ var o=cq.querySelector('.opt[data-correct]'); if(o){o.classList.add('sel'); var sb=cq.querySelector('.cp-submit'); if(sb)sb.click();} }); } }

  buildChrail();
  document.addEventListener('DOMContentLoaded',function(){ applyDeep(); renderMath(); });
  if(document.readyState!=='loading'){ applyDeep(); renderMath(); }
  window.addEventListener('load',renderMath);
})();
