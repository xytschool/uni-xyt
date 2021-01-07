<template>
    <view class="content">
        <view class="row b-b">
            <text class="tit">联系人</text>
            <input class="input" type="text" v-model="addressData.username" placeholder="收货人姓名"
                   placeholder-class="placeholder"/>
        </view>
        <view class="row b-b">
            <text class="tit">手机号</text>
            <input class="input" type="number" v-model="addressData.mobile" placeholder="收货人手机号码"
                   placeholder-class="placeholder"/>
        </view>
        <view class="row b-b">
            <text class="tit">地址</text>
<!--            <text @click="chooseLocation" class="input">-->
             <text class="input" @click="showAddressPicker = true">{{addressData.addressPrefix||'点击选择'}}</text>
             <city-select v-model="showAddressPicker" @city-change="cityChange"></city-select>
            <text class="yticon icon-shouhuodizhi"></text>
        </view>
        <u-picker mode="region" ref="uPicker" v-model="show" />
        <view class="row b-b">
            <text class="tit">门牌号</text>
            <input class="input" type="text" v-model="addressData.area" placeholder="楼号、门牌" placeholder-class="placeholder"/>
        </view>

        <view class="row default-row">
            <text class="tit">设为默认</text>
            <switch :checked="addressData.default" color="#fa436a" @change="switchChange"/>
        </view>
        <button class="add-btn" @click="confirm">提交</button>
    </view>
</template>

<script>
    import citySelect from './u-city-select.vue';
    export default {
        components:{
          citySelect
        },
        data() {
            return {
                showAddressPicker: false,
                addressData: {
                    username: '',
                    mobile: '',
                    addressPrefix: '',
                    address: '',
                    area: '北京',
                    default: false,
                    province_id: 0,
                    city_id: 0,
                    district_id: 0
                }
            }
        },
        onLoad(option) {
            let title = '新增收货地址';
            if (option.type === 'edit') {
                title = '编辑收货地址'
                this.addressData = JSON.parse(option.data)
                var arr = this.addressData.address.split(' ')
                this.addressData.addressPrefix = arr[0]
                this.addressData.area = arr[1]
            }
            this.manageType = option.type;
            uni.setNavigationBarTitle({
                title
            })
        },
        methods: {
            switchChange(e) {
                this.addressData.default = e.detail.value;
            },
            cityChange(e) {
             this.addressData.province_id =  parseInt(e.province.value)
             this.addressData.city_id = parseInt(e.province.value)
             this.addressData.district_id = parseInt(e.area.value)
             this.addressData.addressPrefix = e.province.label + '-' + e.city.label + '-' + e.area.label;
             console.log('cityChange' , e ,this.addressData)
            },
          //地图选择地址
            chooseLocation() {
                uni.chooseLocation({
                    success: (data) => {
                        console.log('chooseLocation', data)
                        this.addressData.addressName = data.name;
                        this.addressData.address = data.name;
                    }
                })
            },

            //提交
            confirm() {
                this.addressData.address = this.addressData.addressPrefix + ' ' +this.addressData.area
                let data = this.addressData;
                if (!data.username) {
                    this.$api.msg('请填写收货人姓名');
                    return;
                }
                if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.mobile)) {
                    this.$api.msg('请输入正确的手机号码');
                    return;
                }
                if (!data.address) {
                    this.$api.msg('请在选择所在位置');
                    return;
                }
                if (!data.area) {
                    this.$api.msg('请填写门牌号信息');
                    return;
                }

                data.checked = data.default

                if (data.id) {
                    this.$api.user.changeAddress(data).then(res => {
                        if (res.code = 200) {
                            this.$store.commit('user/updateAddress', res.data)
                            this.$api.msg(`地址${this.manageType == 'edit' ? '修改' : '添加'}成功`);
                            uni.navigateBack()
                        } else {
                            this.$api.msg('修改失败,' + res.msg);
                        }
                    })
                } else {
                    this.$api.user.addAddress(data).then(res => {
                        //console.log(res)
                        if (res.code = 200) {
                            this.$api.msg(`地址${this.manageType == 'edit' ? '修改' : '添加'}成功`);
                            this.$store.commit('user/addAddress', res.data)
                            uni.navigateBack()
                        } else {
                            this.$api.msg('修改失败,' + res.msg);
                        }
                    })

                }

                //this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
                //this.$api.prePage().refreshList(data, this.manageType);
            },
        }
    }
</script>

<style lang="scss">
    page {
        background: $page-color-base;
        padding-top: 16upx;
    }

    .row {
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 30upx;
        height: 110upx;
        background: #fff;

        .tit {
            flex-shrink: 0;
            width: 120upx;
            font-size: 30upx;
            color: $font-color-dark;
        }

        .input {
            flex: 1;
            font-size: 30upx;
            color: $font-color-dark;
        }

        .icon-shouhuodizhi {
            font-size: 36upx;
            color: $font-color-light;
        }
    }

    .default-row {
        margin-top: 16upx;

        .tit {
            flex: 1;
        }

        switch {
            transform: translateX(16upx) scale(.9);
        }
    }

    .add-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 690upx;
        height: 80upx;
        margin: 60upx auto;
        font-size: $font-lg;
        color: #fff;
        background-color: $base-color;
        border-radius: 10upx;
        box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
    }
</style>
