import {spawn} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
const browser = process.argv[2] ?? 'chrome';
if (!['chrome', 'firefox'].includes(browser)) throw new Error('Choose chrome or firefox');
const focus = process.argv.includes('--focus');
const wave = process.argv.find(arg => arg.startsWith('--wave='))?.slice(7) ?? '1';
if (!['1', '2', '3', '4'].includes(wave)) throw new Error('Only --wave=1 through --wave=4 is implemented; full C++ parity is not yet claimed');
const directory = process.argv.find(arg => arg.startsWith('--output='))?.slice(9) ?? path.join(tmpdir(), 'kinenest-cpp-course');
await mkdir(directory, {recursive: true});
let buildInfo = null;
if (process.argv.includes('--built')) {
  const info = JSON.parse(await readFile(new URL('../dist/build-info.json', import.meta.url), 'utf8'));
  if (typeof info.commit !== 'string' || typeof info.assetVersion !== 'string') throw new Error('Built C++ acceptance requires valid dist/build-info.json');
  const {project, commit, builtAt, assetVersion, dirty} = info;
  buildInfo = {project, commit, builtAt, assetVersion, dirty};
}
const report = {browser, wave: Number(wave), focus, startedAt: new Date().toISOString(), buildInfo, cases: [], summary: null};
const child = spawn(process.execPath, ['scripts/check-browser.mjs', browser,
  '--suite=cpp-course', '--query=wave=' + wave + (focus ? '&focus=1' : ''), ...(process.argv.includes('--built') ? ['--built'] : [])],
{stdio: ['ignore', 'pipe', 'inherit']});
let pending = '';
function parse(line) {
  for (const [prefix, assign] of [
    ['CPP_COURSE_CASE ', value => report.cases.push(value)],
    ['CPP_COURSE_SUMMARY ', value => { report.summary = value; }],
  ]) if (line.startsWith(prefix)) {
    try { assign(JSON.parse(line.slice(prefix.length))); }
    catch (error) { report.artifactError = error.message; }
  }
}
child.stdout.on('data', bytes => {
  process.stdout.write(bytes);
  pending += bytes;
  let end;
  while ((end = pending.indexOf('\n')) >= 0) { parse(pending.slice(0, end)); pending = pending.slice(end + 1); }
});
const code = await new Promise(resolve => {
  child.on('error', error => { report.error = error.message; resolve(1); });
  child.on('exit', (exitCode, signal) => { report.signal = signal; resolve(exitCode ?? 1); });
});
if (pending) parse(pending);
report.finishedAt = new Date().toISOString();
report.exitCode = code;
const file = path.join(directory, browser + '-wave-' + wave + (focus ? '-focus' : '') + '.json');
await writeFile(file, JSON.stringify(report, null, 2) + '\n');
console.log('C++ course JSON: ' + file);
process.exitCode = code === 0 && report.summary?.result === 'passed' && !report.artifactError ? 0 : 1;
