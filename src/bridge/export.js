// Stored ZIP entries keep exports dependency-free and readable by native unzip.
import {ROOT} from './workspace.js';
const encoder=new TextEncoder();
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^(crc&1?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
function header(size){return new DataView(new ArrayBuffer(size));}
function bytes(view){return new Uint8Array(view.buffer);}
function concat(chunks){const length=chunks.reduce((n,x)=>n+x.length,0),out=new Uint8Array(length);let at=0;for(const chunk of chunks){out.set(chunk,at);at+=chunk.length;}return out;}
export function exportPackageZip(workspace,name){
  const files=workspace.filesUnder(ROOT+'/src/'+name);
  if(!Object.keys(files).length)throw Error('Package has no files to export.');
  const locals=[],central=[];let offset=0;
  for(const [relative,content] of Object.entries(files).sort(([a],[b])=>a.localeCompare(b))){
    const filename=encoder.encode(name+'/'+relative),data=encoder.encode(content),crc=crc32(data);
    const local=header(30);local.setUint32(0,0x04034b50,true);local.setUint16(4,20,true);local.setUint32(14,crc,true);local.setUint32(18,data.length,true);local.setUint32(22,data.length,true);local.setUint16(26,filename.length,true);
    locals.push(bytes(local),filename,data);
    const entry=header(46);entry.setUint32(0,0x02014b50,true);entry.setUint16(4,20,true);entry.setUint16(6,20,true);entry.setUint32(16,crc,true);entry.setUint32(20,data.length,true);entry.setUint32(24,data.length,true);entry.setUint16(28,filename.length,true);entry.setUint32(42,offset,true);
    central.push(bytes(entry),filename);offset+=30+filename.length+data.length;
  }
  const centralBytes=concat(central),end=header(22);end.setUint32(0,0x06054b50,true);end.setUint16(8,Object.keys(files).length,true);end.setUint16(10,Object.keys(files).length,true);end.setUint32(12,centralBytes.length,true);end.setUint32(16,offset,true);
  return new Blob([concat(locals),centralBytes,bytes(end)],{type:'application/zip'});
}
