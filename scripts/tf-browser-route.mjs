// KineNest's third module has its own entry point and isolated saved workspace.
// Explicit URLs keep tests independent of ROS Basics' sidebar and saved page.
export function basicsModuleUrl(value){
 const url=new URL(value);
 if(!url.pathname.endsWith('.html'))url.pathname=url.pathname.replace(/\/$/,'')+'/basics.html';
 url.searchParams.delete('unit');url.searchParams.delete('start');
 return url.href;
}
export function tfModuleUrl(value,{autoStart=false}={}){
 const url=new URL(basicsModuleUrl(value));url.searchParams.set('unit','tf');
 if(autoStart)url.searchParams.set('start','1');
 return url.href;
}
export const moduleHomeUrl=value=>new URL('./',basicsModuleUrl(value)).href;
