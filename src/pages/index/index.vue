<template>
  <view class="container">
    <!-- 小程序头部兼容 -->
    <!-- #ifdef MP -->
    <view class="mp-search-box">
      <!-- <input
        class="ser-input"
        @change="changeKeyword"
        type="text"
        v-model="keyword"
      /> -->
    </view>
    <!-- #endif -->

    <!-- 头部轮播 -->
    <view class="carousel-section">
      <!-- 标题栏和状态栏占位符 -->
      <view class="titleNview-placing"></view>
      <!-- 背景色区域 -->
      <view
        class="titleNview-background"
        :style="{ backgroundColor: titleNViewBackground }"
      ></view>
      <swiper class="carousel" circular @change="swiperChange">
        <swiper-item
          v-for="(item, index) in carouselList"
          :key="index"
          class="carousel-item"
          @click="navToDetailPage(item)"
        >
          <!-- {{ item.cover }} -->
          <image :src="item.cover" />
        </swiper-item>
      </swiper>
      <!-- 自定义swiper指示器 -->
      <view class="swiper-dots">
        <text class="num">{{ swiperCurrent + 1 }}</text>
        <text class="sign">/</text>
        <text class="num">{{ swiperLength }}</text>
      </view>
    </view>

    <swiper
      v-if="showNoticeSwiper"
      class="notice-swiper"
      vertical
      autoplay
      circular
      :interval="5000"
    >
      <swiper-item v-for="(value, index) in list" :key="index">
        <u-notice-bar
          mode="horizontal"
          :show.sync="showNotice"
          is-circular="false"
          :list="value.content"
          close-icon="close"
          @close="Noticeclose"
          @click="navToNoticeDetail(value.id)"
        ></u-notice-bar>
      </swiper-item>
    </swiper>

    <view class="ticket-content">
      <view class="item" @click="onlineTicket()">
        <span>在线购票</span>
        <view class="en">Online Ticket</view>
        <span class="iconfont icon-menpiao"></span>
      </view>
      <view class="item" @click="noticeTicket()">
        <span> 购票须知</span>
        <view class="en"> Ticket Notice</view>
        <span class="iconfont icon-goupiaoxuzhi"></span>
      </view>
      <view class="item" @click="introduction()">
        <span> 景区介绍</span>
        <view class="en"> regarding</view>
        <span class="iconfont icon-guanyuwomen"></span>
      </view>
      <view class="item">
        <span style="font-size: 36rpx;">
          客服电话:<br />{{ companyInfo.phone }}</span
        >
        <view class="en"> Service Hot-Line</view>
        <!-- <span class="iconfont icon-bangzhuzhongxin-copy"></span> -->
      </view>
    </view>
    <!-- 猜你喜欢 -->
    <view class="f-header m-t">
      <image src="http://data.xytschool.com/m/v1/static/temp/h1.png"></image>
      <view class="tit-box">
        <text class="tit">商品列表</text>
        <text class="tit2">Product list</text>
      </view>
      <!-- <text class="yticon icon-you"></text> 由于目前没有更多页面暂时注释掉更多样式 -->
    </view>

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
          <text class="price">
            ￥ {{ item.real_price | numberToCurrency }}</text
          >
        </view>
      </view>

      <view v-else class="noData">
        <img src="../../static/noData.png" alt="" class="noDataImg" />
        <view class="noDataText">
          暂无商品
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      titleNViewBackground: '',
      swiperCurrent: 0,
      swiperLength: 0,
      carouselList: [],
      goodsList: [],
      recommendGoodsList: [],
      navList: [],
      keyword: '',
      videoList: [],
      ad_banners: [],
      cate_banners: [],
      companyInfo: {
        phone: '',
        buy_notice: '',
        introduction: ''
      },
      list: [],
      showNotice: true,
      showNoticeSwiper: true
    }
  },
  computed: {},
  onLoad() {
    uni.setNavigationBarTitle({
      title: this.$scenicSpot
    })
    this.loadData()
    this.getNoticesData()
  },
  methods: {
    Noticeclose() {
      this.showNotice = false
      this.showNoticeSwiper = false
    },
    async getNoticesData() {
      let res = await this.$api.publicData.getNotices()
      console.log(res, 'res')
      if (res.code === 'success' && res.data) {
        this.list = res.data.map((notice) => {
          const content = notice.content
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')

          return {
            content: [content],
            id: notice.id
          }
        })
      }
    },
    async loadData() {
      let res = await this.$api.site.getIndexPageBanners()
      console.log('indexPageBanner', res)
      if (res.code == 'success') {
        let carouselList = res.data.scroll
        this.titleNViewBackground = carouselList[0].background
        this.swiperLength = carouselList.length
        this.carouselList = carouselList
        this.ad_banners = res.data.ads
        this.cate_banners = res.data.categories
      }
      let navListRes = await this.$api.site.getNavList()
      if ((navListRes.code = 'success')) {
        console.log('navListRes::', navListRes.code, navListRes.data)
        this.navList = navListRes.data
      }

      // 获取公司信息
      let companyRes = await this.$api.site.getCompany()
      if (companyRes.code == 'success') {
        this.companyInfo = companyRes.data
      }

      //暂时隐藏
      // let videoRes = await this.$api.site.getVideoList()
      // if (videoRes.code == 200) {
      //   this.videoList = videoRes.data || []
      // }

      //let goodsList = await this.$api.json('goodsList');
      let recommendGoodsRes = await this.$api.goods.getRecommendGoodsList()
      if (recommendGoodsRes.code == 'success') {
        this.recommendGoodsList = recommendGoodsRes.data || []
      }

      let goodsRes = await this.$api.goods.getGoodsList()
      if (goodsRes.code == 'success') {
        console.log(goodsRes.data, 'goodsRes.data')
        this.goodsList = goodsRes.data || []
        console.log(this.goodsList, '  this.goodsList')
      }
    },
    changeKeyword() {
      console.log(this.keyword)
    },
    //轮播图切换修改背景色
    swiperChange(e) {
      const index = e.detail.current
      this.swiperCurrent = index
      this.titleNViewBackground = this.carouselList[index].background
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
    },
    onlineTicket() {
      //在线购票
      uni.navigateTo({
        url: `/pages/list/index`
      })
    },
    noticeTicket() {
      // 购票须知
      uni.navigateTo({
        url: `/pages/noticeTicket/index?notice=${encodeURIComponent(
          this.companyInfo.buy_notice
        )}`
      })
    },
    //详情页
    navToVideo(item) {
      let id = item.id
      uni.navigateTo({
        url: `/pages/video/video?id=${id}`
      })
    },
    //详情页
    gotoNav(item) {
      if (!item.href) {
        uni.showToast({ title: '请配置跳转地址' })
        return
      }
      //console.log(item.link)
      if (item.href.indexOf('/pages/category/category') >= 0) {
        uni.switchTab({
          url: item.href
        })
      } else {
        uni.navigateTo({
          url: item.href
        })
      }
    },
    introduction() {
      uni.navigateTo({
        url: `/pages/introduction/index?introduction=${encodeURIComponent(
          this.companyInfo.introduction
        )}`
      })
    },
    navToNoticeDetail(id) {
      uni.navigateTo({
        url: `/pages/notice/index?id=${id}`
      })
    }
  },
  // #ifndef MP
  // 标题栏input搜索框点击
  onNavigationBarSearchInputClicked: async function(e) {
    this.$api.msg('点击了搜索框')
  },
  onNavigationBarSearchInputChanged(e) {
    console.log('change', e.text)
  },
  onNavigationBarSearchInputConfirmed(e) {
    console.log('onNavigationBarSearchInputConfirmed', e.text)
    uni.navigateTo({
      url: '/pages/product/search?keyword=' + e.text
    })
  },
  //点击导航栏 buttons 时触发
  onNavigationBarButtonTap(e) {
    const index = e.index
    if (index === 0) {
      this.$api.msg('点击了扫描')
    } else if (index === 1) {
      // #ifdef APP-PLUS
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
      const currentWebview = page.$getAppWebview()
      currentWebview.hideTitleNViewButtonRedDot({
        index
      })
      // #endif
      uni.navigateTo({
        url: '/pages/notice/notice'
      })
    }
  }
  // #endif
}
</script>

<style lang="scss" scoped>
.mp-search-box {
  position: absolute;
  left: 0;
  top: 30upx;
  z-index: 9999;
  width: 100%;
  padding: 0 80upx;

  .ser-input {
    flex: 1;
    height: 56upx;
    line-height: 56upx;
    text-align: center;
    font-size: 28upx;
    color: $font-color-base;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.6);
  }
}

page {
  .cate-section {
    position: relative;
    z-index: 5;
    border-radius: 16upx 16upx 0 0;
    margin-top: -20upx;
  }

  .carousel-section {
    padding: 0;

    .titleNview-placing {
      padding-top: 0;
      height: 0;
    }

    .carousel {
      .carousel-item {
        padding: 0;
      }
    }

    .swiper-dots {
      left: 45upx;
      bottom: 40upx;
    }
  }
}

/* #endif */

page {
  background: #f5f5f5;
}

.m-t {
  margin-top: 16upx;
}

/* 头部 轮播图 */
.carousel-section {
  position: relative;
  padding-top: 10px;

  .titleNview-placing {
    height: var(--status-bar-height);
    padding-top: 44px;
    box-sizing: content-box;
  }

  .titleNview-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 426upx;
    transition: 0.4s;
  }
}

.carousel {
  width: 100%;
  height: 350upx;

  .carousel-item {
    width: 100%;
    height: 100%;
    padding: 0 28upx;
    overflow: hidden;
  }

  image {
    width: 100%;
    height: 100%;
    border-radius: 10upx;
  }
}

.swiper-dots {
  display: flex;
  position: absolute;
  left: 60upx;
  bottom: 15upx;
  width: 72upx;
  height: 36upx;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
  background-size: 100% 100%;

  .num {
    width: 36upx;
    height: 36upx;
    border-radius: 50px;
    font-size: 24upx;
    color: #fff;
    text-align: center;
    line-height: 36upx;
  }

  .sign {
    position: absolute;
    top: 0;
    left: 50%;
    line-height: 36upx;
    font-size: 12upx;
    color: #fff;
    transform: translateX(-50%);
  }
}

/* 分类 */
.cate-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 30upx 22upx;
  background: #fff;

  .cate-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: $font-sm + 2upx;
    color: $font-color-dark;

    .cate-name {
      display: block;
      text-align: center;
    }
  }

  /* 原图标颜色太深,不想改图了,所以加了透明度 */
  image {
    width: 88upx;
    height: 88upx;
    margin-bottom: 14upx;
    border-radius: 50%;
    opacity: 0.7;
    box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
  }
}

.ad-1 {
  width: 100%;
  height: 210upx;
  padding: 10upx 0;
  background: #fff;

  image {
    width: 100%;
    height: 100%;
  }
}

/* 秒杀专区 */
.seckill-section {
  padding: 4upx 30upx 24upx;
  background: #fff;

  .s-header {
    display: flex;
    align-items: center;
    height: 92upx;
    line-height: 1;

    .s-img {
      width: 140upx;
      height: 30upx;
    }

    .tip {
      font-size: $font-base;
      color: $font-color-light;
      margin: 0 20upx 0 40upx;
    }

    .timer {
      display: inline-block;
      width: 40upx;
      height: 36upx;
      text-align: center;
      line-height: 36upx;
      margin-right: 14upx;
      font-size: $font-sm + 2upx;
      color: #fff;
      border-radius: 2px;
      background: rgba(0, 0, 0, 0.8);
    }

    .icon-you {
      font-size: $font-lg;
      color: $font-color-light;
      flex: 1;
      text-align: right;
    }
  }

  .floor-list {
    white-space: nowrap;
  }

  .scoll-wrapper {
    display: flex;
    align-items: flex-start;
  }

  .floor-item {
    width: 150upx;
    margin-right: 20upx;
    font-size: $font-sm + 2upx;
    color: $font-color-dark;
    line-height: 1.8;

    image {
      width: 150upx;
      height: 150upx;
      border-radius: 6upx;
    }

    .price {
      color: $uni-color-primary;
    }
  }
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
    font-size: $font-lg + 2upx;
    color: #font-color-dark;
    line-height: 1.3;
  }

  .tit2 {
    font-size: $font-sm;
    color: $font-color-light;
  }

  .icon-you {
    font-size: $font-lg + 2upx;
    color: $font-color-light;
  }
}

/* 团购楼层 */
.group-section {
  background: #fff;

  .g-swiper {
    height: 650upx;
    padding-bottom: 30upx;
  }

  .g-swiper-item {
    width: 100%;
    padding: 0 30upx;
    display: flex;
  }

  image {
    width: 100%;
    height: 460upx;
    border-radius: 4px;
  }

  .g-item {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .left {
    flex: 1.2;
    margin-right: 24upx;

    .t-box {
      padding-top: 20upx;
    }
  }

  .right {
    flex: 0.8;
    flex-direction: column-reverse;

    .t-box {
      padding-bottom: 20upx;
    }
  }

  .t-box {
    height: 160upx;
    font-size: $font-base + 2upx;
    color: $font-color-dark;
    line-height: 1.6;
  }

  .price {
    color: $uni-color-primary;
  }

  .m-price {
    font-size: $font-sm + 2upx;
    text-decoration: line-through;
    color: $font-color-light;
    margin-left: 8upx;
  }

  .pro-box {
    display: flex;
    align-items: center;
    margin-top: 10upx;
    font-size: $font-sm;
    color: $font-base;
    padding-right: 10upx;
  }

  .progress-box {
    flex: 1;
    border-radius: 10px;
    overflow: hidden;
    margin-right: 8upx;
  }
}

/* 分类推荐楼层 */
.hot-floor {
  width: 100%;
  overflow: hidden;
  margin-bottom: 20upx;

  .floor-img-box {
    width: 100%;
    height: 320upx;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(255, 255, 255, 0.06) 30%, #f8f8f8);
    }
  }

  .floor-img {
    width: 100%;
    height: 100%;
  }

  .floor-list {
    white-space: nowrap;
    padding: 20upx;
    padding-right: 50upx;
    border-radius: 6upx;
    margin-top: -140upx;
    margin-left: 30upx;
    background: #fff;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 1;
  }

  .scoll-wrapper {
    display: flex;
    align-items: flex-start;
  }

  .floor-item {
    width: 180upx;
    margin-right: 20upx;
    font-size: $font-sm + 2upx;
    color: $font-color-dark;
    line-height: 1.8;

    image {
      width: 180upx;
      height: 180upx;
      border-radius: 6upx;
    }

    .price {
      color: $uni-color-primary;
    }
  }

  .more {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-shrink: 0;
    width: 180upx;
    height: 180upx;
    border-radius: 6upx;
    background: #f3f3f3;
    font-size: $font-base;
    color: $font-color-light;

    text:first-child {
      margin-bottom: 4upx;
    }
  }
}

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

.ticket-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20rpx;
  .item {
    width: 48%;
    height: 260rpx;
    border-radius: 10rpx;
    margin-top: 10rpx;
    color: #fff;
    padding: 40rpx;
    position: relative;
    span {
      font-size: 46rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
    }
    .en {
      font-size: 30rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 200;
    }
    .iconfont {
      // background: red;
      font-size: 70rpx;
      position: absolute;
      right: 30rpx;
    }
  }
  .item:nth-child(1) {
    background: #a6635f;
  }
  .item:nth-child(2) {
    background: #b17965;
  }
  .item:nth-child(3) {
    background: #507487;
  }
  .item:nth-child(4) {
    background: #b68e59;
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
.scroll-text {
  margin-top: 0rpx;
  padding: 10rpx 20rpx;
  background: #fcf6ed;
  display: flex;
  align-items: center;
  width: 100%;
  height: 24px;
  line-height: 24px;
}

.scroll-text .iconfont {
  flex-shrink: 0;
  font-size: 28rpx;
  color: #666;
  margin: 0 10rpx;
}

.scroll-content {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  color: transparent;
}

.scroll-content::after {
  content: attr(data-text);
  position: absolute;
  left: 100%;
  top: 0;
  white-space: nowrap;
  color: #666;
  animation: scroll-left 15s linear infinite;
}

@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.notice-swiper {
  height: 80rpx;
  background: #fcf6ed;
}
</style>
