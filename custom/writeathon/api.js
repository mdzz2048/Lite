/* ------------------------写拉松 API ------------------------ */
// REF: https://guide.writeathon.cn/help/api.html

// 读取本地配置
import { getFile } from "../../script/utils/api.js"

let config = await getFile("/data/assets/思源书斋/思源书斋.json");
if (config) config = await config.json();
const writeathon_token = config.writeathon.token;
const url = "https://api.writeathon.cn/";

// 获取用户基本信息
async function me() {
    let resData = null
    let api_url = url + "v1/me";
    await fetch(api_url, {
        method: 'GET',
        headers: {
            "x-writeathon-token": writeathon_token,
        }
    }).then(function (response) { resData = response.json() })
    return resData
}

// 创建卡片

// 获取最近更新的卡片列表

// 获取卡片
