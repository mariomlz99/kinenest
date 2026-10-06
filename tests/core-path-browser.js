const frame=document.querySelector('iframe'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn,label){for(let i=0;i<200;i++){if(fn())return;await sleep(50);}throw Error(label);}
async function open(url){frame.src=url;await new Promise(r=>frame.onload=r);await until(()=>frame.contentDocument.documentElement.dataset.kinenestReady==='true','ready');}
const assert=(condition,message)=>{if(!condition)throw Error(message);};
try{
 await open('../session-03.html');let d=frame.contentDocument;
 assert(d.body.dataset.lessonId==='session-03-01-camera-subscriber','default Core lesson');
 const groups=[...d.querySelectorAll('#lesson-select optgroup')];
 assert(groups.length===2&&groups[0].children.length===2&&groups[1].children.length===4,'Core/Further grouping');
 assert(groups[0].children[1].value==='session-03-05-services','services independent of perception');
 for(const lang of ['nl','fr','es','de','pt','it','en']){
  d.getElementById('language').value=lang;d.getElementById('language').dispatchEvent(new Event('change'));await sleep(50);
  assert(d.getElementById('lesson-select').value==='session-03-01-camera-subscriber','language preserved selection');
  assert(lang==='en'||d.querySelector('#lesson-select optgroup').label!=='Core exercises','translated group');
 }
 const next=d.querySelector('#lesson-path a').href;await open(next);d=frame.contentDocument;
 assert(d.body.dataset.lessonId==='session-03-05-services','Core next skips perception');
 assert(d.querySelector('#lesson-path a').href.includes('session-04.html?lesson=session-04-01-configure'),'next session Core route');
 await open('../session-03.html?lesson=session-03-04-object-position');d=frame.contentDocument;
 assert(d.getElementById('lesson-select').value==='session-03-04-object-position','optional deep link selected');
 assert(d.getElementById('lesson-path').textContent.includes('optional'),'optional notice');
 assert(d.querySelector('#lesson-path a').href.includes('session-03-03-color-detection'),'optional preparation link');
 const editor=d.getElementById('python-code');editor.value+='\n# preserved learner work';editor.dispatchEvent(new Event('input',{bubbles:true}));
 d.getElementById('lesson-select').value='session-03-05-services';d.getElementById('lesson-select').dispatchEvent(new Event('change'));
 await until(()=>d.body.dataset.lessonId==='session-03-05-services','switch to Core');
 d.getElementById('lesson-select').value='session-03-04-object-position';d.getElementById('lesson-select').dispatchEvent(new Event('change'));
 await until(()=>d.body.dataset.lessonId==='session-03-04-object-position','return to optional');
 assert(editor.value.includes('preserved learner work'),'saved code preserved');
 await open('../session-06.html?lesson=session-06-02-frame-debug');d=frame.contentDocument;
 assert(d.querySelector('#lesson-path a').href.endsWith('/bridge.html'),'Core ends at bridge, skips beacon');
 await open('../index.html');d=frame.contentDocument;
 assert(d.querySelectorAll('.further-exercises a').length===10,'optional labs available on homepage');
 await fetch('/done',{method:'POST',body:'PASS Core route: groups, deep links, translations, saved code, services independent, bridge progression'});
}catch(e){await fetch('/done',{method:'POST',body:'FAIL Core route: '+e.stack});}
