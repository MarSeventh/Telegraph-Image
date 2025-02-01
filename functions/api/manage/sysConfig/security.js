export async function onRequest(context) {
    // 安全设置相关，GET方法读取设置，POST方法保存设置
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

        // 认证管理
        const auth = {
            user: {
                authCode: env.AUTH_CODE
            },
            admin: {
                adminUsername: env.BASIC_USER,
                adminPassword: env.BASIC_PASS,
            }
        }
        settings.auth = auth

        // 上传管理
        const upload = {
            moderate: {
                channel: 'moderatecontent.com',
                apiKey: env.ModerateContentApiKey,
            }
        }
        settings.upload = upload

        // 访问管理
        const access = {
            allowedDomains: env.ALLOWED_DOMAINS || '*',
            whiteListMode: env.WhiteList_Mode || false
        }
        settings.access = access


        return new Response(JSON.stringify(settings), {
            headers: {
                'content-type': 'application/json',
            },
        })
    }

}