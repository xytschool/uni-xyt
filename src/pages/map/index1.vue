<template>
  <view>
    <view class="page-section page-section-gap">
      <map
        style="width: 100%; height: 100vh;"
        :latitude="latitude"
        :longitude="longitude"
        show-location="true"
        isHighAccuracy="true"
        highAccuracyExpireTime="4000"
      >
      </map>
    </view>
    <view>
      <u-popup
        v-model="show"
        border-radius="14"
        ref="popup"
        mode="bottom"
        closeable="true"
      >
        <view class="popup">
          <view class="list">
            <view class="title">
              添加标记
            </view>
            <!-- <view class="voice">语音播报</view> -->
          </view>
          <view class="list">
            <span>地点名称：</span>
            <input class="text" type="text" placeholder="请输入地点名称" />
          </view>
          <view class="list" style="height: 120px;">
            <span>描述信息：</span>
            <textarea
              class="remarks"
              v-model="value1"
              placeholder="请输入描述信息"
            ></textarea>
            <!-- cols="3"
              rows="5"
              maxlength="50" -->
            <!-- <view class="more">更多</view> -->
          </view>
          <button class="add">添加</button>
          <!-- <view class="list"> <span>相关商品：</span><input type="text"/></view> -->
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: 0, // 使用 marker点击事件 需要填写id
      title: 'map',
      latitude: '',
      longitude: '',
      show: true
    }
  },
  onLoad() {},
  methods: {
    getLocation() {
      uni.authorize({
        success: () => {
          // 已授权，获取位置信息
          uni.getLocation({
            type: 'gcj02',
            success: (res) => {
              const { latitude, longitude } = res
              this.latitude = latitude
              this.longitude = longitude
            },
            fail: () => {
              uni.showToast({
                title: '无法获取位置，请开启定位服务',
                icon: 'none'
              })
            }
          })
        },
        fail: () => {
          uni.showToast({
            title: '请授权位置权限',
            icon: 'none'
          })
        }
      })
    }
  },
  mounted() {
    // this.getLocation()
  }
}
</script>
<style scoped lang="scss">
.popup {
  height: 60vh;
  padding: 20px;
}

.title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 18px;
  color: #333333;
  text-align: center;
  width: 100vw;
}
.voice {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 10px;
  position: absolute;
  right: 32px;
  top: 40px;
}
.list {
  height: 50px;
  display: flex;

  span {
    width: 160rpx;
    line-height: 40px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #3f3f3f;
  }
  .text {
    width: 200px;
    height: 30px;
    line-height: 30px;
    box-shadow: 0px 1px 4px 0px rgba(114, 114, 114, 0.05);
    border-radius: 3px 3px 3px 3px;
    border: 1px solid #d6d6d6;
    padding-left: 5px;
    font-family: PingFang SC, PingFang SC;

    font-size: 12px;
    color: #333333;
  }
}
.remarks {
  height: 120px;
  line-height: 18px;
  width: 200px;
  box-shadow: 0px 1px 4px 0px rgba(114, 114, 114, 0.05);
  border-radius: 3px 3px 3px 3px;
  border: 1px solid #d6d6d6;
  padding: 5px;
  resize: none;
  overflow: hidden;
  font-family: PingFang SC, PingFang SC;
  font-size: 12px;
  color: #333333;
}
.more {
  font-family: PingFang SC, PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #355c89;
  line-height: 16px;
}
.add {
  width: 261px;
  height: 37px;
  background: #649c4a;
  border-radius: 30px 30px 30px 30px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 14px;
  color: #ffffff;
  margin-top: 20px;
}
</style>
