import {rm,mkdir,cp} from 'node:fs/promises';
const root=new URL('../',import.meta.url), dest=new URL('dist/',root);
await rm(dest,{recursive:true,force:true}); await mkdir(dest,{recursive:true});
for(const name of ['index.html','src','public']) await cp(new URL(name,root),new URL(name,dest),{recursive:true});
console.log('Static site ready in dist/');
