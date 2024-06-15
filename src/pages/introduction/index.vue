<template>
  <view class="wrap">
    <view class="title">南湾湖景区</view>
    <image
      class="headDiagram"
      src="https://data.xytschool.com/2024/05/27/6653d95141f77.jpg"
    ></image>
    <view class="title">
      景区简介
    </view>
    <view class="content">
      南湾湖，位于河南省信阳市西南5公里，以南湾湖为中
      心，以山林、岛屿为风景内涵。南湾湖水域面积75平方
      公里，61座岛屿(现开放三座) 错落分布，景色各异。
      湖的上游是"信阳毛尖"主产地，湖中盛产南湾鱼。
    </view>
    <view class="title">
      景点介绍
    </view>
    <view class="introduce">
      <view class="introduce-item">
        <image
          src="https://data.xytschool.com/2024/05/26/665318b4a696c.jpg"
        ></image>
        <view class="title">茶岛</view>
        <view class="content">
          茶岛位于南湾湖中，是南 湾湖最大的岛屿之一。岛 上茶园茂盛，是品尝正宗
          信阳毛尖的好去处。
        </view>
      </view>
      <view class="introduce-item">
        <image
          src="https://data.xytschool.com/2024/05/26/665318b51188d.jpg"
        ></image>
        <view class="title">花链岛</view>
        <view class="content">
          花链岛是南湾湖中的一处 花鲜养殖基地，岛上花鲜 品种繁多，是观赏和钓鱼
          的好地方。
        </view>
      </view>
      <view class="introduce-item">
        <image
          src="https://data.xytschool.com/2024/05/26/665318b54c6be.jpg"
        ></image>
        <view class="title">鸟岛</view>
        <view class="content">
          鸟岛是南湾湖的保护区， 是许多鸟类的栖息地。岛 上可以观赏到各种珍稀鸟
          类的繁衍和活动。
        </view>
      </view>
      <view class="introduce-item">
        <image
          src="https://data.xytschool.com/2024/05/26/665318b738e96.jpg"
        ></image>
        <view class="title">猴岛</view>
        <view class="content">
          猴岛是南湾湖中的一座小 岛，岛上有大量的猴群栖 息，游客可以近距离观察
          猴子的生活习性。
        </view>
      </view>
    </view>
    <view class="title">文化遗址</view>
    <image
      class="headDiagram"
      src="https://data.xytschool.com/2024/05/27/6653d959d12a4.jpg"
    ></image>
    <view class="title">梁王磊遗址</view>
    <view class="content">
      梁王垒是南湾湖附近的一处古代军事遗址，是历史文化 的重要见证。
    </view>
    <view class="title">旅游设施</view>
    <image
      class="headDiagram"
      src="https://data.xytschool.com/2024/05/27/6653d95497117.jpg"
    ></image>
    <view class="title">南湾湖大坝</view>
    <view class="content">
      南湾湖大坝是南湾湖的重要水利工程，也是游客观赏湖 景和休闲娱乐的好地方。
    </view>

    <image
      class="headDiagram"
      src="https://data.xytschool.com/2024/05/26/665318bbd6d47.jpg"
    ></image>
    <view class="title">贤隐寺</view>
    <view class="content">
      贤隐寺是南湾湖附近的一座古老寺庙，是信仰和文化交 流的场所。
    </view>

    <image
      class="headDiagram"
      src="https://data.xytschool.com/2024/05/27/6653d95c63220.jpg"
    ></image>
    <view class="title">南湾水上游乐园</view>
    <view class="content" style="padding-bottom: 50rpx;">
      南湾水上游乐园是南湾湖边的一处娱乐设施，提供丰富 的水上游玩项目和设施。
    </view>
  </view>
</template>

<script></script>

<style lang="scss" scoped>
.wrap {
  background: #fff;
  // width: 100vh;
  height: 100vh;
  padding: 20rpx;
}
.title {
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 40rpx;
  color: #333333;
  margin-bottom: 20rpx;
  margin-top: 20rpx;
}
.headDiagram {
  margin-top: 20rpx;
  width: 100%;
}
.content {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 28rpx;
  color: #999999;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}
.introduce {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.introduce-item {
  width: 48%;
  margin-right: 26rpx;
  image {
    width: 100%;
  }
}
.introduce-item:nth-child(2n) {
  margin-right: 0rpx;
}
</style>
