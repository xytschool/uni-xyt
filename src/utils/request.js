
//var host = "http://shop.laravelschool.xyt"
var host = ""
//var host = "https://mobile.xytschool.com"
var baseUrl = ""
import {getAuthToken, getComId} from "./utils"

function request(method, url, query, is_raw) {
    var com_id = getComId()
    if (!query.com_id&&com_id) {
        query.com_id = com_id
    }
    //query.com_id = 9
    return new Promise((resolve, reject) => {
        var token = getAuthToken()
        var fullUrl = ""
        if (url.startsWith("http")) {
            fullUrl = url
        } else if (is_raw) {
            fullUrl = host + url
        } else {
            fullUrl = host + baseUrl + url
        }

        wx.request({
            url: fullUrl,
            data: query,
            method: method,
            header: {
                'content-type': 'application/json',// 默认值
                'Authorization': 'Bearer ' + token
            },
            success(res) {
                res = res.data
                if (res.code === 200 || res.code === 700 || res.code === 0) {
                    resolve(res)
                } else {
                    uni.showToast({
                        icon:"none",
                        title: res.msg,
                        duration: 3000
                    });
                    console.log("请求失败", res.msg)
                    resolve(res)
                }
            },
            fail(res) {
                uni.showToast({
                    icon:"none",
                    title: '请求异常',
                    duration: 3000
                });
                resolve(res)
            }
        })
    })
}

function get(url, query) {
    if (query == undefined) {
        query = {}
    }
    return request('GET', url, query)
}

function rawGet(url, query) {
    if (query == undefined) {
        query = {}
    }
    return request('GET', url, query, true)
}

function post(url, query) {
    if (query == undefined) {
        query = {}
    }
    return request('POST', url, query)
}

module.exports = {
    baseUrl,
    request,
    rawGet,
    get,
    post
}

