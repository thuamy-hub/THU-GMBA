# -*- coding: utf-8 -*-
"""
把 site-data.json 的內容套用到六個 HTML 檔案。

用法：
    python3 apply-site-data.py            # 乾跑，只列出會改什麼，不動檔案
    python3 apply-site-data.py --write    # 真的寫入

原理：
    HTML 裡的欄位都帶有 data-k="欄位名稱" 標記，本程式依標記精準替換內容，
    不會誤傷其他文字。中英文各自對應 en / zh 的值。
    替換後的 HTML 仍是靜態原始碼，AI 爬蟲與搜尋引擎讀得到。
"""
import re, json, sys, collections

PAIRS = [('index.html', 'index-zh.html'),
         ('academics.html', 'academics-zh.html'),
         ('admissions.html', 'admissions-zh.html')]

WRITE = '--write' in sys.argv


def flatten(node, prefix=''):
    flat = {}
    for k, v in node.items():
        if k.startswith('_'):
            continue
        key = f'{prefix}.{k}' if prefix else k
        if isinstance(v, dict) and not set(v) <= {'en', 'zh'}:
            flat.update(flatten(v, key))
        else:
            flat[key] = v
    return flat


def value_for(v, lang):
    if isinstance(v, dict):
        return v.get(lang, '')
    return v


def apply_to(fn, flat, lang):
    src = open(fn, encoding='utf-8').read()
    s = src
    changes = []
    found = set()
    for key, raw in flat.items():
        new = value_for(raw, lang)
        pat = re.compile(r'(<(\w+)[^>]*?data-k="%s"[^>]*?>)' % re.escape(key))
        m = pat.search(s)
        if not m:
            continue          # 這個欄位不屬於這個檔案，正常
        found.add(key)
        tag = m.group(2)
        if tag == 'a':                                   # 連結：換 href
            open_tag = m.group(1)
            old = re.search(r'href="([^"]*)"', open_tag).group(1)
            if old != new:
                s = s.replace(open_tag,
                              re.sub(r'href="[^"]*"', 'href="%s"' % new, open_tag, count=1), 1)
                changes.append((key, old, new))
        else:                                            # 一般元素：換內文
            start = m.end()
            end = s.find('</%s>' % tag, start)
            old = s[start:end]
            if old != new:
                s = s[:start] + new + s[end:]
                changes.append((key, old, new))
    return src, s, changes, found


def main():
    data = json.load(open('site-data.json', encoding='utf-8'),
                     object_pairs_hook=collections.OrderedDict)
    flat = flatten(data)
    print('site-data.json 共 %d 個欄位\n' % len(flat))

    total = 0
    seen = set()
    for en_f, zh_f in PAIRS:
        for fn, lang in ((en_f, 'en'), (zh_f, 'zh')):
            src, new, changes, found = apply_to(fn, flat, lang)
            seen.update(found)
            if changes:
                print('── %s' % fn)
            for k, old, val in changes:
                print('   %-26s %s  →  %s' % (k, old[:34], val[:34]))
                total += 1
            if WRITE and src != new:
                open(fn, 'w', encoding='utf-8').write(new)

    orphan = sorted(set(flat) - seen)
    if orphan:
        print('\n⚠ 以下欄位在網頁中找不到對應標記，可能 HTML 被改動過：')
        for k in orphan:
            print('   ' + k)

    print()
    if total == 0:
        print('✔ 網頁內容與 site-data.json 一致，不需要更動。')
    elif WRITE:
        print('✔ 已更新 %d 處。舊版本已存在 git 裡，需要還原時可用 git 復原。' % total)
        print('  下一步：開瀏覽器檢查 → 跑「一鍵推送.bat」。')
    else:
        print('以上為乾跑結果，共 %d 處待更新。確認無誤後執行：' % total)
        print('    python3 apply-site-data.py --write')


if __name__ == '__main__':
    main()
