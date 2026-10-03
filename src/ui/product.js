// Public identity; repository paths and educational API names are independent.
export const PRODUCT = Object.freeze({
  name: 'KineCourse',
  tagline: 'Interactive robotics learning in your browser.',
  description: 'A free, open-source learning environment for robotics communication, sensors, perception and coordinate frames. Real Python, interactive simulations, no installation.',
  source: 'https://github.com/mariomlz99/ros2learn',
  // Set a relative screenshot path here once a social preview is selected.
  socialImage: null
});
export const SESSIONS = ['Nodes & Topics','Callbacks & LiDAR','Perception & Services','Parameters & Actions','Odometry & Frames','Debugging Challenge'];
export function pageSession(path){return /session-0([2-6])/.exec(path)?.[1]??(path.endsWith('/index.html')||path.endsWith('/')?'1':null);}
export function navigation(session){return '<nav class="session-nav" aria-label="Course sessions">'+SESSIONS.map((title,i)=>'<a href="'+(i?'./session-0'+(i+1)+'.html':'./')+'" aria-label="Session '+(i+1)+'"'+(String(i+1)===String(session)?' aria-current="page"':'')+'>'+(i+1)+'</a>').join('')+'<a href="./real-ros.html">Real environment</a></nav>';}
export function footer(){return '<footer><span>'+PRODUCT.name+' · <span>Open-source browser robotics education</span></span><nav aria-label="Project"><a href="'+PRODUCT.source+'">Source</a> <a href="./licences.html">Licences</a> <a href="./about.html">About</a> <a href="./real-ros.html">Real environment</a></nav></footer>';}
export function brandPage(html,session){
  html=html.replace(/<title>[^<]*<\/title>/,'<title>'+PRODUCT.name+' — '+(session?'Session '+session+' · '+SESSIONS[Number(session)-1]:PRODUCT.tagline)+'</title>');
  html=html.replace(/<meta property="og:[^>]*>/g,'');
  html=html.replace(/<meta name="description"[^>]*>/g,'');
  const meta='<meta name="description" content="'+PRODUCT.description+'"><meta property="og:title" content="'+PRODUCT.name+' — '+PRODUCT.tagline+'"><meta property="og:description" content="'+PRODUCT.description+'"><meta property="og:type" content="website">'+(PRODUCT.socialImage?'<meta property="og:image" content="'+PRODUCT.socialImage+'">':'');
  return html.replace('</head>',meta+'</head>').replace(/<header>[\s\S]*?<\/header>/,'<header><a class="brand" href="./">'+PRODUCT.name+'</a><span class="course" id="session-tag">'+(session?'SESSION 0'+session:'')+'</span></header>').replace(/<nav class="session-nav"[^>]*>[\s\S]*?<\/nav>/,navigation(session)).replace(/<footer>[\s\S]*?<\/footer>/,footer());
}
export function setupBranding(){
  const session=pageSession(location.pathname),header=document.querySelector('header');
  header.querySelector('.brand').textContent=PRODUCT.name;
  let nav=document.querySelector('.session-nav');if(!nav){header.insertAdjacentHTML('afterend',navigation(session));}else nav.outerHTML=navigation(session);
  let end=document.querySelector('footer');if(end)end.outerHTML=footer();else document.querySelector('main').insertAdjacentHTML('beforeend',footer());
  document.title=PRODUCT.name+' — '+(session?'Session '+session+' · '+SESSIONS[Number(session)-1]:PRODUCT.tagline);
}
