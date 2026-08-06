/**
 * Cloudflare Pages Function — YAHO 新聞代理
 * 路徑：/api/yaho-news
 *
 * 為什麼需要這個檔案：
 *   YAHO 的 API 沒有回傳 CORS 標頭，瀏覽器不准網頁直接讀取。
 *   這支程式在 Cloudflare 伺服器端去抓（伺服器端沒有 CORS 限制），
 *   再補上標頭轉交給網頁。等同於以前 netlify.toml 做的事。
 *
 * 不需要安裝任何東西。Cloudflare Pages 會自動偵測 functions/ 資料夾，
 * git 推送後就生效。
 */

const UPSTREAM = 'https://yaho-sooty.vercel.app/api/home';
const CACHE_SECONDS = 1800; // 30 分鐘，避免每次瀏覽都打對方 API

export async function onRequest() {
  try {
    const res = await fetch(UPSTREAM, {
      headers: { accept: 'application/json' },
      cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true },
    });

    if (!res.ok) {
      return reply({ announcements: [], error: 'upstream ' + res.status }, 502);
    }

    const data = await res.json();
    const items = (data.announcements || []).slice(0, 12).map((a) => ({
      category: a.category || '',
      created_at: a.created_at || '',
      title: a.title || '',
      title_en: a.title_en || '',
      content: a.content || '',
      content_en: a.content_en || '',
      application_link: a.application_link || '',
    }));

    return reply({ announcements: items });
  } catch (err) {
    return reply({ announcements: [], error: String(err) }, 502);
  }
}

function reply(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=' + CACHE_SECONDS,
    },
  });
}
