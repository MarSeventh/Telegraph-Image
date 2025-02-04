export async function onRequest(context) {
    // 页面设置相关，GET方法读取设置，POST方法保存设置
    const {
      request, // same as existing Worker API
      env, // same as existing Worker API
      params, // if filename includes [id] or [[path]]
      waitUntil, // same as ctx.waitUntil in existing Worker API
      next, // used for middleware or to fetch assets
      data, // arbitrary space for passing data between middlewares
    } = context;

    const kv = env.img_url

    // GET读取设置
    if (request.method === 'GET') {
        const settings = await getPageConfig(kv, env)

        return new Response(JSON.stringify(settings), {
            headers: {
                'content-type': 'application/json',
            },
        })
    }

    // POST保存设置
    if (request.method === 'POST') {
        const body = await request.json()
        const settings = body

        // 写入 KV
        await kv.put('manage@sysConfig@page', JSON.stringify(settings))

        return new Response(JSON.stringify(settings), {
            headers: {
                'content-type': 'application/json',
            },
        })
    }

}

export async function getPageConfig(kv, env) {
    const settings = {}
    // 读取KV中的设置
    const settingsStr = await kv.get('manage@sysConfig@page')
    const settingsKV = settingsStr ? JSON.parse(settingsStr) : {}

    const config = []
    settings.config = config
    config.push(
        {
            id: 'siteTitle',
            label: '网站标题',
        },
        {
            id: 'siteIcon',
            label: '网站图标',
        },
        {
            id: 'ownerName',
            label: '图床名称',
        },
        {
            id: 'logoUrl',
            label: '图床Logo',
        },
        {
            id: 'loginBkImg',
            label: '登录页背景图',
        },
        {
            id: 'uploadBkImg',
            label: '上传页背景图',
        },
        {
            id: 'bkInterval',
            label: '背景切换间隔',
            value: 3000
        },
        {
            id: 'bkOpacity',
            label: '背景图透明度',
            value: 1
        },
        {
            id: 'footerLink',
            label: '页脚传送门链接',
        },
        {
            id: 'disableFooter',
            label: '隐藏页脚',
        },
        {
            id: 'urlPrefix',
            label: '自定义URL前缀',
        }
    )

    const userConfig = env.USER_CONFIG
    if (userConfig) {
        try {
            const parsedConfig = JSON.parse(userConfig)
            if (typeof parsedConfig === 'object' && parsedConfig !== null) {
                // 搜索config中的id，如果存在则更新
                for (let i = 0; i < config.length; i++) {
                    if (parsedConfig[config[i].id]) {
                        config[i].value = parsedConfig[config[i].id]
                        config[i].fixed = true
                    }
                }
            }
        } catch (error) {
            // do nothing
        }
    }

    // 用KV中的设置覆盖默认设置
    for (let i = 0; i < config.length; i++) {
        if (settingsKV.config[i]?.value) {
            config[i].value = settingsKV.config[i].value
        }
    }

    return settings
}