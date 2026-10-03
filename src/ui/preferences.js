import {setupTransitions} from './transitions.js';
import { setupBranding } from './product.js';
import {UI as strings, LANGUAGES} from './locales.js';
const sourceNodes=new WeakMap();
const originals=new Map();for(const [key,values]of Object.entries(strings)){originals.set(key,key);for(const value of values)if(typeof value==='string')originals.set(value,key);}
let lang='en';try{lang=localStorage.getItem('ros2learn-language')||'en';}catch{}if(!LANGUAGES.includes(lang))lang='en';
export const language=()=>lang;
export function translate(text){
  const prefix=text.match(/^[✓○] /)?.[0]??'';
  if(prefix)return prefix+translate(text.slice(prefix.length));
  const key=originals.get(text);
  if(key){const value=strings[key][LANGUAGES.indexOf(lang)-1];return lang==='en'||typeof value!=='string'?key:value;}
  for(const key of ['RGB channel means:','Session','Exercise','Distance travelled:','Reveal next hint']){
    if(text.startsWith(key+' '))return translate(key)+text.slice(key.length);
    if(lang!=='en'&&text.startsWith(key.toUpperCase()+' '))return translate(key)+text.slice(key.length);
  }
  return text;
}
export function setupPreferences(){
  if(document.getElementById('preferences'))return;
  setupBranding();setupTransitions();
  const flags={en:'🇬🇧',nl:'🇳🇱',fr:'🇫🇷',es:'🇪🇸',de:'🇩🇪',pt:'🇵🇹',it:'🇮🇹'};
  const controls=document.createElement('div');controls.id='preferences';
  controls.innerHTML='<label class="language-control"><span class="sr-only">Language</span><span id="language-current" aria-hidden="true"></span><select id="language" aria-label="Language"><option value="en">🇬🇧 EN · English</option><option value="nl">🇳🇱 NL · Nederlands</option><option value="fr">🇫🇷 FR · Français</option><option value="es">🇪🇸 ES · Español</option><option value="de">🇩🇪 DE · Deutsch</option><option value="pt">🇵🇹 PT · Português</option><option value="it">🇮🇹 IT · Italiano</option></select></label><button id="theme" type="button">Light</button><label><span class="sr-only">Layout</span><select id="layout" aria-label="Layout"><option value="split">Workbench</option><option value="stack">Stacked</option></select></label>';
  document.querySelector('header').append(controls);
  let theme='dark',layout='split';try{theme=localStorage.getItem('ros2learn-theme')||theme;layout=localStorage.getItem('ros2learn-layout')||layout;}catch{}
  const save=(key,value)=>{try{localStorage.setItem('ros2learn-'+key,value);}catch{}};
  const applyTheme=()=>{const previous=document.documentElement.dataset.theme;document.documentElement.dataset.theme=theme;document.getElementById('theme').textContent=theme==='dark'?translate('Light'):translate('Dark');if(previous!==theme)window.dispatchEvent(new Event('themechange'));};applyTheme();
  document.getElementById('theme').onclick=()=>{theme=theme==='dark'?'light':'dark';save('theme',theme);applyTheme();};
  const applyLayout=()=>{document.body.dataset.layout=layout;};applyLayout();document.getElementById('layout').value=layout;
  document.getElementById('layout').onchange=e=>{layout=e.target.value;save('layout',layout);applyLayout();};
  // One shared workbench: mission/code beside sensor feedback. Reading order stays meaningful.
  const mission=document.querySelector('.mission'),code=document.querySelector('.python-panel'),camera=document.querySelector('.camera-panel'),world=document.querySelector('.world-panel'),graph=document.querySelector('.graph-panel');
  if(code){code.insertBefore(code.querySelector('.python-buttons'),code.querySelector('textarea'));const box=document.createElement('div');box.className='workbench';const left=document.createElement('div'),right=document.createElement('div');left.className='workbench-code';right.className='workbench-sensors';document.querySelector('.vision-grid').before(box);box.append(left,right);left.append(mission,code);right.append(camera,world,graph);document.querySelectorAll('.vision-grid').forEach(el=>{if(!el.children.length)el.remove();});}
  const applyLanguage=()=>{document.documentElement.lang=lang;const label=flags[lang]+' '+lang.toUpperCase()+' ▾',current=document.getElementById('language-current');if(current.textContent!==label)current.textContent=label;for(const el of document.querySelectorAll('[data-i18n-label]'))el.setAttribute('aria-label',translate(el.dataset.i18nLabel));document.querySelector('#language').setAttribute('aria-label',translate('Language'));document.querySelector('#layout').setAttribute('aria-label',translate('Layout'));const labels=[translate('Workbench'),translate('Stacked')];[...document.getElementById('layout').options].forEach((o,i)=>{if(o.textContent!==labels[i])o.textContent=labels[i];});const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode;if(n.parentElement.closest('pre,code,textarea,script,style,#preferences,[translate="no"]'))continue;const cached=sourceNodes.get(n),raw=cached&&n.textContent===cached.translated?cached.source:n.textContent,value=raw.trim(),translated=raw.replace(value,translate(value));sourceNodes.set(n,{source:raw,translated});if(n.textContent!==translated)n.textContent=translated;}};
  for(const el of document.querySelectorAll('[aria-label]'))el.dataset.i18nLabel=el.getAttribute('aria-label');
  document.getElementById('language').value=lang;document.getElementById('language').onchange=e=>{lang=e.target.value;save('language',lang);applyLanguage();applyTheme();window.dispatchEvent(new Event('languagechange'));};
  let queued=false;new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(()=>{queued=false;applyLanguage();});}}).observe(document.body,{childList:true,subtree:true,characterData:true});applyLanguage();
}
