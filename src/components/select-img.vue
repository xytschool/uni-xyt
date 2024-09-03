<template>  
  <uni-popup ref="popup" type="bottom" background-color="#fff">  
    <div class="mode-selection">  
      <div @click="selectFile('camera')">拍摄</div>  
      <div @click="selectFile('album')">图库</div>  
      <div @click="close" style="border: none">取消</div>  
    </div>  
  </uni-popup>  
</template>  

<script>  
export default {  
  data() {  
    return {  
      popup: null,  
      count: 1,  
    };  
  },  
  methods: {  
    close() {  
      this.popup.close();  
    },  
    open(e = 1) {  
      this.count = e;  
      this.popup.open();  
    },  
    selectFile(e) {  
      uni.chooseImage({  
        count: this.count, // 默认9  
        sourceType: [e],  
        success: (res) => {  
          this.$emit("success", res.tempFiles);  
        },  
        complete: () => {  
          this.close();  
        },  
      });  
    },  
  },  
  mounted() {  
    this.popup = this.$refs.popup;  
  },  
};  
</script>  

<style scoped lang="scss">  
.mode-selection {  
  width: 100vw;  
  height: auto;  
  background: #fff;  
  border-radius: 16px 16px 0px 0px;  
  > div {  
    width: 100%;  
    height: 124rpx;  
    line-height: 124rpx;  
    text-align: center;  
    border-bottom: 1px solid #e2e2e2;  
  }  
}  
</style>  