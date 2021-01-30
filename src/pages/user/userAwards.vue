<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="loadData"
				>
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					
					<!-- 订单列表 -->
					<view 
						v-for="(item,index) in tabItem.orderList" :key="index"
						class="order-item"
					>
						<view class="i-top b-b" v-if="tabItem.state == 'userAwardHistories'">
							<text class="time">{{item.created_at}}</text>
						</view>

						<view class="goods-box-single" >
							<image class="goods-img" :src="item.goods.small_cover" mode="aspectFill"></image>
							<view class="right">
                <text class="title">{{item.goods.name}}</text>
                <text class="num" v-if="tabItem.state == 'userAwardHistories'">
                  通过
                  <text class="method" @click="gotoDetail(item)">
                    {{method2str(item.method)}}
                  </text>
                  {{item.num > 0 ? "获得" : "消耗" }}  {{item.num}} 件
                </text>
                <text class="num" v-if="tabItem.state == 'userAwards'">剩余数量:{{item.num}}</text>
							</view>
						</view>

						<view class="action-box b-t" v-if="tabItem.state == 'userAwards'">
							<button class="action-btn" @click="gotoReward(item)">核销码</button>
						</view>
					</view>
					 
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					
				</scroll-view>
			</swiper-item>
		</swiper>

    <u-modal v-model="isShowCode" :title="'核销码'" width="70%" :title-style="{fontSize:'20px'}">
      <view style="text-align: center;padding: 10px">
        <img :src="'https://help.xytschool.com/getQrcode?code='+ code" style="width: 200px"/>
        <u-count-down ref="uCountDown"  :timestamp="leftTime" separator="colon"  @end="updateCode"></u-count-down>
      </view>
    </u-modal>

	</view>
</template> 

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
  import {getUserAwardHistories, getUserAwards} from "@/api/activity";
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
			  code : 0 ,
        isShowCode: false,
				tabCurrentIndex: 0,
        leftTime: 0,
        currentItem: null,
				navList: [{
						state: 'userAwards',
						text: '用户奖品',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 'userAwardHistories',
						text: '历史记录',
						loadingType: 'more',
						orderList: []
					}],
			};
		},

		onLoad(options){
			this.tabCurrentIndex = 0
      this.loadData()
		},
		 
		methods: {
			//获取订单列表
			async loadData(source){
				//这里是将订单挂载到tab列表下
				let navItem = this.navList[this.tabCurrentIndex];
				let state = navItem.state;
				
				if(source === 'tabChange' && navItem.loaded === true){
					//tab切换只有第一次需要加载数据
					return;
				}
				if(navItem.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				
				navItem.loadingType = 'loading';
				let len = navItem.orderList.length
				var last_id = len > 0 ? navItem.orderList[len - 1].id : 0
        var res = null
        console.log( 'state' ,state )
        if(state == "userAwards"){
           res = await getUserAwards(last_id)
        }else if(state == "userAwardHistories"){
           res = await getUserAwardHistories(last_id)
        }

				if(res.code == 200){
				    let list = res.data
            if(list.length ==0 ) {
              navItem.loadingType = 'noMore';
              return
            }
            list.forEach(item =>{
            navItem.orderList.push(item)
					 })
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(navItem, 'loaded', true);
					//判断是否还有数据， 有改为 more， 没有改为noMore
					navItem.loadingType = 'more';
				}
			},
      gotoDetail(item) {
			  if(item.method == 'activity'){
          uni.navigateTo({
            url: `/pages/activity/detail?id=` + item.activity_id
          })
        }
      },
      method2str(method){
			  switch (method) {
         case 'activity':
            return '活动'
         case '':
            return ''
        }
      },
			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
			},
      gotoReward(item){
			  this.currentItem = item
			  this.updateCode()
      },
      updateCode(){
        console.log("gotoReward", this.currentItem)
        this.$api.activity.getUserAwardCode(this.currentItem.id ,1).then((res)=>{
          if(res.code == 200){
            console.log('res', res)
            this.isShowCode = true
            this.code = res.data.code
            this.leftTime = 30
            this.$refs.uCountDown.start();
          }
        })
      }
      
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
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

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
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
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: $font-base + 0upx;
					color: $font-color-dark;
					//line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}
				.method{
					font-size: $font-base + 2upx;
          font-weight: 500;
					color: $font-color-dark;
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
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
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
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
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
