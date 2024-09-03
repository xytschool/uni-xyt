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
      <u-popup v-model="show" border-radius="14" ref="popup" mode="bottom">
        <view class="popup">
          <view class="list" style="height: 40px;">
            <view class="title">
              添加标记
            </view>
          </view>
          <view class="list">
            <span>地点名称：</span>
            <input
              v-model="name"
              class="text"
              type="text"
              placeholder="请输入地点名称"
            />
          </view>
          <view class="list" style="height: 100px;">
            <span>描述信息：</span>
            <textarea
              class="remarks"
              v-model="info"
              placeholder="请输入描述信息"
            ></textarea>
          </view>
          <view class="picture">
            <span>图片：</span>
            <span> 最多可上传{{ practiceCertLimit }}张</span>

            <view>
              <u-upload
                :custom-btn="true"
                :max-count="practiceCertLimit"
                :action="action"
                :multiple="true"
                class="select-file-rectangle"
                @on-remove="onRemove"
                :file-list="coversList"
                @on-change="uploadFilePromise"
              >
                <view slot="addBtn" class="slot-btn">
                  <image
                    class="select-file-rectangle-image"
                    src="../../static/select-file-rectangle.png"
                    mode="aspectFit"
                  />
                </view>
              </u-upload>
            </view>
          </view>
          <button class="add" @click="add">添加</button>
        </view>
      </u-popup>
    </view>
    <selectImg ref="selectImgRef" @success="success" />
  </view>
</template>

<script>
import { postlocation } from '../../api/map.js'
import selectImg from '../../components/select-img.vue'

export default {
  components: {
    selectImg
  },
  data() {
    return {
      latitude: '',
      longitude: '',
      // latitude: '39.77972195095486',
      // longitude: '116.52091606987847',
      show: true,
      name: '',
      info: '',
      practiceCert: [],
      practiceCertFileList: [], // 执业证文件列表
      practiceCertLimit: 6,
      denote: '',
      covers: [],
      coversList: [],
      action: 'https://mall.nanwanhu.com.cn/14/api/v1/file/upload'
    }
  },
  onLoad() {},
  methods: {
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
    async add() {
      const validations = [
        { field: this.name, message: '请填写地点名称' },
        { field: this.info, message: '请填写描述信息' }
      ]
      for (const { field, message } of validations) {
        if (!field) {
          uni.showToast({
            title: message,
            icon: 'none'
          })
          return
        }
      }
      let prePayResp = await postlocation({
        name: this.name,
        info: this.info,
        covers: this.covers,
        latitude: Number(this.latitude),
        longitude: Number(this.longitude)
      })
      console.log(prePayResp, 'prePayResp')
      if (prePayResp.code === 'success') {
        uni.showToast({
          title: '添加成功',
          icon: 'none'
        })
        setTimeout(() => {
          this.$refs.popup.close()
          uni.navigateBack()
        }, 1000)
      } else {
        uni.showToast({
          title: prePayResp.message,
          icon: 'none'
        })
      }
    },
    // 选择文件（进行数量判断）
    selectFile(e, count) {
      this.denote = e
      count = this.determineUploadableValues(e)
      if (count <= 0) {
        return
      }

      this.$refs.selectImgRef.open(count)
    },
    determineUploadableValues(e) {
      return this.practiceCertLimit - this.practiceCertFileList.length
    },
    success(e) {
      this.practiceCert.push(...e.map((item) => item.path))
      this.practiceCertFileList.push(...e)
    },
    deleteFile(index) {
      this.practiceCert.splice(index, 1)
      this.practiceCertFileList.splice(index, 1)
    },
    onRemove(index, lists) {
      console.log('图片已被移除', index, lists)
      lists.forEach((element) => {
        console.log(element, 'element')
        // if (element) {

        // }
      })
    },
    uploadFilePromise(file) {
      const { data } = file
      const datas = JSON.parse(data)
      if (datas.code === 'success') {
        console.log('上传成功:', datas.data.url)
        this.covers.push(datas.data.url)
        console.log(' this.covers:', this.covers)
      } else if (file.status === 'fail') {
        uni.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    }
  },
  mounted() {
    this.getLocation()
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
    width: 168rpx;
    line-height: 40px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #3f3f3f;
  }
  span::before {
    content: '*';
    color: red;
    padding-right: 4px;
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
  height: 100px;
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
.picture {
  span {
    line-height: 50px;
  }
}

.slot-btn {
  width: 83px;
  height: 83px;
}
.select-file-rectangle-image {
  width: 100%;
  height: 100%;
  display: inline-block;
}
</style>
