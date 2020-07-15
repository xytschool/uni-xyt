<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.id" class="f-item b-b"
				  :class="{active: item.id === currentId}" @click="tabtap(item)">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside"
					 @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view v-for="item in slist" :key="item.id" class="s-list" :id="'main-'+item.id">
				<text class="s-item">{{item.name}}</text>
				<view class="t-list">
					<view @click="navToGoods(item.id, titem.id)" v-if="titem.tags == item.id"
						  class="t-item" v-for="titem in tlist" :key="titem.id">
						<image class="cover" :src="titem.small_cover"></image>
                        <view class="desc">
							<text class="name">{{titem.name}}</text>
							<text class="price">${{titem.real_price}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {mapState} from "vuex";

	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
				//flist: [],
				slist: [],
				tlist: [],
			}
		},
		onLoad(){
			this.loadData();
		},
		computed:{
			...mapState({
				flist : state => state.goods.goodsTags,
				allGoods: state => state.goods.allGoods
			})
		},
		methods: {
			async loadData(){
			   await this.$store.dispatch('goods/getGoodsTags')
			   await this.$store.dispatch('goods/getAllGoods')
				//let list = await this.$api.json('cateList');
				this.allGoods.forEach( item=>{
					//console.log('item',item)
					this.tlist.push(item)
				})
				this.flist.forEach(item=>{
				    //console.log('item',item)
					this.slist.push(item); //没有图的是2级分类
				})
			},
			//一级分类点击
			tabtap(item){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				
				this.currentId = item.id;
				let index = this.slist.findIndex(sitem=>sitem.id === item.id);
				console.log('tab', index)
				this.tabScrollTop = this.slist[index].top;
			},
			//右侧栏滚动
			asideScroll(e){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item=>item.top <= scrollTop).reverse();
				if(tabs.length > 0){
					this.currentId = tabs[0].id;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				this.slist.forEach(item=>{
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(sid, tid){
				uni.navigateTo({
					url: `/pages/product/list?fid=${this.currentId}&sid=${sid}&tid=${tid}`
				})
			},
			navToGoods(sid, tid){
				uni.navigateTo({
					url: `/pages/product/product?id=${tid}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}
	.t-list{
		display: flex;
		//flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		flex-direction: column;

		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		//flex-direction: column;
		//width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		.cover {
			flex: 0 0 140upx;
			width: 140upx;
			height: 140upx;
		}
		.desc{
			flex: 1;
			flex-direction: column;
            padding-left: 15px;
			.name{
                font-weight: 500;
				font-size: 16px;
                display: flex;
				flex: 1;
			}
			.price{
				flex: 1;
				text-align: right;
			}
		}
	}
</style>
