import {DraftStore,codeVariants,cppVisible} from '../exercises/programming.js';
export class CodeWorkspace {
 constructor({onRunCpp=()=>{},onChange=()=>{}}={}){
  this.drafts=new DraftStore();this.experimental=new URLSearchParams(location.search).get('experimentalCpp')==='1';this.preferred='python';this.mode='python';this.onChange=onChange;
  try{this.preferred=localStorage.getItem('kinenest-code-language')||'python';}catch{}
  if(!['python','cpp','compare'].includes(this.preferred))this.preferred='python';
  const panel=document.querySelector('.python-panel'),head=panel.querySelector('.panel-head');head.querySelector('h2').textContent='Code';
  this.controls=document.createElement('div');this.controls.className='code-languages';this.controls.setAttribute('role','group');this.controls.setAttribute('aria-label','Code language');this.controls.dataset.i18nLabel='Code language';
  const icon=lang=>new URL('../../public/assets/languages/'+lang+'.svg',import.meta.url).href;
  for(const [mode,label]of [['python','Python'],['cpp','C++'],['compare','Compare']]){const button=document.createElement('button');button.type='button';button.dataset.codeLanguage=mode;button.innerHTML=(mode!=='compare'?'<img alt="" width="24" height="20" src="'+icon(mode)+'">':'')+'<span>'+label+'</span>';button.onclick=()=>this.select(mode);this.controls.append(button);}head.after(this.controls);
  this.python=document.getElementById('python-code');this.cpp=document.createElement('textarea');this.cpp.id='cpp-code';this.cpp.spellcheck=false;this.cpp.wrap='off';this.cpp.setAttribute('aria-label','C++ source code');this.cpp.dataset.i18nLabel='C++ source code';document.getElementById('python-output').dataset.i18nLabel='Code output';document.getElementById('stop-python').textContent='Stop';document.getElementById('editor-help').textContent='Complete the TODOs, then Run. Tab indents; Escape then Tab leaves the editor. Stop terminates execution.';
  this.editors=document.createElement('div');this.editors.className='code-editors';this.python.before(this.editors);
  for(const [lang,editor,label]of [['python',this.python,'Python'],['cpp',this.cpp,'C++']]){const pane=document.createElement('div');pane.className='code-pane';pane.dataset.codePane=lang;const title=document.createElement('label');title.htmlFor=editor.id;title.textContent=label;pane.append(title,editor);this.editors.append(pane);}
  this.runCpp=document.createElement('button');this.runCpp.type='button';this.runCpp.id='run-cpp';this.runCpp.className='primary';this.runCpp.textContent='Run C++';this.runCpp.onclick=onRunCpp;document.querySelector('.python-buttons').append(this.runCpp);
  this.note=document.createElement('p');this.note.className='code-support';this.note.setAttribute('role','status');this.editors.after(this.note);
  for(const [lang,editor]of [['python',this.python],['cpp',this.cpp]])editor.addEventListener('input',()=>{if(this.lesson)this.drafts.set(this.lesson.id,lang,editor.value);});
  let leave=false;this.cpp.addEventListener('keydown',e=>{if(e.key==='Escape'){leave=true;return;}if(e.key==='Tab'&&!e.shiftKey&&!leave){e.preventDefault();this.cpp.setRangeText('    ',this.cpp.selectionStart,this.cpp.selectionEnd,'end');}leave=false;});
 }
 save(){if(this.lesson){this.drafts.set(this.lesson.id,'python',this.python.value);this.drafts.set(this.lesson.id,'cpp',this.cpp.value);}}
 load(lesson){this.save();this.lesson=lesson;this.python.value=this.drafts.get(lesson,'python');this.cpp.value=this.drafts.get(lesson,'cpp');const available=cppVisible(lesson,this.experimental);this.mode=available?this.preferred:'python';this.render();if(!available&&this.preferred!=='python')this.note.textContent='This exercise uses Python. Your C++ draft is preserved.';}
 select(mode){if(!this.lesson||mode!=='python'&&!cppVisible(this.lesson,this.experimental))return;this.save();this.preferred=mode;this.mode=mode;try{localStorage.setItem('kinenest-code-language',mode);}catch{}this.render();this.onChange(mode);}
 render(){const available=cppVisible(this.lesson,this.experimental),cpp=codeVariants(this.lesson).cpp;for(const button of this.controls.children){button.hidden=button.dataset.codeLanguage!=='python'&&!available;button.setAttribute('aria-pressed',String(button.dataset.codeLanguage===this.mode));}
  this.editors.dataset.mode=this.mode;for(const pane of this.editors.children)pane.hidden=this.mode!=='compare'&&pane.dataset.codePane!==this.mode;
  const run=document.getElementById('run-python');run.textContent=this.mode==='cpp'?'Run C++':'Run Python';run.disabled=this.mode==='cpp'&&!cpp?.supported;this.runCpp.hidden=this.mode!=='compare';this.runCpp.disabled=!cpp?.supported;
  this.note.textContent=this.mode==='python'?(this.preferred!=='python'&&!available?'This exercise uses Python. Your C++ draft is preserved.':''):cpp?.supported?'Experimental C++ · browser compilation.':'C++ comparison draft. Execution is not available for this exercise.';
 }
 code(language){this.save();return language==='cpp'?this.cpp.value:this.python.value;}
 restore(){const lang=this.mode==='cpp'?'cpp':'python';const editor=lang==='cpp'?this.cpp:this.python;editor.value=this.drafts.restore(this.lesson,lang);}
}
