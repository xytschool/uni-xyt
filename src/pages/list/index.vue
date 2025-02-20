<template>
  <view class="guess-section">
    <view v-if="goodsList.length > 0" class="guess-warp">
      <view
        v-for="(item, index) in goodsList"
        :key="index"
        class="guess-item"
        @click="navToDetailPage(item)"
      >
        <view class="image-wrapper">
          <image :src="item.small_cover" mode="aspectFill"></image>
        </view>
        <text class="title clamp">{{ item.name }}</text>
        <text class="price"> ￥ {{ item.real_price | numberToCurrency }}</text>
      </view>
    </view>
    <view v-else class="noData">
      <img src="../../static/noData.png" alt="" class="noDataImg" />
      <view class="noDataText">
        暂无商品
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      goodsList: []
    }
  },
  onLoad() {
    this.loadData()
  },
  methods: {
    async loadData() {
      let goodsRes = await this.$api.goods.getGoodsList()
      if (goodsRes.code == 'success') {
        console.log(goodsRes.data, 'goodsRes.data')
        this.goodsList = goodsRes.data || []
        console.log(this.goodsList, '  this.goodsList')
      }
    },
    //详情页
    navToDetailPage(item) {
      let id = item.id
      if (item.href) {
        uni.navigateTo({ url: item.href })
      } else {
        uni.navigateTo({
          url: `/pages/product/product?id=${id}`
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/* 猜你喜欢 */
.guess-section {
  .guess-warp {
    display: flex;
    flex-wrap: wrap;
    margin: 30rpx;

    padding: 0 30upx;
    background: #fff;
  }
  .guess-item {
    display: flex;
    flex-direction: column;
    width: 48%;
    padding-bottom: 40upx;

    &:nth-child(2n + 1) {
      margin-right: 4%;
    }
  }

  .image-wrapper {
    width: 100%;
    height: 330upx;
    border-radius: 3px;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
      opacity: 1;
    }
  }

  .title {
    font-size: $font-lg;
    color: $font-color-dark;
    line-height: 80upx;
  }

  .price {
    font-size: $font-lg;
    color: $uni-color-primary;
    line-height: 1;
  }
}
.noData {
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .noDataImg {
    width: 236rpx;
    height: 236rpx;
  }
  .noDataText {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 36rpx;
    color: #999999;
    margin-top: 48rpx;
  }
}
</style>
