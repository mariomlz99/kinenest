// Public identity; repository paths and educational API names are independent.
export const PRODUCT = Object.freeze({
  name: 'KineNest',
  tagline: 'A safe place to learn robotics by making things move.',
  description: 'A free, open-source environment for learning robotics communication, sensors, perception and coordinate frames through interactive browser experiments.',
  source: 'https://github.com/mariomlz99/ros2learn',
  support: 'https://buymeacoffee.com/mariomlz99',
  site: 'https://mariomlz99.github.io/ros2learn/',
  socialImage: 'public/assets/brand/social-preview.png',
  institutionalBranding: Object.freeze({enabled:false,logos:[]})
});
export const SESSIONS = ['Nodes & Topics','Callbacks & LiDAR','Perception & Services','Parameters & Actions','Odometry & Frames','Debugging Challenge'];
export function pageSession(path){return /session-0([2-6])/.exec(path)?.[1]??(path.endsWith('/index.html')||path.endsWith('/')?'1':null);}
export function navigation(session){return '<nav class="session-nav" aria-label="Course sessions">'+SESSIONS.map((title,i)=>'<a href="'+(i?'./session-0'+(i+1)+'.html':'./')+'" aria-label="Session '+(i+1)+'"'+(String(i+1)===String(session)?' aria-current="page"':'')+'>'+(i+1)+'</a>').join('')+'<a href="./real-ros.html">Real environment</a></nav>';}
export const brandAsset=name=>new URL('../../public/assets/brand/'+name,import.meta.url).href;
export function brandMark(icon='./public/assets/brand/kinenest-icon.png'){return '<img src="'+icon+'" alt="" width="38" height="38"><span>'+PRODUCT.name+'</span>';}
export function supportLink(){return '<a class="support-link" href="'+PRODUCT.support+'" target="_blank" rel="noopener noreferrer"><svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h12v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Zm12 1h2a3 3 0 0 1 0 6h-2M2 22h18M7 2v2m6-2v2"/></svg><span>Support KineNest</span></a>';}
export function footer(){return '<footer><span>'+PRODUCT.name+' · <span>Open-source browser robotics education</span></span><nav aria-label="Project"><a href="'+PRODUCT.source+'">Source</a> <a href="./licences.html">Licences</a> <a href="./about.html">About</a> <a href="./real-ros.html">Real environment</a> '+supportLink()+'</nav><p class="attribution" lang="en" translate="no"><svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14"><path d="M12 20 3 11C-2 4 8 0 12 6c4-6 14-2 9 5Z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg> <span>Made with love in Belgium 🇧🇪 by</span> <a href="https://www.linkedin.com/in/mario-malizia/">Mario Malizia</a>, an Italian soul, <span>with development assistance from</span> <a href="https://chatgpt.com/">ChatGPT</a> <span>by</span> <a href="https://openai.com/">OpenAI</a>.</p></footer>';}
export function brandPage(html,session,{assetPath='',page='index.html'}={}){
  html=html.replace(/<title>[^<]*<\/title>/,'<title>'+PRODUCT.name+' — '+(session?'Session '+session+' · '+SESSIONS[Number(session)-1]:PRODUCT.tagline)+'</title>');
  html=html.replace(/(<[^>]+data-product-tagline[^>]*>)[^<]*(<\/[^>]+>)/g,'$1'+PRODUCT.tagline+'$2');
  html=html.replace(/<span data-support-link><\/span>/g,supportLink());
  html=html.replace(/<meta property="og:[^>]*>/g,'');
  html=html.replace(/<meta name="description"[^>]*>/g,'');
  const meta='<link rel="canonical" href="'+new URL(page==='index.html'?'':page,PRODUCT.site).href+'"><meta name="description" content="'+PRODUCT.description+'"><meta property="og:title" content="'+PRODUCT.name+' — Interactive robotics learning in your browser"><meta property="og:description" content="'+PRODUCT.description+'"><meta property="og:type" content="website">'+(PRODUCT.socialImage?'<meta property="og:image" content="'+new URL(assetPath+PRODUCT.socialImage,PRODUCT.site).href+'">':'');
  return html.replace('</head>',meta+'<link rel="icon" href="./public/assets/brand/favicon-32.png"><link rel="apple-touch-icon" href="./public/assets/brand/apple-touch-icon.png"></head>').replace(/<header>[\s\S]*?<\/header>/,'<header><a class="brand" href="./">'+brandMark()+'</a><span class="course" id="session-tag">'+(session?'SESSION 0'+session:'')+'</span></header>').replace(/<nav class="session-nav"[^>]*>[\s\S]*?<\/nav>/,navigation(session)).replace(/<footer>[\s\S]*?<\/footer>/,footer());
}
export function setupBranding(){
  const session=pageSession(location.pathname),header=document.querySelector('header');
  for(const el of document.querySelectorAll('[data-product-tagline]'))el.textContent=PRODUCT.tagline;
  for(const el of document.querySelectorAll('[data-support-link]'))el.outerHTML=supportLink();
  header.querySelector('.brand').innerHTML=brandMark(brandAsset('kinenest-icon.png'));
  let nav=document.querySelector('.session-nav');if(!nav){header.insertAdjacentHTML('afterend',navigation(session));}else nav.outerHTML=navigation(session);
  let end=document.querySelector('footer');if(end)end.outerHTML=footer();else document.querySelector('main').insertAdjacentHTML('beforeend',footer());
  if(new URLSearchParams(location.search).get('experimentalCpp')==='1')for(const a of document.querySelectorAll('.session-nav a')){const url=new URL(a.href);url.searchParams.set('experimentalCpp','1');a.href=url.href;}
  document.title=PRODUCT.name+' — '+(session?'Session '+session+' · '+SESSIONS[Number(session)-1]:PRODUCT.tagline);
}
