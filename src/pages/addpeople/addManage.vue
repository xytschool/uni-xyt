<template>
  <view class="content">
    <view class="row b-b">
      <text class="tit">姓名</text>
      <view class="cont">
        <input
          class="input"
          type="text"
          v-model="addressData.username"
          placeholder="请输入使用人姓名"
          placeholder-class="placeholder"
        />
      </view>
    </view>
    <view class="row b-b">
      <text class="tit">证件号码</text>
      <view class="cont">
        <input
          class="input"
          type="idcard"
          v-model="addressData.id_card"
          placeholder="请输入使用人证件号码"
          placeholder-class="placeholder"
        />
      </view>
    </view>

    <button class="add-btn" @click="confirm">确定</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      addressData: {
        username: '',
        id_card: '',
        type: 'id_card'
      }
    }
  },

  methods: {
    //提交
    confirm() {
      let data = this.addressData
      var nameTest = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/

      if (!nameTest.test(data.username)) {
        this.$api.msg('请填写正确使用人名称')
        return
      }

      const iphoneReg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ //
      if (!iphoneReg.test(data.id_card)) {
        this.$api.msg('身份证格式不正确，请重新填写')
        return
      }
      console.log(data, 'data')

      //接口
      this.$api.user.addAddress(data).then((res) => {
        console.log(res)
        if ((res.code = 200)) {
          this.$api.msg(`常用人已添加成功`)
          // this.$store.commit('user/addPeople', data)
          this.$store.dispatch('user/getAddress')
          uni.navigateBack()
        } else {
          this.$api.msg('添加失败,' + res.msg)
        }
      })

      //this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
      //this.$api.prePage().refreshList(data, this.manageType);
    }
  }
}
</script>
<style lang="scss">
page {
  background: #fff;
  padding-top: 16upx;
}
.content {
  padding: 24rpx 36rpx;
}
.row {
  display: flex;
  margin-bottom: 30rpx;
  height: 70rpx;
  .tit {
    display: inline-block;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #383838;
    line-height: 100rpx;
    width: 118rpx;
    height: 70rpx;
    // vertical-align: bottom;
  }
  .cont {
    flex: 1;
    width: 544rpx;
    height: 70rpx;
    background: #fafafa;
    border-radius: 10rpx 10rpx 10rpx 10rpx;
    margin-left: 20rpx;
    input {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
      color: #333;
      line-height: 70rpx;
      height: 70rpx;
      padding-left: 22rpx;
    }
    .placeholder {
      color: #9a9a9a;
    }
  }
}

.add-btn {
  position: fixed;
  left: 30upx;
  right: 30upx;
  bottom: 16upx;
  z-index: 95;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50rpx;
  font-size: 32upx;
  color: #fff;
  width: 542rpx;
  height: 84rpx;
  background: #649c4a;
  border-radius: 60rpx 60rpx 60rpx 60rpx;
}
</style>
