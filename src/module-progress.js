const key=module=>'kinenest.progress.'+module;
export function saveModuleProgress(module,progress){const units=[...new Set(progress)].filter(i=>Number.isInteger(i)&&i>=0&&i<7);try{localStorage.setItem(key(module),JSON.stringify({version:1,units,updatedAt:Date.now()}));}catch{}return units;}
export function readModuleProgress(module){try{const data=JSON.parse(localStorage.getItem(key(module))||'null');if(data?.version===1&&Array.isArray(data.units))return [...new Set(data.units)].filter(i=>Number.isInteger(i)&&i>=0&&i<7);}catch{}return [];}

// The playground has separate work; it must not replace course completion.
export function sessionProgress(record){return (record?.ui?.unitIndex===7?record.other:record)?.ui?.progress??[];}
export async function syncSavedModuleProgress(){
 for(const [module,name] of [['linux','kinenest-linux-session'],['ros','kinenest-basics-session']]){
  try{const record=await new Promise((resolve,reject)=>{
   const request=indexedDB.open(name,1);let absent=false;
   request.onupgradeneeded=()=>{absent=true;request.transaction.abort();};
   request.onerror=()=>absent?resolve(null):reject(request.error);
   request.onsuccess=()=>{const db=request.result;if(!db.objectStoreNames.contains('sessions')){db.close();resolve(null);return;}const read=db.transaction('sessions').objectStore('sessions').get('current');read.onsuccess=()=>{db.close();resolve(read.result);};read.onerror=()=>{db.close();reject(read.error);};};
  });if(record)saveModuleProgress(module,sessionProgress(record));}catch{}
 }
}
