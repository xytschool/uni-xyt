<template>
  <view class="container">
    <view class="carousel">
      <swiper indicator-dots circular="true" duration="400">
        <swiper-item
          class="swiper-item"
          v-for="(item, index) in goods.covers"
          :key="index"
        >
          <view class="image-wrapper">
            <image :src="item" class="loaded" mode="aspectFill"></image>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <view class="introduce-section">
      <text class="title">{{ goods.name }}</text>
      <view class="price-box">
        <text class="price-tip">¥</text>
        <text class="price"> {{ goods.real_price | numberToCurrency }}</text>
        <text class="m-price" v-if="goods.real_price < goods.price"
          >¥ {{ goods.price | numberToCurrency }}</text
        >
        <text class="coupon-tip">折扣</text>
      </view>
      <!-- <view class="bot-row">
        <text>销量: {{ goods.sale_num }}</text>
        <text>库存: {{ goods.num }}</text>
        <text>浏览量: {{ goods.pv }}</text>
      </view> -->
    </view>

    <view class="c-list">
      <view
        class="c-row b-b"
        @click="toggleSpec"
        v-show="goods.sku_labels && goods.sku_labels.length != 0"
      >
        <text class="tit">购买类型</text>
        <view class="con">
          <text
            class="selected-text"
            v-for="(sItem, sIndex) in specSelected"
            :key="sIndex"
          >
            {{ sItem }}
          </text>
        </view>
        <text class="yticon icon-you"></text>
      </view>
    </view>

    <view class="detail-desc">
      <view class="d-header">
        <text>图文详情</text>
      </view>
      <view class="detail-desc-text">
        <rich-text :nodes="htmlString"></rich-text>
      </view>
    </view>

    <!-- 底部操作菜单 -->
    <view class="page-bottom">
      <navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
        <text class="yticon icon-xiatubiao--copy"></text>
        <text>首页</text>
      </navigator>

      <view>
        <text class="price">
          折扣¥{{ goods.real_price | numberToCurrency }}
        </text>
        <text class="m-price">¥{{ goods.price | numberToCurrency }}</text>
      </view>
      <view class="action-btn-group">
        <button
          type="primary"
          class=" action-btn no-border buy-now-btn"
          @click="buy"
        >
          立即购买
        </button>
      </view>
    </view>

    <!-- 规格-模态层弹窗 -->
    <view
      class="popup spec"
      :class="specClass"
      @touchmove.stop.prevent="stopPrevent"
      @click="toggleSpec"
    >
      <!-- 遮罩层 -->
      <view class="mask"></view>
      <view class="layer attr-content" @click.stop="stopPrevent">
        <view class="a-t">
          <image :src="currentSku.cover"></image>
          <view class="right">
            <text class="price"
              >¥ <text> {{ currentSku.real_price | numberToCurrency }}</text>
              {{ currentSku.sku_name }}</text
            >
            <text class="stock">库存：{{ currentSku.num }}件</text>
            <view class="selected">
              已选：
              <text
                class="selected-text"
                v-for="(val, label) in specSelected"
                :key="sIndex"
              >
                {{ val }}
              </text>
            </view>
          </view>
        </view>

        <view
          v-for="(item, index) in goods.sku_labels"
          :key="index"
          class="attr-list"
        >
          <text>{{ item.label }}</text>
          <view class="item-list">
            <text
              v-for="(childItem, childIndex) in item.options"
              :key="childIndex"
              class="tit"
              :class="{ selected: item.selected == childItem }"
              @click="selectSpec(childItem, item)"
            >
              {{ childItem }}
            </text>
          </view>
        </view>
        <button class="btn" @click="toggleSpec">完成</button>
      </view>
    </view>
  </view>
</template>

<script>
// import { isCollect } from '../../api/userapi'
// import coupons from '@/components/coupons'
import { mapState } from 'vuex'
import { deepEqual } from '../../utils/utils'

//#ifdef H5
import wx from 'weixin-js-sdk'
//#endif

export default {
  data() {
    return {
      showCouponMask: 0,
      specClass: 'none',
      specSelected: [],
      currentSku: {
        sku_name: '',
        price: '',
        cover: '',
        num: 0,
        id: 0
      },
      favorite: false,

      commentList: [],
      commentNum: 0,
      goodCommentNum: 0,
      goods: {},
      htmlString: '',
      activity: null,
      from_user_id: 0
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      hasLogin: (state) => state.user.hasLogin,
      company: (state) => state.company.company
    })
  },
  async onLoad(options) {
    //接收传值,id里面放的是标题，因为测试数据并没写id
    let id = options.id
    let goodsRes = await this.$api.goods.getGoodsDetail({ id })
    if (goodsRes.code == 'success') {
      var goods = goodsRes.data
      if (!goods.sku_labels) {
        goods.sku_labels = []
      }
      if (!goods.skus) {
        goods.skus = []
      }
      this.goods = Object.assign({}, goods)
      uni.setNavigationBarTitle({ title: goods.name + '-详情' })
    } else {
      uni.showToast({ title: goodsRes.msg })
      return
    }

    let from_user_id = parseInt(options.from_user)
    let nickname = options.nickname
    if (from_user_id && nickname) {
      this.from_user_id = from_user_id
      uni.showToast({ title: '来自用户' + nickname + '分享' })
    }

    //规格 默认选中第一条(如果有规格)
    if (this.goods.sku_labels) {
      this.goods.sku_labels.forEach((skuLabel, index) => {
        var val = skuLabel.options[0]
        this.selectSpec(val, skuLabel)
        this.goods.sku_labels[index].selected = val
      })
      this.specSelected = Object.assign({}, this.specSelected)
    }

    // let activityRes = await this.$api.activity.getActivityByGoodsId({
    //   goods_id: this.goods.id,
    //   com_id: this.goods.com_id
    // })
    // if (activityRes.code == 'success') {
    //   this.activity = activityRes.data
    // }

    //#ifdef H5
    if (this.clientType == 'wx_official') {
      this.setShareInfo()
    }
    //#endif

    // if (this.hasLogin) {
    //   let collectRes = await isCollect('goods', this.goods.id)
    //   if (collectRes.code == 'success') {
    //     this.favorite = collectRes.data
    //   }
    //   this.$api.user.addUserHistory({ type: 'goods', target_id: this.goods.id })
    // }
    this.htmlString = this.goods.body.replace(
      /<img/g,
      '<img style="width:100vw; height:auto;"'
    )
    console.log( this.htmlString, 'htmlString')
  },
  methods: {
    //#ifdef H5
    async setShareInfo() {
      var configRes = await this.$api.site.getWxConfig({
        url: window.location.href
      })
      if (configRes.code != 'success') {
        return
      }
      var config = configRes.data
      // console.log('set share info config',config)
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: config.app_id,
        timestamp: config.timestamp, // 生成签名的时间戳
        nonceStr: config.nonce_str, // 生成签名的随机串
        signature: config.signature, // 签名
        jsApiList: [
          'updateTimelineShareData',
          'updateAppMessageShareData',
          'onMenuShareAppMessage',
          'onMenuShareTimeline'
        ] // 需要使用的JS接口列表，所有JS接口列表见附录2
      })

      wx.ready(() => {
        var shareUrl =
          '/pages/product/product?id=' +
          this.goods.id +
          '&from_user=' +
          this.user.id +
          '&nickname=' +
          this.user.nickname
        if (window) {
          var location = window.location
          shareUrl =
            location.protocol +
            '//' +
            location.host +
            location.pathname +
            '#' +
            shareUrl
        }
        //updateShareMenu(this.goods.name, this.goods.desc, shareUrl, this.goods.small_cover)
        var title = this.goods.name
        if (this.company.name) {
          title = this.company.name + '-' + this.goods.name
        }
        wx.updateAppMessageShareData({
          title: title, // 分享标题
          desc: this.goods.desc, // 分享描述
          link: shareUrl, // 分享链接，该链接域名必须与当前企业的可信域名一致
          imgUrl: this.goods.small_cover // 分享图标
        })

        wx.updateTimelineShareData({
          title: title, // 分享标题
          link: shareUrl, // 分享链接，该链接域名必须与当前企业的可信域名一致
          imgUrl: this.goods.small_cover // 分享图
        })
      })

      wx.error(function(err) {
        console.log('err', err)
      })
    },
    //#endif

    //规格弹窗开关
    toggleSpec() {
      if (!this.goods.sku_labels || this.goods.sku_labels.length == 0) {
        return
      }
      if (this.specClass === 'show') {
        this.specClass = 'hide'
        setTimeout(() => {
          this.specClass = 'none'
        }, 250)
      } else if (this.specClass === 'none') {
        this.specClass = 'show'
      }
    },
    gotoCommentList() {
      uni.navigateTo({
        url: `/pages/comment/index?goods_id=` + this.goods.id
      })
    },
    //选择规格
    selectSpec(option, labelItem) {
      //console.log(option, labelItem)
      this.$set(labelItem, 'selected', option)
      /**
       * 修复选择规格存储错误
       * 将这几行代码替换即可
       * 选择的规格存放在specSelected中
       */
      this.specSelected[labelItem.label] = option
      var currentSku = null
      console.log(this.goods, '3333')
      this.goods.skus.forEach((sku) => {
        if (deepEqual(this.specSelected, sku.label_combine)) {
          currentSku = sku
        }
      })
      if (currentSku == null) {
        currentSku = {
          sku_id: 0,
          sku_name: '缺货中',
          num: 0,
          price: 9999999,
          real_price: 9999999
        }
      }
      this.currentSku = currentSku
    },
    //分享
    share() {
      this.$api.msg(`分享给请点击右上方的功能按钮,选择分享`)
      //this.$refs.share.toggleMask();
    },
    async addCartGoods() {
      if (!this.hasLogin) {
        this.$store.dispatch('user/checkLogin', this.com_id)
      }

      this.$store.dispatch('order/reset')
      var cartGoodsItem = this.buildCartGoods()
      if (!cartGoodsItem) {
        return
      }
      let res = await this.$api.goods.addCartGoods(cartGoodsItem)
      if (res.code == 'success') {
        uni.showToast({ title: '添加成功' })
        //uni.navigateTo({url: "/pages/cart/cart"})
      } else {
        uni.showToast({ title: '添加购物车失败' + res.msg })
      }
    },
    //收藏
    toFavorite() {
      if (!this.hasLogin) {
        this.$store.dispatch('user/checkLogin', this.com_id)
        return
      }

      let flag = !this.favorite
      if (flag) {
        this.$api.user.addUserCollection('goods', this.goods.id).then((res) => {
          if (res.code == 'success') {
            this.favorite = flag
          }
        })
      } else {
        this.$api.user.delUserCollection('goods', this.goods.id).then((res) => {
          if (res.code == 'success') {
            this.favorite = flag
          }
        })
      }
    },
    buy() {
      if (!this.hasLogin) {
        this.$store.dispatch('user/checkLogin', this.com_id)
        return
      }

      this.$store.dispatch('order/reset')
      var cartGoodsItem = this.buildCartGoods()
      console.log(cartGoodsItem, '222222')
      if (!cartGoodsItem) {
        return
      }
      this.$store.dispatch('order/preOrderByGoodsList', [cartGoodsItem])

      this.$store.dispatch('order/preOrderBygoodsType', this.goods.goods_type)
      uni.navigateTo({
        url: `/pages/order/createOrder?from_user=` + this.from_user_id
      })
    },
    buildCartGoods() {
      var cartGoodsItem = {
        goods_id: parseInt(this.goods.id),
        sku_id: this.currentSku.id,
        name: this.goods.name,
        price: parseFloat(this.goods.price),
        real_price: parseFloat(this.goods.real_price),
        cover: this.goods.small_cover,
        num: 1,
        goods_type: this.goods.goods_type,
        express_type: this.goods.express_type,
        id_cards: []
      }
      if (this.goods.sku_labels && this.goods.sku_labels.length > 0) {
        //有sku的商品
        if (this.currentSku.num == 0) {
          uni.showToast({ title: '该型号商品缺货中请选择其他型号' })
          return false
        }
        cartGoodsItem.sku_name = this.currentSku.sku_name
        cartGoodsItem.price = this.currentSku.price
        cartGoodsItem.real_price = this.currentSku.real_price
        cartGoodsItem.cover = this.currentSku.cover
        cartGoodsItem.label_combine = this.currentSku.label_combine
      }
      console.log(cartGoodsItem, '34567654345')
      return cartGoodsItem
    },
    stopPrevent() {}
  }
}
</script>

<style lang="scss">
page {
  background: $page-color-base;
  padding-bottom: 160upx;
}

.icon-you {
  font-size: $font-base + 2upx;
  color: #888;
}

.carousel {
  height: 722upx;
  position: relative;

  swiper {
    height: 100%;
  }

  .image-wrapper {
    width: 100%;
    height: 100%;
  }

  .swiper-item {
    display: flex;
    justify-content: center;
    align-content: center;
    height: 750upx;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }
  }
}

/* 标题简介 */
.introduce-section {
  background: #fff;
  padding: 20upx 30upx;

  .title {
    font-size: 32upx;
    color: $font-color-dark;
    height: 50upx;
    line-height: 50upx;
  }

  .price-box {
    display: flex;
    align-items: baseline;
    height: 64upx;
    padding: 10upx 0;
    font-size: 26upx;
    color: $uni-color-primary;
  }

  .coupon-tip {
    align-items: center;
    padding: 4upx 10upx;
    background: $uni-color-primary;
    font-size: $font-sm;
    color: #fff;
    border-radius: 6upx;
    line-height: 1;
    transform: translateY(-4upx);
  }

  .bot-row {
    display: flex;
    align-items: center;
    height: 50upx;
    font-size: $font-sm;
    color: $font-color-light;

    text {
      flex: 1;
    }
  }
}

.price {
  font-size: $font-lg + 2upx;
  color: $uni-color-primary;
  margin-bottom: 10upx;
  margin-right: 12upx;
}

.m-price {
  margin: 0 12upx;
  color: $font-color-light;
  text-decoration: line-through;
}

/* 分享 */
.share-section {
  display: flex;
  align-items: center;
  color: $font-color-base;
  background: linear-gradient(left, #fdf5f6, #fbebf6);
  padding: 12upx 30upx;

  .share-icon {
    display: flex;
    align-items: center;
    width: 70upx;
    height: 30upx;
    line-height: 1;
    border: 1px solid $uni-color-primary;
    border-radius: 4upx;
    position: relative;
    overflow: hidden;
    font-size: 22upx;
    color: $uni-color-primary;

    &:after {
      content: '';
      width: 50upx;
      height: 50upx;
      border-radius: 50%;
      left: -20upx;
      top: -12upx;
      position: absolute;
      background: $uni-color-primary;
    }
  }

  .icon-xingxing {
    position: relative;
    z-index: 1;
    font-size: 24upx;
    margin-left: 2upx;
    margin-right: 10upx;
    color: #fff;
    line-height: 1;
  }

  .tit {
    font-size: $font-base;
    margin-left: 10upx;
  }

  .icon-bangzhu1 {
    padding: 10upx;
    font-size: 30upx;
    line-height: 1;
  }

  .share-btn {
    flex: 1;
    text-align: right;
    font-size: $font-sm;
    color: $uni-color-primary;
  }

  .icon-you {
    font-size: $font-sm;
    margin-left: 4upx;
    color: $uni-color-primary;
  }
}

.c-list {
  font-size: $font-sm + 2upx;
  color: $font-color-base;
  background: #fff;

  .c-row {
    display: flex;
    align-items: center;
    padding: 20upx 30upx;
    position: relative;
  }

  .tit {
    width: 140upx;
  }

  .con {
    flex: 1;
    color: $font-color-dark;

    .selected-text {
      margin-right: 10upx;
    }
  }

  .bz-list {
    height: 40upx;
    font-size: $font-sm + 2upx;
    color: $font-color-dark;

    text {
      display: inline-block;
      margin-right: 30upx;
    }
  }

  .con-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    color: $font-color-dark;
    line-height: 40upx;
  }

  .red {
    color: $uni-color-primary;
  }
}

/* 评价 */
.eva-section {
  display: flex;
  flex-direction: column;
  padding: 20upx 30upx;
  background: #fff;
  margin-top: 16upx;

  .e-header {
    display: flex;
    align-items: center;
    height: 70upx;
    font-size: $font-sm + 2upx;
    color: $font-color-light;

    .tit {
      font-size: $font-base + 2upx;
      color: $font-color-dark;
      margin-right: 4upx;
    }

    .tip {
      flex: 1;
      text-align: right;
    }

    .icon-you {
      margin-left: 10upx;
    }
  }
}

.eva-box {
  display: flex;
  padding: 20upx 0;

  .portrait {
    flex-shrink: 0;
    width: 80upx;
    height: 80upx;
    border-radius: 100px;
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: $font-base;
    color: $font-color-base;
    padding-left: 26upx;

    .con {
      font-size: $font-base;
      color: $font-color-dark;
      padding: 20upx 0;
    }

    .bot {
      display: flex;
      justify-content: space-between;
      font-size: $font-sm;
      color: $font-color-light;
    }
  }
}

/*  详情 */
.detail-desc {
  background: #fff;
  margin-top: 16upx;
  padding: 0 5px;

  .d-header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80upx;
    font-size: $font-base + 2upx;
    color: $font-color-dark;
    position: relative;

    text {
      padding: 0 20upx;
      background: #fff;
      position: relative;
      z-index: 1;
    }

    &:after {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%);
      width: 300upx;
      height: 0;
      content: '';
      border-bottom: 1px solid #ccc;
    }
  }

  .detail-desc-content {
    width: 100ww;
    p {
      font-size: 24px;
    }
    img {
      width: 100%;
      height: auto;
    }
  }
}

/* 规格选择弹窗 */
.attr-content {
  padding: 10upx 30upx;

  .a-t {
    display: flex;

    image {
      width: 170upx;
      height: 170upx;
      flex-shrink: 0;
      margin-top: -40upx;
      border-radius: 8upx;
    }

    .right {
      display: flex;
      flex-direction: column;
      padding-left: 24upx;
      font-size: $font-sm + 2upx;
      color: $font-color-base;
      line-height: 42upx;

      .selected-text {
        margin-right: 10upx;
      }
    }
  }

  .attr-list {
    display: flex;
    flex-direction: column;
    font-size: $font-base + 2upx;
    color: $font-color-base;
    padding-top: 30upx;
    padding-left: 10upx;
  }

  .item-list {
    padding: 20upx 0 0;
    display: flex;
    flex-wrap: wrap;

    text {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eee;
      margin-right: 20upx;
      margin-bottom: 20upx;
      border-radius: 100upx;
      min-width: 60upx;
      height: 60upx;
      padding: 0 20upx;
      font-size: $font-base;
      color: $font-color-dark;
    }

    .selected {
      background: #fbebee;
      color: $uni-color-primary;
    }
  }
}

/*  弹出层 */
.popup {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99;

  &.show {
    display: block;

    .mask {
      animation: showPopup 0.2s linear both;
    }

    .layer {
      animation: showLayer 0.2s linear both;
    }
  }

  &.hide {
    .mask {
      animation: hidePopup 0.2s linear both;
    }

    .layer {
      animation: hideLayer 0.2s linear both;
    }
  }

  &.none {
    display: none;
  }

  .mask {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .layer {
    position: fixed;
    z-index: 99;
    bottom: 0;
    width: 100%;
    min-height: 40vh;
    border-radius: 10upx 10upx 0 0;
    background-color: #fff;

    .btn {
      height: 66upx;
      line-height: 66upx;
      border-radius: 100upx;
      background: $uni-color-primary;
      font-size: $font-base + 2upx;
      color: #fff;
      margin: 30upx auto 20upx;
    }
  }

  @keyframes showPopup {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes hidePopup {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes showLayer {
    0% {
      transform: translateY(120%);
    }
    100% {
      transform: translateY(0%);
    }
  }
  @keyframes hideLayer {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(120%);
    }
  }
}

/* 底部操作菜单 */
.page-bottom {
  display: flex;
  justify-content: space-between;
  position: fixed;
  left: 30upx;
  bottom: 30upx;
  z-index: 95;

  align-items: center;
  width: 690upx;
  height: 100upx;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
  border-radius: 16upx;

  .p-b-btn {
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: $font-sm;
    color: $font-color-base;
    width: 96upx;
    height: 80upx;
    line-height: 80upx;
    margin-left: 20upx;
    .yticon {
      font-size: 30upx;
      line-height: 48upx;
      color: $font-color-light;
    }

    &.active,
    &.active .yticon {
      color: $uni-color-primary;
    }

    .icon-fenxiang2 {
      font-size: 42upx;
      transform: translateY(-2upx);
    }

    .icon-shoucang {
      font-size: 46upx;
    }
  }

  .action-btn-group {
    width: 200upx;
    height: 76upx;
    border-radius: 100px;
    overflow: hidden;
    box-shadow: 0 20upx 40upx -16upx #fa436a;
    box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
    background: linear-gradient(to right, #ffac30, #fa436a, #f56c6c);
    margin-left: 20upx;
    position: relative;
    margin-right: 10px;

    &:after {
      content: '';
      position: absolute;
      top: 50%;
      right: 50%;
      transform: translateY(-50%);
      height: 28upx;
      width: 0;
      border-right: 1px solid rgba(255, 255, 255, 0.5);
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 180upx;
      height: 100%;
      font-size: $font-base;
      padding: 0;
      border-radius: 0;
      background: transparent;
    }
  }
}
</style>
