// Classic loader reports module/network failures through the first-paint cover.
(async()=>{try{await import('./app.js');}catch(error){console.error(error);globalThis.KineNestBoot?.fail(error.message);}})();
