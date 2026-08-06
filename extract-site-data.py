# -*- coding: utf-8 -*-
"""從 HTML 讀出目前所有 data-k 欄位的值，產生／更新 site-data.json"""
import re, json, collections

PAIRS = [('index.html','index-zh.html'),
         ('academics.html','academics-zh.html'),
         ('admissions.html','admissions-zh.html')]

def read(fn):
    s = open(fn, encoding='utf-8').read()
    out = {}
    for m in re.finditer(r'<(\w+)([^>]*?)data-k="([^"]+)"([^>]*)>', s):
        tag, key = m.group(1), m.group(3)
        if tag == 'a':                      # 連結取 href
            href = re.search(r'href="([^"]*)"', m.group(2) + m.group(4))
            out[key] = href.group(1) if href else ''
        else:                               # 其他取內文
            end = s.find('</%s>' % tag, m.end())
            out[key] = s[m.end():end]
    return out

data = collections.OrderedDict()
for en_f, zh_f in PAIRS:
    en, zh = read(en_f), read(zh_f)
    for k in en:
        data[k] = en[k] if en[k] == zh.get(k) else {'en': en[k], 'zh': zh.get(k, '')}

def nest(flat):
    root = collections.OrderedDict()
    for k, v in flat.items():
        parts = k.split('.'); cur = root
        for p in parts[:-1]:
            cur = cur.setdefault(p, collections.OrderedDict())
        cur[parts[-1]] = v
    return root

print(json.dumps(nest(data), ensure_ascii=False, indent=2))
