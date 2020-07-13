<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view>测试页面</view>
	</view>
</template>

<script>
	import {  
        mapMutations  
    } from 'vuex';
	import {getAuthToken} from "../../utils/utils";
	
	export default{
		data(){
			return {
				mobile: '',
				password: '',
				logining: false
			}
		},
		onLoad(){
			var ws = this.$api.message.newWsClient()
		},
		methods: {
			...mapMutations(['login']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
			toRegist(){
				this.$api.msg('去注册');
			},
			async test() {
					
			}
		},

	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
</style>
