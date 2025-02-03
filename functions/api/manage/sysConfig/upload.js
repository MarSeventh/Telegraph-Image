export async function onRequest(context) {
    // 上传设置相关，GET方法读取设置，POST方法保存设置
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

        const telegram = []
        // 读取tg渠道配置
        if (env.TG_BOT_TOKEN) {
            telegram.push({
                id: 1,
                name: 'Telegram_1',
                type: 'telegram',
                savePath: 'environment variable',
                botToken: env.TG_BOT_TOKEN,
                chatId: env.TG_CHAT_ID,
                enabled: true,
                fixed: true,
            })
        }
        // 读取r2渠道配置
        const cfr2 = []
        if (env.img_r2) {
            cfr2.push({
                id: 1,
                name: 'Cloudflare R2_1',
                type: 'cfr2',
                savePath: 'environment variable',
                enabled: true,
                fixed: true,
            })
        }

        // 读取s3渠道配置
        const s3 = []
        if (env.S3_ACCESS_KEY_ID) {
            s3.push({
                id: 1,
                name: 'S3_1',
                type: 's3',
                savePath: 'environment variable',
                accessKeyId: env.S3_ACCESS_KEY_ID,
                secretAccessKey: env.S3_SECRET_ACCESS_KEY,
                region: env.S3_REGION || 'auto',
                bucketName: env.S3_BUCKET_NAME,
                endpoint: env.S3_ENDPOINT,
                enabled: true,
                fixed: true,
            })
        }

        settings.telegram = telegram
        settings.cfr2 = cfr2
        settings.s3 = s3
        return new Response(JSON.stringify(settings), {
            headers: {
                'content-type': 'application/json',
            },
        })
    }

}