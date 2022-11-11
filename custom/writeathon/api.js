/* ------------------------写拉松 API ------------------------ */
// REF: https://guide.writeathon.cn/help/api.html

import { getFile, putFile } from "../../script/utils/api.js"
import { config } from "./config.js";

// getFile();
// putFile();

let url = config.api_url;
let writeathon_token = config.writeathon_token;
let writeathon_id = config.writeathon_id;
let exclude_data_title = config.exclude_data_title;

// 发送请求
async function writeathon_api(url, init) {
    let resData = null;
    
    await fetch(url, init)
    .then(data => data.json())
    .then(data => resData = data)
    .catch(error => console.log(error));

    return resData;
}

// 解析请求体
async function get_response(response) {
    let r = await response;
    // console.log(r);
    return r.success === true ? r.data : null
}

// 获取用户基本信息
async function me() {
    let api_url = url + "/v1/me";
    let init = {
        method: 'GET',
        headers: {
            "x-writeathon-token": writeathon_token
        }
    };
    return get_response(writeathon_api(api_url, init));
}

// 创建卡片
async function creat_card(title, content) {
    let api_url = url + "/v1/users/" + writeathon_id + "/cards";
    let body = {
        "title": title,
        "content": content,
    };
    let init = {
        method: "POST", 
        headers: {
            "x-writeathon-token": writeathon_token,
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(body),
    };
    return writeathon_api(api_url, init);
}


// 获取最近更新的卡片列表
async function recent_card_list(exclude_data_title) {
    let api_url = url + "/v1/users/" + writeathon_id + "/cards/recent";
    let body = {
        exclude_data_title: exclude_data_title,
    }
    let init = {
        method: "GET",        
        headers: {
            "x-writeathon-token": writeathon_token,
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(body),
    };
    return get_response(writeathon_api(api_url, init));
}

// 获取卡片
async function get_card(id, title) {
    let api_url = url + "/v1/users/" + writeathon_id + "/cards/get";
    let body = {
        "title": title,
        "id": id,
    }
    let init = {
        method: "POST",
        headers: {
            "x-writeathon-token": writeathon_token,
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(body),
    };
    return get_response(writeathon_api(api_url, init));
}

setTimeout(() => {
    
    // me();
    // recent_card_list();
    // creat_card("title", "content");
    // get_card("", "title");

}, 500);