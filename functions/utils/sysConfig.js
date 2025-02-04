import { getUploadConfig } from '../api/manage/sysConfig/upload';

export async function fetchUploadConfig(env) {
    const kv = env.img_url;
    const settings = await getUploadConfig(kv, env);
    // 去除 已禁用 的渠道
    settings.telegram.channels = settings.telegram.channels.filter((channel) => channel.enabled);
    settings.cfr2.channels = settings.cfr2.channels.filter((channel) => channel.enabled);
    settings.s3.channels = settings.s3.channels.filter((channel) => channel.enabled);
    
    return settings;
}