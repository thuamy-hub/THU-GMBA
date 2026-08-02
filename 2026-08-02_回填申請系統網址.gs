/**
 * GMBA 官網資料庫 - 回填「招生日程」的申請系統網址
 * 產生日期：2026-08-02
 * 網址來源：現用版本/admissions.html 與 admissions-zh.html 實際的 Apply 連結
 *
 * 用法：擴充功能 -> Apps Script -> 貼上 -> 存檔 -> 選 updateApplyUrls -> 執行
 *
 * 特性：
 *   - 用「身份類別 + 目標學期」兩欄組合比對，不靠列順序
 *   - 中英文欄位填相同網址（東海報名系統只有一套，沒有分語言版本）
 *   - 僑生春季無此管道，該列網址會清空
 *   - 只在值真的不同時才寫入
 *   - 對不上的列會列在報告中
 */

// [身份類別, 目標學期, 網址]   網址為空字串 = 清空該格
var URLS = [
  ["International",       "Spring", "https://exam2.thu.edu.tw/EXAM/index.jsp?DOC=26"],
  ["International",       "Fall",   "https://exam2.thu.edu.tw/EXAM/index.jsp?DOC=25"],
  ["In Taiwan (ARC)",     "Spring", "https://exam2.thu.edu.tw/EXAM/081.jsp?DOC=21&page=%27si%27"],
  ["In Taiwan (ARC)",     "Fall",   "https://exam2.thu.edu.tw/EXAM/081.jsp?DOC=22&page=%27si%27"],
  ["Overseas Compatriot", "Spring", ""],
  ["Overseas Compatriot", "Fall",   "https://exam2.thu.edu.tw/EXAM/index.jsp?DOC=54"]
];

function updateApplyUrls() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1) 找出含「身份類別」「目標學期」「申請系統網址（英）」的工作表
  var sheet = null, hdrRow = -1, cCat = -1, cSem = -1, cEn = -1, cZh = -1;
  var sheets = ss.getSheets();
  for (var s = 0; s < sheets.length && !sheet; s++) {
    var data = sheets[s].getDataRange().getValues();
    for (var r = 0; r < Math.min(data.length, 10); r++) {
      var row = data[r].map(function (c) { return String(c).replace(/\s/g, ''); });
      var a = row.indexOf('身份類別');
      var b = row.indexOf('目標學期');
      var e = row.indexOf('申請系統網址（英）');
      var z = row.indexOf('申請系統網址（中）');
      if (a > -1 && b > -1 && e > -1) {
        sheet = sheets[s]; hdrRow = r; cCat = a; cSem = b; cEn = e; cZh = z; break;
      }
    }
  }
  if (!sheet) {
    SpreadsheetApp.getUi().alert('找不到含「身份類別」「目標學期」「申請系統網址（英）」的工作表。沒有做任何更動。');
    return;
  }

  // 2) 建立 對照表。身份類別只比對關鍵字，避免「Overseas Compatriot 僑生」這種尾綴差異
  function key(cat, sem) {
    var c = String(cat).replace(/\s/g, '').toLowerCase();
    if (c.indexOf('international') > -1)      c = 'international';
    else if (c.indexOf('intaiwan') > -1)      c = 'intaiwan';
    else if (c.indexOf('compatriot') > -1 || c.indexOf('僑生') > -1) c = 'compatriot';
    var m = String(sem).replace(/\s/g, '').toLowerCase();
    m = (m.indexOf('spring') > -1 || m.indexOf('春') > -1) ? 'spring'
      : (m.indexOf('fall')   > -1 || m.indexOf('秋') > -1) ? 'fall' : m;
    return c + '|' + m;
  }
  var map = {};
  for (var i = 0; i < URLS.length; i++) map[key(URLS[i][0], URLS[i][1])] = URLS[i][2];

  // 3) 逐列寫入（英、中兩欄填相同網址）
  var values = sheet.getDataRange().getValues();
  var updated = 0, unchanged = 0, cleared = 0, notFound = [];
  for (var r = hdrRow + 1; r < values.length; r++) {
    if (!String(values[r][cCat]).trim()) continue;
    var k = key(values[r][cCat], values[r][cSem]);
    if (!map.hasOwnProperty(k)) {
      notFound.push(values[r][cCat] + ' / ' + values[r][cSem]);
      continue;
    }
    var url = map[k];
    var cols = (cZh > -1) ? [cEn, cZh] : [cEn];
    var touched = false;
    for (var t = 0; t < cols.length; t++) {
      if (String(values[r][cols[t]] || '') !== url) {
        sheet.getRange(r + 1, cols[t] + 1).setValue(url);
        touched = true;
      }
    }
    if (!touched) unchanged++;
    else if (url === '') cleared++;
    else updated++;
    delete map[k];
  }

  // 4) 報告
  var leftover = Object.keys(map);
  var msg = '工作表：' + sheet.getName() + '\n'
          + '網址欄：第 ' + (cEn + 1) + ' 欄（英）'
          + (cZh > -1 ? ' / 第 ' + (cZh + 1) + ' 欄（中）' : '（找不到中文欄，只寫了英文欄）') + '\n\n'
          + '已填入網址：' + updated + ' 列\n'
          + '已清空（無此管道）：' + cleared + ' 列\n'
          + '原本就正確：' + unchanged + ' 列'
          + (notFound.length ? '\n\n[注意] Sheet 有、清單沒有：' + notFound.join('、') : '')
          + (leftover.length ? '\n[注意] 清單有、Sheet 找不到：' + leftover.join('、') : '');
  Logger.log(msg);
  SpreadsheetApp.getUi().alert(msg);
}
