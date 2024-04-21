<template>
  <view class="container">
    <view class="user-section">
      <image
        class="bg"
        src="http://data.xytschool.com/m/v1/static/user-bg.jpg"
      ></image>
      <!-- {{ JSON.stringify(user) + '345676543' }} -->
      <view class="user-info-box">
        <view class="portrait-box">
          <image
            class="portrait"
            :src="user.avatar || '/static/missing-face.png'"
          ></image>
        </view>
        <view class="info-box">
          <text class="username">{{ user.nickname || user.name }}</text>
        </view>
      </view>

      <view class="vip-card-box">
        <image
          class="card-bg"
          src="http://data.xytschool.com/m/v1/static/vip-card-bg.png"
          mode=""
        ></image>
        <!-- <view
          class="b-btn"
          v-if="user.vip_level <= 0"
          @click="navTo('/pages/user/openVip')"
        >
          开通会员
        </view> -->

        <!-- <view class="tit" v-if="user.vip_level > 0" @click="showUserCode">
          <text class="yticon icon-iLinkapp-"></text>
          黄金会员
          <u-icon
            name="scan"
            color="#89f23a"
            size="28"
            style="margin-left: 10px"
          ></u-icon>
        </view> -->

        <text class="e-m">南湾湖景区 </text>
        <!-- <text class="e-b">总有人要成功为什么不是我</text> -->
      </view>
    </view>

    <view
      class="cover-container"
      :style="[
        {
          transform: coverTransform,
          transition: coverTransition
        }
      ]"
      @touchstart="coverTouchstart"
      @touchmove="coverTouchmove"
      @touchend="coverTouchend"
    >
      <image
        class="arc"
        src="http://data.xytschool.com/m/v1/static/arc.png"
      ></image>

      <view class="tj-sction">
        <view class="tj-item">
          <text class="num">{{ user.balance || 0 }}</text>
          <text>余额</text>
        </view>
        <view class="tj-item">
          <text class="num">0</text>
          <text>优惠券</text>
        </view>
        <view class="tj-item">
          <text class="num">{{ user.score || 0 }}</text>
          <text>积分</text>
        </view>
      </view>
      <!-- 订单 -->
      <view class="order-section">
        <view
          class="order-item"
          @click="navTo('/pages/order/order?state=0')"
          hover-class="common-hover"
          :hover-stay-time="50"
        >
          <text class="yticon icon-shouye"></text>
          <text>全部订单</text>
        </view>
        <view
          class="order-item"
          @click="navTo('/pages/order/order?state=1')"
          hover-class="common-hover"
          :hover-stay-time="50"
        >
          <text class="yticon icon-daifukuan"></text>
          <text>待付款</text>
        </view>
        <view
          class="order-item"
          @click="navTo('/pages/order/order?state=2')"
          hover-class="common-hover"
          :hover-stay-time="50"
        >
          <text class="yticon icon-yishouhuo"></text>
          <text>待使用</text>
        </view>
        <view
          class="order-item"
          @click="navTo('/pages/order/order?state=4')"
          hover-class="common-hover"
          :hover-stay-time="50"
        >
          <text class="yticon icon-shouhoutuikuan"></text>
          <text>退款/售后</text>
        </view>
      </view>
      <!-- 浏览历史 -->
      <view class="history-section icon">
        <!-- <view class="sec-header">
          <text class="yticon icon-lishijilu"></text>
          <text>浏览历史</text>
        </view> -->
        <scroll-view scroll-x class="h-list">
          <image
            @click="navTo('/pages/product/product?id=' + item.id)"
            v-for="item in historyList"
            :src="item.cover"
            mode="aspectFill"
          ></image>
          <!--					<image @click="navTo('/pages/product/product')" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553105231218&di=09534b9833b5243296630e6d5b728eff&imgtype=0&src=http%3A%2F%2Fimg002.hc360.cn%2Fm1%2FM05%2FD1%2FAC%2FwKhQcFQ3iN2EQTo8AAAAAHQU6_8355.jpg" mode="aspectFill"></image>-->
          <!--					<image @click="navTo('/pages/product/product')" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553105320890&di=c743386be51f2c4c0fd4b75754d14f3c&imgtype=0&src=http%3A%2F%2Fimg007.hc360.cn%2Fhb%2FMTQ1OTg4ODY0MDA3Ny05OTQ4ODY1NDQ%3D.jpg" mode="aspectFill"></image>-->
        </scroll-view>
        <!-- <list-cell
          icon="icon-saomiao"
          @eventClick="navTo('/pages/MyVerification/index')"
          iconColor="#e07472"
          title="人脸认证"
        ></list-cell> -->
        <!-- <list-cell
          icon="icon-iconfontweixin"
          @eventClick="myCode()"
          iconColor="#e07472"
          title="我的二维码"
          tips=""
        ></list-cell> -->

        <!-- <list-cell
          icon="icon-iconfontweixin"
          @eventClick="navTo('/pages/user/userAwards')"
          iconColor="#e07472"
          title="我的奖品"
          tips=""
        ></list-cell> -->
        <!-- <list-cell
          icon="icon-dizhi"
          iconColor="#5fcda2"
          title="地址管理"
          @eventClick="navTo('/pages/address/address')"
        ></list-cell> -->
        <list-cell
          icon="icon-tuandui"
          iconColor="#649C4A"
          title="常用联系人"
          @eventClick="navTo('/pages/addpeople/addpeople')"
        ></list-cell>
        <!-- <list-cell
          icon="icon-share"
          iconColor="#9789f7"
          title="分享"
          tips="邀请好友赢10万大礼"
        ></list-cell> -->
        <!--				<list-cell icon="icon-pinglun-copy" iconColor="#ee883b" title="晒单" tips="晒单抢红包"></list-cell>-->
        <!-- <list-cell
          icon="icon-shoucang_xuanzhongzhuangtai"
          iconColor="#54b4ef"
          title="我的收藏"
        ></list-cell> -->
        <!-- <list-cell
          icon="icon-shezhi1"
          iconColor="#e07472"
          title="设置"
          border=""
          @eventClick="navTo('/pages/set/set')"
        ></list-cell> -->
      </view>
    </view>
    <u-modal
      v-model="isShowUserCode"
      :title="'会员码'"
      width="70%"
      :title-style="{ fontSize: '20px' }"
    >
      <view style="text-align: center;padding: 10px">
        <img
          :src="'https://help.xytschool.com/getQrcode?code=' + userCode"
          style="width: 200px"
        />
        <u-count-down
          ref="uCountDown"
          :timestamp="leftTime"
          separator="colon"
          @end="updateUserCode"
        ></u-count-down>
      </view>
    </u-modal>
    <scan-code v-model="showCodePicker" />
  </view>
</template>
<script>
import listCell from '@/components/mix-list-cell'

import { mapState } from 'vuex'
let startY = 0,
  moveY = 0,
  pageAtTop = true
export default {
  components: {
    listCell
  },
  data() {
    return {
      com_id: 0,
      coverTransform: 'translateY(0px)',
      coverTransition: '0s',
      moving: false,
      historyList: [],
      isShowUserCode: false,
      leftTime: 0,
      userCode: '',
      showCodePicker: false,
      loadMake: false
    }
  },
  onLoad(params) {
    this.com_id = params.com_id
    this.$store.dispatch('user/checkLogin', this.com_id)

    // this.$api.user.getUserHistoryList().then((list) => {
    //   var dateRange = list.data
    //   for (var date in dateRange) {
    //     var dateItems = dateRange[date]
    //     for (var index in dateItems) {
    //       this.historyList.push(dateItems[index])
    //     }
    //   }
    //   this.historyList = this.historyList.subarray(0, 10)
    //   console.log(this.historyList)
    // })
  },
  // #ifndef MP
  onNavigationBarButtonTap(e) {
    const index = e.index
    if (index === 0) {
      this.navTo('/pages/set/set')
    } else if (index === 1) {
      // #ifdef APP-PLUS
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
      const currentWebview = page.$getAppWebview()
      currentWebview.hideTitleNViewButtonRedDot({
        index
      })
      // #endif
      uni.navigateTo({
        url: '/pages/notice/notice'
      })
    }
  },
  // #endif
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      hasLogin: (state) => state.user.hasLogin
    })
  },
  methods: {
    showUserCode() {
      this.isShowUserCode = true
      this.updateUserCode()
    },
    updateUserCode() {
      this.$api.user.updateUserCode().then((res) => {
        //console.log('updateUserCode', res)
        if (res.code == 'success') {
          this.userCode = res.data.code
          this.leftTime = 30
          this.$refs.uCountDown.start()
        }
      })
    },
    /**
     * 统一跳转接口,拦截未登录路由
     * navigator标签现在默认没有转场动画，所以用view
     */
    navTo(url) {
      // if(!this.hasLogin){
      // 	url = '/pages/login/index';
      // }
      uni.navigateTo({
        url
      })
    },

    myCode() {
      this.showCodePicker = true
      console.log(this.showCodePicker)
    },

    /**
     *  会员卡下拉和回弹
     *  1.关闭bounce避免ios端下拉冲突
     *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
     *    transition设置0.1秒延迟，让css来过渡这段空窗期
     *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
     */
    coverTouchstart(e) {
      if (pageAtTop === false) {
        return
      }
      this.coverTransition = 'transform .1s linear'
      startY = e.touches[0].clientY
    },
    coverTouchmove(e) {
      moveY = e.touches[0].clientY
      let moveDistance = moveY - startY
      if (moveDistance < 0) {
        this.moving = false
        return
      }
      this.moving = true
      if (moveDistance >= 80 && moveDistance < 100) {
        moveDistance = 80
      }

      if (moveDistance > 0 && moveDistance <= 80) {
        this.coverTransform = `translateY(${moveDistance}px)`
      }
    },
    coverTouchend() {
      if (this.moving === false) {
        return
      }
      this.moving = false
      this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)'
      this.coverTransform = 'translateY(0px)'
    }
  }
}
</script>
<style lang="scss">
%flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
%section {
  display: flex;
  justify-content: space-around;
  align-content: center;
  background: #fff;
  border-radius: 10upx;
}

.user-section {
  height: 520upx;
  padding: 100upx 30upx 0;
  position: relative;
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    filter: blur(1px);
    opacity: 0.7;
  }
}
.user-info-box {
  height: 180upx;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  .portrait {
    width: 130upx;
    height: 130upx;
    border: 5upx solid #fff;
    border-radius: 50%;
  }
  .username {
    font-size: $font-lg + 6upx;
    color: $font-color-dark;
    margin-left: 20upx;
  }
}

.vip-card-box {
  display: flex;
  flex-direction: column;
  color: #f7d680;
  height: 240upx;
  background: linear-gradient(left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
  border-radius: 16upx 16upx 0 0;
  overflow: hidden;
  position: relative;
  padding: 20upx 24upx;
  .card-bg {
    position: absolute;
    top: 20upx;
    right: 0;
    width: 380upx;
    height: 260upx;
  }
  .b-btn {
    position: absolute;
    right: 20upx;
    top: 16upx;
    width: 132upx;
    height: 40upx;
    text-align: center;
    line-height: 40upx;
    font-size: 22upx;
    color: #36343c;
    border-radius: 20px;
    background: linear-gradient(left, #f9e6af, #ffd465);
    z-index: 1;
  }
  .tit {
    font-size: $font-base + 2upx;
    color: #f7d680;
    margin-bottom: 28upx;
    .yticon {
      color: #f6e5a3;
      margin-right: 16upx;
    }
  }
  .e-b {
    font-size: $font-sm;
    color: #d8cba9;
    margin-top: 10upx;
  }
}
.cover-container {
  background: $page-color-base;
  margin-top: -150upx;
  padding: 0 30upx;
  position: relative;
  background: #f5f5f5;
  padding-bottom: 20upx;
  .arc {
    position: absolute;
    left: 0;
    top: -34upx;
    width: 100%;
    height: 36upx;
  }
}
.tj-sction {
  @extend %section;
  .tj-item {
    @extend %flex-center;
    flex-direction: column;
    height: 140upx;
    font-size: $font-sm;
    color: #75787d;
  }
  .num {
    font-size: $font-lg;
    color: $font-color-dark;
    margin-bottom: 8upx;
  }
}
.order-section {
  @extend %section;
  padding: 28upx 0;
  margin-top: 20upx;
  .order-item {
    @extend %flex-center;
    width: 120upx;
    height: 120upx;
    border-radius: 10upx;
    font-size: $font-sm;
    color: $font-color-dark;
  }
  .yticon {
    font-size: 48upx;
    margin-bottom: 18upx;
    color: #fa436a;
  }
  .icon-shouhoutuikuan {
    font-size: 44upx;
  }
}
.history-section {
  padding: 30upx 0 0;
  margin-top: 20upx;
  background: #fff;
  border-radius: 10upx;
  .sec-header {
    display: flex;
    align-items: center;
    font-size: $font-base;
    color: $font-color-dark;
    line-height: 40upx;
    margin-left: 30upx;
    .yticon {
      font-size: 44upx;
      color: #5eba8f;
      margin-right: 16upx;
      line-height: 40upx;
    }
  }
  .h-list {
    white-space: nowrap;
    padding: 30upx 30upx 0;
    image {
      display: inline-block;
      width: 160upx;
      height: 160upx;
      margin-right: 20upx;
      border-radius: 10upx;
    }
  }
}
</style>
