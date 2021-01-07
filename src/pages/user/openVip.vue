<template>
	<view class="page">
		<view class="title">{{goods.name}}</view>
    <view class="price">
       价格: <text v-yuan="goods.real_price"></text>
    </view>
    <view class="desc">{{goods.desc}}</view>
    <text class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>
  import {jsPay} from "../../utils/payment";
	export default{
    data(){
			return {
			  goods: {},
        canSubmit: true,
        inviter_id: 0
			}
		},
		onLoad(){
     this.$api.goods.getVipInfo().then(res => {
       if(res.code == 200){
         console.log('goods -> ', res.data)
         this.goods = res.data
       }
     })
		},
		methods: {
      confirm(){
        console.log('submit ...')
        if(!this.canSubmit){
          console.log('submit ... rep')
          uni.showToast({title:"支付中请勿重复点击"})
          return
        }
        this.canSubmit = false
        let params = {
          inviter_id : this.inviter_id
        }
        this.$store.dispatch('order/preOrderByGoodsList' ,[{
            goods_id: parseInt(this.goods.id),
            sku_id: 0,
            name: this.goods.name,
            price: this.goods.price,
            real_price: this.goods.real_price,
            cover: this.goods.small_cover,
            num: 1
          }])
        this.$store.dispatch('order/openVip', params).then(preParams => {
          console.log('openVip', preParams)
          if (preParams) {
            jsPay(preParams).then((res) => {
              this.$api.order.queryOrder(preParams.order_no).then((res)=>{
                this.canSubmit = true
                if( res.code == 200 && res.data.pay_status === "paid" ){
                  uni.showToast({title:"开通会员成功"})
                  setTimeout(function (){
                    uni.redirectTo({url:"/pages/order/order?state=2"})
                  },1000)
                }
              }).catch( ()=>{
                this.canSubmit = true
              })
            })
          }else {
            this.canSubmit = true
          }
        }).catch(()=>{
          this.canSubmit = true
        })
      }
		}
	}
</script>

<style lang='scss'>
	page{
		background: #fff;

    .mix-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 630upx;
      height: 80upx;
      margin: 80upx auto 30upx;
      font-size: $font-lg;
      color: #fff;
      background-color: $base-color;
      border-radius: 10upx;
      box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
    }

    .title{
      margin-top: 25px;
      font-size: 26px;
      text-align: center;
    }

    .price{
      margin-top: 35px;
      font-size: 18px;
      color: #b54c3a;
      text-align: center;
    }

    .desc{
      margin-top: 45px;
      font-size: 16px;
      color: #2C405A;
      text-align: center;
    }
	}
</style>
