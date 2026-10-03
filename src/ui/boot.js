// A classic script can report module-download and module-evaluation failures.
(async()=>{
  const fail=message=>{const title=document.getElementById('mission-title'),status=document.getElementById('status');if(title)title.textContent='Lab could not start';if(status)status.textContent=message+' Try Ctrl+Shift+R. If this persists, check the browser Console.';};
  const timer=setTimeout(()=>fail('Loading is taking longer than expected.'),15000);
  try{await import('./app.js');}catch(error){console.error(error);fail(error.message);}finally{clearTimeout(timer);}
})();
