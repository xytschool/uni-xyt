import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
import uView from "uview-ui";
Vue.use(uView);
App.mpType = 'app'

console.log(process)

function ready() {
  console.log(window.__wxjs_environment === 'miniprogram') // true
}
if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
  document.addEventListener('WeixinJSBridgeReady', ready, false)
  //alert("123333")
} else {
  ready()
}

if(wx && wx.config){
  wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，公众号的唯一标识
    timestamp: 0, // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名
    jsApiList: [] // 必填，需要使用的JS接口列表
  });
  wx.ready(()=>{
     console.log(ready)
  })
  wx.error(function(res){
    console.log(res)
  })

  if(wx.miniProgram){
     wx.miniProgram.getEnv(function(res) {
     console.log(res.miniprogram) // true
     alert('xx')
    })
  }
}


const app = new Vue({
  ...App
})
app.$mount()
