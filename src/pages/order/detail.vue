<template>
  <view>
    <view class="yt-list">
      <view class="yt-list-cell b-b">
        <text class="cell-tit clamp">订单号：</text>
        <text class="cell-tip"> {{ dataList.order_no }}</text>
      </view>
      <view class="yt-list-cell b-b">
        <text class="cell-tit clamp">付款时间：</text>
        <text class="cell-tip">
          {{ dataList.paid_at | transformTimestamp }}</text
        >
      </view>
      <view v-if="dataList.pay_status != 'torefund'">
        <view class="yt-list-cell b-b">
          <text class="cell-tit clamp">二维码：</text>
        </view>

        <view v-for="(item, index) in dataList.tickets" class="tickets">
          <!--        <view class="tickets-item">-->
          <!--          姓名：<text>{{ item.username }}</text>-->
          <!--        </view>-->
          <!--        <view class="tickets-item">-->
          <!--          身份证号：<text>-->
          <!--            {{ item.id_card.replace(/^(.{8})(?:\d+)(.{4})$/, '$1******$2') }}</text-->
          <!--          >-->
          <!--        </view>-->
          <view class="tickets-item" style="margin-bottom: 15px">
            票名：<text>{{ item.name }}</text> x
            <text>{{ item.number }}张</text>
          </view>

          <view>
            <tki-qrcode
              cid="qrcode1"
              ref="qrcode"
              :val="item.code"
              :size="size"
              :unit="unit"
              :icon="icon"
              :iconSize="iconsize"
              :lv="lv"
              :onval="onval"
              :loadMake="loadMake"
              :usingComponents="true"
              :showLoading="false"
              @result="qrR"
              class="qrcode"
            />
          </view>

          <view v-if="item.logs" class="tickets-item">
            <view style="margin-bottom: 10px">使用记录：</view>
            <text>{{ item.logs }}</text>
          </view>
        </view>
      </view>
      <view v-else class="noData">
        该订单正在退款中
      </view>
    </view>
    <ad-custom
      unit-id="adunit-8071496ede66bfe8"
      bindload="adLoad"
      binderror="adError"
      bindclose="adClose"
    ></ad-custom>
  </view>
</template>
<script>
import { getOrderDetail } from '../../api/order'
import tkiQrcode from 'tki-qrcode'

export default {
  components: {
    tkiQrcode
  },

  data() {
    return {
      order_no: '',
      dataList: [],
      size: 150, // 二维码大小
      unit: 'rpx', // 单位
      background: '#b4e9e2', // 背景色
      foreground: '#309286', // 前景色
      pdground: '#32dbc6', // 角标色
      onval: true, // val值变化时自动重新生成二维码
      loadMake: true, // 组件加载完成后自动生成二维码
      num: 0, // 计数器，初始为0
      timer: null // 定时器
    }
  },
  created() {
    this.timer = setInterval(this.loadData, 10000)
  },
  onLoad(options) {
    uni.showLoading({
      title: '加载中'
    })
    this.order_no = options.order_no
    this.loadData()
  },
  methods: {
    async loadData() {
      console.log(22222)
      if (this.num < 100) {
        const { data } = await getOrderDetail({ order_no: this.order_no })
        this.dataList = data
        uni.hideLoading()
        this.num++
      } else {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    stop() {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  destroyed() {
    //离开页面是销毁
    clearInterval(this.timer)
    this.timer = null
  }
}
</script>

<style lang="scss" scoped>
page {
  padding-bottom: 100upx;
  background: $page-color-base;
}
.content {
  margin-top: 16upx;
  background: #fff;
}
.yt-list {
  height: 100vh;
}
.yt-list-cell {
  display: flex;
  align-items: center;
  padding: 10upx 30upx 10upx 40upx;
  line-height: 70upx;
  position: relative;
  &.b-b {
    left: 30upx;
  }
  .cell-tit {
    font-size: 26upx;
    color: $font-color-light;
    margin-right: 10upx;
  }

  .cell-tip {
    flex: 1;
    font-size: 26upx;
    color: $font-color-dark;
  }
}
.tickets {
  margin: 24rpx auto 0 auto;
  width: 349px;

  background: #ffffff;
  border-radius: 12px 12px 12px 12px;
  padding: 46rpx;
  .tickets-item {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 28rpx;
    color: #2c2c2c;
    line-height: 33rpx;
    letter-spacing: 3px;
    margin-bottom: 18rpx;
  }
  text {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #2c2c2c;
    line-height: 28rpx;
  }
  .qrcode {
    text-align: center;
  }
}
.noData {
  font-size: 16px;
  text-align: center;
  padding: 30px 0;
}
</style>
