import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {PRODUCT,brandPage,navigation} from '../src/ui/product.js';
async function files(dir){const out=[];for(const entry of await readdir(dir,{withFileTypes:true})){const url=new URL(entry.name+(entry.isDirectory()?'/':''),dir);out.push(...(entry.isDirectory()?await files(url):[url]));}return out;}
test('public source and generated branding preserve independent identity',async()=>{
 const root=new URL('../',import.meta.url);
 const paths=[...(await files(new URL('src/',root))),...(await files(new URL('public/',root))),...(await readdir(root)).filter(x=>x.endsWith('.html')).map(x=>new URL(x,root))];
 for(const path of paths.filter(path=>/\.(html|js|json|css|py)$/.test(path.pathname))){const text=await readFile(path,'utf8');assert.doesNotMatch(text,/ROS2Learn|ROS2<span>Learn|Lab 01|LAB 01|KineCourse|KineNest preliminary/,path.pathname);assert.doesNotMatch(text.replace(/[™©®]/g,''),/\p{Extended_Pictographic}/u,path.pathname);}
 const html=brandPage('<html><head><title>old</title></head><body><header></header><nav class="session-nav"></nav><footer></footer></body></html>',5);
 assert.equal(PRODUCT.contact,'hello@kinenest.com');
 assert.ok(html.includes('<span>Questions?</span>'));
 assert.ok(html.includes('an <span role="img" aria-label="Italian">🇮🇹</span> soul'));
 assert.doesNotMatch(html,/an Italian soul/);
 assert.ok(html.includes('href="mailto:hello@kinenest.com" translate="no"'));
 assert.ok(html.includes(PRODUCT.name));assert.ok(html.includes('og:title'));assert.ok(html.includes('aria-current="page"'));assert.ok(navigation(5).includes('Real environment'));assert.ok(navigation(5).includes('class="nav-home" href="./"'));assert.ok(navigation(null,'index.html').includes('class="nav-home" href="./" aria-label="Home" aria-current="page"'));assert.ok(!navigation(null,'about.html').includes('aria-current="page"'));
 const about=await readFile(new URL('about.html',root),'utf8');assert.ok(about.includes('ROS™ 2'));assert.ok(about.includes('not affiliated with or endorsed by Open Robotics'));
});
