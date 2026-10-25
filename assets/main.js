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
    });
  }
  document.querySelectorAll('.has-dd>a').forEach(function(a){
    a.addEventListener('click',function(e){
      if(window.innerWidth<=1120){e.preventDefault();a.parentElement.classList.toggle('open')}
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

  var f=document.querySelector('form[data-demo]');
  if(f){f.addEventListener('submit',function(e){
    e.preventDefault();
    f.innerHTML='<div class="center" style="padding:40px 10px"><div class="ico g" style="margin:0 auto 20px"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2f9a0c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></div><h3>Thanks, we got it.</h3><p style="color:#5B6F88;margin-top:10px">We will send your free website audit within 1 business day.</p></div>';
  })}
})();
