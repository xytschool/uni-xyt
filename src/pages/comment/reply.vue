<template>
	<view class="wrap">
		<view class="comment">
			<view class="top">
				<view class="left">
					<view class="heart-photo">
						<image :src="comment.avatar" mode=""></image></view>
					<view class="user-info">
						<view class="name">{{ comment.nickname? comment.nickname:'匿名用户' }}</view>
						<view class="date">{{parseDate(comment.created_at)}}</view>
					</view>
				</view>
				<view class="right" :class="{ highlight: comment.isLike }">
					{{ comment.up_num }}
					<u-icon v-if="!comment.isLike" name="thumb-up" class="like" color="#9a9a9a" :size="30" @click="getLike(0)"></u-icon>
					<u-icon v-if="comment.isLike" name="thumb-up-fill" class="like" :size="30" @click="getLike"></u-icon>
				</view>
			</view>
			<view class="content">{{ comment.content }}</view>
			<view class="content"> 
				<img v-for="(cover ,index) in comment.covers" 
				style="width:48%;margin-right:2%"
				:key="index" :src="cover" mode="aspectFit"/>
			</view>
		</view>
		<view class="all-reply">
			<view class="all-reply-top">全部回复（{{ comment.reply_num }}）</view>
			<view class="item" v-for="(item, index) in commentList" :key="index">
				<view class="comment">
					<view class="top">
						<view class="left">
							<view class="heart-photo"><image :src="item.avatar" mode=""></image></view>
							<view class="user-info">
								<view class="name">{{ item.nickname? item.nickname:'匿名用户' }}</view>
								<view class="date">{{ parseDate(item.created_at) }}</view>
							</view>
						</view>
						<view class="right"  :class="{ highlight: item.isLike }">
							<view class="num">{{ item.up_num }}</view>
							<u-icon v-if="!item.isLike" name="thumb-up" class="like" :size="30" color="#9a9a9a" @click="getLike(index)"></u-icon>
							<u-icon v-if="item.isLike" name="thumb-up-fill" class="like" :size="30" @click="getLike(index)"></u-icon>
						</view>
					</view>
					<view class="reply" v-if="item.reply">
						<view class="username">{{ item.reply.name }}</view>
						<view class="text">{{ item.reply.content }}</view>
					</view>
					<view class="content">{{ item.content }}</view>
				</view>
			</view>
			<u-loadmore :status="loadmore" />
		</view>
	</view>
</template>

<script>
import {getSubCommentList,submitComment,upComment} from "../../api/comment"
import {parseDate} from "../../utils/date"
export default {
	data() {
		return {
			loadmore: 'loadmore',
			commnet_id: 0,
			commentList: [],
			comment: ''
		};
	},
	onLoad(params) {
		this.comment_id = parseInt(params.comment_id)
		if(this.comment_id<=0){
			return 
		}
		this.getReply();
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
   			var comment ={
    		    goods_id: parseInt(this.goods_id),
     		    content: res.reply,
      		    pid: res.id 
      		}
			console.log('doReply',res,comment)
			submitComment(comment)
		},
		// 点赞
		getLike(index) {
			var id = index >=0  ? 
			    this.commentList[index].id :
				this.comment.id
			upComment({id: id}).then( res => {
				if(res.code != 200){
					return 
				}
				uni.showToast({
  				  title: '点赞成功',
   				  duration: 2000
				});
				if(index >=0 ) {
			        this.commentList[index].up_num++;
				}else{
					this.comment.up_num++
				}
			})
		},
		onReachBottom() {
			this.getReply()		
		},
		// 回复列表
		getReply() {
			this.loadmore = 'loading';
			var last_id = 0
			if(this.commentList.length > 0 ){
				last_id = this.commentList[this.commentList.length -1].id
			}
			getSubCommentList({id:this.comment_id,lastid}).then(res =>{
				if(res.data.length == 0){
					this.loadmore = 'nomore';
				}else{
					this.loadmore = 'loadmore';
				}	

				if(res.code != 200){
					return
				}
				console.log('getSubCommentList', res)
				this.comment = res.data.comment
				res.data.subCommentList.data.forEach((v)=>{
				this.commentList.push(v) 
				})
			})	

			// this.comment = {
			// 	id: 1,
			// 	name: '叶轻眉',
			// 	date: '12-25 18:58',
			// 	contentText: '我不信伊朗会没有后续反应，美国肯定会为今天的事情付出代价的',
			// 	url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
			// 	allReply: 12,
			// 	likeNum: 33,
			// 	isLikes: false
			// };
			// this.commentList = [
			// 	{
			// 		name: '新八几',
			// 		date: '12-25 18:58',
			// 		contentText: '不要乱打广告啊喂！虽然是真的超好用',
			// 		url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
			// 		likeNum: 33,
			// 		isLike: false,
			// 		reply: {
			// 			name: 'uview',
			// 			contentStr: 'uview是基于uniapp的一个UI框架，代码优美简洁，宇宙超级无敌彩虹旋转好用，用它！'
			// 		}
			// 	},
			// 	{
			// 		name: '叶轻眉1',
			// 		date: '01-25 13:58',
			// 		url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
			// 		contentText: '我不信伊朗会没有后续反应，美国肯定会为今天的事情付出代价的',
			// 		allReply: 0,
			// 		likeNum: 11,
			// 		isLike: false,
			// 		reply: {
			// 			name: '粘粘',
			// 			contentStr: '今天吃什么，明天吃什么，晚上吃什么，我只是一只小猫咪为什么要烦恼这么多'
			// 		}
			// 	},
			// 	{
			// 		name: '叶轻眉2',
			// 		date: '03-25 13:58',
			// 		contentText: '我不信伊朗会没有后续反应，美国肯定会为今天的事情付出代价的',
			// 		allReply: 0,
			// 		likeNum: 21,
			// 		url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
			// 		isLike: false,
			// 		allReply: 2,
			// 		reply: {
			// 			name: '豆包',
			// 			contentStr: '想吃冰糖葫芦粘豆包，但没钱5555.........'
			// 		}
			// 	},
			// 	{
			// 		name: '叶轻眉3',
			// 		date: '06-20 13:58',
			// 		contentText: '我不信伊朗会没有后续反应，美国肯定会为今天的事情付出代价的',
			// 		allReply: 0,
			// 		likeNum: 150,
			// 		url: 'https://cdn.uviewui.com/uview/template/SmilingDog.jpg',
			// 		isLike: false
			// 	}
			// ];
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f2f2f2;
}
.comment {
	padding: 30rpx;
	font-size: 32rpx;
	background-color: #ffffff;
	.top {
		display: flex;
		justify-content: space-between;
	}
	.left {
		display: flex;
		.heart-photo {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}
		.user-info {
			margin-left: 10rpx;
			.name {
				color: #5677fc;
				font-size: 28rpx;
				margin-bottom: 4rpx;
			}
			.date {
				font-size: 20rpx;
				color: $u-light-color;
			}
		}
	}
	.right {
		display: flex;
		font-size: 20rpx;
		align-items: center;
		color: #9a9a9a;
		.like {
			margin-left: 6rpx;
		}
		.num{
			font-size: 26rpx;
			color: #9a9a9a;
		}
	}
	.highlight {
		color: #5677fc;
		.num{
			color: #5677fc;
		}
	}
}
.all-reply {
	margin-top: 10rpx;
	padding-top: 20rpx;
	background-color: #ffffff;
	.all-reply-top {
		margin-left: 20rpx;
		padding-left: 20rpx;
		border-left: solid 4rpx #5677fc;
		font-size: 30rpx;
		font-weight: bold;
	}
	.item {
		border-bottom: solid 2rpx $u-border-color;
	}
	.reply {
		padding: 20rpx;
		background-color: rgb(242, 242, 242);
		border-radius: 12rpx;
		margin: 10rpx 0;
		.username {
			font-size: 24rpx;
			color: #7a7a7a;
		}
	}
}
</style>
