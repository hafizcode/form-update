function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Request body is missing.');
    }

    var data = JSON.parse(e.postData.contents);
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Request body must be a JSON object.');
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('No active spreadsheet is available.');
    }

    var sheet = spreadsheet.getSheetByName('Sheet1');
    if (!sheet) {
      throw new Error('Sheet1 was not found.');
    }

    var companyDetails = data.companyDetails && typeof data.companyDetails === 'object'
      ? data.companyDetails
      : {};
    var categories = toTextArray(companyDetails.categories);
    var roles = toTextArray(companyDetails.roles, formatRole);

    sheet.appendRow([
      new Date(),
      safeCellText(data.name),
      safeCellText(data.phone),
      safeCellText(data.email),
      safeCellText(data.age),
      safeCellText(data.inquiry),
      categories.map(safeCellText).join(', '),
      roles.map(safeCellText).join(', '),
      safeCellText(data.message),
      safeCellText(data.jobInternType),
      safeCellText(data.yearsExperience),
      safeCellText(data.role),
      safeCellText(data.location),
      safeCellText(data.expectedCtc),
      safeCellText(data.noticePeriod)
    ]);

    return jsonResponse({ result: 'success' });
  } catch (error) {
    return jsonResponse({ result: 'error', error: String(error) });
  }
}

function toTextArray(value, formatter) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(formatter || safeCellText)
    .filter(function (item) {
      return item !== '';
    });
}

function formatRole(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return safeCellText(value);
  }

  if (!value || typeof value !== 'object') {
    return '';
  }

  var industry = safeCellText(value.industry);
  var role = safeCellText(value.role);
  if (industry && role) {
    return industry + ': ' + role;
  }
  return role || industry;
}

function safeCellText(value) {
  if (value === null || value === undefined) {
    return '';
  }

  var text = String(value).trim();
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
