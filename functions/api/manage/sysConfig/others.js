export async function onRequest(context) {
    // 其他设置相关，GET方法读取设置，POST方法保存设置
    const {
      request, // same as existing Worker API
      env, // same as existing Worker API
      params, // if filename includes [id] or [[path]]
      waitUntil, // same as ctx.waitUntil in existing Worker API
      next, // used for middleware or to fetch assets
      data, // arbitrary space for passing data between middlewares
    } = context;

    // GET读取设置
    if (request.method === 'GET') {
        const settings = {}

        // 远端遥测
        settings.telemetry = {
            enabled: env.disable_telemetry === undefined || env.disable_telemetry === 'false',
            fixed: true,
        }

        // 随机图API
        settings.randomImageAPI = {
            enabled: env.AllowRandom === 'true',
            fixed: true,
        }

        // CloudFlare API Token
        settings.cloudflareApiToken = {
            CF_ZONE_ID: env.CF_ZONE_ID,
            CF_EMAIL: env.CF_EMAIL,
            CF_API_KEY: env.CF_API_KEY,
            fixed: true,
        }

        return new Response(JSON.stringify(settings), {
            headers: {
                'content-type': 'application/json',
            },
        })
    }

}