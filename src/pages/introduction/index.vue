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
          src="https://data.xytschool.com/2024/06/15/666da85b97aab.jpeg"
        ></image>
        <view class="title">茶岛</view>
        <view class="content">
          茶岛位于南湾湖中，是南 湾湖最大的岛屿之一。岛 上茶园茂盛，是品尝正宗
          信阳毛尖的好去处。
        </view>
      </view>
      <view class="introduce-item">
        <image
          src="https://data.xytschool.com/2024/06/15/666dad57904e4.jpg"
        ></image>
        <view class="title">樱花园</view>
        <view class="content">
          樱花园就位于茶岛上。春风醉茶都，樱漫南湾湖。每年的的四月份左右，正值樱花盛开的季节。
        </view>
      </view>
      <view class="introduce-item">
        <image
          src="https://data.xytschool.com/2024/06/15/666dad9b7928e.jpg"
        ></image>
        <view class="title">鸟岛</view>
        <view class="content">
          鸟岛是南湾湖的保护区， 是许多鸟类的栖息地。岛 上可以观赏到各种珍稀鸟
          类的繁衍和活动。
        </view>
      </view>
      <view class="introduce-item">
        <image
          src="https://data.xytschool.com/2024/06/15/666da85b76263.jpg"
        ></image>
        <view class="title">猴岛</view>
        <view class="content">
          猴岛是南湾湖中的一座小 岛，岛上有大量的猴群栖 息，游客可以近距离观察
          猴子的生活习性。
        </view>
      </view>
    </view>
    <!-- <view class="title">文化遗址</view>
    <image
      class="headDiagram"
      src="https://data.xytschool.com/2024/05/27/6653d959d12a4.jpg"
    ></image>
    <view class="title">梁王磊遗址</view>
    <view class="content">
      梁王垒是南湾湖附近的一处古代军事遗址，是历史文化 的重要见证。
    </view> -->
    <view class="title">旅游设施</view>
    <image
      class="headDiagram"
      src="https://data.xytschool.com/2024/06/15/666daab64e9ae.jpg"
    ></image>
    <view class="title">南湾湖大坝</view>
    <view class="content">
      南湾湖大坝长816.5米，坝顶宽8米，坝高38.3米，最大拦蓄水量为16.3亿立方米，大坝正面镶砌有毛泽东所题的“一定要把淮河修好”八个大字，坝顶、坝坡安装投光灯、高压钠灯共369盏，在东西坝头分设2盏高杆灯，并在高杆灯上设4台激光射灯。白天漫步坝顶，大坝如一条长龙，横贯东西，气势恢宏，放眼远眺，但觉碧波荡漾，颇有临江濒海之感。而夜幕下的大坝，灯火通明、金碧辉煌，灯光映照在湖面上波光粼粼，呈现出如梦如幻般景象，令人流连忘返。
    </view>

    <image
      class="headDiagram"
      src="https://data.xytschool.com/2024/06/15/666dab625a02e.jpg"
    ></image>
    <view class="title">贤隐寺</view>
    <view class="content" style="padding-bottom: 50rpx;">
      贤隐寺为古时“中原五大寺”之一，与“嵩山少林寺、洛阳白马寺、开封相国寺、南阳玄观庙”齐名。
    </view>

    <!-- <image
      class="headDiagram"
      src="https://data.xytschool.com/2024/05/27/6653d95c63220.jpg"
    ></image>
    <view class="title">南湾水上游乐园</view>
    <view class="content" style="padding-bottom: 50rpx;">
      南湾水上游乐园是南湾湖边的一处娱乐设施，提供丰富 的水上游玩项目和设施。
    </view> -->
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
    height: 480rpx;
    object-fit: contain;
  }
}
.introduce-item:nth-child(2n) {
  margin-right: 0rpx;
}
</style>
