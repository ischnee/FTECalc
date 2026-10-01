// TA names never reach the page or the browser's storage; only what FTECalc needs is kept.
const { launch } = require('./harness.js');
const TAS = ['Assistant', 'Aster', 'Birch', 'Cedar', 'Dahlia', 'Elm', 'Fern', 'Ginkgo', 'Hazel', 'Iris', 'Juniper'];
module.exports = async (check, port) => {
  const tab = await launch('privacy', port);
  try {
    const app = await tab.openApp('WIN2026');
    await app.type('#prefix-input', 'PHIL');
    await app.key('Enter', 'Enter', 13);
    await app.waitFor('document.querySelectorAll("#tas tbody tr").length === 5');
    await app.choose('select.cat[data-person="Prof, Alpha"]', 'tt');
    const html = await app.evaluate('document.documentElement.outerHTML');
    const found = TAS.filter(n => html.includes(n));
    check('no TA name anywhere on the page', found.length === 0, found);
    const stored = await app.evaluate('JSON.stringify(Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)])))');
    check('no TA name in the browser’s storage', TAS.every(n => !stored.includes(n)), stored);
    check('storage holds only prefixes and the categories set', stored === JSON.stringify({ 'ftecalc-prefixes': '["PHIL"]', 'ftecalc-people': '{"Prof, Alpha":{"cat":"tt"}}' }) || stored === JSON.stringify({ 'ftecalc-people': '{"Prof, Alpha":{"cat":"tt"}}', 'ftecalc-prefixes': '["PHIL"]' }), stored);
    check('no script errors', app.errors.length === 0, app.errors);
  } finally { tab.kill(); }
};
