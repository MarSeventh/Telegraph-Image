export async function onRequest(context) {
    const { request } = context;

    const url = new URL(request.url);
    const cache = caches.default;
    const cacheKey = `${url.origin}/123.jpg`;

    const del = url.searchParams.get('del');
    if (del) {
        await cache.put(cacheKey, new Response(null, {
            headers: { 'Cache-Control': 'max-age=0' },
        }));
        return new Response('deleted', { status: 200 });
    }

    const cacheResult = await cache.match(cacheKey);
    if (cacheResult) {
        return new Response('match', { status: 200 });
    } else {
        return new Response('no match', { status: 200 });
    }
    
}