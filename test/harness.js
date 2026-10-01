// Shared test helpers: the fake Time Schedule server, and a throwaway headless Chrome driven over the DevTools protocol.
// Needs Google Chrome and Node 20+ run with --experimental-websocket (run.js does that).
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const page = require('./fake-time-schedule.js');

const DIR = __dirname, TMP = path.join(DIR, 'tmp'), PORT = 9557, BASE = `http://127.0.0.1:${PORT}`;
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BOOKMARKLET = fs.readFileSync(path.join(DIR, '..', 'bookmarklet-ftecalc.js'), 'utf8').slice('javascript:'.length);
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* The fake Time Schedule at /students/timeschd/. /__signout toggles a signed-out state, where every page redirects to a
   sign-in page on another origin (as UW's does), so the dashboard's reads fail. /__requests counts page requests. */
function startServer() {
  let signedOut = false, requests = 0;
  const server = http.createServer((req, res) => {
    if (req.url === '/__signout') { signedOut = !signedOut; res.writeHead(200); return res.end(String(signedOut)); }
    if (req.url === '/__requests') { res.writeHead(200); return res.end(String(requests)); }
    if (req.url.startsWith('/cdn/bookmarklet-ftecalc.js')) { res.writeHead(200, { 'content-type': 'application/javascript; charset=utf-8' }); return res.end(fs.readFileSync(path.join(DIR, '..', 'bookmarklet-ftecalc.js'))); }
    if (req.url === '/students/timeschd/') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end('<html><body><h1>Time Schedule</h1><a href="AUT2026/">Autumn 2026</a></body></html>'); }
    if (req.url === '/elsewhere') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end('<html><body><h1>Not the Time Schedule</h1></body></html>'); }
    const m = req.url.match(/^\/students\/timeschd\/([A-Z]{3}\d{4})\/(\w*\.html)?$/);
    if (m && !m[2]) { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(`<html><body><h1>Time Schedule ${m[1]}</h1></body></html>`); }
    if (m) {
      requests++;
      if (signedOut) { res.writeHead(302, { location: `http://localhost:${PORT}/idp/sign-in` }); return res.end(); }
      const html = page(m[1], m[2]);
      if (html) { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(html); }
    }
    res.writeHead(404); res.end('not found');
  });
  return new Promise(r => server.listen(PORT, '127.0.0.1', () => r(server)));
}
const toggleSignedOut = () => fetch(BASE + '/__signout');

async function connect(url, isBrowser) {
  const ws = new WebSocket(url);
  await new Promise(r => (ws.onopen = r));
  let id = 0; const pending = {}, listeners = [];
  ws.onmessage = m => { const d = JSON.parse(m.data); if (pending[d.id]) { pending[d.id](d.result || { error: d.error }); delete pending[d.id]; } else if (d.method) listeners.forEach(f => f(d)); };
  const send = (method, params = {}) => new Promise(r => { pending[++id] = r; ws.send(JSON.stringify({ id, method, params })); });
  const evaluate = async (expr, gesture) => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true, userGesture: !!gesture }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400)); return r.result ? r.result.value : r; };
  const d = { ws, send, evaluate, on: f => listeners.push(f), errors: [] };
  d.on(m => { if (m.method === 'Runtime.exceptionThrown') d.errors.push((m.params.exceptionDetails.exception || {}).description || m.params.exceptionDetails.text); });
  if (isBrowser) return d;
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  d.waitFor = async (expr, tries = 60) => { for (let i = 0; i < tries; i++) { if (await d.evaluate(expr).catch(() => false)) return true; await sleep(200); } return false; };
  /* A real mouse click in the middle of the element. */
  d.click = async sel => {
    const p = await d.evaluate(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; e.scrollIntoView({ block: "center" }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!p) throw new Error('no element ' + sel);
    for (const type of ['mousePressed', 'mouseReleased']) await d.send('Input.dispatchMouseEvent', { type, x: p.x, y: p.y, button: 'left', clickCount: 1 });
    await sleep(200);
  };
  d.type = async (sel, text) => { await d.click(sel); await d.send('Input.insertText', { text }); };
  d.key = async (key, code, keyCode) => { for (const type of ['keyDown', 'keyUp']) await d.send('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: keyCode }); await sleep(150); };
  /* Choose an option in a select, as a person would (the change event bubbles). */
  d.choose = (sel, value) => d.evaluate(`(() => { const s = document.querySelector(${JSON.stringify(sel)}); if (!s) throw new Error("no select ${sel.replace(/"/g, "'")}"); s.value = ${JSON.stringify(value)}; s.dispatchEvent(new Event("change", { bubbles: true })); return s.value; })()`);
  d.shot = async file => { const r = await d.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); fs.writeFileSync(file, Buffer.from(r.data, 'base64')); };
  return d;
}

/* A fresh headless Chrome at 1440×900, with downloads going to tmp/downloads-<name>. Returns the first tab, with openApp() to
   run the bookmarklet the way a person does: on a Time Schedule quarter page, which opens FTECalc in a new tab (returned,
   ready once the prefixes have loaded). */
async function launch(name, port) {
  const profile = path.join(TMP, 'profile-' + name), downloads = path.join(TMP, 'downloads-' + name);
  fs.rmSync(profile, { recursive: true, force: true }); fs.rmSync(downloads, { recursive: true, force: true }); fs.mkdirSync(downloads, { recursive: true });
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--user-data-dir=${profile}`, `--remote-debugging-port=${port}`, '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
  const json = async p => (await fetch(`http://127.0.0.1:${port}${p}`)).json();
  for (let i = 0; i < 60; i++) { try { await json('/json/version'); break; } catch { await sleep(200); } }
  const browser = await connect((await json('/json/version')).webSocketDebuggerUrl, true);
  await browser.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads, eventsEnabled: true });
  const tab = await connect((await json('/json/list')).find(t => t.type === 'page').webSocketDebuggerUrl);
  tab.kill = () => chrome.kill();
  tab.downloads = downloads;
  tab.downloaded = async () => { for (let i = 0; i < 80; i++) { const f = fs.readdirSync(downloads).find(x => x.endsWith('.html')); if (f) return path.join(downloads, f); await sleep(250); } return null; };
  /* Open a saved file in a new tab, as a person would by double-clicking it. */
  tab.openFile = async file => {
    const target = await (await fetch(`http://127.0.0.1:${port}/json/new?` + encodeURI('file://' + file), { method: 'PUT' })).json();
    const d = await connect(target.webSocketDebuggerUrl);
    await d.waitFor('document.readyState === "complete" && !!document.getElementById("summary")');
    await sleep(300);
    return d;
  };
  tab.go = async url => { await tab.send('Page.navigate', { url }); await tab.waitFor(`document.readyState === "complete" && location.href === ${JSON.stringify(url)}`); };
  tab.runBookmarklet = () => tab.evaluate(BOOKMARKLET, true);
  /* The README's loader, with its address pointed at this server (or at jsDelivr itself, given cdn). */
  tab.runLoader = cdn => tab.evaluate(`(function(){ var s = document.createElement('script'); s.src = ${JSON.stringify(cdn || BASE + '/cdn/bookmarklet-ftecalc.js')} + '?t=' + Date.now(); document.body.appendChild(s); })()`, true);
  tab.openApp = async (quarter = 'AUT2026', how) => {
    await tab.go(`${BASE}/students/timeschd/${quarter}/`);
    const before = new Set((await json('/json/list')).map(t => t.id));
    if (how) await how(); else await tab.runBookmarklet();
    let target;
    for (let i = 0; i < 50 && !target; i++) { target = (await json('/json/list')).find(t => t.type === 'page' && !before.has(t.id)); if (!target) await sleep(100); }
    if (!target) throw new Error('FTECalc did not open a tab');
    const app = await connect(target.webSocketDebuggerUrl);
    await app.waitFor('!!document.getElementById("summary")');
    await app.waitFor('!/Loading/.test(document.getElementById("load-status").textContent)');
    await sleep(200);
    app.close = () => fetch(`http://127.0.0.1:${port}/json/close/${target.id}`);
    return app;
  };
  return tab;
}

/* What the dashboard shows, as text: the summary's four sections, and each table's rows as lists of cell texts. */
const READ = `(() => {
  const cells = sel => [...document.querySelectorAll(sel + " tbody tr")].map(tr => [...tr.children].map(td => td.textContent.trim()));
  return {
    summary: [...document.querySelectorAll("#summary section")].map(s => ({ head: s.querySelector("h4").textContent, big: s.querySelector(".big").textContent, parts: s.querySelector(".parts").textContent })),
    programs: cells("#programs"), faculty: cells("#faculty"), tas: cells("#tas"),
    status: document.getElementById("load-status").textContent,
  };
})()`;

module.exports = { DIR, TMP, BASE, sleep, startServer, toggleSignedOut, launch, READ };
