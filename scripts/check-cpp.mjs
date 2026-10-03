import {spawn} from 'node:child_process';
const browser=process.argv[2]??'chrome';
for(const suite of ['cpp-probe','cpp-runtime','cpp-ui']){const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['scripts/check-browser.mjs',browser,'--suite='+suite,...(process.argv.includes('--built')?['--built']:[])],{stdio:'inherit'});child.on('error',reject);child.on('exit',resolve);});if(code!==0){process.exitCode=1;break;}}
