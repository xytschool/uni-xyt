<style scoped lang="scss">
.notify-page {
  img {
    width: 100%;
    position: relative;
  }
}
.picCon {
  position: absolute;
  left: 20px;
  top: 40px;
  p {
    color: #fff;
    line-height: 30px;
  }
  .welcome {
    font-size: 20px;
  }
}
.notify-conten{
    position:absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
   
    background: rgba(255,255,255,1);
background: -moz-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(237,237,237,0.1) 100%);
background: -webkit-gradient(left top, right top, color-stop(0%, rgba(255,255,255,1)), color-stop(100%, rgba(237,237,237,0.1)));
background: -webkit-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(237,237,237,0.1) 100%);
background: -o-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(237,237,237,0.1) 100%);
background: -ms-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(237,237,237,0.1) 100%);
background: linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(237,237,237,0.1) 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#ededed', GradientType=1 );

}
</style>
<template>
  <div class="notify-page">
    <img src="/static/platform.jpg" alt="" ref="platformimg" @load="platformimgload"/>
    <div class="picCon">
      <p class="welcome">欢迎使用</p>
      <p class="real">实名制预约登记</p>
    </div>
    <div class="notify-conten" :style="{height:notifyContenH}">

    </div>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
        notifyContenH:0,

    };
  },

  methods: {
      platformimgload:function(){
console.log(4444);
  this.notifyContenH=this.$refs.platformimg.offsetHeight+"px"
      },
    
  },
  mounted(){

  }
};
</script>
