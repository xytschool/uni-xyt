<template>
  <u-popup
    v-model="value"
    :maskCloseAble="maskCloseAble"
    @close="close"
    mode="center"
  >
    <view class="popup">
      <!-- <view class="title">扫码</view> -->
      <!-- <image src="/static/test.png"></image> -->
      <tki-qrcode
        cid="qrcode1"
        ref="qrcode"
        :val="val"
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
      />
    </view>
  </u-popup>
</template>
<script>
import tkiQrcode from 'tki-qrcode'
export default {
  props: {
    // 通过双向绑定控制组件的弹出与收起
    value: {
      type: Boolean,
      default: false
    },
    // 是否允许通过点击遮罩关闭Picker
    maskCloseAble: {
      type: Boolean,
      default: true
    },
 
  },
  components: {
    tkiQrcode
  },
  data() {
    return {
      id: '',
      val: '记得要忘记', // 要生成的二维码值
      size: 300, // 二维码大小
      unit: 'rpx', // 单位
      background: '#b4e9e2', // 背景色
      foreground: '#309286', // 前景色
      pdground: '#32dbc6', // 角标色
      // icon: '', // 二维码图标
      // iconsize: 40, // 二维码图标大小
      // lv: 3 // 二维码容错级别 ， 一般不用设置，默认就行
      onval: true, // val值变化时自动重新生成二维码
      loadMake: true // 组件加载完成后自动生成二维码
    }
  },
  onLoad() {
    console.log(3456)
   
  },
  methods: {
    // open (reasonDesc) {
    //   console.log(345)
    //   this.props.value = true
    //
    // },
    close() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss"></style>
