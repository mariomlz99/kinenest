const key=module=>'kinenest.progress.'+module;
export function saveModuleProgress(module,progress){const units=[...new Set(progress)].filter(i=>Number.isInteger(i)&&i>=0&&i<7);try{localStorage.setItem(key(module),JSON.stringify({version:1,units,updatedAt:Date.now()}));}catch{}return units;}
export function readModuleProgress(module){try{const data=JSON.parse(localStorage.getItem(key(module))||'null');if(data?.version===1&&Array.isArray(data.units))return [...new Set(data.units)].filter(i=>Number.isInteger(i)&&i>=0&&i<7);}catch{}return [];}
