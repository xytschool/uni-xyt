export default {
  data() {
    return {
      shareParams: {
        path: '/pages/index/index',
        title: '南湾湖',
        desc:
          "南湾湖，位于河南省信阳市西南5公里，以南湾湖为中 心，以山林、岛屿为风景内涵。南湾湖水域面积75平方公里，61座岛屿(现开放三座) 错落分布，景色各异。湖的上游是'信阳毛尖'主产地，湖中盛产南湾鱼。"
      }
    }
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内分享按钮
      console.log(res.target)
    }
    return {
      title: this.shareParams.title, // 标题
      path: this.shareParams.path, // 分享路径
      imageUrl: 'http://data.xytschool.com/img/nanwanhu/20240429-114951.jpg', // 分享图
      desc: this.shareParams.desc
    }
  },
  onShareTimeline() {
    return {
      title: this.shareParams.title, // 标题
      path: this.shareParams.path, // 分享路径
      imageUrl: 'https://cdn.uviewui.com/uview/swiper/1.jpg' // 分享图
    }
  }
}
