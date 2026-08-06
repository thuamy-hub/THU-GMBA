# -*- coding: utf-8 -*-
"""
掃描「GMBA 年度報告」資料夾，自動產生 admissions.html／admissions-zh.html
的年度報告下載按鈕列表。

用法：
    python3 sync-annual-reports.py            # 乾跑，只列出會改什麼
    python3 sync-annual-reports.py --write    # 真的寫入

原理：
    檔名裡抓「GMBA-民國年」的數字（例如 GMBA-113 → 民國113年 → AY 2024-25）。
    助理只要把新學年度的 PDF 丟進「GMBA 年度報告」資料夾（檔名只要含
    GMBA-數字，不必是特定檔名），存檔、跑這支程式，網頁上的年度報告按鈕
    就會自動更新，不必手動改 HTML。

    抓不到年份數字的檔案，會用檔名當按鈕文字，並且在畫面上提醒你，
    請把檔名改成含「GMBA-113」這種格式，這樣中英文標籤才能自動算對。
"""
import re, os, sys, urllib.parse

FOLDER = 'GMBA 年度報告'
PAIRS = [('admissions.html', 'en'), ('admissions-zh.html', 'zh')]
ANCHOR = 'display:flex;flex-wrap:wrap;gap:.4rem;'
WRITE = '--write' in sys.argv


def scan():
    items = []
    for fn in os.listdir(FOLDER):
        if not fn.lower().endswith('.pdf'):
            continue
        m = re.search(r'GMBA-(\d+)', fn)
        roc = int(m.group(1)) if m else None
        mtime = os.path.getmtime(os.path.join(FOLDER, fn))
        items.append((roc, mtime, fn))
    # 有抓到民國年的，年份新到舊；抓不到的排最後，用檔案時間新到舊
    items.sort(key=lambda t: (t[0] is None, -(t[0] or 0), -t[1]))
    return items


def label(roc, fn, lang):
    if roc is None:
        base = os.path.splitext(fn)[0]
        return f'{base} ↓', True  # True = 需要人工檢查
    start = roc + 1911
    end2 = (start + 1) % 100
    if lang == 'en':
        return f'AY {start}–{end2:02d} ↓', False
    else:
        return f'{start}–{end2:02d} 學年 ↓', False


def build_block(items, lang):
    lines = []
    warn = []
    for roc, mtime, fn in items:
        href = './' + FOLDER + '/' + fn
        href = urllib.parse.quote(href, safe='/()')
        text, needs_check = label(roc, fn, lang)
        if needs_check:
            warn.append(fn)
        lines.append(
            f'      <a href="{href}" class="ar-pill" target="_blank" rel="noopener">{text}</a>'
        )
    return '\n' + '\n'.join(lines) + '\n    ', warn


def apply_to(fn, items, lang):
    src = open(fn, encoding='utf-8').read()
    start = src.find(f'<div style="{ANCHOR}">')
    if start == -1:
        raise SystemExit(f'{fn}: 找不到年度報告區塊，網頁可能被改過版面，請人工檢查')
    inner_start = start + len(f'<div style="{ANCHOR}">')
    end = src.find('</div>', inner_start)
    old_inner = src[inner_start:end]
    new_inner, warn = build_block(items, lang)
    new_src = src[:inner_start] + new_inner + src[end:]
    return src, new_src, old_inner.strip(), new_inner.strip(), warn


def main():
    if not os.path.isdir(FOLDER):
        raise SystemExit(f'找不到資料夾：{FOLDER}')
    items = scan()
    if not items:
        raise SystemExit(f'「{FOLDER}」裡沒有 PDF 檔案')

    print(f'掃描到 {len(items)} 份年度報告 PDF：')
    for roc, mtime, fn in items:
        yr = f'民國{roc}年' if roc else '（檔名沒有年份，將用檔名當標籤）'
        print(f'   {fn}  {yr}')
    print()

    any_change = False
    all_warn = []
    for fn, lang in PAIRS:
        src, new_src, old_inner, new_inner, warn = apply_to(fn, items, lang)
        all_warn += warn
        if old_inner == new_inner:
            print(f'✔ {fn} 內容已經是最新，不需更動。')
            continue
        any_change = True
        print(f'── {fn} 將更新為：')
        for l in new_inner.splitlines():
            print('   ' + l.strip())
        if WRITE:
            open(fn, 'w', encoding='utf-8').write(new_src)
        print()

    if all_warn:
        print('⚠ 以下檔案抓不到年份，用檔名當按鈕文字，建議改檔名成含「GMBA-113」這種格式：')
        for w in set(all_warn):
            print('   ' + w)
        print()

    if not any_change:
        print('兩個網頁都已經是最新狀態，不需要更動。')
    elif WRITE:
        print('✔ 已寫入。下一步：開瀏覽器檢查 → 跑「一鍵推送.bat」。')
    else:
        print('以上為乾跑結果。確認無誤後執行：')
        print('    python3 sync-annual-reports.py --write')


if __name__ == '__main__':
    main()
