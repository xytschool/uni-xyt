<template>
    <view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
        <view class="mask-content">
            <!-- 优惠券页面，仿mt -->
            <view class="coupon-item" v-for="(item,index) in couponList" @click.stop.prevent="clickCoupon(item)"
                  :key="index">
                <view class="con">
                    <view class="left">
                        <text class="title">{{item.name}}</text>
                        <text class="time">有效期至
                            <text v-datetime="item.expire_at"></text>
                        </text>
                    </view>
                    <view class="right">
                        <text class="price" v-yuan="item.amount"></text>
                      <text>满 <text v-yuan="item.amount"></text>元可以使用</text>
                    </view>

                    <view class="circle l"></view>
                    <view class="circle r"></view>
                </view>
                <text class="tips">{{item.desc}}</text>
            </view>
        </view>
    </view>
</template>
<script>
    import {mapState} from "vuex";

    export default {
        props: ['goods_id', 'position', 'order', 'display'],
        data() {
            return {
                maskState: 0, //优惠券面板显示状态
                desc: '', //备注
                payType: 1, //1微信 2支付宝
                choosedCoupons: [],
                couponList: []
            }
        },
        computed: {
            ...mapState({
                goodsList: state => state.order.tempOrder.goodsList,
            }),
        },
        watch: {
            display() {
                this.maskState = this.display
            },
            order() {
                this.getCouponsByOrder()
            }
        },
        async created() {
            console.log('coupons param', this.display)
            let res = {code: 404}
            if (this.goods_id) {
                let goods_id = parseInt(this.goods_id)
                res = await this.$api.activity.getCouponsByGoodsId({goods_id})
            }
            // if (this.position) {
            //     res = await this.$api.activity.getCouponsByPosition({position: this.position})
            // }
            if (res.code == 200 && res.data instanceof Array) {
                console.log(res)
                this.couponList = res.data
            }
            if (this.order) {
                this.getCouponsByOrder()
            }
        },
        methods: {
            async getCouponsByOrder() {
             
              let res = await this.$api.activity.getCouponsByOrder(this.order)
              if (res.code == 200 && res.data) {
                 this.couponList = res.data.user
                 console.log('getCouponsByOrder', this.couponList)
              }
            },
            //显示优惠券面板
            toggleMask(type) {
                let timer = type === 'show' ? 10 : 300;
                let state = type === 'show' ? 1 : 0;
                this.maskState = 2;
                setTimeout(() => {
                    //this.maskState = state;
                    //交给调用着去修改 调用者 通过 .sync 收到update事件
                    this.$emit('update:display', state)
                }, timer)
            },
            clickCoupon(coupon) {
                if (this.position == 'createOrder') {
                    var flag = this.choosedCoupons.some((c, index) => {
                        if (c.id == coupon.id) {
                            this.choosedCoupons.splice(index, 1)
                            return true
                        }
                    })
                    if (!flag) {
                        this.choosedCoupons.push(coupon)
                    }
                    this.$emit("update" ,this.choosedCoupons)
                //console.log('choosedCoupons',JSON.stringify(this.choosedCoupons))
                } else {
                    this.createCoupon(coupon)
                }
                this.toggleMask('none')
            },
            createCoupon(coupon) {
                let params = {coupon_id: coupon.id}
                console.log('coupon', coupon, params)
                this.$api.activity.createUserCoupon(params).then(res => {
                    if (res.code == 200) {
                        uni.showToast({title: '领取成功'})
                    } else {
                        if (res.msg) {
                            uni.showToast({title: res.msg})
                        } else {
                            uni.showToast({title: '领取失败'})
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    /* 优惠券面板 */
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
        transition: .3s;

        .mask-content {
            width: 100%;
            min-height: 30vh;
            max-height: 70vh;
            background: #f3f3f3;
            transform: translateY(100%);
            transition: .3s;
            overflow-y: scroll;
        }

        &.none {
            display: none;
        }

        &.show {
            background: rgba(0, 0, 0, .4);

            .mask-content {
                transform: translateY(0);
            }
        }
    }

    /* 优惠券列表 */
    .coupon-item {
        display: flex;
        flex-direction: column;
        margin: 20upx 24upx;
        background: #fff;

        .con {
            display: flex;
            align-items: center;
            position: relative;
            height: 120upx;
            padding: 0 30upx;

            &:after {
                position: absolute;
                left: 0;
                bottom: 0;
                content: '';
                width: 100%;
                height: 0;
                border-bottom: 1px dashed #f3f3f3;
                transform: scaleY(50%);
            }
        }

        .left {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            overflow: hidden;
            height: 100upx;
        }

        .title {
            font-size: 32upx;
            color: $font-color-dark;
            margin-bottom: 10upx;
        }

        .time {
            font-size: 24upx;
            color: $font-color-light;
        }

        .right {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 26upx;
            color: $font-color-base;
            height: 100upx;
        }

        .price {
            font-size: 44upx;
            color: $base-color;

            &:before {
                content: '￥';
                font-size: 34upx;
            }
        }

        .tips {
            font-size: 24upx;
            color: $font-color-light;
            line-height: 60upx;
            padding-left: 30upx;
        }

        .circle {
            position: absolute;
            left: -6upx;
            bottom: -10upx;
            z-index: 10;
            width: 20upx;
            height: 20upx;
            background: #f3f3f3;
            border-radius: 100px;

            &.r {
                left: auto;
                right: -6upx;
            }
        }
    }

</style>

