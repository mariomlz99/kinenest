import {readFile,writeFile} from 'node:fs/promises';
import {pageShell} from '../src/ui/page-shell.js';
import {brandMark,navigation,pageSession} from '../src/ui/product.js';
for(const page of ['index.html','session-01.html','session-02.html','session-03.html','session-04.html','session-05.html','session-06.html','about.html','licences.html','real-ros.html']){const url=new URL('../'+page,import.meta.url),session=pageSession(page);let html=pageShell(await readFile(url,'utf8'));html=html.replace(/<header>[\s\S]*?<\/header>/,'<header><a class="brand" href="./">'+brandMark()+'</a><span class="course" id="session-tag">'+(session?'SESSION 0'+session:'')+'</span></header>').replace(/<nav class="session-nav"[^>]*>[\s\S]*?<\/nav>/,navigation(session));await writeFile(url,html);}
