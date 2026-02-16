// ============================================================
// GymLog Google Apps Script — Deploy as Web App
// ============================================================
// The @OnlyCurrentDoc annotation restricts the OAuth scope so
// Google only grants access to this sheet, not your entire Drive.
// The script uses getActiveSpreadsheet() which only returns the
// sheet this script is attached to — no other sheets are accessible.
// ============================================================

/**
 * @OnlyCurrentDoc
 */

const SECRET_TOKEN = 'CHANGE_ME_TO_A_RANDOM_STRING';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const token = e.parameter.token;
    if (token !== SECRET_TOKEN) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const action = e.parameter.action;

    switch (action) {
      case 'getAll':
        return jsonResponse(getAll());
      case 'pushHistory':
        return jsonResponse(pushHistory(JSON.parse(e.postData.contents)));
      case 'deleteHistory':
        return jsonResponse(deleteHistory(JSON.parse(e.postData.contents)));
      case 'pushExercises':
        return jsonResponse(pushExercises(JSON.parse(e.postData.contents)));
      case 'setMeta':
        return jsonResponse(setMeta(JSON.parse(e.postData.contents)));
      default:
        return jsonResponse({ error: 'Unknown action: ' + action });
    }
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function jsonResponse(data, code) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---- getAll ----
function getAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const history = sheetToObjects(ss.getSheetByName('History'));
  const exercises = sheetToObjects(ss.getSheetByName('Exercises'));
  const metaRows = sheetToObjects(ss.getSheetByName('Meta'));

  const meta = {};
  metaRows.forEach(r => { meta[r.key] = r.value; });

  return { history, exercises, meta };
}

// ---- pushHistory ----
// Upsert sets — idempotent, skips rows with existing IDs
function pushHistory(body) {
  const sets = body.sets || [];
  if (sets.length === 0) return { ok: true, added: 0 };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('History');
  const existing = getColumnValues(sheet, 1); // column A = id

  let added = 0;
  sets.forEach(s => {
    if (existing.indexOf(s.id) === -1) {
      sheet.appendRow([
        s.id, s.exerciseId, s.weight, s.reps,
        s.date, s.time, s.timestamp, s.deleted || ''
      ]);
      added++;
    }
  });

  return { ok: true, added };
}

// ---- deleteHistory ----
// Soft-delete: set deleted=true for the given ID
function deleteHistory(body) {
  const id = body.id;
  if (!id) return { ok: false, error: 'Missing id' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('History');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.getRange(i + 1, 8).setValue('true'); // column H = deleted
      return { ok: true, deleted: id };
    }
  }

  return { ok: true, notFound: true };
}

// ---- pushExercises ----
// Full replace of exercises list
function pushExercises(body) {
  const exercises = body.exercises || [];

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Exercises');

  // Clear all data rows (keep header)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }

  // Write new data
  exercises.forEach(ex => {
    sheet.appendRow([
      ex.id, ex.name, ex.muscle, ex.videoUrl || '',
      ex.defaultWeight || 0, ex.defaultReps || 0,
      ex.instructions || '', ex.deleted || '', ex.updatedAt || ''
    ]);
  });

  return { ok: true, count: exercises.length };
}

// ---- setMeta ----
function setMeta(body) {
  const key = body.key;
  const value = body.value;
  if (!key) return { ok: false, error: 'Missing key' };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Meta');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return { ok: true, updated: key };
    }
  }

  sheet.appendRow([key, value]);
  return { ok: true, created: key };
}

// ---- Helpers ----
function sheetToObjects(sheet) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  const headers = data[0];
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const obj = {};
    let hasData = false;
    headers.forEach((h, j) => {
      const val = data[i][j];
      if (val !== '' && val !== null && val !== undefined) hasData = true;
      obj[h] = val;
    });
    if (hasData) rows.push(obj);
  }
  return rows;
}

function getColumnValues(sheet, col) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, col, lastRow - 1, 1).getValues().map(r => r[0]);
}
