<template>
<u-popup
 
    v-model="value" 
    :maskCloseAble="maskCloseAble"
    @close="close"
    mode="center"
>
    <view class="popup">
      <view class="title">扫码</view>
      <image src="/static/test.png"></image>
    </view>
  </u-popup>
</template>
<script >

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
  onload() {

  },
  methods: {
     open(reasonDesc) {
      this.props.value=true
    },
		close() {
				this.$emit('input', false);
			},
  }
}
</script>
<style lang='scss'>

</style>

