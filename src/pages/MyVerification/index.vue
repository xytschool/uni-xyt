<template>
  <view class="page-content">
    <view class="containerV">
      <view class="headerV">
        <view class="top-tips1">
          <view>请将正对手机，头部匹配摄像区域</view>
        </view>
      </view>

      <view class="contentV">
        <view class="mark"></view>
        <image v-if="tempImg" mode="widthFix" :src="tempImg" />
        <camera
          v-if="isAuthCamera"
          device-position="front"
          class="camera"
          flash="off"
          resolution="high"
        />
        <view v-show="!tempImg && tipsText" class="tipV">{{ tipsText }}</view>
      </view>

      <view class="footerV">
        <view style="width: 100%;">
          <view v-if="!tempImg" style="width: 100%;">
            <view class="take-photo-bgV">
              <!--拍照-->
              <view class="btn-take-photo" @click="handleTakePhotoClick" />
              <!-- 切换镜头 -->
            </view>
          </view>
          <view class="confirmV" v-else>
            <view class="btn-cancel" @click="handleCancelClick">
              取消
            </view>
            <view class="btn-ok" @click="handleOkClick">
              确定
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getAuthToken } from '../../utils/utils.js'
import { baseUrl } from '../../../src/config'

export default {
  name: 'index',
  components: {},
  data() {
    return {
      tipsText: '', // 错误文案提示
      tempImg: '', // 本地图片路径

      cameraEngine: null, // 相机引擎

      isAuthCamera: true // 是否拥有相机权限
    }
  },

  onLoad(options) {
    this.initData()
  },

  methods: {
    // 初始化相机引擎
    initData() {
      // #ifdef MP-WEIXIN

      // 1、初始化人脸识别
      wx.initFaceDetect()
      // 2、创建 camera 上下文 CameraContext 对象
      this.cameraEngine = wx.createCameraContext()
      // 3、获取 Camera 实时帧数据
      const listener = this.cameraEngine.onCameraFrame((frame) => {
        if (this.tempImg) {
          return
        }
        // 4、人脸识别，使用前需要通过 wx.initFaceDetect 进行一次初始化，推荐使用相机接口返回的帧数据
        wx.faceDetect({
          frameBuffer: frame.data,
          width: frame.width,
          height: frame.height,
          enablePoint: true,
          enableConf: true,
          enableAngle: true,
          enableMultiFace: true,
          success: (faceData) => {
            let face = faceData.faceInfo[0]
            if (faceData.x == -1 || faceData.y == -1) {
              this.tipsText = '检测不到人'
            }
            if (faceData.faceInfo.length > 1) {
              this.tipsText = '请保证只有一个人'
            } else {
              const { pitch, roll, yaw } = face.angleArray
              const standard = 0.5
              if (
                Math.abs(pitch) >= standard ||
                Math.abs(roll) >= standard ||
                Math.abs(yaw) >= standard
              ) {
                this.tipsText = '请平视摄像头'
              } else if (
                face.confArray.global <= 0.8 ||
                face.confArray.leftEye <= 0.8 ||
                face.confArray.mouth <= 0.8 ||
                face.confArray.nose <= 0.8 ||
                face.confArray.rightEye <= 0.8
              ) {
                this.tipsText = '请勿遮挡五官'
              } else {
                this.tipsText = '请拍照'
                // 这里可以写自己的逻辑了
              }
            }
          },
          fail: (err) => {
            if (err.x == -1 || err.y == -1) {
              this.tipsText = '检测不到人'
            } else {
              this.tipsText = err.errMsg || '网络错误，请退出页面重试'
            }
          }
        })
      })
      // 5、开始监听帧数据
      listener.start()
      // #endif
    },

    // 拍照点击
    handleTakePhotoClick() {
      if (this.tipsText != '' && this.tipsText != '请拍照') {
        return
      }

      uni.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.camera']) {
            this.isAuthCamera = false
            uni.openSetting({
              success: (res) => {
                if (res.authSetting['scope.camera']) {
                  this.isAuthCamera = true
                }
              }
            })
          }
        }
      })
      this.cameraEngine.takePhoto({
        quality: 'high',
        success: ({ tempImagePath }) => {
          this.tempImg = tempImagePath
          console.log('=======tempImg:', this.tempImg)
        }
      })
    },

    // 点击确定上传
    handleOkClick() {
      console.log(this.tempImg, 'this.tempImg')
      wx.uploadFile({
        filePath: this.tempImg,
        name: 'file',
        header: {
          Authorization: getAuthToken()
        },
        url: `${baseUrl}/14/api/v1/user/face`,
        success: (res) => {
          if (JSON.parse(res.data).code == 'success') {
            uni.showToast({
              title: '上传成功',
              duration: 2000
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 2000)
          }
        },
        fail: (err) => {
          uni.showToast({
            title: `上传失败,${err}`,
            duration: 2000
          })
          console.log('失败...', err)
        }
      })
    },

    // 点击 - 取消上传
    handleCancelClick() {
      this.tempImg = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  width: 100%;
  height: 100%;

  .containerV {
    width: 100%;
    height: 100%;

    .headerV {
      .top-tips1 {
        margin-top: 60rpx;
        color: #1c1c1c;
        font-size: 36rpx;
        text-align: center;
      }
    }

    .contentV {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 661rpx;
      margin-top: 30rpx;

      .tipV {
        bottom: 30rpx;
        position: absolute;
        line-height: 90rpx;
        padding-left: 24rpx;
        padding-right: 24rpx;
        max-width: calc(100vw - 50rpx * 2);
        text-align: center;
        font-size: 30rpx;
        background: #000000;
        opacity: 0.75;
        color: #ffffff;
        border-radius: 16rpx;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        z-index: 5;
      }

      .camera {
        width: 100%;
        height: 100%;
      }

      .mark {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 2;
        width: 750rpx;
        height: 100%;
        background: url('@/static/face/view_face_background.png') no-repeat
          center bottom;
        background-size: 750rpx 661rpx;
      }

      image {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 3;
      }
    }

    .footerV {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .take-photo-bgV {
        width: 100%;
        margin-top: 30rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .btn-take-photo {
          // 由于左边没有按钮，所以左边要便宜更大，以便是拍照按钮居中
          margin: 0rpx 80rpx 0rpx 80rpx;
          width: 196rpx;
          height: 196rpx;
          background: url('https://pro-file-qn.ztjy61.com/1003020211103145058685NNR9vlTm.png')
            no-repeat;
          background-size: 100% auto;
        }
      }

      .confirmV {
        margin: 200rpx 100rpx 0rpx 100rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .btn-cancel {
          font-size: 32rpx;
          color: #1c1c1c;
        }

        .btn-ok {
          font-size: 32rpx;
          color: #00aaff;
        }
      }
    }
  }
}
</style>
