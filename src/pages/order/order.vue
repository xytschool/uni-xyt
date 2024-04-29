<template>
  <view class="content">
    <view class="navbar">
      <view
        v-for="(item, index) in navList"
        :key="index"
        class="nav-item"
        :class="{ current: tabCurrentIndex === index }"
        @click="tabClick(index)"
      >
        {{ item.text }}
      </view>
    </view>

    <swiper
      :current="tabCurrentIndex"
      class="swiper-box"
      duration="300"
      @change="changeTab"
    >
      <swiper-item
        class="tab-content"
        v-for="(tabItem, tabIndex) in navList"
        :key="tabIndex"
      >
        <scroll-view class="list-scroll-content" scroll-y>
          <!-- 空白页 -->
          <empty
            v-if="tabItem.loaded === true && tabItem.orderList.length === 0"
          ></empty>

          <!-- 订单列表 -->
          <view
            v-for="(item, index) in tabItem.orderList"
            :key="index"
            class="order-item"
          >
            <view class="i-top b-b">
              <text class="time">{{ item.order_no }}</text>
              <text class="time">{{
                item.created_at | transformTimestamp
              }}</text>
              <text class="state">
                <!-- :style="{ color: orderStateExp(item.pay_status).stateTipColor }" -->
                {{ orderStateExp(item.pay_status).stateTip }}
              </text>

              <text
                v-if="item.pay_status === 'unpay'"
                class="del-btn yticon icon-iconfontshanchu1"
                @click="deleteOrder(index)"
              ></text>
            </view>

            <scroll-view
              v-if="item.goods_list && item.goods_list.length > 1"
              class="goods-box"
              scroll-x
              style="display: block; overflow: hidden; white-space: nowrap;"
              @click="toDetail(item)"
            >
              <view
                v-for="(goodsItem, goodsIndex) in item.goods_list"
                :key="goodsIndex"
                class="goods-item"
              >
                <image
                  class="goods-img"
                  :src="goodsItem.cover"
                  mode="aspectFill"
                ></image>
                <text class="title clamp">{{ goodsItem.name }}</text>
                <text class="price">
                  <text>{{ goodsItem.real_price | numberToCurrency }}</text>
                  <text v-if="goodsItem.num > 1">
                    <text>x</text>
                    <text>{{ goodsItem.num }}</text>
                  </text>
                </text>
              </view>
            </scroll-view>
            <view
              v-if="item.goods_list.length === 1"
              class="goods-box-single"
              v-for="(goodsItem, goodsIndex) in item.goods_list"
              :key="goodsIndex"
              @click="toDetail(item)"
            >
              <image
                class="goods-img"
                :src="goodsItem.cover"
                mode="aspectFill"
              ></image>
              <view class="right">
                <text class="title clamp">{{ goodsItem.name }}</text>
                <view class="attr-box">
                  x <text>{{ goodsItem.num }}</text>
                </view>
                <view class="price">
                  {{ goodsItem.real_price | numberToCurrency }}</view
                >
              </view>
            </view>

            <view class="price-box">
              共
              <text class="num">{{ item.goods_num }}</text>
              件商品 实付款
              <text class="price">{{ item.real_total }}</text>
            </view>
            <view class="action-box b-t">
              <button
                class="action-btn"
                v-if="item.pay_status == 'unpay'"
                @click="cancelOrder(item)"
              >
                取消订单
              </button>
              <button
                class="action-btn  recom"
                v-if="item.pay_status == 'unpay'"
              >
                立即支付
              </button>
              <button
                class="action-btn"
                v-if="item.pay_status == 'signed'"
                @click="gotoComment(item)"
              >
                去评价
              </button>

              <!-- <button
                class="action-btn"
                v-if="item.pay_status == 'paid'"
                @click="gotoRefund(item)"
              >
                退款
              </button> -->
              <button
                class="action-btn"
                v-if="item.pay_status == 'paid'"
                @click="toDetail(item)"
              >
                查看票码
              </button>
              <view v-if="item.pay_status == 'torefund'">
                退款中
              </view>
            </view>
          </view>

          <uni-load-more :status="tabItem.loadingType"></uni-load-more>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
import empty from '@/components/empty'
import Json from '@/Json'
import { getOrderList, refund } from '../../api/order'
export default {
  components: {
    uniLoadMore,
    empty
  },
  data() {
    return {
      tabCurrentIndex: 0,
      navList: [
        {
          state: 'all',
          text: '全部',
          loadingType: 'more',
          orderList: []
        },
        {
          state: 'unpay',
          text: '待付款',
          loadingType: 'more',
          orderList: []
        },
        {
          state: 'paid',
          text: '待使用',
          loadingType: 'more',
          orderList: []
        },
        {
          state: 'torefund',
          text: '退款中',
          loadingType: 'more',
          orderList: []
        },
        {
          state: 'refund',
          text: '退款',
          loadingType: 'more',
          orderList: []
        }
      ],
      payDetail: ['paid']
    }
  },

  onLoad(options) {
    /**
     * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
     * 替换onLoad下代码即可
     */
    this.tabCurrentIndex = +options.state
    // #ifndef MP
    this.loadData()
    // #endif
    // #ifdef MP
    if (options.state == 0) {
      this.loadData()
    }
    console.log(this.navList[index].orderList, 'this.navList[index].orderList')
    // #endif
  },

  methods: {
    //获取订单列表
    async loadData(source, last_id, more) {
      //这里是将订单挂载到tab列表下
      let index = this.tabCurrentIndex
      let navItem = this.navList[index]
      let order_status = navItem.state
      navItem.loadingType = more

      if (source === 'tabChange' && navItem.loaded === true) {
        //tab切换只有第一次需要加载数据
        return
      }
      if (navItem.loadingType === 'loading') {
        //防止重复加载
        return
      }

      navItem.loadingType = 'loading'
      let len = navItem.orderList.length

      if (last_id == 0) {
        last_id = last_id
      } else {
        last_id = len > 0 ? navItem.orderList[len - 1].id : 0
      }

      let res = await getOrderList(order_status, last_id)

      if (res.code == 'success') {
        let orderLists = res.data
        this.navList[index].orderList = []
        if (orderLists.length == 0) {
          navItem.loadingType = 'noMore'
          return
        }
        orderLists.forEach((item) => {
          let num = 0
          if (item.goodsList instanceof Array) {
            item.goodsList.forEach((goods) => {
              num += goods.num
            })
          }
          item.total_num = num

          this.navList[index].orderList.push(item)
          this.$forceUpdate()
        })
        //loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
        this.$set(navItem, 'loaded', true)

        //判断是否还有数据， 有改为 more， 没有改为noMore
        navItem.loadingType = 'more'
      }
    },

    //swiper 切换
    changeTab(e) {
      this.tabCurrentIndex = e.target.current
      this.loadData('tabChange')
    },
    //顶部tab点击
    tabClick(index) {
      this.tabCurrentIndex = index
    },
    //删除订单
    deleteOrder(index) {
      uni.showLoading({
        title: '请稍后'
      })
      setTimeout(() => {
        this.navList[this.tabCurrentIndex].orderList.splice(index, 1)
        uni.hideLoading()
      }, 600)
    },
    //取消订单
    cancelOrder(item) {
      uni.showLoading({
        title: '请稍后'
      })
      this.$api.order.cancelOrder(item).then((res) => {
        uni.hideLoading()
        if (res.code == 'success') {
          uni.showToast({ title: '取消订单成功' })
        } else {
          uni.showToast({ title: '取消订单失败' + res.msg })
        }
      })
    },
    gotoComment(item) {
      let goodsList = JSON.stringify(item.goodsList)
      uni.navigateTo({
        url:
          '/pages/comment/comment?type=order&order_no=' +
          item.order_no +
          '&goodsList=' +
          goodsList
      })
    },
    async gotoRefund(item) {
      let that = this
      uni.showModal({
        title: '退款',
        content: '确定要退款吗',
        success: async function(res) {
          if (res.confirm) {
            const res = await refund({
              order_no: item.order_no,
              user_id: item.user_id
            })
            if (res.code == 'success') {
              console.log(res.code)
              const last_id = 0
              uni.showToast({ title: '退款成功', icon: 'success' })

              that.loadData('', last_id, 'more')
            } else {
              uni.showToast({ title: res.message, icon: 'error' })
            }
          }
        }
      })
    },
    //订单状态文字和颜色
    orderStateExp(state) {
      let stateTip = '',
        stateTipColor = '#fa436a'
      switch (state) {
        case 'unpay':
          stateTip = '待付款'
          break
        case 'paid':
          stateTip = '待使用'
          break
        case 'torefund':
          stateTip = '退款中'
          break
        case 'refund':
          stateTip = '退款'
          break
        case 'cancel':
          stateTip = '订单已关闭'
          stateTipColor = '#909399'
          break
      }

      return { stateTip, stateTipColor }
    },

    toDetail(item) {
      if (this.payDetail.includes(item.pay_status)) {
        uni.navigateTo({
          url: `/pages/order/detail?order_no=${item.order_no}`
        })
      }
    }
  }
}
</script>

<style lang="scss">
page,
.content {
  background: $page-color-base;
  height: 100%;
}

.swiper-box {
  height: calc(100% - 40px);
}
.list-scroll-content {
  height: 100%;
}

.navbar {
  display: flex;
  height: 40px;
  padding: 0 5px;
  background: #fff;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;
  .nav-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 15px;
    color: $font-color-dark;
    position: relative;
    &.current {
      color: $base-color;
      &:after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 44px;
        height: 0;
        border-bottom: 2px solid $base-color;
      }
    }
  }
}

.uni-swiper-item {
  height: auto;
}
.order-item {
  display: flex;
  flex-direction: column;
  padding-left: 30upx;
  background: #fff;
  margin-top: 16upx;
  .i-top {
    display: flex;
    align-items: center;
    height: 80upx;
    padding-right: 30upx;
    font-size: $font-base;
    color: $font-color-dark;
    position: relative;
    .time {
      flex: 1;
    }
    .state {
      color: $base-color;
    }
    .del-btn {
      padding: 10upx 0 10upx 36upx;
      font-size: $font-lg;
      color: $font-color-light;
      position: relative;
      &:after {
        content: '';
        width: 0;
        height: 30upx;
        border-left: 1px solid $border-color-dark;
        position: absolute;
        left: 20upx;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  /* 多条商品 */
  .goods-box {
    height: 230upx;
    padding: 20upx 0;
    white-space: nowrap;
    .goods-item {
      width: 120upx;
      height: 120upx;
      display: inline-block;
      margin-right: 24upx;
    }
    .goods-img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .title {
      text-align: left;
      font-size: $font-base + 0upx;
      color: $font-color-dark;
      //line-height: 1;
    }
    .price {
      margin: 0px;
      text-align: left;
      display: block;
      &:before {
        content: '￥';
        font-size: $font-sm;
      }
    }
    .action-btn {
      width: 160upx;
      height: 60upx;
      margin: 0;
      padding: 0;
      text-align: center;
      line-height: 45upx;
      font-size: $font-sm + 2upx;
      color: $font-color-dark;
      background: #fff;
      border-radius: 100px;
      border-color: #f7bcc8;
    }
  }
  /* 单条商品 */
  .goods-box-single {
    display: flex;
    padding: 20upx 0;
    .goods-img {
      display: block;
      width: 120upx;
      height: 120upx;
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0 30upx 0 24upx;
      overflow: hidden;
      .title {
        font-size: $font-base + 0upx;
        color: $font-color-dark;
        //line-height: 1;
      }
      .attr-box {
        font-size: $font-sm + 2upx;
        color: $font-color-light;
        padding: 10upx 12upx;
      }
      .price {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        &:before {
          content: '￥';
          font-size: $font-sm;
          margin: 0 2upx 0 8upx;
        }
      }
    }
  }

  .price-box {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    padding: 20upx 30upx;
    font-size: $font-sm + 2upx;
    color: $font-color-light;
    .num {
      margin: 0 8upx;
      color: $font-color-dark;
    }
    .price {
      font-size: $font-lg;
      color: $font-color-dark;
      &:before {
        content: '￥';
        font-size: $font-sm;
        margin: 0 2upx 0 8upx;
      }
    }
  }
  .action-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100upx;
    position: relative;
    padding-right: 30upx;
  }
  .action-btn {
    width: 160upx;
    height: 60upx;
    margin: 0;
    margin-left: 24upx;
    padding: 0;
    text-align: center;
    line-height: 60upx;
    font-size: $font-sm + 2upx;
    color: $font-color-dark;
    background: #fff;
    border-radius: 100px;
    &:after {
      border-radius: 100px;
    }
    &.recom {
      background: #fff9f9;
      color: $base-color;
      &:after {
        border-color: #f7bcc8;
      }
    }
  }
}

/* load-more */
.uni-load-more {
  display: flex;
  flex-direction: row;
  height: 80upx;
  align-items: center;
  justify-content: center;
}

.uni-load-more__text {
  font-size: 28upx;
  color: #999;
}

.uni-load-more__img {
  height: 24px;
  width: 24px;
  margin-right: 10px;
}

.uni-load-more__img > view {
  position: absolute;
}

.uni-load-more__img > view view {
  width: 6px;
  height: 2px;
  border-top-left-radius: 1px;
  border-bottom-left-radius: 1px;
  background: #999;
  position: absolute;
  opacity: 0.2;
  transform-origin: 50%;
  animation: load 1.56s ease infinite;
}

.uni-load-more__img > view view:nth-child(1) {
  transform: rotate(90deg);
  top: 2px;
  left: 9px;
}

.uni-load-more__img > view view:nth-child(2) {
  transform: rotate(180deg);
  top: 11px;
  right: 0;
}

.uni-load-more__img > view view:nth-child(3) {
  transform: rotate(270deg);
  bottom: 2px;
  left: 9px;
}

.uni-load-more__img > view view:nth-child(4) {
  top: 11px;
  left: 0;
}

.load1,
.load2,
.load3 {
  height: 24px;
  width: 24px;
}

.load2 {
  transform: rotate(30deg);
}

.load3 {
  transform: rotate(60deg);
}

.load1 view:nth-child(1) {
  animation-delay: 0s;
}

.load2 view:nth-child(1) {
  animation-delay: 0.13s;
}

.load3 view:nth-child(1) {
  animation-delay: 0.26s;
}

.load1 view:nth-child(2) {
  animation-delay: 0.39s;
}

.load2 view:nth-child(2) {
  animation-delay: 0.52s;
}

.load3 view:nth-child(2) {
  animation-delay: 0.65s;
}

.load1 view:nth-child(3) {
  animation-delay: 0.78s;
}

.load2 view:nth-child(3) {
  animation-delay: 0.91s;
}

.load3 view:nth-child(3) {
  animation-delay: 1.04s;
}

.load1 view:nth-child(4) {
  animation-delay: 1.17s;
}

.load2 view:nth-child(4) {
  animation-delay: 1.3s;
}

.load3 view:nth-child(4) {
  animation-delay: 1.43s;
}

@-webkit-keyframes load {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0.2;
  }
}
</style>
