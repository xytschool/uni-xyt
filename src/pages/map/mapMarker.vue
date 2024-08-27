<template>
  <view>
    <view class="page-section page-section-gap">
      <map
        style="width: 100%; height: 100vh;"
        :latitude="latitude"
        :longitude="longitude"
        :markers="covers"
        @markertap="bindmarkertap"
        @regionchange="onRegionChange"
        scale="17"
      >
        <cover-view slot="callout">
          <block v-for="(item, index) in covers" :key="index">
            <cover-view class="customCallout" :marker-id="item.id">
              <cover-view class="content">
                {{ item.name }}
              </cover-view>
            </cover-view>
          </block>
        </cover-view>
      </map>
    </view>
    <view class="music">
      <image
        class="spinning-icon"
        src="/static/playMusic.png"
        mode="aspectFit"
        v-if="isPlaying"
        @click="showPlaying"
      ></image>
      <image
        v-else
        class=""
        src="/static/stopMusic.png"
        mode="aspectFit"
        @click="showPlaying"
      ></image>
    </view>
    <view>
      <view class="info">
        <ellipsis
          class="ellipsis-content"
          @click-btn="hideMore(false)"
          :content="info"
        >
        </ellipsis
      ></view>

      <u-popup v-model="show" border-radius="14" ref="popup" mode="bottom">
        <view class="popup">
          <view class="title">{{ detailsList.name }}</view>
          <view class="language">
            <u-icon
              name="volume-off"
              style="color: #48648c;font-size: 14px;margin-right:5px ;"
              size="28"
              v-if="musicShow"
              @click="bjMusicClick"
            ></u-icon>
            <u-icon
              v-else
              name="volume"
              style="color: #48648c;font-size: 14px;margin-right:5px ;"
              size="28"
              @click="bjMusicClick"
            ></u-icon>

            <view class="text" @click="bjMusicClick"> 语言播报</view>
          </view>
          <view class="info">
            <view class="ellipsis-component">
              {{ detailsList.info }}
            </view>
            <view class="more" @click="more(detailsList)">
              ...查看详情
            </view>
          </view>
          <view class="goods-line">
            <view
              v-if="detailsList.goods_ids.length === 1"
              class="single-product"
              @click="navToDetailPage(detailsList.goods_ids[0])"
            >
              <image
                :src="detailsList.goods_ids[0].small_cover"
                class="image-wrapper"
              />

              <view class="product-info">
                <view class="product-name">
                  {{ detailsList.goods_ids[0].name }}
                </view>
                <view class="product-price">
                  价格: ¥{{
                    detailsList.goods_ids
                      ? detailsList.goods_ids[0].real_price
                      : '' | numberToCurrency
                  }}
                </view>
              </view>
            </view>

            <view
              v-else-if="detailsList.goods_ids.length > 1"
              class="multiple-products"
            >
              <view
                v-for="(item, index) in detailsList.goods_ids"
                :key="item.id"
                class="product"
                :class="{
                  double: detailsList.goods_ids.length === 2,
                  single: detailsList.goods_ids.length === 3
                }"
                @click="navToDetailPage(item)"
              >
                <image :src="item.small_cover" class="image-product" />
                <view class="product-info">
                  <view class="product-name" style=" margin-bottom: 6px;">{{
                    item.name
                  }}</view>
                  <view class="product-price"
                    >价格: ¥{{ item.real_price | numberToCurrency }}</view
                  >
                </view>
              </view>
            </view>
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script>
import { getlocation } from '../../api/map.js'
import { AudioPlay, audioStop } from './utils/audio.js'
const innerAudioContext = uni.createInnerAudioContext()
const audio = uni.createInnerAudioContext() // 音频对象

export default {
  data() {
    return {
      show: false,
      latitude: null,
      longitude: null,
      covers: [],
      detailsList: {},
      musicShow: true,

      currentPlayingMarker: null, // 当前播放音频的标记点
      isPlaying: true
    }
  },
  onLoad() {
    this.getdata()
  },
  mounted() {
    this.getLocation()
  },
  methods: {
    // 获取用户的位置
    getLocation() {
      uni.authorize({
        scope: 'scope.userLocation',
        success: () => {
          // 已授权，获取位置信息
          uni.getLocation({
            type: 'gcj02',
            success: (res) => {
              const { latitude, longitude } = res
              this.latitude = latitude
              this.longitude = longitude
              console.log(this.latitude, '  this.latitude')
              console.log(this.longitude, '  this.longitude')
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
    },
    onRegionChange(e) {
      console.log(e, 'e')
      if (e.type === 'end') {
        this.checkProximity()
      }
    },
    checkProximity() {
      let isWithinAnyMarker = false
      this.covers.forEach((marker) => {
        console.log(this.latitude, ' this.latitude')
        const distance = this.calculateDistance(
          this.latitude,
          this.longitude,
          marker.latitude,
          marker.longitude
        )
        console.log(distance, 'distance')
        console.log(distance < 100, 'distance < 100')
        if (distance < 100) {
          // 设置一个阈值，比如100米
          isWithinAnyMarker = true

          this.playAudio(marker)
        } else {
          this.stopAudio()
        }

        // 如果用户不在任何标记点内，停止音频
        if (!isWithinAnyMarker && this.currentPlayingMarker) {
          this.stopAudio()
        }
      })
    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371000 // 地球半径，单位为米
      const φ1 = (lat1 * Math.PI) / 180
      const φ2 = (lat2 * Math.PI) / 180
      const Δφ = ((lat2 - lat1) * Math.PI) / 180
      const Δλ = ((lon2 - lon1) * Math.PI) / 180

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c // 距离以米为单位
      return distance
    },
    playAudio(marker) {
      if (!audio) {
        audio = uni.createInnerAudioContext()
      }
      audio.src = marker.voice_url
      console.log(audio.src, '   this.audio.src')
      audio.play()
      this.currentPlayingMarker = marker // 记录当前播放的标记点
      this.isPlaying = true // 设置为播放状态
      console.log(this.isPlaying, 'this.isPlaying ')
    },

    bindmarkertap(e) {
      const { markerId } = e.detail
      this.detailsList = this.covers.find((element) => element.id === markerId)
      this.show = this.detailsList ? true : false

      innerAudioContext.src = this.detailsList.voice_url //必须放在 static下
      innerAudioContext.onError((res) => {
        console.error(res.errMsg)
      })
      console.log(innerAudioContext, 'this.innerAudioContext')
      console.log(innerAudioContext.src, '  this.innerAudioContext.src')
    },

    async getdata() {
      let prePayResp = await getlocation()
      // this.covers = prePayResp.data
      this.covers = [
        {
          id: 1,
          name: '故宫博物院',
          address: '北京市东城区景山前街4号',
          info:
            '百里滇池，奔来眼底，披襟岸帻，喜茫茫空阔无边。看东骧神骏，西翥灵仪，北走蜿蜒，南翔缟素。高人韵士，何妨选胜登临。趁蟹屿螺洲，梳裹就风鬟雾鬓；更苹天苇地，点缀些翠羽丹霞，莫辜负四围香稻，万顷晴沙，九夏芙蓉，三春杨柳。数千年往事，注到心头，把酒凌虚，叹滚滚英雄谁在。想汉习楼船，唐标铁柱，宋挥玉斧，元跨革囊。伟烈丰功，费尽移山心力。尽珠帘画栋，卷不及暮雨朝云；便断碣残碑，都付与苍烟落照。只赢得几杵疏钟，半江渔火，两行秋雁，一枕清霜。',
          // latitude: 39.916594,
          // longitude: 116.397128,
          latitude: 39.77971571180556,
          longitude: 116.5209423828125,
          user_id: 12345,
          voice_url:
            'https://web-ext-storage.dcloud.net.cn/uni-app/ForElise.mp3',
          // 'https://data.xytschool.com/ai_gen/%E5%8D%97%E6%B9%BE%E6%B9%96.mp3',
          covers: null,
          goods_ids: [
            {
              id: 246,
              user_id: 0,
              created_at: '2024-04-28T11:17:56+08:00',
              updated_at: '2024-08-20T11:46:48+08:00',
              com_id: 14,
              price: 60,
              real_price: 60,
              num: 1000000,
              pv: 0,
              sale_num: 0,
              status: 'publish',
              express_type: 'none',
              express: 0,
              tags: '10037',
              name: '全价门票',
              small_cover:
                'http://data.xytschool.com/storage/image/20240430/1714436793305953.png',
              covers: [
                'http://data.xytschool.com/storage/image/20240430/1714436803762264.png',
                'http://data.xytschool.com/storage/image/20240430/1714436820274470.png'
              ],
              infos: {
                subs: [
                  {
                    id: 244,
                    name: '全价门票（首检）',
                    cover: '',
                    goods_type: 'ticket',
                    number: 1
                  },
                  {
                    id: 245,
                    name: '全价门票（复检）',
                    cover: '',
                    goods_type: 'ticket',
                    number: 1
                  }
                ],
                ota: {
                  pre_sale_time: 0
                }
              },
              desc: '',
              goods_type: 'mix_ticket',
              parent_id: 0
            },
            {
              id: 231,
              user_id: 0,
              created_at: '2024-04-25T22:24:07+08:00',
              updated_at: '2024-08-13T07:55:52+08:00',
              com_id: 14,
              price: 100,
              real_price: 100,
              num: 100000,
              pv: 0,
              sale_num: 0,
              status: 'publish',
              express_type: 'none',
              express: 0,
              tags: '10044',
              name: '全价门票+船票',
              small_cover:
                'http://data.xytschool.com/storage/image/20240430/1714455433605301.png',
              covers: [
                'http://data.xytschool.com/storage/image/20240425/1714053207856926.png',
                'http://data.xytschool.com/storage/image/20240430/1714455444961961.png',
                'http://data.xytschool.com/storage/image/20240430/1714455451737047.png'
              ],
              infos: {
                subs: [
                  {
                    id: 265,
                    name: '全价门票+船票（复检）',
                    cover: '',
                    goods_type: 'ticket',
                    number: 1
                  },
                  {
                    id: 266,
                    name: '全价门票+船票（船队）',
                    cover: '',
                    goods_type: 'ticket',
                    number: 1
                  },
                  {
                    id: 264,
                    name: '全价门票+船票（首检）',
                    cover: '',
                    goods_type: 'ticket',
                    number: 1
                  }
                ]
              }
            }
          ],
          created_at: '2023-08-01T20:00:00+08:00',
          updated_at: '2023-08-01T20:00:00+08:00'
        }
      ]
      console.log(this.covers, ' this.covers ')
      const defaultIconPath = '/static/flag.png' // 写死的图标路径
      this.covers = this.covers.map((marker) => ({
        ...marker,
        iconPath: defaultIconPath, // 将 iconPath 添加到每个标记中
        width: 30,
        height: 30,
        customCallout: {
          anchorY: 70,
          anchorX: 0,
          display: 'ALWAYS' //'BYCLICK':点击显示; 'ALWAYS':常显
        }
      }))
      this.latitude = this.covers[0].latitude
      this.longitude = this.covers[0].longitude
    },
    bjMusicClick() {
      if (this.musicShow) {
        console.log('播放')
        const timout = setTimeout(() => {
          clearTimeout(timout)
          console.log(innerAudioContext, 'innerAudioContext')
          innerAudioContext.play()
        }, 500)
      } else {
        console.log('暂停')
        innerAudioContext.pause()
      }
      this.musicShow = !this.musicShow
    },
    navToDetailPage(item) {
      let id = item.id
      if (item.href) {
        uni.navigateTo({
          url: item.href
        })
      } else {
        uni.navigateTo({
          url: `/pages/product/product?id=${id}`
        })
      }
    },
    more(item) {
      console.log(item, 'item')
      uni.navigateTo({
        url: `/pages/map/mapdetails?item=${JSON.stringify(item)}`
      })
    },
    stopAudio() {
      if (audio) {
        audio.stop() // 停止播放音频
        this.currentPlayingMarker = null // 重置当前播放的标记点
      }
      this.isPlaying = false // 设置为停止状态
    },
    showPlaying() {
      if (this.isPlaying) {
        this.isPlaying = false
        audio.stop() // 停止播放音频
      } else {
        this.isPlaying = true
        audio.play() // 停止播放音频
      }
    }
  },
  beforeDestroy() {
    this.stopAudio() // 页面关闭时停止音频播放
    if (this.watchId) {
      uni.stopLocationUpdate() // 停止位置更新
    }
  }
}
</script>
<style scoped lang="scss">
.customCallout {
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 12px;
  color: #090909;
  line-height: 16px;
}

.content {
  flex: 0 1 auto;
  margin: 0 10px;
  font-size: 14px;
}
.popup {
  height: 60vh;
  padding: 20px;
  width: 100vw;
}
.title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 24px;
  color: #313030;
  text-align: center;
}
.language {
  width: 680rpx;
  text-align: right;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  line-height: 16px;
  .text {
    color: #333333;
    font-size: 12px;
    display: inline-block;
  }
}
.info {
  width: 660rpx;
  position: relative;
  margin-top: 20rpx;
  .ellipsis-component {
    width: 100%;
    max-height: 75px;
    overflow: hidden;
    color: #333;
    font-family: PingFang SC, PingFang SC;
    font-size: 14px;
    color: #333;
    line-height: 25px;
  }

  .more {
    position: absolute;
    right: 0;
    top: 50px;
    width: 130px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 60%,
      rgba(255, 255, 255, 1) 100%
    );
    display: inline-block;
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    color: #355c89;
    text-align: right; /* 使文本右对齐 */
    padding-right: 5px; /* 右侧留一点内边距 */
  }
}
.single-product {
  width: 100%;
  display: flex;
  align-items: center;
}

.image-wrapper {
  width: 69px;
  height: 69px;
  margin-right: 15px;
  border-radius: 4px;
  opacity: 1;
}
.product-name {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #262626;
  line-height: 16px;
  margin-bottom: 20px;
}
.product-price {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #a90a0a;
  line-height: 16px;
}
.multiple-products {
  width: 100%;
  display: flex;
  overflow: hidden; /* 超出部分不显示 */
  white-space: nowrap; /* 防止换行 */
  justify-content: space-between;
}
.product {
  box-sizing: border-box; /* 包裹内边距和边框 */
  margin-right: 5px;
}
.product:last-child {
  margin-right: 0; /* 最后一个商品不需要右边距 */
}

.single {
  flex: 0 1 calc(33.333% - 5px); /* 防止子元素过大，只在需要时缩小 */
}

.double {
  width: calc(50% - 5px); /* 双商品时占据50% */
}
.image-product {
  width: 100%;
  height: 69px;
}
.music {
  position: fixed;
  right: 20px;
  top: 20px;
  image {
    width: 26px;
    height: 26px;
  }
}
// .spinning-icon {
//   animation: spin 1s linear infinite;
// }

// @keyframes spin {
//   0% {
//     transform: rotate(0deg);
//   }
//   100% {
//     transform: rotate(360deg);
//   }
// }
</style>
