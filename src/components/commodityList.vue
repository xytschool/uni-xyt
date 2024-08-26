<template>
  <view>
    <view class="guess-section">
      <view
        v-for="(item, index) in goodsList"
        :key="index"
        class="guess-item"
        @click="navToDetailPage(item)"
      >
        <view class="image-wrapper">
          <image :src="item.small_cover" mode="aspectFill"></image>
        </view>
        <text class="titles clamp">{{ item.name }}</text>
        <text class="price"> ￥ {{ item.real_price | numberToCurrency }}</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    goodsList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    //详情页
    navToDetailPage(item) {
      let id = item.id
      if (item.href) {
        uni.navigateTo({
          url: item.href
        })
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
  display: flex;
  flex-wrap: wrap;
  padding: 0 30upx;
  background: #fff;

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

  .titles {
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
</style>
