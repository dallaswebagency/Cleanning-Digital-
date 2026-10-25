(function(){
  var h=document.querySelector('.header');
  function onScroll(){h&&h.classList.toggle('scrolled',window.scrollY>10)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  var b=document.querySelector('.burger'),m=document.querySelector('.menu');
  if(b&&m){
    b.addEventListener('click',function(){
      var o=m.classList.toggle('open');
      b.setAttribute('aria-expanded',o);
      document.body.style.overflow=o?'hidden':'';
      b.setAttribute('aria-label',o?'Close menu':'Open menu');
    });
    function closeMenu(){m.classList.remove('open');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Open menu');document.body.style.overflow=''}
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.classList.contains('open')){closeMenu();b.focus()}});
    m.addEventListener('click',function(e){var a=e.target.closest('a');if(a&&!a.parentElement.classList.contains('has-dd')){closeMenu()}});
    window.addEventListener('resize',function(){if(window.innerWidth>1120)closeMenu()});
  }
  document.querySelectorAll('.has-dd>a').forEach(function(a){
    a.addEventListener('click',function(e){
      if(window.innerWidth<=1120){e.preventDefault();var o=a.parentElement.classList.toggle('open');a.setAttribute('aria-expanded',o)}
    });
  });

  var items=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
    },{threshold:.12});
    items.forEach(function(i){io.observe(i)});
  }else{items.forEach(function(i){i.classList.add('in')})}

  document.querySelectorAll('.count').forEach(function(el){
    var t=parseFloat(el.dataset.to),s=el.dataset.suffix||'',p=el.dataset.prefix||'',done=false;
    var o=new IntersectionObserver(function(es){
      if(es[0].isIntersecting&&!done){done=true;var st=null;
        (function step(ts){if(!st)st=ts;var k=Math.min((ts-st)/1400,1);
          el.textContent=p+Math.round(t*(1-Math.pow(1-k,3)))+s;
          if(k<1)requestAnimationFrame(step)})(performance.now());
      }
    });o.observe(el);
  });

  document.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      f.innerHTML='<div class="center" role="status" style="padding:32px 8px"><div class="ico" style="margin:0 auto 24px"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></div><h3>Thanks, we got your message.</h3><p style="color:#737373;margin-top:8px">We will be in touch to arrange your discovery call.</p></div>';
    });
  });
})();

/* hero video pause/play */
(function(){
  var b=document.querySelector('[data-vid-toggle]'), v=document.querySelector('.hero-bg');
  if(!b||!v) return;
  b.addEventListener('click',function(){
    if(v.paused){ v.play(); b.setAttribute('aria-label','Pause background video'); b.firstChild.innerHTML='&#10074;&#10074;'; }
    else { v.pause(); b.setAttribute('aria-label','Play background video'); b.firstChild.innerHTML='&#9654;'; }
  });
})();

/* review marquee pause */
document.querySelectorAll('[data-mq-toggle]').forEach(function(b){
  b.addEventListener('click',function(){
    var mq=document.querySelector('[data-mq]'); if(!mq) return;
    var on=mq.classList.toggle('paused');
    b.setAttribute('aria-pressed',on?'true':'false'); b.textContent=on?'Play reviews':'Pause reviews';
  });
});

/* process wiper sweep */
(function(){
  var wrap=document.querySelector('[data-process]'); if(!wrap) return;
  var steps=[].slice.call(wrap.querySelectorAll('.pr')), wiper=wrap.querySelector('.pr-wiper'), fill=wrap.querySelector('.pr-fill'), track=wrap.querySelector('.pr-track');
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!wiper){steps.forEach(function(s){s.classList.add('on')});return;}
  var DUR=5000, timers=[], visible=false, running=false;
  function clear(){timers.forEach(clearTimeout);timers=[]}
  function cycle(){
    if(!visible){running=false;return;} running=true;
    if(getComputedStyle(track).display==='none'){steps.forEach(function(s){s.classList.add('on')});running=false;return;}
    steps.forEach(function(s){s.classList.remove('on')});
    wrap.classList.add('run');
    [wiper,fill].forEach(function(e){e.style.transition='none';});
    wiper.style.left='0px'; fill.style.width='0px'; void wrap.offsetWidth;
    var w=wrap.clientWidth;
    wiper.style.transition='left '+DUR+'ms linear'; fill.style.transition='width '+DUR+'ms linear';
    wiper.style.left=w+'px'; fill.style.width=w+'px';
    steps.forEach(function(s,i){timers.push(setTimeout(function(){s.classList.add('on')},DUR*(i*2+1)/8))});
    timers.push(setTimeout(function(){wiper.style.transition='opacity .4s';wiper.style.opacity='0';fill.style.transition='opacity .6s';fill.style.opacity='0'},DUR+200));
    timers.push(setTimeout(function(){wiper.style.opacity='';fill.style.opacity='';cycle()},DUR+4200));
  }
  new IntersectionObserver(function(es){es.forEach(function(e){visible=e.isIntersecting; if(visible&&!running) cycle(); if(!visible){clear();running=false;}})},{threshold:.3}).observe(wrap);
})();

/* random Trustpilot review: pop-up on every page + small frame on home */
(function(){
  var R=window.CD_REVIEWS; if(!R||!R.length) return;
  var last=-1; try{last=parseInt(sessionStorage.getItem('cdRev'),10);if(isNaN(last))last=-1}catch(e){}
  var i=Math.floor(Math.random()*R.length); if(R.length>1&&i===last) i=(i+1)%R.length;
  var j=(i+1+Math.floor(Math.random()*(R.length-1)))%R.length;
  try{sessionStorage.setItem('cdRev',String(i))}catch(e){}
  var hr=document.querySelector('[data-hero-rev]');
  if(hr){var r=R[j]; hr.querySelector('[data-hr-text]').textContent=r.t; hr.querySelector('[data-hr-name]').textContent=r.n;}
  var r=R[i], reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t=document.createElement('aside'); t.className='rev-pop'; t.setAttribute('role','status'); t.setAttribute('aria-live','polite');
  t.innerHTML='<button type="button" class="rp-x" aria-label="Close review">&times;</button>'+
    '<div class="rp-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>'+
    '<p class="rp-t"></p><p class="rp-n"><b></b><span></span></p>'+
    '<a class="rp-l" target="_blank" rel="noopener">Read on Trustpilot</a>';
  t.querySelector('.rp-t').textContent='“'+r.t+'”';
  t.querySelector('.rp-n b').textContent=r.n; t.querySelector('.rp-n span').textContent=r.c?(' · '+r.c):'';
  t.querySelector('.rp-l').href=window.CD_TP;
  document.body.appendChild(t);
  var hide=function(){t.classList.remove('show'); setTimeout(function(){t.remove()},reduce?0:500)};
  t.querySelector('.rp-x').addEventListener('click',hide);
  setTimeout(function(){t.classList.add('show')},reduce?300:3500);
  setTimeout(hide,reduce?15000:13000);
})();

/* Inner page hero slideshow */
(function(){
  var bg=document.querySelector('.ph-bg'); if(!bg) return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var slides=[].slice.call(bg.querySelectorAll('.ph-s')); if(slides.length<2) return;
  var i=0,timer=null;
  function load(){slides.forEach(function(s){var d=s.getAttribute('data-src'); if(d){s.src=d; s.removeAttribute('data-src');}});}
  function next(){slides[i].classList.remove('on'); i=(i+1)%slides.length; slides[i].classList.add('on');}
  function start(){ if(reduce||timer) return; timer=setInterval(next,5000); }
  if(document.readyState==='complete') load(); else window.addEventListener('load',load);
  window.addEventListener('load',function(){setTimeout(start,2500)});
  document.addEventListener('visibilitychange',function(){ if(document.hidden){clearInterval(timer);timer=null;} else start(); });
})();

/* Conversion events (sent only when Google Analytics is installed) */
(function(){
  function ev(n,p){if(typeof window.gtag==='function'){window.gtag('event',n,p||{})}}
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');if(!a)return;
    var h=a.getAttribute('href')||'';
    if(h.indexOf('zcal.co')>-1){ev('book_discovery_call',{link_text:(a.textContent||'').trim().slice(0,60),page_path:location.pathname})}
    else if(h.indexOf('mailto:')===0){ev('email_click',{page_path:location.pathname})}
    else if(h.indexOf('tel:')===0){ev('phone_click',{page_path:location.pathname})}
    else if(a.classList.contains('wk')){ev('portfolio_open',{link_text:(a.getAttribute('aria-label')||'').slice(0,60)})}
  },true);
  document.addEventListener('submit',function(e){ev('generate_lead',{form_id:(e.target&&e.target.id)||'form',page_path:location.pathname})},true);
})();

/* conversion event hooks: only fire when GA4 (gtag) is installed */
(function(){
  function ev(n,p){try{if(window.gtag)window.gtag('event',n,p||{})}catch(e){}}
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');if(!a)return;
    var h=a.getAttribute('href')||'';
    if(h.indexOf('zcal.co')>-1)ev('book_discovery_call',{link_text:(a.textContent||'').trim().slice(0,40),page_path:location.pathname});
    else if(h.indexOf('mailto:')===0)ev('email_click',{page_path:location.pathname});
    else if(h.indexOf('tel:')===0)ev('phone_click',{page_path:location.pathname});
  });
  document.addEventListener('submit',function(e){ev('generate_lead',{form_id:(e.target&&e.target.id)||'form',page_path:location.pathname})});
})();

/* Project stories tabs with auto-rotate */
(function(){
  document.querySelectorAll('[data-cs]').forEach(function(box){
    var tabs=[].slice.call(box.querySelectorAll('.cs-tab')),panels=[].slice.call(box.querySelectorAll('.cs-panel')),cur=0,timer=null;
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(i){cur=i;tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i?'true':'false');t.tabIndex=k===i?0:-1});panels.forEach(function(p,k){p.hidden=k!==i})}
    function stop(){clearInterval(timer);timer=null;box.setAttribute('data-paused','')}
    function start(){if(reduce||timer)return;box.removeAttribute('data-paused');timer=setInterval(function(){show((cur+1)%tabs.length)},8000)}
    tabs.forEach(function(t,i){t.addEventListener('click',function(){stop();show(i)});
      t.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d){e.preventDefault();stop();var n=(cur+d+tabs.length)%tabs.length;show(n);tabs[n].focus()}})});
    box.addEventListener('mouseenter',stop);
    if('IntersectionObserver' in window){new IntersectionObserver(function(en){en[0].isIntersecting?start():stop()},{threshold:.4}).observe(box)}else start();
    if(reduce)box.setAttribute('data-paused','');
  });
})();
