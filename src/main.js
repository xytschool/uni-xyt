import Vue from 'vue'
import App from './App'
import Json from './Json' //测试用数据
import store from './store'

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
Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;

import site from './api/site' //测试用数据
import user from './api/userapi' //测试用数据
import order from './api/order' //测试用数据
import goods from './api/goods' //测试用数据
import comment from './api/comment'
import message from './api/message'
import {getUserInfo} from "./utils/utils"; //测试用数据


let userInfo = getUserInfo()
//console.log('getUserInfo', userInfo)
if (userInfo) {
    store.commit('user/setUser', userInfo)
}

Vue.prototype.$api = {msg, json, prePage, message, site, user, order, goods, comment};

const app = new Vue({
    ...App
})
app.$mount()
