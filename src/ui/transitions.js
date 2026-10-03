import {brandAsset} from './product.js';
export const VARIANTS=['lidar-sweep','tf-rotate','robot-yaw','orbit-ring','sensor-pulse'];
export function chooseTransitionVariant(previous,random=Math.random){const choices=VARIANTS.filter(v=>v!==previous);return choices[Math.floor(random()*choices.length)%choices.length];}
export function createTransition({variant='sensor-pulse',loading=false,reducedMotion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches}={}){
 const el=document.createElement('div');el.className='brand-motion '+(loading?'runtime-loading':'page-transition');if(reducedMotion)el.classList.add('no-motion');el.dataset.variant=VARIANTS.includes(variant)?variant:'sensor-pulse';el.setAttribute('aria-hidden','true');
 el.innerHTML='<div class="motion-art"><img alt="" src="'+brandAsset('kinenest-icon.png')+'"><svg viewBox="0 0 100 100"><g class="motion-lidar" fill="none" stroke="currentColor"><path d="M50 52 14 20M50 52 32 8M50 52 50 5M50 52 68 8M50 52 86 20"/></g><g class="motion-tf"><path d="M50 50h35m-5-4 5 4-5 4" stroke="#db4c50"/><path d="M50 50V15m-4 5 4-5 4 5" stroke="#2ca773"/></g><circle class="motion-ring" cx="50" cy="50" r="43" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></div>';
 return el;
}
export function setupTransitions(){
 if(document.querySelector('link[data-transitions]'))return;
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('./transitions.css',import.meta.url).href;css.dataset.transitions='';document.head.append(css);
 let overlay;const clear=()=>{overlay?.remove();overlay=null;};
 // Destination readiness ends the transition; navigation is never delayed.
 try{const pending=JSON.parse(sessionStorage.getItem('kinenest-navigation')||'null');sessionStorage.removeItem('kinenest-navigation');if(pending&&Date.now()-pending.time<5000&&!matchMedia('(prefers-reduced-motion: reduce)').matches){overlay=createTransition({variant:pending.variant});document.body.append(overlay);requestAnimationFrame(()=>requestAnimationFrame(()=>{overlay?.classList.add('finished');setTimeout(clear,180);}));}}catch{}
 window.addEventListener('pageshow',clear);window.addEventListener('pagehide',clear);
 document.addEventListener('click',event=>{const link=event.target.closest('a[href]');if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.target||link.hasAttribute('download'))return;const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.hash||url.pathname===location.pathname||!(/\.html$/.test(url.pathname)||url.pathname.endsWith('/')))return;
  let previous;try{previous=sessionStorage.getItem('kinenest-transition');}catch{}const variant=chooseTransitionVariant(previous);try{sessionStorage.setItem('kinenest-transition',variant);sessionStorage.setItem('kinenest-navigation',JSON.stringify({variant,time:Date.now()}));}catch{}
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){clear();overlay=createTransition({variant});document.body.append(overlay);setTimeout(clear,900);}
 });
 const state=document.getElementById('python-state');if(state){const loader=createTransition({loading:true});loader.hidden=true;state.before(loader);const update=()=>{loader.hidden=state.dataset.loading!=='true';};new MutationObserver(update).observe(state,{attributes:true,attributeFilter:['data-loading']});update();}
}
