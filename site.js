(()=>{
const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const themeBtn=document.getElementById('theme');
if(themeBtn)themeBtn.onclick=()=>{const d=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=d;try{localStorage.setItem('eawo-theme',d)}catch(e){}};
const header=document.getElementById('header'),menu=document.getElementById('menu');

// scroll progress bar + header shrink + hero parallax
const bar=document.createElement('div');bar.className='progress';header.appendChild(bar);
const heroArt=document.querySelector('.hero-art');let ticking=false;
function onScroll(){const y=scrollY,h=root.scrollHeight-innerHeight;
  header.classList.toggle('scrolled',y>30);
  bar.style.transform='scaleX('+(h>0?Math.min(y/h,1):0)+')';
  if(heroArt&&!reduce&&y<1400)heroArt.style.setProperty('--py',(y*0.1)+'px');
  ticking=false}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

// mobile menu
menu.onclick=()=>{const o=header.classList.toggle('open');menu.setAttribute('aria-expanded',o)};
document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>{header.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

// photo slots (add #slots to the address to see which file goes where)
document.querySelectorAll('.ph img').forEach(i=>{const ok=()=>i.closest('.ph').classList.add('has');i.complete&&i.naturalWidth?ok():i.addEventListener('load',ok)});
if(location.hash==='#slots')document.body.classList.add('show-slots');

// hero photo: hold its entrance until the image has arrived (or 1.6s, whichever is first)
const art=document.querySelector('.hero-art');
if(art){const im=art.querySelector('img');const go=()=>art.classList.add('ready');
  if(!im||(im.complete&&im.naturalWidth))go();
  else{im.addEventListener('load',()=>{(im.decode?im.decode():Promise.resolve()).then(go,go)});im.addEventListener('error',go);setTimeout(go,1600)}}

// hero headline: words rise in one by one
document.querySelectorAll('.hero h1').forEach(h=>{const txt=h.textContent.trim();h.setAttribute('aria-label',txt);
  h.innerHTML=txt.split(/\s+/).map((w,i)=>'<span class="w" aria-hidden="true"><span style="--i:'+i+'">'+w+'</span></span>').join(' ')});

// reveal-on-scroll
const singles='main section:not(.hero) .wrap > h2, main section:not(.hero) .head > div, .split > div, .prog > div, .info, form, .identity > div, .two > div, .band .wrap > *, .dark .wrap > p, .contact h1, .contact .lede, .map-card';
const groups='.tile, .rows > div, .cols > div, .journey article, .targets > div, .gov > div, .mark-notes > div';
const photos='.split .ph, .prog .ph, .contact .ph, .identity .logo-panel';
const els=new Set();
document.querySelectorAll(singles).forEach(e=>els.add(e));
document.querySelectorAll(groups).forEach(e=>els.add(e));
document.querySelectorAll(photos).forEach(e=>els.add(e));
const idx=new Map();
document.querySelectorAll(groups).forEach(e=>{const p=e.parentElement;const n=idx.get(p)||0;idx.set(p,n+1);e.style.setProperty('--d',Math.min(n,7)*90+'ms')});
document.querySelectorAll('.route li').forEach((li,i)=>li.style.setProperty('--d',(300+i*190)+'ms'));
els.forEach(e=>e.classList.add('reveal'));

function countUp(el){const to=+el.dataset.count,pre=el.dataset.prefix||'',suf=el.dataset.suffix||'';
  if(reduce){el.textContent=pre+to+suf;return}
  const t0=performance.now(),D=1800;
  (function step(t){const p=Math.min((t-t0)/D,1),e=1-Math.pow(1-p,4);el.textContent=pre+Math.round(to*e)+suf;if(p<1)requestAnimationFrame(step)})(t0);}
document.querySelectorAll('[data-count]').forEach(el=>{el.textContent=(el.dataset.prefix||'')+'0'+(el.dataset.suffix||'')});

const targets=[...els,...document.querySelectorAll('.route,[data-count]')];
if(reduce||!('IntersectionObserver' in window)){targets.forEach(e=>{e.classList.add('in');if(e.dataset&&e.dataset.count)countUp(e)})}
else{
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const e=en.target;e.classList.add('in');if(e.dataset.count)countUp(e);io.unobserve(e)}),{threshold:.14,rootMargin:'0px 0px -8% 0px'});
  targets.forEach(e=>io.observe(e));
}

// contact form: opens the visitor's email app with the message filled in
const f=document.getElementById('contactForm');
if(f)f.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(f);
 const body='Name: '+d.get('name')+'\nOrganisation: '+d.get('org')+'\nInterest: '+d.get('topic')+'\n\n'+d.get('msg');
 location.href='mailto:kundusam32@gmail.com?subject='+encodeURIComponent('EAWO enquiry: '+d.get('topic'))+'&body='+encodeURIComponent(body);
 const n=document.getElementById('formNotice');n.classList.add('show');n.textContent='Your email app should open with the message ready to send. If it does not, write to kundusam32@gmail.com.'});
})();
