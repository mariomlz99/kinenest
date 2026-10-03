import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {LANGUAGES,UI} from '../src/ui/locales.js';
export const required=['Experimental C++ · first run downloads about 60 MB. Cached when available.','Timer fired and code published at least 5 messages','A safe place to learn robotics by making things move.','Why KineNest?','Support KineNest','KineNest is free and open source. Optional contributions help support development and maintenance.','Loading Python runtime…','Loading NumPy…','Loading C++ toolchain…','Compiling C++…','Linking WebAssembly…','Python stopped','C++ stopped','Run Python','Stop Python','Restore starter code','Reset','Check solution','Reveal next hint','Learning terminals','Language','Layout','Light','Dark','Workbench','Stacked','Real environment','Source','Licences','About','Nodes & Topics','Callbacks & LiDAR','Perception & Services','Parameters & Actions','Odometry & Frames','Debugging Challenge','From browser to a real robot','On a real ROS 2 machine','Exercise complete.','Assessment and privacy','Licence and independence','KineNest teaches concepts and workflows used with ROS™ 2.'];
test('seven-language UI has explicit translations or declared English fallbacks',()=>{
 assert.deepEqual(LANGUAGES,['en','nl','fr','es','de','pt','it']);
 for(const [key,row]of Object.entries(UI)){assert.equal(row.length,6,key);for(const value of row)assert.ok(typeof value==='string'&&value.length||value?.fallback==='en',key);}
 for(const key of required){assert.ok(UI[key],key);assert.ok(UI[key].every(value=>typeof value==='string'&&value.length),key);}
});
test('every lesson and catalog has complete seven-language teaching text with shared code',async()=>{
 const dir=new URL('../public/lessons/',import.meta.url);
 for(const name of await readdir(dir)){
  const lesson=JSON.parse(await readFile(new URL(name,dir),'utf8'));
  if(Array.isArray(lesson)){for(const entry of lesson)for(const lang of LANGUAGES.slice(1))assert.ok(entry.translations[lang]?.length,name+' '+lang);continue;}
  for(const lang of LANGUAGES.slice(1)){
   const text=lesson.translations[lang];assert.ok(text,name+' '+lang);
   assert.deepEqual(Object.keys(text).sort(),['description','hints','steps','title']);
   for(const key of ['title','description'])assert.ok(typeof text[key]==='string'&&text[key].length,name+' '+lang+' '+key);
   for(const key of ['steps','hints']){assert.equal(text[key].length,lesson[key].length,name+' '+lang+' '+key);assert.ok(text[key].every(s=>typeof s==='string'&&s.trim()));}
  }
 }
});
