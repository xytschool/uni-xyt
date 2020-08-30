import Vue from 'vue'
import App from './App'
import Json from './Json' //测试用数据
import store from './store'
import {getComId, getUserInfo, setUserInfo} from "./utils/utils";


Vue.config.productionTip = false
import uView from "uview-ui";

Vue.use(uView);
App.mpType = 'app'

//console.log(process)

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
    //统一提示方便全局修改
    if (Boolean(title) === false) {
        return;
    }
    uni.showToast({
        title,
        duration,
        mask,
        icon
    });
}
const json = type => {
    //模拟异步请求数据
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(Json[type]);
        }, 500)
    })
}
const prePage = () => {
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    // #ifdef H5
    return prePage;
    // #endif
    return prePage.$vm;
}

//#ifdef H5
import wx from 'weixin-js-sdk'
var VConsole = require('vconsole');
var vConsole = new VConsole();
var clientType = "h5"

var ua = navigator.userAgent.toLowerCase()
if (ua.match(/MicroMessenger/i) == "micromessenger") {
    //在微信中打开
    clientType = "wx_official"
}
//#endif

//#ifndef H5
var clientType = "wx_miniapp"
//#endif

//
var com_id = getComId()
//console.log("com_id", com_id)

Vue.prototype.$com_id = com_id
Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;

import site from './api/site' //测试用数据
import activity from './api/activity' //测试用数据
import user from './api/userapi' //测试用数据
import order from './api/order' //测试用数据
import goods from './api/goods' //测试用数据
import comment from './api/comment'
import message from './api/message'
import {parseDate} from "./utils/date";

//微信回调会在html中写入用户信息
if (window && window.userInfo && window.userInfo.id) {
    setUserInfo(window.userInfo)
}

let userInfo = getUserInfo()
if (userInfo) {
    store.commit('user/setUser', userInfo)
}
Vue.prototype.clientType = clientType
Vue.prototype.$api = {msg, json, prePage, activity, message, site, user, order, goods, comment};

Vue.directive('datetime', {
    bind: function (el, binding, vnode) {
        el.innerText = parseDate(binding.value)
    }
})

//console.log("clientType", clientType)
if (clientType == "wx_official") {
    //console.log("wxCof",window.wx_config)
    wx.config(window.wx_config)
    wx.ready(function () {
        console.log("wx.ready",'share')
        // // 朋友圈
        // wx.updateTimelineShareData({
        //     title: 'xxxxx', // 分享标题
        //     link: "http://m.xytschool.com?share_user_id= 6917", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //     imgUrl: "http://data.xytschool.com/storage/image/20200522/1590103645499758.png",// 分享图标
        //     success: function (res) {
        //         console.log("updateTimelineShareData", res)
        //         // 设置成功
        //     }
        // });
        //
        // // 微信朋友
        // wx.updateAppMessageShareData({
        //     title: 'abc', // 分享标题
        //     desc: 'wwwww', // 分享描述
        //     link: "http://m.xytschool.com?share_user_id= 6917", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        //     imgUrl: "http://data.xytschool.com/storage/image/20200522/1590103645499758.png",// 分享图标
        //     type: 'link', // 分享类型,music、video或link，不填默认为link
        //     dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
        // });
        const app = new Vue({
            ...App
        })
        app.$mount()
    });
    wx.error(function (err) {
        console.log(err)
    })
} else {
    const app = new Vue({
        ...App
    })
    app.$mount()
}


