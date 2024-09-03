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
    <view class="img">
      <view v-for="item in data.covers" :key="index" class="img-item">
        <img :src="item" alt="" />
      </view>
    </view>
    <commodityList :goodsList="goodsList"></commodityList>
  </view>
</template>
<script>
import commodityList from '@/components/commodityList.vue'
import audioManager from './utils/audio.js'

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
    this.data = JSON.parse(options.item)
    this.goodsList = this.data.goods_ids
  },
  methods: {
    bjMusicClick() {
      if (this.musicShow) {
        console.log('播放')

        audioManager.AudioPlay(this.data.voice_url)
      } else {
        console.log('暂停')

        audioManager.audioStop()
      }
      this.musicShow = !this.musicShow
    }
  },
  beforeDestroy() {
    // 在页面关闭时停止音乐播放
    audioManager.audioStop()
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
.img {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  .img-item {
    flex: 0 0 calc((100% - 10px) / 2);
    height: 120px;
    margin: 0 5px 5px 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .item:nth-child(2n) {
    margin-right: 0;
  }
}
</style>
