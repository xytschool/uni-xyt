<template>
  <view>
    <view class="goods-section">
      <view class="g-header b-b">
        <text class="name">商品列表</text>
      </view>
      <!-- 商品列表 -->
      <view class="g-item" v-for="(goods, index) in goodsList" :key="index">
        <image :src="goods.cover"></image>
        <view class="right">
          <text class="title clamp">{{ goods.name }}</text>

          <view class="price-box">
            <text class="real_price"
              >￥  {{ goods.real_price | numberToCurrency }}</text
            >
            <text class="price">￥ {{ goods.price | numberToCurrency }}</text>
            <text class="number">x {{ tickets }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 金额明细 -->
    <!-- <view class="yt-list">
      <view class="yt-list-cell b-b">
        <text class="cell-tit clamp">商品金额</text>
        <text class="cell-tip">￥ {{ amount | numberToCurrency }}</text>
      </view>
    </view> -->
    <!-- 购票张数 -->
    <view class="tickets-Number">
      <view class="yt-list-cell desc-cell">
        <text class="cell-tit clamp">购票张数</text>

        <u-number-box
          :min="1"
          v-model="tickets"
          @change="valChange"
        ></u-number-box>
        <text class="addpeople" @click="navTo('/pages/addpeople/addpeople')">
          去添加使用人
        </text>
      </view>
    </view>
    <view class="personnel">
      <view v-if="getpeopleList">
        <view
          class="list b-b"
          v-for="(item, index) in getpeopleList"
          :key="index"
        >
          <view class="wrapper">
            <view class="information-box">
              <view class="name">{{ item.username }}</view>
              <view class="mobile">{{ item.id_card }}</view>
            </view>
            <view class="delect-box">
              <u-checkbox-group>
                <u-checkbox
                  @change="checkboxChange(item)"
                  v-model="item.checked"
                ></u-checkbox>
              </u-checkbox-group>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="noData">
        还未添加使用人，<text @click="navTo('/pages/addpeople/addpeople')"
          >去添加</text
        >
      </view>
    </view>

    <!-- 底部 -->
    <view class="footer">
      <view class="price-content">
        <text>实付款</text>
        <text class="price-tip">￥</text>
        <text class="price" v-if="real_total">{{
          real_total | numberToCurrency
        }}</text>

        <text class="price" v-else>{{ real_amount | numberToCurrency }}</text>
      </view>
      <text class="submit" @click="submit" :disabled="canSubmit">提交订单</text>
    </view>

    <coupons
      :order="order"
      :display.sync="showCouponMask"
      @update="updateChoosedCoupon"
      :position="'createOrder'"
    ></coupons>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import coupons from '@/components/coupons'
import { jsPay, miniPay } from '../../utils/payment'
import { createOrder } from '../../api/order.js'
import { prePayment } from '../../api/payment.js'

export default {
  components: { coupons },
  data() {
    return {
      showCouponMask: 0, //优惠券面板显示状态
      desc: '', //备注
      payType: 1, //1微信 2支付宝
      couponList: [],
      from: 'goods', //goods ,cart
      addressData: {
        name: '',
        mobile: '',
        addressName: '',
        address: '',
        area: '',
        default: false
      },
      getpeopleList: [],
      tempNote: '',
      inviter_id: 0,
      canSubmit: true,
      tickets: 1,
      params: [],
      real_total: ''
    }
  },
  onShow() {
    this.getdata()
    this.params = []
  },
  onLoad(option) {
    if (option.from) {
      this.from = option.from
    }
    if (option.from_user) {
      this.inviter_id = parseInt(option.from_user)
    }
    this.getdata()
  },
  computed: {
    ...mapState({
      goodsList: (state) => state.order.tempOrder.goodsList,
      amount: (state) => state.order.tempOrder.total,
      real_amount: (state) => state.order.tempOrder.real_total,
      num: (state) => state.order.tempOrder.num,
      // discount: (state) => state.order.tempOrder.discount,
      // express: (state) => state.order.tempOrder.express,
      // note: (state) => state.order.tempOrder.note,
      // defaultAddress: (state) => state.user.defaultAddress,
      // orderAddress: (state) => state.order.tempAddress,
      goodsType: (state) => state.order.tempOrder.goods_type,
      order: (state) => state.order.tempOrder,
      user: (state) => state.user.user
    })
  },
  watch: {
    tempNote(newVal) {
      //console.log(newVal)
      this.$store.commit('order/changeNote', newVal)
    },
    couponList(list) {
      console.log('couponList change', this.couponList)
      this.$store.dispatch('order/updateCouponList', this.couponList)
    }
  },

  methods: {
    getdata() {
      this.$api.user.getAddress().then((res) => {
        res.data.forEach((element) => {
          element.checked = false
        })
        this.getpeopleList = res.data
      })
    },
    updateChoosedCoupon(coupons) {
      this.couponList = coupons
    },
    numberChange(data) {
      this.number = data.number
    },
    changePayType(type) {
      this.payType = type
    },
    checkboxChange(item) {},

    valChange(e) {
      this.real_total = e.value * this.real_amount
    },
    async submit() {
      console.log('submit ...')
      this.params = []
      if (!this.canSubmit) {
        console.log('submit ... rep')
        uni.showToast({ title: '支付中请勿重复点击' })
        return
      }
      this.canSubmit = false
      let params = {
        inviter_id: this.inviter_id
      }
      this.getpeopleList.forEach((item) => {
        if (item.checked) {
          this.params.push({ ...item, ...this.goodsList[0] })
        }
      })
      console.log('create order params', this.params)
      if (
        this.tickets > this.params.length ||
        this.tickets < this.params.length
      ) {
        uni.showToast({
          icon: 'none',
          title: `共需选择${this.tickets}位使用人，\r\n已选择${this.params.length}位使用人`
        })
        this.canSubmit = true

        return
      }
      console.log(this.goodsType, 'this.goodsType')
      let res = await createOrder({
        goods_type: this.goodsType,
        pay_method: 'wx',
        source: '小程序',
        client_type: 'wx_miniapp',
        real_total: this.real_total || this.real_amount,
        discount_type: 'none',
        goods_list: this.params
      })
      console.log('create res', res, this.user)
      if (res.code != 'success') {
        uni.showToast({ title: res.message, icon: 'none' })
        return false
      }

      let wxPayParams = {
        order_no: res.data.order_no,
        total_amount: this.real_total || this.real_amount,
        payway: 'weixin',
        sub_payway: 'mini_prog',
        payer_id: this.user.openid
      }

      console.log('wxPayParams', wxPayParams)

      let prePayResp = await prePayment(wxPayParams)

      console.log('prePayResp', prePayResp)
      if (prePayResp.code != 'success') {
        uni.showToast({ title: res.message, icon: 'none' })
        return
      }
      let payRes = await miniPay(prePayResp.data.wap_pay_request)
      if (payRes.code == 'success') {
        uni.showToast({ title: '下单成功' })
      } else {
        uni.showToast({ title: '下单失败' + res.errMsg })
      }
      //commit('clearTempOrder', res.data)
      return true
    },
    stopPrevent() {},
    navTo(url) {
      console.log(url, 'url')
      uni.navigateTo({
        url
      })
    }
  }
}
</script>

<style lang="scss">
page {
  background: $page-color-base;
  padding-bottom: 100upx;
}

.address-section {
  padding: 30upx 0;
  background: #fff;
  position: relative;

  .order-content {
    display: flex;
    align-items: center;
  }

  .icon-shouhuodizhi {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90upx;
    color: #888;
    font-size: 44upx;
  }

  .cen {
    display: flex;
    flex-direction: column;
    flex: 1;
    font-size: 28upx;
    color: $font-color-dark;
  }

  .name {
    font-size: 34upx;
    margin-right: 24upx;
  }

  .address {
    margin-top: 16upx;
    margin-right: 20upx;
    color: $font-color-light;
  }

  .icon-you {
    font-size: 32upx;
    color: $font-color-light;
    margin-right: 30upx;
  }

  .a-bg {
    position: absolute;
    left: 0;
    bottom: 0;
    display: block;
    width: 100%;
    height: 5upx;
  }
}

.goods-section {
  margin-top: 16upx;
  background: #fff;
  padding-bottom: 1px;

  .g-header {
    display: flex;
    align-items: center;
    height: 84upx;
    padding: 0 30upx;
    position: relative;
  }

  .logo {
    display: block;
    width: 50upx;
    height: 50upx;
    border-radius: 100px;
  }

  .name {
    font-size: 30upx;
    color: $font-color-base;
    // margin-left: 24upx;
  }

  .g-item {
    display: flex;
    margin: 20upx 30upx;
    // background: red;
    image {
      flex-shrink: 0;
      display: block;
      width: 140upx;
      height: 140upx;
      border-radius: 4upx;
    }

    .right {
      flex: 1;
      padding-left: 24upx;
      overflow: hidden;
    }

    .title {
      font-size: 30upx;
      color: $font-color-dark;
    }

    .spec {
      font-size: 30upx;
      color: #d55c5c;
      padding-right: 30upx;
    }

    .price-box {
      display: flex;
      align-items: center;
      font-size: 32upx;
      color: $font-color-dark;
      padding-top: 10upx;

      .real_price {
        margin-bottom: 4upx;
      }

      .price {
        margin-left: 5px;
        text-decoration: line-through;
        margin-bottom: 4upx;
        color: #d2d1d1;
      }

      .number {
        font-size: 26upx;
        color: $font-color-base;
        margin-left: 20upx;
      }
    }

    .step-box {
      position: relative;
    }
  }
}

.yt-list {
  margin-top: 16upx;
  background: #fff;
}

/* 支付列表 */
.pay-list {
  padding-left: 40upx;
  margin-top: 16upx;
  background: #fff;

  .pay-item {
    display: flex;
    align-items: center;
    padding-right: 20upx;
    line-height: 1;
    height: 110upx;
    position: relative;
  }

  .icon-weixinzhifu {
    width: 80upx;
    font-size: 40upx;
    color: #6bcc03;
  }

  .icon-alipay {
    width: 80upx;
    font-size: 40upx;
    color: #06b4fd;
  }

  .icon-xuanzhong2 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60upx;
    height: 60upx;
    font-size: 40upx;
    color: $base-color;
  }

  .tit {
    font-size: 32upx;
    color: $font-color-dark;
    flex: 1;
  }
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 995;
  display: flex;
  align-items: center;
  width: 100%;
  height: 90upx;
  justify-content: space-between;
  font-size: 30upx;
  background-color: #fff;
  z-index: 998;
  color: $font-color-base;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

  .price-content {
    padding-left: 30upx;
  }

  .price-tip {
    color: $base-color;
    margin-left: 8upx;
  }

  .price {
    font-size: 36upx;
    color: $base-color;
  }

  .submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 280upx;
    height: 100%;
    color: #fff;
    font-size: 32upx;
    background-color: $base-color;
  }
}

.mask {
  display: flex;
  align-items: flex-end;
  position: fixed;
  left: 0;
  top: var(--window-top);
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 9995;
  transition: 0.3s;

  .mask-content {
    width: 100%;
    min-height: 30vh;
    max-height: 70vh;
    background: #f3f3f3;
    transform: translateY(100%);
    transition: 0.3s;
    overflow-y: scroll;
  }

  &.none {
    display: none;
  }

  &.show {
    background: rgba(0, 0, 0, 0.4);

    .mask-content {
      transform: translateY(0);
    }
  }
}
.tickets-Number {
  margin-top: 16upx;
  background: #fff;
}
.yt-list-cell {
  display: flex;
  align-items: center;
  padding: 10upx 30upx 10upx 40upx;
  line-height: 70upx;
  position: relative;

  &.cell-hover {
    background: #fafafa;
  }

  &.b-b:after {
    left: 30upx;
  }

  .cell-icon {
    height: 32upx;
    width: 32upx;
    font-size: 22upx;
    color: #fff;
    text-align: center;
    line-height: 32upx;
    background: #f85e52;
    border-radius: 4upx;
    margin-right: 12upx;

    &.hb {
      background: #ffaa0e;
    }

    &.lpk {
      background: #3ab54a;
    }
  }

  .cell-more {
    align-self: center;
    font-size: 24upx;
    color: $font-color-light;
    margin-left: 8upx;
    margin-right: -10upx;
  }

  .cell-tit {
    flex: 1;
    font-size: 26upx;
    color: $font-color-light;
    margin-right: 10upx;
  }
  .addpeople {
    color: #649c4a;
    margin-left: 20upx;
  }
  .cell-tip {
    font-size: 26upx;
    color: $font-color-dark;

    &.disabled {
      color: $font-color-light;
    }

    &.active {
      color: $base-color;
    }

    &.red {
      color: $base-color;
    }
  }

  .desc {
    flex: 1;
    font-size: $font-base;
    color: $font-color-dark;
  }
}
.personnel {
  margin-top: 16upx;
  background: #fff;
  .noData {
    text-align: center;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #000000;
    line-height: 80rpx;

    text {
      color: #649c4a;
    }
  }
}
.list {
  display: flex;
  align-items: center;
  padding: 20upx 30upx;
  background: #fff;
  position: relative;
}
.wrapper {
  width: 100%;
  display: flex;
  // flex-direction: column;
  padding: 20rpx 30rpx 6rpx 20rpx;
  line-height: 50px;
}
.information-box {
  flex: 1;
  .name {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #1a1a1a;
    line-height: 33rpx;
  }
  .mobile {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #767676;
    line-height: 28rpx;
    margin-top: 20rpx;
  }
}
</style>
