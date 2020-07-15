import Vue from "vue";

function getQueryParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function setAuthToken(token) {
    uni.setStorageSync('authToken', token);
}

function getAuthToken() {
    var token = uni.getStorageSync('authToken')
    return token
}

var user = null
function getUserInfo() {
    if(user){
        return user
    }
    user = uni.getStorageSync('userInfo')
    return user
}

function setUserInfo(userInfo) {
    user = userInfo
    uni.setStorageSync('userInfo', userInfo)
    setAuthToken(user.jws_token)
}

function logout() {
    user = null
    uni.setStorageSync('userInfo', user)
    setAuthToken('')
}

function getCurPage() {
    let pages = getCurrentPages();
    let curPage = pages[pages.length - 1];
    return curPage
}

function getComId() {
    // /*获取当前路由*/
    // let curPage = getCurPage();
    // //在微信小程序或是app中，通过curPage.options；如果是H5，则需要curPage.$route.query（H5中的curPage.options为undefined，所以刚好就不需要条件编译了）
    // let curParam = curPage.options || curPage.$route.query;
    // let com_id = curParam.com_id
    // if (!com_id)
    //     com_id = uni.getStorageSync('com_id');

    var lo = window.location.pathname
    var arr = lo.split('/')
    var com_id= arr.pop()
    return com_id
}

function setComId(com_id_storge) {
    uni.setStorageSync('com_id', com_id_storge);
    return
}

function getClientID() {
    var client_id = uni.getStorageSync('client_id')
    if (!client_id) {
        let key = Math.floor(new Date().getTime() / 30000)
        let rand = Math.floor(Math.random() * 100000000)
        let rand2 = Math.floor(Math.random() * 100000000)
        let params = {
            r: rand,
            r2: rand2,
            key: key + (rand2 + rand +20201314),
        }
        client_id = rand+"_" +rand2+"_"+ params.key
        uni.setStorageSync('client_id', client_id)
    }
    return client_id
}

module.exports = {getQueryParam, getAuthToken, setAuthToken,
    getComId, setComId, setUserInfo, getUserInfo, getClientID}