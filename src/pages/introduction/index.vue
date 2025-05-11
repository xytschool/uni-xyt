<template>
  <view class="wrap">
    <rich-text :nodes="noticeContent" class="rich-text"></rich-text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      dataMallZoneUrl: 'https://data.seekstarry.com',
      introduction: '',
      noticeContent: ''
    }
  },
  onLoad(params) {
    if (params.introduction) {
      this.introduction = decodeURIComponent(params.introduction)
      // 处理 HTML 内容，确保图片路径正确并添加样式
      let processedContent = this.introduction
        .replace(
          /src="https:\/\/data\.seekstarry\.com/g,
          `src="${this.dataMallZoneUrl}`
        )
        // 将每个img标签包装在一个div容器中
        .replace(
          /<img([^>]*)>/g,
          '<div style="width:100%;max-width:698rpx;margin:0 auto;"><img$1 style="width:100%;display:block;"></div>'
        )

      this.noticeContent = processedContent
      console.log(this.noticeContent, 'noticeContent')
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  background: #fff;
  // width: 100vh;
  height: 100vh;
  padding: 20rpx;
}
.title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 40rpx;
  color: #333333;
  margin-bottom: 20rpx;
  margin-top: 20rpx;
}
.headDiagram {
  margin-top: 20rpx;
  width: 100%;
}
.content {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #999999;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}
.introduce {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.introduce-item {
  width: 48%;
  margin-right: 26rpx;
  image {
    width: 100%;
    height: 480rpx;
    object-fit: contain;
  }
}
.introduce-item:nth-child(2n) {
  margin-right: 0rpx;
}
</style>
