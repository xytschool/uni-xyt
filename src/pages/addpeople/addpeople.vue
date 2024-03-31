<template>
  <view class="content b-t">
    <view v-if="addpeopleList">
      <view
        class="list b-b"
        v-for="(item, index) in addpeopleList"
        :key="index"
        @click="checkAddpeopleList(item)"
      >
        <view class="wrapper">
          <view class="information-box">
            <view class="name">{{ item.username }}</view>
            <view class="mobile">{{ item.id_card }}</view>
          </view>
          <view class="delect-box" @click="delectAddpeople(item)">
            <text class="yticon icon-iconfontshanchu1"></text>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="noData">
      还没有常用使用人哦！
    </view>

    <button class="add-btn" @click="addAddpeople('add')">新增使用人</button>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {}
  },
  onLoad(option) {
    console.log(option, 'option')
    this.$store.dispatch('user/getAddress')
    console.log(addpeopleList, 'addpeopleList')
  },
  computed: {
    ...mapState({
      addpeopleList: (state) => state.user.addpeopleList
    })
  },
  methods: {
    //选择地址

    addAddpeople(type, item) {
      uni.navigateTo({
        url: '/pages/addpeople/addManage'
      })
    },
    delectAddpeople(item) {
      this.$api.user.deleteAddress(item.id).then((res) => {
        console.log(res)
        if ((res.code = 200)) {
          this.$api.msg('删除成功')
          this.$store.commit('user/delPeople', item.id)
          this.$store.dispatch('user/getAddress')
        } else {
          this.$api.msg('删除失败,' + res.msg)
        }
      })
    },
    //添加或修改成功之后回调
    refreshList(data, type) {
      console.log(data, type, 'refreshList')
      //添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
      this.addressList.unshift(data)
    }
  }
}
</script>

<style lang="scss">
page {
  padding-bottom: 120upx;
}
.content {
  position: relative;
}
.list {
  display: flex;
  align-items: center;
  padding: 20upx 30upx;
  background: #fff;
  position: relative;
}
.wrapper {
  width: 100%;
  display: flex;
  // flex-direction: column;
  padding: 20rpx 30rpx 6rpx 20rpx;
  line-height: 50px;
}

.information-box {
  flex: 1;
  .name {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #1a1a1a;
    line-height: 33rpx;
  }
  .mobile {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 24rpx;
    color: #767676;
    line-height: 28rpx;
    margin-top: 20rpx;
  }
}
.delect-box {
  height: 17rpx;
  width: 36rpx;
  vertical-align: bottom;
  display: inline-block;

  .icon-iconfontshanchu1 {
    color: #767676;
    // height: 36rpx;
    // width: 36rpx;
  }
}

.icon-bianji {
  display: flex;
  align-items: center;
  height: 80upx;
  font-size: 40upx;
  color: $font-color-light;
  padding-left: 30upx;
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

.noData {
  padding-top: 50rpx;
  text-align: center;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #7d7d7d;
  line-height: 33rpx;
}
</style>
