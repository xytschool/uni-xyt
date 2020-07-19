<template>
    <view class="wrap">
        <view class="key-input">
            <view class="title">输入验证码</view>
            <view class="tips">验证码已发送至 {{mobile}}</view>
            <u-message-input :focus="true" :value="value" @change="change" @finish="finish" mode="bottomLine"
                             :maxlength="maxlength"></u-message-input>
            <text :class="{ error: error }">{{ errorMsg }}</text>
            <view class="captcha">
                <text :class="{ noCaptcha: show }" @tap="noCaptcha">重新发送短信</text>
                <text :class="{ regain: !show }">{{ second }}秒后重新获取验证码</text>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                com_id: 0,
                mobile: '',
                maxlength: 6,
                value: '',
                second: 60,
                show: false,
                error: false,
                errorMsg:'',
            };
        },
        computed: {},
        onLoad(options) {
            this.mobile = options.mobile
            //this.com_id = parseInt(options.com_id)
            // this.getCaptcha()
            let interval = setInterval(() => {
                this.second--;
                if (this.second <= 0) {
                    this.show = true;
                    clearInterval(interval);
                }
            }, 1000);
        },
        methods: {
            // 收不到验证码选择时的选择
            noCaptcha() {
                // uni.showActionSheet({
                //     itemList: ['重新获取验证码', '接听语音验证码'],
                //     success: function (res) {
                //
                //     },
                //     fail: function (res) {
                //
                //     }
                // });
                this.sendSms()
            },
            sendSms() {
                if (this.$u.test.mobile(this.mobile)) {
                    console.log(this.$com_id)
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
                    this.errorMsg = '电话格式错误'
                    uni.showToast({
                        'title': '电话格式错误',
                        'icon': 'none'
                    })
                }
            },
            // change事件侦听
            change(value) {
                // console.log('change', value);
            },
            // 输入完验证码最后一位执行
            finish(value) {
                //console.log('finish', value);
                this.login(value)
            },
            login(code) {
                let params = {
                    com_id: parseInt(this.$com_id),
                    method: 'sms',
                    username: this.mobile,
                    sms_code: code,
                }
                this.$store.dispatch('user/login', params).then(isLogin => {
                    if (isLogin) {
                        uni.showToast({'title': "登录成功"})
                        setTimeout(() => {
                           uni.switchTab({url: `/pages/index/index?com_id=${this.com_id}`})
                        }, 500)
                    } else {
                        this.value = ""
                        this.error = true;
                        this.errorMsg = '验证失败'
                    }
                })
            }
        }
    };
</script>

<style lang="scss" scoped>
    .wrap {
        padding: 80rpx;
    }

    .box {
        margin: 30rpx 0;
        font-size: 30rpx;
        color: 555;
    }

    .key-input {
        padding: 30rpx 0;

        text {
            display: none;
        }

        .error {
            display: block;
            color: red;
            font-size: 30rpx;
            margin: 20rpx 0;
        }
    }

    .title {
        font-size: 50rpx;
        color: #333;
    }

    .key-input .tips {
        font-size: 30rpx;
        color: #333;
        margin-top: 20rpx;
        margin-bottom: 60rpx;
    }

    .captcha {
        color: $u-type-warning;
        font-size: 30rpx;
        margin-top: 40rpx;

        .noCaptcha {
            display: block;
        }

        .regain {
            display: block;
        }
    }
</style>
