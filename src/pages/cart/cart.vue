<template>
    <view class="container">
        <!-- 空白页 -->
        <view v-if="!hasLogin || empty===true" class="empty">
            <image src="http://data.xytschool.com/m/v1/static/emptyCart.jpg" mode="aspectFit"></image>
            <view v-if="hasLogin" class="empty-tips">
                空空如也
                <navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛>
                </navigator>
            </view>
            <view v-else class="empty-tips">
                空空如也
                <view class="navigator" @click="navToLogin">去登陆></view>
            </view>
        </view>
        <view v-else>
            <!-- 列表 -->
            <view class="cart-list">
                <block v-for="(item, index) in cartList" :key="index">
                    <view
                            class="cart-item"
                            :class="{'b-b': index!==cartList.length-1}"
                    >
                        <view class="image-wrapper">
                            <img :src="item.cover"
                                   :class="[item.loaded]"
                                   mode="aspectFill"
                                   lazy-load
                                   @load="onImageLoad('cartList', index)"
                                   @error="onImageError('cartList', index)"
                            />
                            <view
                                    class="yticon icon-xuanzhong2 checkbox"
                                    :class="{checked: item.checked}"
                                    @click="check('item', index)"
                            ></view>
                        </view>
                        <view class="item-right">
                            <text class="clamp title">{{item.name}}</text>
                            <text class="attr">
                                <text v-if="item.label_combine" style="padding-right: 15px"
                                      v-for="(value ,key) in item.label_combine">
                                {{key}}:&nbsp;{{value}}
                                </text>
                            </text>

                            <text class="price" v-yuan="item.real_price">¥</text>
<!--                            <uni-number-box-->
<!--                                    class="step"-->
<!--                                    :min="1"-->
<!--                                    :max="item.stock"-->
<!--                                    :value="item.num>item.stock?item.stock:item.num"-->
<!--                                    :isMax="item.num>=item.stock?true:false"-->
<!--                                    :isMin="item.num===1"-->
<!--                                    :index="index"-->
<!--                                    @eventChange="numberChange"-->
<!--                            ></uni-number-box>-->
                          <u-number-box v-model="item.num"
                                        :min="1"
                                        :max="10"
                                        @plus="numberChange"
                                        @minus="numberChange"
                                        :index="index"></u-number-box>
                        </view>
                        <text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
                    </view>
                </block>
            </view>
            <!-- 底部菜单栏 -->
            <view class="action-section">
                <view class="checkbox">
                    <image
                            :src="allChecked?'/static/selected.png':'/static/select.png'"
                            mode="aspectFit"
                            @click="check('all')"
                    ></image>
                    <view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
                        清空
                    </view>
                </view>
                <view class="total-box">
                    <text class="price" v-yuan="real_total">¥</text>
                    <text class="coupon">
                        已优惠
                        <text v-yuan="total_discount">¥</text>
                        元
                    </text>
                </view>
                <button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
            </view>
        </view>
    </view>
</template>

<script>
    import {
        mapState
    } from 'vuex';
    import uniNumberBox from '@/components/uni-number-box.vue'

    export default {
        components: {
            uniNumberBox
        },
        data() {
            return {
                com_id: 0,
                real_total: 0,
                total_discount: 0,
                total: 0, //总价格
                allChecked: false, //全选状态  true|false
                empty: false, //空白页现实  true|false
                cartList: [],
            }
        },
        onLoad(params) {
           this.com_id = params.com_id
        },
        onShow(){
           this.$store.dispatch('user/checkLogin',this.com_id)
           console.log("onShow")
           this.loadData();
        },
        computed: {
            ...mapState({
                hasLogin: state => state.user.hasLogin,
            })
        },
        watch: {
            //显示空白页
            cartList(e) {
                let empty = e.length === 0 ? true : false;
                if (this.empty !== empty) {
                    this.empty = empty;
                }
            }
        },
        methods: {
            async loadData() {
                let listRes = await this.$api.goods.getCartGoodsList()
                if(listRes.code == 200){
                  let list = listRes.data
                  let cartList = []
                  if(list instanceof Array){
                     cartList = list.map(item => {
                          item.checked = true;
                          return item;
                     });
                  }
                  this.cartList = cartList
                  console.log('cartList3', cartList)
                  this.calcTotal();  //计算总价
                }
            },
            //监听image加载完成
            onImageLoad(key, index) {
                this.$set(this[key][index], 'loaded', 'loaded');
            },
            //监听image加载失败
            onImageError(key, index) {
                this[key][index].image = '/static/errorImage.jpg';
            },
            navToLogin() {
                uni.navigateTo({
                    url: '/pages/login/index'
                })
            },
            //选中状态处理
            check(type, index) {
                if (type === 'item') {
                    this.cartList[index].checked = !this.cartList[index].checked;
                } else {
                    const checked = !this.allChecked
                    const list = this.cartList;
                    list.forEach(item => {
                        item.checked = checked;
                    })
                    this.allChecked = checked;
                }
                this.calcTotal(type);
            },
            //数量
            async numberChange(data) {
              data.num = data.value
              console.log('numberChange', data)
              let goodsItem = Object.assign({},this.cartList[data.index])
              
              if (data.num > 0) {
                    goodsItem.num = data.num
                    uni.showLoading()
                    this.$api.goods.updateCartGoods(goodsItem).then(res => {
                        console.log(res)
                        uni.hideLoading()
                        if(res.code == 200){
                            this.cartList[data.index].num = data.num
                            this.calcTotal();
                        }else if(res.code == 502) {
                          //this.cartList.splice(data.index,1)
                          this.deleteCartItem(data.index)
                          this.calcTotal();
                        }
                    })
                } else {
                    this.deleteCartItem(data.index)
                }
            },
            //删除
            async deleteCartItem(index) {
                let list = this.cartList;
                let row = list[index];
                uni.showLoading()
                row.num = 0
                let res = await this.$api.goods.delCartGoods(row)
                if (res.code == 200) {
                    this.cartList.splice(index, 1);
                    this.calcTotal();
                } else {
                    uni.showToast({title: res.msg})
                }
                uni.hideLoading();
            },
            //清空
            clearCart() {
                uni.showModal({
                    content: '清空购物车？',
                    success: (e) => {
                        if (e.confirm) {
                            uni.showLoading()
                            let res = this.$api.goods.clearCart()
                            if (res.code == 200) {
                                this.cartList = [];
                                this.cartList.push({})
                                this.cartList.pop()
                                uni.showToast({title: '清空成功'})
                            } else {
                                uni.showToast({title: res.msg})
                            }
                            uni.hideLoading();
                        }
                    }
                })
            },
            //计算总价
            calcTotal() {
                let list = this.cartList;
                if (list.length === 0) {
                    this.empty = true;
                    return;
                }
                let real_total = 0;
                let total = 0;
                let checked = true;
                list.forEach(item => {
                    if (item.checked === true) {
                       if(item.real_price > item.price){
                          item.price = item.real_price
                       }

                      real_total += parseInt(item.real_price) * parseInt(item.num);
                      total += parseInt(item.price )* parseInt(item.num);
                    } else if (checked === true) {
                        checked = false;
                    }
                })
                this.allChecked = checked
                this.real_total = real_total
                this.total = total
                this.total_discount = parseInt(this.total) - parseInt(this.real_total)
                console.log('calcTotal' ,this.total_discount , this.real_total,this.total,this.total - this.real_total)
            },
            //创建订单
            createOrder() {
                let list = this.cartList;
                let goodsData = [];
                list.forEach(item => {
                    if (item.checked) {
                        goodsData.push({
                            attr_val: item.attr_val,
                            num: item.number
                        })
                    }
                })
                this.$store.dispatch('order/reset')
                this.$store.dispatch('order/preOrderByGoodsList', this.cartList)

                uni.navigateTo({
                    url: `/pages/order/createOrder?data=${JSON.stringify({
                        goodsData: goodsData
                    })}`
                })
                this.$api.msg('跳转下一页 sendData');
            }
        }
    }
</script>

<style lang='scss'>
    .container {
        padding-bottom: 134upx;
        /* 空白页 */
        .empty {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            padding-bottom: 100upx;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            background: #fff;

            image {
                width: 240upx;
                height: 160upx;
                margin-bottom: 30upx;
            }

            .empty-tips {
                display: flex;
                font-size: $font-sm+2upx;
                color: $font-color-disabled;

                .navigator {
                    color: $uni-color-primary;
                    margin-left: 16upx;
                }
            }
        }
    }

    /* 购物车列表项 */
    .cart-item {
        display: flex;
        position: relative;
        padding: 30upx 40upx;

        .image-wrapper {
            width: 230upx;
            height: 230upx;
            flex-shrink: 0;
            position: relative;

            image {
                border-radius: 8upx;
            }
        }

        .checkbox {
            position: absolute;
            left: -16upx;
            top: -16upx;
            z-index: 8;
            font-size: 44upx;
            line-height: 1;
            padding: 4upx;
            color: $font-color-disabled;
            background: #fff;
            border-radius: 50px;
        }

        .item-right {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
            position: relative;
            padding-left: 30upx;

            .title, .price {
                font-size: $font-base + 2upx;
                color: $font-color-dark;
                height: 40upx;
                line-height: 40upx;
                .origin_price{
                    text-decoration:line-through;
                    margin-left: 15px;
                    color: $font-color-light;
                }
            }

            .attr {
                font-size: $font-sm + 2upx;
                color: $font-color-light;
                height: 50upx;
                line-height: 50upx;
            }

            .price {
                height: 50upx;
                line-height: 50upx;
            }
        }

        .del-btn {
            padding: 4upx 10upx;
            font-size: 34upx;
            height: 50upx;
            color: $font-color-light;
        }
    }

    /* 底部栏 */
    .action-section {
        /* #ifdef H5 */
        margin-bottom: 100upx;
        /* #endif */
        position: fixed;
        left: 30upx;
        bottom: 30upx;
        z-index: 95;
        display: flex;
        align-items: center;
        width: 690upx;
        height: 100upx;
        padding: 0 30upx;
        background: rgba(255, 255, 255, .9);
        box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
        border-radius: 16upx;

        .checkbox {
            height: 52upx;
            position: relative;

            image {
                width: 52upx;
                height: 100%;
                position: relative;
                z-index: 5;
            }
        }

        .clear-btn {
            position: absolute;
            left: 26upx;
            top: 0;
            z-index: 4;
            width: 0;
            height: 52upx;
            line-height: 52upx;
            padding-left: 38upx;
            font-size: $font-base;
            color: #fff;
            background: $font-color-disabled;
            border-radius: 0 50px 50px 0;
            opacity: 0;
            transition: .2s;

            &.show {
                opacity: 1;
                width: 120upx;
            }
        }

        .total-box {
            flex: 1;
            display: flex;
            flex-direction: column;
            text-align: right;
            padding-right: 40upx;

            .price {
                font-size: $font-lg;
                color: $font-color-dark;
            }

            .coupon {
                font-size: $font-sm;
                color: $font-color-light;

                text {
                    color: $font-color-dark;
                }
            }
        }

        .confirm-btn {
            padding: 0 38upx;
            margin: 0;
            border-radius: 100px;
            height: 76upx;
            line-height: 76upx;
            font-size: $font-base + 2upx;
            background: $uni-color-primary;
            box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
        }
    }

    /* 复选框选中状态 */
    .action-section .checkbox.checked,
    .cart-item .checkbox.checked {
        color: $uni-color-primary;
    }
</style>
