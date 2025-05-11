<template>
  <view class="wrap">
    <rich-text :nodes="noticeContent" class="rich-text"></rich-text>
  </view>
</template>
<script>
import { dataMallZoneUrl } from '@/config'

export default {
  data() {
    return {
      dataMallZoneUrl: 'https://data.seekstarry.com',
      notice: '',
      noticeContent: '',
 
    }
  },
  onLoad(params) {

    if (params.notice) {
      this.notice = decodeURIComponent(params.notice)
      // 处理 HTML 内容，确保图片路径正确并添加样式
      let processedContent = this.notice
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
<style lang="scss">
.wrap {
  width: 750rpx;
  padding: 26rpx;

  /deep/ .rich-text {
    width: 698rpx;

    img {
      width: 698rpx !important;
      height: auto !important;
    }
  }
}
</style>
