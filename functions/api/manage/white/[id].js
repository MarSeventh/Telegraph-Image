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
    // 组装 CDN URL
    const url = new URL(request.url);
    const cdnUrl = `https://${url.hostname}/file/${params.id}`;

    // 解码params.id
    params.id = decodeURIComponent(params.id);

    //read the metadata
    const value = await env.img_url.getWithMetadata(params.id);

    //change the metadata
    value.metadata.ListType = "White"
    await env.img_url.put(params.id,"",{metadata: value.metadata});
    const info = JSON.stringify(value.metadata);

    // 清除CDN缓存
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'X-Auth-Email': `${env.CF_EMAIL}`, 'X-Auth-Key': `${env.CF_API_KEY}`},
      body: `{"files":["${ cdnUrl }"]}`
    };
    await fetch(`https://api.cloudflare.com/client/v4/zones/${ env.CF_ZONE_ID }/purge_cache`, options);
    // 清除api/manage/list API缓存
    try {
        const cache = caches.default;
        // 通过写入一个max-age=0的response来清除缓存
        const nullResponse = new Response(null, {
            headers: { 'Cache-Control': 'max-age=0' },
        });
        await cache.put(`${url.origin}/api/manage/list`, nullResponse);
    } catch (error) {
        console.error('Failed to clear cache:', error);
    }

    return new Response(info);

  }