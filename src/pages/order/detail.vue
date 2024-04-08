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
      <view class="yt-list-cell b-b">
        <text class="cell-tit clamp">二维码：</text>
      </view>
      <view v-for="(item, index) in dataList.tickets" class="tickets">
        <view class="tickets-item">
          姓名：<text>{{ item.username }}</text>
        </view>
        <view class="tickets-item">
          身份证号：<text>
            {{ item.code.replace(/^(.{8})(?:\d+)(.{4})$/, '$1******$2') }}</text
          >
        </view>

        <tki-qrcode
          v-if="item.status == 'normal'"
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
        <view v-else class="tickets-item">
          使用时间：<text>{{ item.used_at | transformTimestamp }}</text>
        </view>
      </view>
    </view>
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
      loadMake: true // 组件加载完成后自动生成二维码
    }
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
      const { data } = await getOrderDetail({ order_no: this.order_no })
      this.dataList = data
      uni.hideLoading()
    }
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
</style>
