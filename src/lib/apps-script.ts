export const APPS_SCRIPT_SOURCE = `const HEADERS = ['Id','Name','Link','Category','Price','Target','Currency','Colors','Brand','Website','Status','Notes','Image','Added'];

function ensureHeaders(sheet) {
  const range = sheet.getRange(1, 1, 1, HEADERS.length);
  const current = range.getValues()[0];
  const empty = current.every(function (c) { return c === ''; });
  if (empty || String(current[0]) !== 'Id') {
    range.setValues([HEADERS]);
    range.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function rowToItem(row) {
  return {
    id: String(row[0] || ''),
    name: String(row[1] || ''),
    url: String(row[2] || ''),
    category: String(row[3] || ''),
    price: row[4] === '' ? null : Number(row[4]),
    targetPrice: row[5] === '' ? null : Number(row[5]),
    currency: String(row[6] || 'INR'),
    colors: String(row[7] || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean),
    brand: String(row[8] || ''),
    website: String(row[9] || ''),
    status: String(row[10] || 'watching'),
    notes: String(row[11] || ''),
    imageUrl: String(row[12] || ''),
    createdAt: String(row[13] || new Date().toISOString()),
  };
}

function itemToRow(item) {
  return [
    item.id, item.name, item.url, item.category,
    item.price == null ? '' : item.price,
    item.targetPrice == null ? '' : item.targetPrice,
    item.currency || 'INR',
    (item.colors || []).join(', '),
    item.brand, item.website, item.status, item.notes,
    item.imageUrl, item.createdAt
  ];
}

function findRowById(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return -1;
  const ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function handle(body) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  ensureHeaders(sheet);
  const action = body.action;
  if (action === 'ping') return { ok: true, title: SpreadsheetApp.getActiveSpreadsheet().getName() };
  if (action === 'list' || action === 'pull') {
    const last = sheet.getLastRow();
    if (last < 2) return { ok: true, items: [] };
    const values = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();
    return { ok: true, items: values.filter(function (r) { return r[0]; }).map(rowToItem) };
  }
  if (action === 'upsert') {
    const row = itemToRow(body.item);
    const existing = findRowById(sheet, body.item.id);
    if (existing > 0) sheet.getRange(existing, 1, 1, HEADERS.length).setValues([row]);
    else sheet.appendRow(row);
    return { ok: true };
  }
  if (action === 'delete') {
    const existing = findRowById(sheet, body.id);
    if (existing > 0) sheet.deleteRow(existing);
    return { ok: true };
  }
  if (action === 'replaceAll') {
    const last = sheet.getLastRow();
    if (last > 1) sheet.deleteRows(2, last - 1);
    const items = body.items || [];
    if (items.length) {
      const rows = items.map(itemToRow);
      sheet.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
    }
    return { ok: true, count: items.length };
  }
  return { ok: false, error: 'unknown action' };
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    return json(handle(JSON.parse(e.postData.contents)));
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    if (e.parameter && e.parameter.payload) {
      return json(handle(JSON.parse(e.parameter.payload)));
    }
    return json(handle({ action: 'list' }));
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}
`;
