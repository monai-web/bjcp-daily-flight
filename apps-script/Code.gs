/**
 * BJCP Daily Flight — progress sync backend (Google Apps Script Web App)
 * Deploy: Deploy > New deployment > Web app
 *   Execute as: Me   |   Who has access: Anyone
 * Fill in SHEET_ID / SECRET / FOLDER_ID in your own copy (never commit real values).
 */
const SHEET_ID = 'YOUR_SHEET_ID';
const SECRET = 'CHANGE_ME';   // the game sends this key; change it here + in the game link if it leaks
const FOLDER_ID = 'YOUR_FOLDER_ID'; // folder for game file backup
const CHUNK = 40000;                          // stay well under the per-cell character limit

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function sheet_(name) { return SpreadsheetApp.openById(SHEET_ID).getSheetByName(name); }

function readProgress_() {
  const sh = sheet_('progress');
  if (sh.getLastRow() < 2) return null;
  const n = Number(sh.getRange(2, 3).getValue()) || 0;
  if (!n) return null;
  const parts = sh.getRange(2, 4, 1, n).getValues()[0];
  try { return JSON.parse(parts.join('')); } catch (e) { return null; }
}

function writeProgress_(data) {
  const sh = sheet_('progress');
  const s = JSON.stringify(data);
  const parts = [];
  for (let i = 0; i < s.length; i += CHUNK) parts.push(s.slice(i, i + CHUNK));
  const lastCol = Math.max(sh.getLastColumn(), 4);
  sh.getRange(2, 1, 1, lastCol).clearContent();
  sh.getRange(2, 1, 1, 3).setValues([[new Date(), data.xp || 0, parts.length]]);
  sh.getRange(2, 4, 1, parts.length).setValues([parts]);
  writeLog_(data);
}

function writeLog_(data) {
  const sh = sheet_('daily_log');
  const days = data.days || {};
  const rows = Object.keys(days).sort().map(function (d) {
    const r = days[d] || {};
    const q = r.q || 0, c = r.c || 0;
    return [d, q, c, q ? Math.round(c / q * 100) : 0, Math.round((r.sec || 0) / 60), r.done ? 'yes' : '', r.sotd || ''];
  });
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 7).clearContent();
  if (rows.length) sh.getRange(2, 1, rows.length, 7).setValues(rows);
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.key !== SECRET) return out_({ ok: false, error: 'bad_key' });
  if (p.action === 'ping') return out_({ ok: true, pong: true });
  if (p.action === 'file') {
    const it = DriveApp.getFolderById(FOLDER_ID).getFilesByName(p.name || 'index.html');
    if (!it.hasNext()) return out_({ ok: false, error: 'no_file' });
    return ContentService.createTextOutput(it.next().getBlob().getDataAsString('UTF-8')).setMimeType(ContentService.MimeType.TEXT);
  }
  return out_({ ok: true, data: readProgress_() });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'bad_json' }); }
  if (body.key !== SECRET) return out_({ ok: false, error: 'bad_key' });
  if (body.action === 'putFile') {          // store a copy of the game file in the folder
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const old = folder.getFilesByName(body.name);
    while (old.hasNext()) old.next().setTrashed(true);
    const f = folder.createFile(body.name, body.content, 'text/html');
    return out_({ ok: true, id: f.getId(), size: f.getSize() });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    writeProgress_(body.data || {});
    return out_({ ok: true, savedAt: new Date().toISOString() });
  } finally { lock.releaseLock(); }
}

/** Run once from the editor to grant permissions and check the sheet is reachable. */
function setupTest() {
  Logger.log(sheet_('progress').getName() + ' / ' + sheet_('daily_log').getName() + ' / ' + DriveApp.getFolderById(FOLDER_ID).getName() + ' OK');
}
