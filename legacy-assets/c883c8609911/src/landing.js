import {initPreferences} from './i18n.js';
import {readModuleProgress} from './module-progress.js';
function renderProgress(){for(const badge of document.querySelectorAll('[data-module-progress]')){const count=readModuleProgress(badge.dataset.moduleProgress).length;badge.textContent=count===7?'✓ Completed':`${count} / 7 completed`;badge.classList.toggle('completed',count===7);}}
renderProgress();initPreferences();window.addEventListener('storage',renderProgress);window.addEventListener('pageshow',renderProgress);
