<template>
	<view>
		<view class="comment" v-for="(res, index) in commentList" :key="res.id">
			<view class="left"><image :src="res.avatar" mode="aspectFill"></image></view>
			<view class="right">
				<view class="top">
					<view class="name">{{ res.nickname ? res.nickname :"匿名用户" }}</view>
					<view class="like" :class="{ highlight: res.isLike }">
						<view class="num">{{ res.up_num }}</view>
						<u-icon v-if="!res.isLike" name="thumb-up" :size="30" color="#9a9a9a" @click="getLike(index)"></u-icon>
						<u-icon v-if="res.isLike" name="thumb-up-fill" :size="30" @click="getLike(index)"></u-icon>
					</view>
				</view>
				<view class="content">{{ res.content }}</view>
				<view class="content"> 
						<img v-for="(cover ,index) in res.covers" 
						style="width:48%;margin-right:2%"
						:key="index" :src="cover" mode="aspectFit"/>
				</view>
				<view class="reply-box">
					<view class="item" v-for="(item, index) in res.reply_list" :key="item.index">
						<view class="username">{{ item.nickname? item.nickname:'匿名' }}</view>
						<view class="text">{{ item.content }}</view>
					</view>
					<view class="all-reply" @tap="toAllReply(res)" v-if="res.reply_list && res.reply_list.length > 0">
						共{{ res.reply_num }}条回复
						<u-icon class="more" name="arrow-right" :size="26"></u-icon>
					</view>
				</view>
				<view class="bottom">
					{{ parseDate(res.created_at) }}
					<view class="reply" @click="showReply(res)">回复</view>
				</view>
				<view v-if="res.showReply">
					<textarea v-model="res.reply" maxlength="128" placeholder="请输入回复内容"/>
					<button @click="doReply(res)" size="mini" type="primary">确定</button>
				</view>
			</view>
		</view>
	<u-loadmore :status="loadmore" />
	</view>
</template>

<script>
import {getCommentList,submitComment,upComment} from "../../api/comment"
import {parseDate} from "../../utils/date"
export default {
	data() {
		return {
			loadmore:'loadmore',
			commentList: [],
			goods_id: 0,
			limit: 10,
			lastId: 0,
			onPullDown:false,
		};
	},
	onLoad(params) {
		console.log('params',params)
		this.goods_id = parseInt(params.goods_id)
		this.getComment();
	},
	methods: {
		parseDate(date){
			return parseDate(date)
		},
		showReply(res){
			console.log('showReply',res)
			res.showReply = !res.showReply 
		},
		doReply(res){
			if(res.reply.length < 6){
				uni.showToast({
  					  title: '请您输入6个以上的字符',
   					  duration: 2000
				});
				return
			}

      		uni.showLoading()
   			var comment ={
    		    goods_id: parseInt(this.goods_id),
     		    content: res.reply,
      		    pid: res.id 
			}
			//console.log('doReply',res,comment)
			submitComment(comment).then(res =>{
				uni.hideLoading()
				if(res.code == 200){
					uni.showToast({
  					  title: '评论成功',
   					  duration: 2000
					});
					this.getComment()
				}else{
					uni.showToast({
						title: '评论失败' + res.msg,
   					  	duration: 2000
					});
				}
			})
		},
		// 跳转到全部回复
		toAllReply(res) {
			uni.navigateTo({
				url: '/pages/comment/reply?comment_id=' + res.id
			});
		},
		// 点赞
		getLike(index) {
			upComment({id: this.commentList[index].id}).then( res => {
				this.commentList[index].up_num++;
				uni.showToast({
					title: '点赞成功',
   				  	duration: 2000
				});
			})
			// this.commentList[index].isLike = !this.commentList[index].isLike;
			// if (this.commentList[index].isLike == true) {
			// 	this.commentList[index].likeNum++;
			// } else {
			// 	this.commentList[index].likeNum--;
			// }
		},
		// 评论列表
		onPullDownRefresh() {
			//this.onPullDown = true
			//getComment()
			console.log('refresh');
		  },
		onReachBottom() {
			this.getComment()		
		},
		getComment() {
			this.loadmore = 'loading';
			var last_id = 0
			if(this.commentList.length > 0 ){
				last_id = this.commentList[this.commentList.length -1].id
			}
			getCommentList({goods_id:this.goods_id,last_id}).then(res =>{
				if(res.data.length == 0){
					this.loadmore = 'nomore';
				}else{
					this.loadmore = 'loadmore';
				}
				//console.log(res.data)
				if(res.code != 200){
					return
				}
				res.data.forEach((v,index,list) =>{
					list[index].showReply = false 
					list[index].reply = '' 
				    this.commentList.push(list[index])
				})
			})	

			// this.commentList = [
			// 	{
			// 		id: 1,
			// 		name: '叶轻眉',
			// 		date: '12-25 18:58',
			// 		contentText: '我不信伊朗会没有后续反应，美国肯定会为今天的事情付出代价的',
			// 		url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
			// 		allReply: 12,
			// 		likeNum: 33,
			// 		isLike: false,
			// 		replyList: [
			// 			{
			// 				name: 'uview',
			// 				contentStr: 'uview是基于uniapp的一个UI框架，代码优美简洁，宇宙超级无敌彩虹旋转好用，用它！'
			// 			},
			// 			{
			// 				name: '粘粘',
			// 				contentStr: '今天吃什么，明天吃什么，晚上吃什么，我只是一只小猫咪为什么要烦恼这么多'
			// 			}
			// 		]
			// 	},
			// 	{
			// 		id: 2,
			// 		name: '叶轻眉1',
			// 		date: '01-25 13:58',
			// 		contentText: '我不信伊朗会没有后续反应，美国肯定会为今天的事情付出代价的',
			// 		allReply: 0,
			// 		likeNum: 11,
			// 		isLike: false,
			// 		url: 'https://cdn.uviewui.com/uview/template/niannian.jpg',
			// 	},
			// 	{
			// 		id: 3,
			// 		name: '叶轻眉2',
			// 		date: '03-25 13:58',
			// 		contentText: '我不信伊朗会没有后续反应，美国肯定会为今天的事情付出代价的',
			// 		allReply: 0,
			// 		likeNum: 21,
			// 		isLike: false,
			// 		allReply: 2,
			// 		url: '../../../static/logo.png',
			// 		replyList: [
			// 			{
			// 				name: 'uview',
			// 				contentStr: 'uview是基于uniapp的一个UI框架，代码优美简洁，宇宙超级无敌彩虹旋转好用，用它！'
			// 			},
			// 			{
			// 				name: '豆包',
			// 				contentStr: '想吃冰糖葫芦粘豆包，但没钱5555.........'
			// 			}
			// 		]
			// 	},
			// 	{
			// 		id: 4,
			// 		name: '叶轻眉3',
			// 		date: '06-20 13:58',
			// 		contentText: '我不信伊朗会没有后续反应，美国肯定会为今天的事情付出代价的',
			// 		url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
			// 		allReply: 0,
			// 		likeNum: 150,
			// 		isLike: false
			// 	}
			// ];
		}
	}
};
</script>

<style lang="scss" scoped>
.comment {
	display: flex;
	padding: 30rpx;
	.left {
		image {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			background-color: #f2f2f2;
		}
	}
	.right {
		flex: 1;
		padding-left: 20rpx;
		font-size: 30rpx;
		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 10rpx;
			.name {
				color: #5677fc;
			}
			.like {
				display: flex;
				align-items: center;
				color: #9a9a9a;
				font-size: 26rpx;
				.num {
					margin-right: 4rpx;
					color: #9a9a9a;
				}
			}
			.highlight {
				color: #5677fc;
				.num {
					color: #5677fc;
				}
			}
		}
		.content {
			margin-bottom: 10rpx;
		}
		.reply-box {
			background-color: rgb(242, 242, 242);
			border-radius: 12rpx;
			.item {
				padding: 20rpx;
				border-bottom: solid 2rpx $u-border-color;
				.username {
					font-size: 24rpx;
					color: #999999;
				}
			}
			.all-reply {
				padding: 20rpx;
				display: flex;
				color: #5677fc;
				align-items: center;
				.more {
					margin-left: 6rpx;
				}
			}
		}
		.bottom {
			margin-top: 20rpx;
			display: flex;
			font-size: 24rpx;
			color: #9a9a9a;
			.reply {
				color: #5677fc;
				margin-left: 10rpx;
			}
		}
	}
}
</style>
