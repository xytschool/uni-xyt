<style lang="scss" scoped>
    .wrap {
        font-size: 28rpx;

        .content {
            width: 600rpx;
            margin: 80rpx auto 0;

            .title {
                text-align: left;
                font-size: 60rpx;
                font-weight: 500;
                margin-bottom: 100rpx;
            }

            input {
                text-align: left;
                margin-bottom: 10rpx;
                padding-bottom: 6rpx;
            }

            .tips {
                color: $u-type-info;
                margin-bottom: 60rpx;
                margin-top: 8rpx;
            }

            .getCaptcha {
                background-color: rgb(253, 243, 208);
                color: $u-tips-color;
                border: none;
                font-size: 30rpx;
                padding: 12rpx 0;

                &::after {
                    border: none;
                }
            }

            .alternative {
                color: $u-tips-color;
                display: flex;
                justify-content: space-between;
                margin-top: 30rpx;
            }
        }

        .buttom {
            .loginType {
                display: flex;
                padding: 350rpx 150rpx 150rpx 150rpx;
                justify-content: space-between;

                .item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: $u-content-color;
                    font-size: 28rpx;
                }
            }

            .hint {
                padding: 20rpx 40rpx;
                font-size: 20rpx;
                color: $u-tips-color;

                .link {
                    color: $u-type-warning;
                }
            }
        }
    }
</style>

<template>
    <view class="wrap">
        <view class="top"></view>
        <view class="content">
            <view class="title">欢迎登录创意堂</view>
            <view class="u-margin-bottom-40">
                <input class="u-border-bottom" type="number" v-model="mobile" placeholder="请输入手机号"/>
            </view>
            <view class="u-margin-bottom-40" v-if="loginMethod == 'password'">
                <input class="u-border-bottom" type="password" v-model="password" placeholder="请输入登录密码"/>
                <button @tap="login" :style="[inputStyle]" class="getCaptcha">登录</button>
            </view>

            <view class="u-margin-bottom-40" v-else>
                <view class="tips">未注册的手机号验证后自动创建创意堂账号</view>
                <button @tap="sendSms" :style="[inputStyle]" class="getCaptcha">获取短信验证码</button>
            </view>

            <view class="alternative">
                <view class="password" v-if="loginMethod=='phone'" @click="loginMethod ='password'">密码登录</view>
                <view class="password" v-else @click="loginMethod ='phone'">短信登录</view>
                <view class="issue">遇到问题</view>
            </view>
        </view>
        <view class="buttom">
            <view class="loginType">
                <view class="wechat item">
                    <view class="icon">
                        <u-icon size="70" name="weixin-fill" color="rgb(83,194,64)"></u-icon>
                    </view>
                    微信
                </view>
                <view class="QQ item">
                    <view class="icon">
                        <u-icon size="70" name="qq-fill" color="rgb(17,183,233)"></u-icon>
                    </view>
                    QQ
                </view>
            </view>
            <view class="hint">
                登录代表同意
                <text class="link">创意堂点评用户协议、隐私政策，</text>
                并授权使用您的创意堂点评账号信息（如昵称、头像、收获地址）以便您统一管理
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                mobile: '17150014402',
                password: '',
                loginMethod: 'password',
                //com_id: 0
            }
        },
        computed: {
            inputStyle() {
                let style = {};
                if (this.mobile) {
                    style.color = "#fff";
                    style.backgroundColor = this.$u.color['warning'];
                }
                return style;
            }
        },
        onLoad(params){
            //this.com_id = parseInt(params.com_id)
        },
        methods: {
            login(){
                if (!this.$u.test.mobile(this.mobile)) {
                    uni.showToast({
                        'title': '电话号码格式不对',
                        'icon': 'none'
                    })
                    return
                }
                if(this.password.length< 6){
                    uni.showToast({
                        'title': '密码最少6个字符',
                        'icon': 'none'
                    })
                    return
                }
                
                var params = {
                    com_id: parseInt(this.$com_id),
                    username: this.mobile,
                    password: this.password
                }
                this.$store.dispatch('user/login', params).then((ret)=>{
                    let pages = getCurrentPages();
                    if(pages.length >= 2) {
                        uni.navigateBack()
                    }else {
                        this.$u.route({
                            url: 'pages/index/index?com_id=' + this.com_id,
                            queryParams: {
                                com_id: this.com_id
                            }
                        })
                    }
                })
            },
            sendSms() {
                if (this.$u.test.mobile(this.mobile)) {
                    var params = {
                        com_id: parseInt(this.$com_id),
                        mobile: this.mobile,
                    }
                    this.$api.user.sendLoginMessage(params).then(res => {
                        if (res.code == 200) {
                            uni.navigateTo({url: '/pages/login/code?mobile=' + this.mobile +'&com_id=' + this.com_id})
                        } else {
                            uni.showToast({
                                'title': '短信发生失败' + res.msg ? res.msg : '',
                                'icon': 'none'
                            })
                        }
                    })

                } else {
                    uni.showToast({
                        'title': '电话格式错误',
                        'icon': 'none'
                    })
                }
            }
        }
    };
</script>


