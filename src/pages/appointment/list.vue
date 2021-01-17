<style lang="scss">
.list-scroll-content{
  height: 100%;
}
.uni-swiper-item{
  height: auto;
}

.swiper-box{
  height: calc(100% - 40px);
}
.list-scroll-content{
  height: 100%;
}
.goods-img{
  display: block;
  width: 120upx;
  height: 120upx;
}
.title{
  font-size: $font-base + 0upx;
  color: $font-color-dark;
  display: block;
  //line-height: 1;
}
</style>

<template>
  <view>
    <view>
      <u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
                     swiperWidth="750">
      </u-tabs-swiper>
    </view>
    <swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
      <swiper-item class="swiper-item" v-for="(tabItem, index) in list" :key="index">

          <scroll-view scroll-y
                     class="list-scroll-content"
                     @scrolltolower="onreachBottom">
          <view v-for="(item,index) in tabItem.items" :key="index" class="list-item">
            <view class="goods-box-single" >
              <view class="right">
                <text class="title">{{item.goods_name}}</text>
                <text class="title">{{item.name}}</text>
                <text class="title">{{item.start_at}}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          name: '预约中',
          status: 'unused' ,
          items: [
            {
              "name": "高位",
              "goods_name": "颐和园门票",
              "goods_id": 156,
              "start_at": "2021-02-02 12:00",
            },
            {
              "name": "高位",
              "goods_name": "颐和园门票",
              "goods_id": 156,
              "start_at": "2021-02-02 12:00",
            }
          ]
        },
        {
          name: '已经使用',
          status: 'used' ,
          items: [
            {
              "name": "高位",
              "goods_name": "颐和园门票",
              "goods_id": 156,
              "start_at": "2021-01-02 12:00",
            },
            {
              "name": "高位",
              "goods_name": "颐和园门票",
              "goods_id": 156,
              "startAt": "2021-01-02 12:00",
            }
          ]
        },
        {
          name: '过期',
          status: 'overdue' ,
          items: []
        },
        {
         name: '取消',
         status: 'cancel' ,
         items: []
        },
      ],
      // 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
      current: 0, // tabs组件的current值，表示当前活动的tab选项
      swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
    };
  },
  methods: {
    // tabs通知swiper切换
    tabsChange(index) {
      console.log('tabsChange',index)
      this.swiperCurrent = index;
    },
    // swiper-item左右移动，通知tabs的滑块跟随移动
    transition(e) {
      let dx = e.detail.dx;
      this.$refs.uTabs.setDx(dx);
    },
    // 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
    // swiper滑动结束，分别设置tabs和swiper的状态
    animationfinish(e) {
      let current = e.detail.current;
      this.$refs.uTabs.setFinishCurrent(current);
      this.swiperCurrent = current;
      this.current = current;
    },
    // scroll-view到底部加载更多
    onreachBottom() {

    }
  }
};
</script>
