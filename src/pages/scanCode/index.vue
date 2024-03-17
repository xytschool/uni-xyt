<template>
<!-- <view>
  扫码功能

  <image
  class="test"  
  src="/static/test.png" @longpress="longPressImage"></image>

</view> -->
</template>
<script >

export default {
  methods: {
    longPressImage() {
      console.log('longpress')
      uni.saveImageToPhotosAlbum({
        filePath: '/static/test.png',
        success: () => {
          uni.scanCode({
            success: (res) => {
              console.log(res.result); // 打印扫描结果
              // 这里可以根据扫描结果进行相应的操作
            },
            fail: (err) => {
              console.log(err);
            }
          });
        },
        fail: (err) => {
          console.log(err);
        }
      });
    }
  }
}
</script>
<style lang='scss'>
.test{
width: 600rpx;


}
</style>

