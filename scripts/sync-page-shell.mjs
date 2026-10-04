import {readFile,writeFile} from 'node:fs/promises';
import {pageShell} from '../src/ui/page-shell.js';
for(const page of ['index.html','session-02.html','session-03.html','session-04.html','session-05.html','session-06.html','about.html','licences.html','real-ros.html']){const url=new URL('../'+page,import.meta.url);await writeFile(url,pageShell(await readFile(url,'utf8')));}
