<template>
  <view class="container">
    <view class="notice-content">
      <view class="notice-title">{{ noticeDetail.title }}</view>
      <!-- <view class="notice-time">{{ noticeDetail.create_time }}</view> -->
      <view class="notice-body" v-html="noticeDetail.content"></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      noticeDetail: {
        title: '',
        content: '',
        create_time: ''
      }
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
      this.getNoticeDetail()
    }
  },
  methods: {
    async getNoticeDetail() {
      try {
        const res = await this.$api.publicData.NoticesDetails(this.id)
        if (res.code === 'success' && res.data) {
          this.noticeDetail = res.data
        } else {
          uni.showToast({
            title: '获取通知详情失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('获取通知详情失败:', error)
        uni.showToast({
          title: '获取通知详情失败',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
  background: #fff;
  min-height: 100vh;
}

.notice-content {
  .notice-title {
    font-size: 42rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    text-align: center;
  }

  .notice-body {
    font-size: 28rpx;
    color: #666;
    line-height: 40rpx;
  }
}
</style>
