<template>
  <view class="wrap">
    <view class="title">
      {{ data.name }}
    </view>
    <view class="language">
      <u-icon
        name="volume-off"
        style="color: #48648c;font-size: 14px;margin-right:5px ;"
        size="28"
        v-if="musicShow"
        @click="bjMusicClick"
      ></u-icon>
      <u-icon
        v-else
        name="volume"
        style="color: #48648c;font-size: 14px;margin-right:5px ;"
        size="28"
        @click="bjMusicClick"
      ></u-icon>

      <view class="text" @click="bjMusicClick"> 语言播报</view>
    </view>
    <view class="info">
      {{ data.info }}
    </view>
    <commodityList :goodsList="goodsList"></commodityList>
  </view>
</template>
<script>
import commodityList from '@/components/commodityList.vue'
export default {
  components: {
    commodityList
  },
  data() {
    return {
      goodsList: [],
      data: [],
      musicShow: true
    }
  },
  async onLoad(options) {
    console.log(JSON.parse(options.item), 'options')
    this.data = JSON.parse(options.item)
    this.goodsList = this.data.goods_ids
    console.log(this.goodsList, 'this.goodsList')
  },
  methods: {
    bjMusicClick() {
      if (this.musicShow) {
        console.log('播放')
        this.innerAudioContext = uni.createInnerAudioContext()
        this.innerAudioContext.src = this.data.voice_url //必须放在 static下
        const timout = setTimeout(() => {
          clearTimeout(timout)
          this.innerAudioContext.play()
        }, 500)
      } else {
        console.log('暂停')
        this.innerAudioContext.pause()
      }
      this.musicShow = !this.musicShow
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100vw;
  /* padding: 20px; */
}
.title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 16px;
  color: #383838;
  line-height: 19px;
  text-align: center;
  margin: 20px;
}
.info {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #454545;
  line-height: 14px;
  margin-left: 20px;
  margin-right: 20px;

  margin-bottom: 20px;
}
.language {
  width: 680rpx;
  text-align: right;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  line-height: 16px;
  margin-bottom: 10px;
  .text {
    color: #333333;
    font-size: 12px;
    display: inline-block;
  }
}
</style>
