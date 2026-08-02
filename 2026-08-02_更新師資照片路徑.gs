/**
 * GMBA 官網資料庫 - 更新「師資名單」的照片網址欄
 * 產生日期：2026-08-02
 *
 * 用法：擴充功能 -> Apps Script -> 貼上這段 -> 存檔 -> 選 updatePhotoPaths -> 執行
 *       第一次執行會跳授權，選 amychen@go.thu.edu.tw 允許即可。
 *
 * 特性：
 *   - 用「姓名（中）」比對，不靠列順序，之後 Sheet 重新排序也不會錯位
 *   - 只改「照片網址」欄，其他欄位一律不動
 *   - 只在值真的不同時才寫入，重複執行不會產生多餘的修訂紀錄
 *   - 「恆 / 恒」等異體字自動正規化
 *   - 對不上的人名會列在報告中，不會靜默略過
 */

// [姓名（中）, 照片路徑]
var PHOTOS = [
  ["陳鶴元", "faculty-photos/01-chen-ho-yuan.jpg"],
  ["金泰星", "faculty-photos/02-kim-brian.jpg"],
  ["黃尹姿", "faculty-photos/03-huang-yin-tzu.jpg"],
  ["黃家俊", "faculty-photos/04-wong-ka-chun.jpg"],
  ["張永和", "faculty-photos/05-chang-yung-ho.jpg"],
  ["郭一棟", "faculty-photos/06-kuo-i-doun.jpg"],
  ["莊凱旭", "faculty-photos/07-chuang-kai-shi.jpg"],
  ["傅郁芬", "faculty-photos/08-fu-yufen.jpg"],
  ["黃琛瑞", "faculty-photos/09-huang-chen-jui.jpg"],
  ["李貴宜", "faculty-photos/10-lee-kuei-i.jpg"],
  ["吳祉芸", "faculty-photos/11-wu-chih-yun.jpg"],
  ["陳靜瑜", "faculty-photos/12-chen-amy.jpg"],
  ["張譽騰", "faculty-photos/13-jang-jacky.jpg"],
  ["陳暐婷", "faculty-photos/14-chen-wei-ting.jpg"],
  ["莊旻潔", "faculty-photos/15-chuang-min-chieh.jpg"],
  ["陳秋政", "faculty-photos/16-chen-jose.jpg"],
  ["林子立", "faculty-photos/17-lin-tzu-li.jpg"],
  ["陳蔚芳", "faculty-photos/18-chen-wei-fang.jpg"],
  ["張凱鑫", "faculty-photos/19-chang-kai-hsin.jpg"],
  ["邱嘉慧", "faculty-photos/20-chiu-chia-hui.jpg"],
  ["白恒旭", "faculty-photos/21-bai-heng-xu.jpg"],
];

function updatePhotoPaths() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1) 找出同時有「姓名（中）」與「照片網址」的工作表（不綁定分頁名稱）
  var sheet = null, hdrRow = -1, colName = -1, colPhoto = -1;
  var sheets = ss.getSheets();
  for (var s = 0; s < sheets.length && !sheet; s++) {
    var data = sheets[s].getDataRange().getValues();
    for (var r = 0; r < Math.min(data.length, 10); r++) {
      var row = data[r].map(function (c) { return String(c).replace(/\s/g, ''); });
      var iN = row.indexOf('姓名（中）');
      var iP = row.indexOf('照片網址');
      if (iN > -1 && iP > -1) {
        sheet = sheets[s]; hdrRow = r; colName = iN; colPhoto = iP; break;
      }
    }
  }
  if (!sheet) {
    SpreadsheetApp.getUi().alert('找不到同時有「姓名（中）」和「照片網址」欄的工作表。沒有做任何更動。');
    return;
  }

  // 2) 建立 姓名 -> 路徑 對照表
  function norm(x) { return String(x).replace(/\s/g, '').replace(/恆/g, '恒'); }
  var map = {};
  for (var i = 0; i < PHOTOS.length; i++) map[norm(PHOTOS[i][0])] = PHOTOS[i][1];

  // 3) 逐列比對寫入
  var values = sheet.getDataRange().getValues();
  var updated = 0, unchanged = 0, notFound = [];
  for (var r = hdrRow + 1; r < values.length; r++) {
    var name = norm(values[r][colName]);
    if (!name) continue;
    if (map.hasOwnProperty(name)) {
      var oldV = String(values[r][colPhoto] || '');
      var newV = map[name];
      if (oldV === newV) { unchanged++; }
      else { sheet.getRange(r + 1, colPhoto + 1).setValue(newV); updated++; }
      delete map[name];
    } else {
      notFound.push(String(values[r][colName]));
    }
  }

  // 4) 報告
  var leftover = Object.keys(map);
  var msg = '工作表：' + sheet.getName() + '\n'
          + '照片網址欄：第 ' + (colPhoto + 1) + ' 欄\n\n'
          + '已更新：' + updated + ' 列\n'
          + '原本就正確：' + unchanged + ' 列\n'
          + (notFound.length ? '\n[注意] Sheet 有、清單沒有：' + notFound.join('、') : '')
          + (leftover.length ? '\n[注意] 清單有、Sheet 找不到：' + leftover.join('、') : '');
  Logger.log(msg);
  SpreadsheetApp.getUi().alert(msg);
}
