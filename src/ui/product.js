import {pageShell} from './page-shell.js';
import {ATTRIBUTION} from './locales.js';
// Public identity; repository paths and educational API names are independent.
export const PRODUCT = Object.freeze({
  name: 'KineNest',
  tagline: 'A safe place to learn robotics by making things move.',
  description: 'Free, open-source browser robotics exercises with real Python and browser-compiled C++, shared sensors, simulation and behavioral checks.',
  source: 'https://github.com/mariomlz99/kinenest',
  support: 'https://buymeacoffee.com/mariomlz99',
  contact: 'hello@kinenest.com',
  site: 'https://kinenest.com/',
  socialImage: 'public/assets/brand/social-preview.png',
  institutionalBranding: Object.freeze({enabled:false,logos:[]})
});
export const SESSIONS = ['Nodes & Topics','Callbacks & LiDAR','Perception & Services','Parameters & Actions','Odometry & Frames','Debugging Challenge'];
export function pageSession(path){return /session-0([1-6])\.html$/.exec(path)?.[1]??null;}
export function pageTitle(session,page='index.html'){return PRODUCT.name+' — '+(session?'Session '+session+' · '+SESSIONS[Number(session)-1]:({'about.html':'About','licences.html':'Licences','real-ros.html':'From browser to real robot'}[page]??PRODUCT.tagline));}
export function navigation(session,page=session?'session-0'+session+'.html':'index.html'){return '<nav class="session-nav" aria-label="Course sessions"><a class="nav-home" href="./" aria-label="Home"'+(page==='index.html'?' aria-current="page"':'')+'>Home</a>'+SESSIONS.map((title,i)=>'<a href="'+('./session-0'+(i+1)+'.html')+'" aria-label="Session '+(i+1)+'"'+(String(i+1)===String(session)?' aria-current="page"':'')+'>'+(i+1)+'</a>').join('')+'<a href="./real-ros.html">Real environment</a></nav>';}
export const brandAsset=name=>new URL('../../public/assets/brand/'+name,import.meta.url).href;
export function brandMark(icon='./public/assets/brand/kinenest-icon.png'){return '<img class="brand-icon" src="'+icon+'" alt="" width="38" height="38"><span class="brand-copy"><span class="brand-name" translate="no">'+PRODUCT.name+'</span><span class="brand-tagline" data-product-tagline>'+PRODUCT.tagline+'</span></span>';}
export function supportLink(){return '<a class="support-link" href="'+PRODUCT.support+'" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h12v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Zm12 1h2a3 3 0 0 1 0 6h-2M2 22h18M7 2v2m6-2v2"/></svg><span>Support KineNest</span></a>';}
export function footerAttribution(language='en'){
  const code=ATTRIBUTION[language]?language:'en';
  const [intro,soul,assist,flagLabel]=ATTRIBUTION[code];
  const flag='<span role="img" aria-label="'+flagLabel+'">🇮🇹</span>';
  return '<p class="attribution" lang="'+code+'" translate="no"><svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14"><path d="M12 20 3 11C-2 4 8 0 12 6c4-6 14-2 9 5Z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg> '+intro+'<a href="https://www.linkedin.com/in/mario-malizia/">Mario Malizia</a>'+soul.replace('{flag}',flag)+'<a href="https://chatgpt.com/">ChatGPT</a>'+assist+'<a href="https://openai.com/">OpenAI</a>.</p>';
}
export function footer(){return '<footer><span>'+PRODUCT.name+' · <span>Open-source browser robotics education</span></span><nav aria-label="Project"><a href="'+PRODUCT.source+'">Source</a> <a href="./licences.html">Licences</a> <a href="./about.html">About</a> <a href="./real-ros.html">Real environment</a> '+supportLink()+'</nav>'+footerAttribution()+'<p class="footer-contact"><span>Questions?</span> <a href="mailto:'+PRODUCT.contact+'" translate="no">'+PRODUCT.contact+'</a></p></footer>';}

export function brandPage(html,session,{assetPath='',page='index.html'}={}){
  html=pageShell(html);
  html=html.replace(/<title>[^<]*<\/title>/,'<title>'+pageTitle(session,page)+'</title>');
  html=html.replace(/(<[^>]+data-product-tagline[^>]*>)[^<]*(<\/[^>]+>)/g,'$1'+PRODUCT.tagline+'$2');
  html=html.replace(/<span data-support-link><\/span>/g,supportLink());
  html=html.replace(/<meta property="og:[^>]*>/g,'');
  html=html.replace(/<meta name="description"[^>]*>/g,'');
  const meta='<link rel="canonical" href="'+new URL(page==='index.html'?'':page,PRODUCT.site).href+'"><meta name="description" content="'+PRODUCT.description+'"><meta property="og:title" content="'+PRODUCT.name+' — Interactive robotics learning in your browser"><meta property="og:description" content="'+PRODUCT.description+'"><meta property="og:type" content="website">'+(PRODUCT.socialImage?'<meta property="og:image" content="'+new URL(assetPath+PRODUCT.socialImage,PRODUCT.site).href+'">':'');
  return html.replace('</head>',meta+'<link rel="icon" href="./public/assets/brand/favicon-32.png"><link rel="apple-touch-icon" href="./public/assets/brand/apple-touch-icon.png"></head>').replace(/<header>[\s\S]*?<\/header>/,'<header><a class="brand" href="./">'+brandMark()+'</a><span class="course" id="session-tag">'+(session?'SESSION 0'+session:'')+'</span></header>').replace(/<nav class="session-nav"[^>]*>[\s\S]*?<\/nav>/,navigation(session,page)).replace(/<footer>[\s\S]*?<\/footer>/,footer());
}
export function setupBranding(){
  const page=location.pathname.split('/').pop()||'index.html',session=pageSession(location.pathname),header=document.querySelector('header');
  for(const el of document.querySelectorAll('[data-product-tagline]'))el.textContent=PRODUCT.tagline;
  for(const el of document.querySelectorAll('[data-support-link]'))el.outerHTML=supportLink();
  header.querySelector('.brand').innerHTML=brandMark(brandAsset('kinenest-icon.png'));
  let nav=document.querySelector('.session-nav');if(!nav){header.insertAdjacentHTML('afterend',navigation(session,page));}else nav.outerHTML=navigation(session,page);
  let end=document.querySelector('footer');if(end)end.outerHTML=footer();else document.querySelector('main').insertAdjacentHTML('beforeend',footer());
  if(new URLSearchParams(location.search).get('experimentalCpp')==='1')for(const a of document.querySelectorAll('.session-nav a')){const url=new URL(a.href);url.searchParams.set('experimentalCpp','1');a.href=url.href;}
  document.title=pageTitle(session,page);
}
