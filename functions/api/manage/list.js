export async function onRequest(context) {
    // Contents of context object
    const {
      request, // same as existing Worker API
      env, // same as existing Worker API
      params, // if filename includes [id] or [[path]]
      waitUntil, // same as ctx.waitUntil in existing Worker API
      next, // used for middleware or to fetch assets
      data, // arbitrary space for passing data between middlewares
    } = context;
    // 看缓存中是否有记录，有则直接返回
    const cache = caches.default;
    const cacheRes = await cache.match(request.url);
    if (cacheRes) {
        return cacheRes;
    }

    // 缓存未命中
    let allRecords = [];
    let cursor = null;

    do {
      const records = await env.img_url.list({
        limit: 1000,
        cursor,
      });
      // 除去records中key以manage@开头的记录
      records.keys = records.keys.filter(item => !item.name.startsWith("manage@"));
      allRecords.push(...records.keys);
      cursor = records.cursor;
    } while (cursor);

    const info = JSON.stringify(allRecords);
    let res = new Response(info, {
        headers: {
            "Content-Type": "application/json",
        }
    });

    // 缓存结果，缓存时间为24小时
    await cache.put(request.url, res.clone(), {
        expirationTtl: 24 * 60 * 60
    });
    return res;
}