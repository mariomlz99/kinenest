import http from 'node:http';import path from 'node:path';import {readFile} from 'node:fs/promises';
export async function serveDirectory(directory,{prefix='/ros2learn/'}={}){
 const root=path.resolve(directory),server=http.createServer(async(req,res)=>{try{
  const pathname=new URL(req.url,'http://localhost').pathname;if(!pathname.startsWith(prefix))throw Error('Outside prefix');let relative=decodeURIComponent(pathname.slice(prefix.length));if(!relative||relative.endsWith('/'))relative+='index.html';const file=path.resolve(root,relative);if(!file.startsWith(root+path.sep)||relative.split('/').some(p=>p.startsWith('.')))throw Error('Outside public root');
  const bytes=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.wasm':'application/wasm','.py':'text/plain','.hpp':'text/plain'})[path.extname(file)]??'application/octet-stream');res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found');}});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));return {url:'http://127.0.0.1:'+server.address().port+prefix,close:()=>server.close()};
}
