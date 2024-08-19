<template>
  <view>
    <view class="page-section page-section-gap">
      <map
        style="width: 100%; height: 100vh;"
        :latitude="latitude"
        :longitude="longitude"
        :markers="covers"
        @markertap="bindmarkertap"
      >
      </map>
      <!-- <view > 上报坐标</view> -->
      <view class="" icon="icon-dizhi" title="上报坐标"></view>
    </view>
    <view>
      <!-- <button @click="open">打开弹窗</button> -->
      <uni-popup ref="popup" type="bottom">
        <view>
          <uni-list v-for="(item, index) in List" :key="index">
            <view>
              <text class="text">xxxxx标题</text>
              <!-- 点击地图其它地方也能关闭 -->
              <view @click="close()">
                <uni-icons type="closeempty" size="30"></uni-icons>
              </view>
            </view>
            <uni-list-item title="名称" :rightText="item.name" />
            <uni-list-item title="描述" :rightText="item.localAccentDescribe" />
            <uni-list-item title="时间" :rightText="item.date" />
            <uni-list-item title="作者" :rightText="item.createPeople" />
            <uni-list-item title="查看详情" link @click="toinfo(item.id)" />
          </uni-list>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script>
import { location } from '../../api/map.js'
export default {
  data() {
    return {
      id: 0, // 使用 marker点击事件 需要填写id
      title: 'map',
      latitude: 39.909,
      longitude: 116.39742,
      covers: [
        // {
        //   latitude: 39.909,
        //   longitude: 116.39742,
        //   id: 1,
        //   title: 'Marker 1'
        // },
        // {
        //   latitude: 39.9,
        //   longitude: 116.39,
        //   id: 2,
        //   title: 'Marker 2'
        // }
      ]
    }
  },
  onLoad() {
    this.getdata()
  },
  methods: {
    //关闭弹框
    close() {
      this.$refs.popup.close()
    }, //跳转详情
    toinfo(id) {
      uni.navigateTo({
        url: '/pages/detail?id=' + id
      })
    },
    markertap(e) {
      let that = this
      var id = e.markerId
      //页面数据逻辑
      //根据项目调用请求方法或uni.request方法
      //弹框控制与<uni-popup ref="popup" type="bottom">对应
      this.$refs.popup.open('bottom')
    },
    bindmarkertap: function(e) {
      console.log(e, 'e')
      e.detail = { markerId }
      const { markerId } = e
      console.log('Marker tapped:', markerId)
    },
    async getdata() {
      let prePayResp = await location()
      console.log(prePayResp, 'prePayResp')
      this.covers = prePayResp.data
      console.log(this.covers, 'this.covers')
    }
  }
}
</script>
