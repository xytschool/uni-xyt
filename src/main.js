import Vue from 'vue'
import App from './App'
import Json from './Json' //测试用数据
import store from './store'
import {getComId ,getUserInfo, setUserInfo} from "./utils/utils";
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
var clientType = "h5"
//#endif

//#ifndef H5
var clientType = "wx_miniapp"
//#endif

//
var com_id = getComId()
console.log("com_id", com_id)

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
    console.log("getUser fro window.userInfo", window.userInfo)
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
        // el.innerHTML =
        //     'name: '       + s(binding.name) + '<br>' +
        //     'value: '      + s(binding.value) + '<br>' +
        //     'expression: ' + s(binding.expression) + '<br>' +
        //     'argument: '   + s(binding.arg) + '<br>' +
        //     'modifiers: '  + s(binding.modifiers) + '<br>' +
        //     'vnode keys: ' + Object.keys(vnode).join(', ')
    }
})

const app = new Vue({
    ...App
})
app.$mount()
