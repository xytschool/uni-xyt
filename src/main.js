import Vue from 'vue'
import App from './App'
import Json from './Json' //测试用数据
import store from './store'
import { getComId, getUserInfo, setUserInfo } from './utils/utils'

Vue.config.productionTip = false
import uView from 'uview-ui'

Vue.use(uView)
App.mpType = 'app'

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
  //统一提示方便全局修改
  if (Boolean(title) === false) {
    return
  }
  uni.showToast({
    title,
    duration,
    mask,
    icon
  })
}
const json = (type) => {
  //模拟异步请求数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Json[type])
    }, 500)
  })
}
const prePage = () => {
  let pages = getCurrentPages()
  let prePage = pages[pages.length - 2]
  // #ifdef H5
  return prePage
}

//#ifdef H5
var VConsole = require('vconsole')
var vConsole = new VConsole()
var clientType = 'h5'

var ua = navigator.userAgent.toLowerCase()
if (ua.match(/MicroMessenger/i) == 'micromessenger') {
  //在微信中打开
  clientType = 'wx_official'
}
//#endif

//#ifndef H5
var clientType = 'wx_miniapp'
//#endif

//
var com_id = getComId()
//console.log("com_id", com_id)

Vue.prototype.$com_id = com_id
Vue.config.productionTip = false
Vue.prototype.$fire = new Vue()
Vue.prototype.$store = store

import site from './api/site' //测试用数据
import activity from './api/activity' //测试用数据
import user from './api/userapi' //测试用数据
import order from './api/order' //测试用数据
import goods from './api/goods' //测试用数据
import comment from './api/comment'
import message from './api/message'
import { parseDate } from './utils/date'

{
  // 加载必要数据
  store.dispatch('company/getCompany')
  // 微信回调会在html中写入用户信息
  if (window && window.userInfo && window.userInfo.id) {
    setUserInfo(window.userInfo)
  }

  let userInfo = getUserInfo()
  if (userInfo) {
    store.commit('user/setUser', userInfo)
  }
}

Vue.prototype.clientType = clientType
Vue.prototype.$api = {
  msg,
  json,
  prePage,
  activity,
  message,
  site,
  user,
  order,
  goods,
  comment
}

Vue.directive('datetime', {
  bind: function(el, binding, vnode) {
    el.innerText = parseDate(binding.value)
  }
})

Vue.directive('yuan', {
  bind: function(el, binding, vnode) {
    console.log(el, binding, vnode, 'bind')
    if (binding.value == undefined) {
      return
    }
    var fen = binding.value.toString()
    var a = 0,
      b = 0
    if (binding.value < 100) {
      b = fen
    } else {
      a = fen.substring(0, fen.length - 2)
      b = fen.substring(fen.length - 2, fen.length)
    }
    if (b.length == 1) {
      b = '0' + b
    }
    var text = el.innerText.replace(/[\d\.]+/, '')
    el.innerText = text + a + '.' + b
  },
  update: function(el, binding, vnode) {
    console.log(el, binding, vnode, 'update')

    if (binding.value == undefined) {
      return
    }
    var fen = binding.value.toString()
    var a = 0,
      b = 0
    if (binding.value < 100) {
      b = fen
    } else {
      a = fen.substring(0, fen.length - 2)
      b = fen.substring(fen.length - 2, fen.length)
    }
    if (b.length == 1) {
      b = '0' + b
    }
    var text = el.innerText.replace(/[\d\.]+/, '')
    el.innerText = text + a + '.' + b
  }
})

const app = new Vue({
  ...App
})
app.$mount()
