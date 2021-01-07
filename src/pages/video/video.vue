<template>  
    <view class="page">
		  <view class="video-wrap">
        <iframe :src="src" width="100%" height="245px" scrolling="no" frameborder="0">
          <p>Your browser does not support iframes.</p>
        </iframe>
		  </view>
      <view>
        <!-- 猜你喜欢 -->
        <view class="f-header m-t">
          <image src="http://data.xytschool.com/m/v1/static/temp/h1.png"></image>
          <view class="tit-box">
            <text class="tit">商品推荐</text>
            <text class="tit2">Guess You Like</text>
          </view>
          <text class="yticon icon-you"></text>
        </view>

        <view class="guess-section">
          <view
              v-for="(item, index) in goodsList" :key="index"
              class="guess-item"
              @click="navToDetailPage(item)"
          >
            <view class="image-wrapper">
              <image :src="item.small_cover" mode="aspectFill"></image>
            </view>
            <text class="title clamp">{{item.name}}</text>
            <text class="price" v-yuan="item.real_price">￥</text>
          </view>
        </view>
        
      </view>
    </view>
</template>  
<script>
  import { mapState } from 'vuex';
	let startY = 0, moveY = 0, pageAtTop = true;
    export default {
		components: {
		},
		data(){
			return {
        src : '',
        goodsList: [],
			}
		},
		onLoad(params){
		    let id = params.id
        this.src =  window.location.pathname + '/video/' + id
        this.loadData()
		},
    computed: {
			...mapState({
			})
		},
    methods: {
		  async loadData(){
        let goodsRes = await this.$api.goods.getGoodsList();
        if (goodsRes.code == 200) {
          this.goodsList = goodsRes.data || [];
        }
      },
      //详情页
      navToDetailPage(item) {
        //测试数据没有写id，用title代替
        let id = item.id;
        if (item.href) {
          uni.navigateTo({url: item.href})
        } else {
          uni.navigateTo({
            url: `/pages/product/product?id=${id}`
          })
        }
      },
    }
    }
</script>

<style lang='scss'>
.page{
  background: #f5f5f5;
  .m-t {
    margin-top: 16upx;
  }
  .f-header {
    display: flex;
    align-items: center;
    height: 140upx;
    padding: 6upx 30upx 8upx;
    background: #fff;

    image {
      flex-shrink: 0;
      width: 80upx;
      height: 80upx;
      margin-right: 20upx;
    }

    .tit-box {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .tit {
      font-size: $font-lg +2upx;
      color: #font-color-dark;
      line-height: 1.3;
    }

    .tit2 {
      font-size: $font-sm;
      color: $font-color-light;
    }

    .icon-you {
      font-size: $font-lg +2upx;
      color: $font-color-light;
    }
  }

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

      &:nth-child(2n+1) {
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


}
</style>
