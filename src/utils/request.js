//var host = "http://shop.laravelschool.xyt"
import he from "@dcloudio/vue-cli-plugin-uni/packages/uni-cloud/dist";

var host = ""
//var host = "https://mobile.xytschool.com"
var baseUrl = ""
import {getAuthToken, getClientID, getComId} from "./utils"

function request(method, url, query, is_raw) {
    var com_id = getComId()
    if (com_id) {
        //query.com_id = com_id
        //console.log('replace')
        url = url.replace('{$com_id}', com_id)
    }
    //query.com_id = 9
    return new Promise((resolve, reject) => {
        var token = getAuthToken()
        var clientId = getClientID()

        var fullUrl = ""
        if (url.startsWith("http")) {
            fullUrl = url
        } else if (is_raw) {
            fullUrl = host + url
        } else {
            fullUrl = host + baseUrl + url
        }
        var header = {}
        if (token) {
            header = {
                'content-type': 'application/json',// 默认值
                'Authorization': 'Bearer ' + token,
                'ClientID': clientId
            }
        } else {
            header = {
                'content-type': 'application/json',// 默认值
                'ClientID': clientId
            }
        }

        wx.request({
            url: fullUrl,
            data: query,
            method: method,
            header: header,
            success(res) {
                //console.log('request', res)
                if (res.statusCode == 200) {
                    res = res.data
                    if (res.code === 200 || res.code === 700 || res.code === 0) {
                        resolve(res)
                    } else {
                        uni.showToast({
                            icon: "none",
                            title: res.msg,
                            duration: 3000
                        });
                        resolve(res)
                    }
                } else if (res.statusCode == 401) {
                    // uni.getProvider({
                    //     service: 'oauth',
                    //     success: function (res) {
                    //         console.log(res.provider)
                    //         if (~res.provider.indexOf('qq')) {
                    //             uni.login({
                    //                 provider: 'qq',
                    //                 success: function (loginRes) {
                    //                     console.log(JSON.stringify(loginRes));
                    //                 }
                    //             });
                    //         }
                    //     },
                    //     complete(res){ console.log(res)}
                    // });
                    uni.showModal({
                        title: '当前未登录',
                        content: '授权登陆',
                        success: function (res) {
                            console.log('授权登陆',res)
                            if (res.confirm) {
                                //#ifdef H5
                                console.log("/pages/login/index")
                                uni.navigateTo({
                                    url: `/pages/login/index`
                                })
                                //#endif

                                //#ifndef H5
                                uni.login({
                                    provider: 'weixin',
                                    success: function (loginRes) {
                                        console.log(loginRes.authResult);
                                    }
                                });
                                //#endif
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    });
                } else {
                    reject(res)
                }
            },
            fail(res) {
                uni.showToast({
                    icon: "none",
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

function ws(url, query) {
    // if (query == undefined) {
    //     query = {}
    // }
    //
    // var token = getAuthToken()
    // var clientId = getClientID()
    //
    // var header = {}
    // if (token) {
    //     header = {
    //         'content-type': 'application/json',// 默认值
    //         'Authorization': 'Bearer ' + token,
    //         'ClientID': clientId
    //     }
    // } else {
    //     header = {
    //         'content-type': 'application/json',// 默认值
    //         'ClientID': clientId
    //     }
    // }
    return uni.connectSocket({
        url: url,
        data() {
            return query
        },
        complete: (e) => {
            console.log(e)
        }
        //protocols: ['protocol1'],
        //method: 'GET'
    });
}

module.exports = {
    baseUrl,
    request,
    rawGet,
    ws,
    get,
    post
}

