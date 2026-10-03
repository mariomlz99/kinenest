import {spawn} from 'node:child_process';
const browser=process.argv[2]??'chrome',built=process.argv.includes('--built');
for(const suite of ['transitions','compare','tf-browser','localization','lesson-loading','browser','session2','session3','session4','session5','session6','string-type']){
  console.log('\nCourse acceptance: '+browser+' / '+suite);
  const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['scripts/check-browser.mjs',browser,'--suite='+suite,...(built?['--built']:[])],{stdio:'inherit'});child.on('error',reject);child.on('exit',resolve);});
  if(code!==0){process.exitCode=1;break;}
}
