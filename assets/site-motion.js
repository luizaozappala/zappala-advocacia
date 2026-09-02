(function(){
  'use strict';
  var root=document.documentElement;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function makeField(section,count){
    if(!section || section.querySelector('.ambient-field')) return;
    var field=document.createElement('div'); field.className='ambient-field'; field.setAttribute('aria-hidden','true');
    for(var i=1;i<=count;i++){var orb=document.createElement('span');orb.className='ambient-orb ambient-orb--'+i;field.appendChild(orb);} section.insertBefore(field,section.firstChild);
    if(!reduce && window.matchMedia('(pointer:fine)').matches){var tx=0,ty=0,raf=0;section.addEventListener('pointermove',function(e){var r=section.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*10;ty=((e.clientY-r.top)/r.height-.5)*8;if(!raf) raf=requestAnimationFrame(function(){field.style.setProperty('--field-x',tx.toFixed(2)+'px');field.style.setProperty('--field-y',ty.toFixed(2)+'px');raf=0;});},{passive:true});section.addEventListener('pointerleave',function(){field.style.setProperty('--field-x','0px');field.style.setProperty('--field-y','0px');},{passive:true});}
  }
  function setupReveal(){var groups=[{selector:'.reveal',stagger:0},{selector:'.svc',stagger:70},{selector:'.team-mini',stagger:110},{selector:'.profile-card',stagger:100},{selector:'.flow__step',stagger:75},{selector:'.pub',stagger:70}],items=[];groups.forEach(function(g){document.querySelectorAll(g.selector).forEach(function(el,index){if(g.selector!=='.reveal') el.classList.add('motion-item');el.style.transitionDelay=Math.min(index*g.stagger,420)+'ms';items.push(el);});});if(reduce || !('IntersectionObserver' in window)){items.forEach(function(el){el.classList.add('motion-in');});return;}var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('motion-in');io.unobserve(entry.target);}});},{threshold:.06,rootMargin:'0px 0px -7% 0px'});items.forEach(function(el){io.observe(el);});setTimeout(function(){items.forEach(function(el){el.classList.add('motion-in');});},2800);}
  function setupHeader(){var header=document.querySelector('.masthead');if(!header)return;var scheduled=false;function update(){header.classList.toggle('is-scrolled',window.scrollY>18);scheduled=false;}window.addEventListener('scroll',function(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});update();}
  function init(){makeField(document.querySelector('.hero'),3);makeField(document.querySelector('.flow'),2);setupReveal();setupHeader();requestAnimationFrame(function(){requestAnimationFrame(function(){root.classList.add('motion-ready');});});}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
