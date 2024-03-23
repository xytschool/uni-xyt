<template>
  <view class="page-content">
    <view class="contentV">
      <camera
        v-if="isAuthCamera"
        device-position="front"
        class="camera"
        flash="off"
        resolution="high"
      />
      <image v-if="tempImg" mode="widthFix" :src="tempImg" />
      <view v-show="!tempImg && tipsText" class="tipV">{{ tipsText }}</view>
    </view>
    <view class="footerV">
      <view style="width: 100%;">
        <view v-if="!tempImg" style="width: 100%;">
          <view class="verify ">
            请进行人脸识别验证身份
          </view>
          <view class="verify">
            并确保本人操作
          </view>

          <view class="take-photo-bgV">
            <button
              type="primary"
              class="start-verification"
              @click="handleTakePhotoClick"
            >
              开始录入
            </button>
          </view>
        </view>

        <view class="confirmV" v-else>
          <view class="btn-cancel btn" @click="handleCancelClick">
            取消
          </view>
          <view class="btn-ok btn" @click="handleOkClick">
            确定
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
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

  onLoad() {
    this.initData()
  },
  mounted() {},
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
        wx.createVKSession({
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
          console.log(res.authSetting['scope.camera'], 'scope')
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
          this.isAuthCamera = false
        }
      })
      //
    },
    // 点击确定上传
    handleOkClick() {
      //  这里的 this.tempImg 是经过人脸检测后  拍照拿到的路径
      this.upLoadOne(this.tempImg)
      uni.navigateBack({
        delta: 1
      })
    },
    upLoadOne(imgPath) {
      //  然后这里imgPath 传过来的是 要上传的临时本地图片的路径
      //  具体上传方法根据自己的请求方式   请求自己的接口
    },
    // 点击 - 取消上传
    handleCancelClick() {
      this.tempImg = ''
      this.isAuthCamera = true
    }
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  width: 100%;
  height: 100%;
  .contentV {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 661rpx;
    margin-top: 30rpx;
    .tipV {
      margin-top: 20rpx;
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
      width: 448rpx;
      height: 448rpx;
      border-radius: 50% !important;
    }

    image {
      margin: 30rpx auto;
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
      .start-verification {
        width: 640rpx;
        height: 100rpx;
        background: #71b459;
        border-radius: 82rpx 82rpx 82rpx 82rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 32rpx;
        color: #ffffff;
        line-height: 100rpx;
        text-align: left;
        font-style: normal;
        text-transform: none;
        text-align: center;
        position: absolute;
        bottom: 158rpx;
        left: 50%;
        margin-left: -320rpx;
      }
    }
    .confirmV {
      margin: 200rpx 100rpx 0rpx 100rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .btn {
        width: 188rpx;
        height: 60rpx;
        background: #649c4a;
        border-radius: 76rpx 76rpx 76rpx 76rpx;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 28rpx;
        color: #ffffff;
        line-height: 60rpx;
        text-align: left;
        font-style: normal;
        text-align: center;
      }
    }
  }
}
.verify {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 32rpx;
  color: #000000;
  line-height: 52rpx;
  text-align: center;
  font-style: normal;
}
</style>
