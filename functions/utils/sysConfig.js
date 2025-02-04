import { getUploadConfig } from '../api/manage/sysConfig/upload';

export async function fetchUploadConfig(env) {
    const kv = env.img_url;
    const settings = await getUploadConfig(kv, env);
    return settings;
}