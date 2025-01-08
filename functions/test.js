export async function onRequest(context) {
    const { request, env } = context;

    const url = new URL(request.url);
    const cache = caches.default;
    const cacheKey = `${url.origin}/123.jpg`;

    const del = url.searchParams.get('del');
    if (del) {
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'X-Auth-Email': `${env.CF_EMAIL}`, 'X-Auth-Key': `${env.CF_API_KEY}`},
            body: `{"files":["${ cacheKey }"]}`
        };
    
        await fetch(`https://api.cloudflare.com/client/v4/zones/${ env.CF_ZONE_ID }/purge_cache`, options);
        return new Response('deleted', { status: 200 });
    }
    
    const cacheResult = await cache.match(cacheKey);
    console.log(cacheResult);
    if (cacheResult) {
        return new Response('match', { status: 200 });
    } else {
        // Store the response in the cache
        const response = new Response('no match', { status: 200 });
        const cacheResponse = new Response(response.body, response);
        await cache.put(cacheKey, cacheResponse.clone());

        return new Response('no match', { status: 200 });
    }
    
}