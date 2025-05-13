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
          v-if="goods.goods_skus.length > 0"
          type="primary"
          class=" action-btn no-border buy-now-btn"
          @click="openCalendar"
        >
          立即预约
        </button>
        <button
          v-else
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

    <!-- 日历弹窗 -->
    <u-popup v-model="showCalendar" mode="center">
      <view class="calendar-popup u-calendar">
        <view class="u-calendar__header">选择预约日期</view>
        <view class="u-calendar__week">
          <text
            v-for="w in ['日', '一', '二', '三', '四', '五', '六']"
            :key="w"
            class="u-calendar__week-item"
            >{{ w }}</text
          >
        </view>
        <view class="calendar-grid u-calendar__body">
          <view
            v-for="empty in firstDayOfWeek"
            :key="'empty' + empty"
            class="calendar-cell u-calendar__cell u-calendar__cell--empty"
          ></view>
          <view
            v-for="day in calendarDays"
            :key="day.date"
            class="calendar-cell u-calendar__cell"
            :class="{
              'u-calendar__cell--selected': day.date === selectedDate,
              'u-calendar__cell--disabled': !day.price
            }"
            @click="onDateClick(day)"
          >
            <text>{{ day.day }}</text>
            <text v-if="day.price" class="calendar-price"
              >¥{{ day.price }}</text
            >
          </view>
        </view>
        <view class="u-calendar__footer">
          <button class="u-calendar__btn " @click="showCalendar = false">
            取消
          </button>
        </view>
      </view>
    </u-popup>

    <!-- 时间段弹窗 -->
    <u-popup v-model="showTimeRangePopup" mode="center">
      <view class="timerange-popup">
        <view class="timerange-header">选择时间段</view>
        <scroll-view scroll-y class="timerange-scroll">
          <view
            v-for="tr in availableTimeRanges"
            :key="tr.sku_id"
            class="timerange-item"
            :class="{
              selected:
                selectedTimeRange && selectedTimeRange.sku_id === tr.sku_id
            }"
            @click="onTimeRangeSelect(tr)"
          >
            <text class="timerange-time"
              >{{ tr.time_range_start }} - {{ tr.time_range_end }}</text
            >
            <text class="timerange-price">¥{{ tr.real_price }}</text>
          </view>
        </scroll-view>
        <view class="timerange-footer">
          <span class="timerange-close" @click="showTimeRangePopup = false">
            取消
          </span>
        </view>
      </view>
    </u-popup>

    <!-- 底部确认栏 -->
    <view v-if="confirmInfo" class="confirm-bar">
      <span>已选：</span>
      <text
        >{{ confirmInfo.date }} {{ confirmInfo.timeRange }} ¥{{
          confirmInfo.price
        }}</text
      >
      <button @click="buy">确认预约</button>
    </view>
  </view>
</template>

<script>
// import { isCollect } from '../../api/userapi'
// import coupons from '@/components/coupons'
import { mapState } from 'vuex'
import { deepEqual } from '../../utils/utils'
import uCalendar from 'uview-ui/components/u-calendar/u-calendar'

//#ifdef H5
import wx from 'weixin-js-sdk'
//#endif

export default {
  components: {
    uCalendar
  },
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
      from_user_id: 0,
      show: false,
      mode: 'single',
      markDate: [],
      disabledDates: [],
      selectedDate: '',
      dateRange: [],
      showTimePicker: false,
      timeRange: [0, 0],
      hours: Array.from({ length: 24 }, (_, i) => i),
      selectedTimeRange: null,
      showCalendar: false,
      showTimeRangePopup: false,
      datePriceMap: {},
      dateTimeRangeMap: {},
      calendarDays: [],
      availableTimeRanges: [],
      confirmInfo: null,
      firstDayOfWeek: 0
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      hasLogin: (state) => state.user.hasLogin,
      company: (state) => state.company.company
    }),
    maxDate() {
      if (
        !this.goods ||
        !this.goods.goods_skus ||
        !this.goods.goods_skus.length
      ) {
        return null
      }

      // 获取当前日期
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // 获取所有有效的日期
      const validDates = this.goods.goods_skus
        .map((sku) => {
          if (!sku.effect_date) return null
          const date = new Date(sku.effect_date)
          if (isNaN(date.getTime())) return null
          return date
        })
        .filter((date) => date !== null)

      if (validDates.length === 0) {
        return null
      }

      // 找出最大日期
      const maxTimestamp = Math.max(...validDates.map((date) => date.getTime()))
      const maxDate = new Date(maxTimestamp)

      // 确保最大日期不小于今天
      const finalDate = maxTimestamp > today ? maxDate : today

      // 格式化为 YYYY-MM-DD
      const year = finalDate.getFullYear()
      const month = String(finalDate.getMonth() + 1).padStart(2, '0')
      const day = String(finalDate.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    }
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
    console.log(this.htmlString, 'htmlString')

    // 处理日历数据
    this.preprocessSkus()
    this.generateCalendarDays()
  },
  methods: {
    change(e) {
      console.log('日期变化:', e)
      this.selectedDate = e.result
      this.showTimePicker = true
    },
    confirm(e) {
      console.log('确认选择:', e)
      this.dateRange = e.result
      this.show = false
    },
    close() {
      this.show = false
    },
    openCalendar() {
      this.showCalendar = true
    },
    onTimeRangeChange(e) {
      this.timeRange = e.detail.value
    },
    confirmTimeRange() {
      const startHour = this.hours[this.timeRange[0]]
      const endHour = this.hours[this.timeRange[1]]

      if (startHour >= endHour) {
        uni.showToast({
          title: '结束时间必须大于开始时间',
          icon: 'none'
        })
        return
      }

      this.selectedTimeRange = {
        start: `${startHour}:00`,
        end: `${endHour}:00`
      }

      // 这里可以处理预约逻辑
      console.log('选择的日期:', this.selectedDate)
      console.log('选择的时间范围:', this.selectedTimeRange)

      this.showTimePicker = false
      // 可以在这里调用预约API
    },
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

      if (!cartGoodsItem) {
        return
      }
      this.$store.dispatch('order/preOrderByGoodsList', [cartGoodsItem])

      this.$store.dispatch('order/preOrderBygoodsType', this.goods.goods_type)

      uni.navigateTo({
        url: `/pages/order/createOrder?from_user=${this.from_user_id}`
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
        need_id_card: this.goods.infos.limit.need_id_card,
        id_cards: []
      }

      if (this.goods.goods_skus.length > 0) {
        cartGoodsItem.sku_id = this.confirmInfo.sku_id
        cartGoodsItem.sku_name = this.confirmInfo.sku_name
        cartGoodsItem.real_price = parseFloat(this.confirmInfo.price)
        cartGoodsItem.price = parseFloat(this.confirmInfo.price)
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
    stopPrevent() {},

    // 禁用日期
    disabledDate(date) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date < today
    },
    preprocessSkus() {
      this.datePriceMap = {}
      this.dateTimeRangeMap = {}
      ;(this.goods.goods_skus || []).forEach((sku) => {
        const date = sku.effect_date
        // 价格只取最低价
        if (
          !this.datePriceMap[date] ||
          sku.real_price < this.datePriceMap[date]
        ) {
          this.datePriceMap[date] = sku.real_price
        }
        if (!this.dateTimeRangeMap[date]) this.dateTimeRangeMap[date] = []
        this.dateTimeRangeMap[date].push({
          start: sku.time_range_start,
          end: sku.time_range_end,
          sku_id: sku.id,
          ...sku
        })
      })
    },
    generateCalendarDays() {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const days = []
      this.firstDayOfWeek = firstDay.getDay()
      for (let d = 1; d <= lastDay.getDate(); d++) {
        const dateStr = `${year}-${(month + 1)
          .toString()
          .padStart(2, '0')}-${d.toString().padStart(2, '0')}`
        days.push({
          date: dateStr,
          day: d,
          price: this.datePriceMap[dateStr] || null
        })
      }
      this.calendarDays = days
    },
    onDateClick(day) {
      if (!day.price) return
      this.selectedDate = day.date
      this.availableTimeRanges = this.dateTimeRangeMap[day.date] || []
      this.showCalendar = false
      this.showTimeRangePopup = true
      this.selectedTimeRange = null
    },
    onTimeRangeSelect(tr) {
      this.selectedTimeRange = tr
      this.showTimeRangePopup = false
      this.confirmInfo = {
        date: this.selectedDate,
        timeRange: `${tr.time_range_start
          .split(':')
          .slice(0, 2)
          .join(':')} - ${tr.time_range_end
          .split(':')
          .slice(0, 2)
          .join(':')}`,
        price: tr.real_price,
        sku_id: tr.sku_id,
        sku_name: tr.name
      }
    }
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

/* 日历样式 */
.u-calendar {
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;

  .u-calendar__header {
    padding: 20rpx;
    text-align: center;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .u-calendar__body {
    padding: 20rpx;

    .u-calendar__row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;

      .u-calendar__cell {
        flex: 1;
        text-align: center;
        padding: 10rpx;

        &.u-calendar__cell--selected {
          background-color: #fa436a;
          color: #fff;
          border-radius: 8rpx;
        }

        &.u-calendar__cell--disabled {
          color: #ccc;
        }
      }
    }
  }

  .u-calendar__footer {
    padding: 20rpx;
    display: flex;
    justify-content: space-between;

    .u-calendar__btn {
      border-radius: 8rpx;
      font-size: 28rpx;
    }
  }
}

.time-picker {
  background-color: #fff;
  padding: 20rpx;

  .time-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1px solid #eee;

    .close {
      color: #666;
      font-size: 28rpx;
    }
  }

  .time-picker-content {
    height: 400rpx;

    .time-picker-view {
      width: 100%;
      height: 100%;
    }

    .time-item {
      line-height: 80rpx;
      text-align: center;
    }
  }

  .time-picker-footer {
    padding: 20rpx 0;

    .confirm-btn {
      background: #fa436a;
      color: #fff;
      border-radius: 40rpx;
      font-size: 28rpx;
    }
  }
}

.calendar-popup {
  background-color: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
  min-width: 650rpx;
  overflow: hidden;
}
.u-calendar__header {
  padding: 32rpx 0 16rpx 0;
  text-align: center;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  border-bottom: 1rpx solid #f2f2f2;
}
.u-calendar__week {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 0 0 0;
  color: #999;
  font-size: 26rpx;
}
.u-calendar__week-item {
  flex: 1;
  text-align: center;
}
.u-calendar__body {
  display: flex;
  flex-wrap: wrap;
  min-height: 420rpx;
  padding: 0 0 16rpx 0;
}
.calendar-cell {
  width: 14.28%;
  text-align: center;
  margin-bottom: 10rpx;
  padding: 18rpx 0 8rpx 0;
  border-radius: 12rpx;
  background: #fff;
  margin-right: 0;
  font-size: 30rpx;
  position: relative;
  transition: background 0.2s;
}
.u-calendar__cell--selected {
  background: #fa436a;
  color: #fff;
}
.u-calendar__cell--disabled {
  color: #ccc;
  background: #f5f5f5;
}
.u-calendar__cell--empty {
  background: transparent;
}
.calendar-price {
  display: block;
  color: #fa436a;
  font-size: 22rpx;
  margin-top: 2rpx;
}
.u-calendar__cell--selected .calendar-price {
  color: #fff;
}
.u-calendar__footer {
  padding: 24rpx 0 24rpx 0;
  display: flex;
  justify-content: flex-end;
}
.u-calendar__btn {
  background: #fff;
  color: #666;
  margin-left: 16rpx;
}

// 时间段弹窗
.timerange-popup {
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
  min-width: 600rpx;
  min-height: 400rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.timerange-header {
  font-size: 32rpx;
  font-weight: bold;
  padding: 32rpx 0 16rpx 0;
  text-align: center;
  border-bottom: 1rpx solid #f2f2f2;
}
.timerange-scroll {
  flex: 1;
  max-height: 400rpx;
  overflow-y: auto;
  padding: 0 0 0 0;
}
.timerange-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 40rpx;
  font-size: 30rpx;
  border-bottom: 1rpx solid #f2f2f2;
  cursor: pointer;
  transition: background 0.2s;
}
.timerange-item.selected,
.timerange-item:active {
  background: #fa436a;
  color: #fff;
}
.timerange-time {
  font-weight: 500;
}
.timerange-price {
  color: #fa436a;
  font-size: 28rpx;
  margin-left: 16rpx;
}
.timerange-footer {
  padding: 24rpx 0 24rpx 0;
  display: flex;
  justify-content: space-around;
}
.timerange-close {
  border-radius: 8rpx;
  font-size: 28rpx;
  border: 1rpx solid #fa436a;
  background: #fff;
  color: #fa436a;
  width: 50px;
  height: 30px;
  text-align: center;
  line-height: 30px;
}
.confirm-bar {
  position: fixed;
  left: 30upx;
  bottom: 30upx;
  z-index: 95;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 690upx;
  height: 100upx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
  border-radius: 16upx;
  padding: 0 20upx;
  span {
    font-size: 26rpx;
  }
  text {
    font-size: $font-sm;
    color: $font-color-base;
  }

  button {
    width: 200upx;
    height: 76upx;
    border-radius: 100px;
    overflow: hidden;
    box-shadow: 0 20upx 40upx -16upx #fa436a;
    box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
    background: linear-gradient(to right, #ffac30, #fa436a, #f56c6c);
    font-size: $font-base;
    color: #fff;
    border: none;
    margin-left: 20upx;
  }
}
</style>
