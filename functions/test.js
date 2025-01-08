export async function onRequest(context) {
    const { request } = context;

    const url = new URL(request.url);
    const cache = caches.default;
    const cacheKey = `${url.origin}/123`;

    const del = url.searchParams.get('del');
    if (del) {
        await cache.delete(cacheKey);
        return new Response('deleted', { status: 200 });
    }
    
    const cacheResult = await cache.match(cacheKey);
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