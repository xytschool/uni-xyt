<style scoped lang="scss">
.u-card-wrap {
  background-color: $u-bg-color;
}

.u-body-item {
  min-height: 75px;
  align-items: flex-start;
  .item-name {
    font-size: 18px;
    font-weight: 500;
    color: rgb(50, 128, 102);
    margin-bottom: 10px;
  }
  .item-status-used {
    color: #beb9b9;
    font-weight: 500;
  }
  .item-status-refund {
    color: #d55c5c;
    font-weight: 500;
  }
}

.u-body-item image {
  width: 120rpx;
  flex: 0 0 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
  margin-left: 12rpx;
}
.item-left-wrap {
  flex: 1;
}
.item-right-wrap {
  width: 60px;
  text-align: right;
  align-content: flex-end;
}
</style>
<template>
  <div>
    <u-notice-bar mode="horizontal" :list="activity"></u-notice-bar>
    <u-card :title="goodsName" :sub-title="'2020-05-15'" :thumb='goodsCover' title-size="38">
      <view class="" slot="body">
        <!--item-->
        <view v-for="item in subGoodsList" :key="item.id" class="u-body-item u-flex u-border-bottom u-col-between ">
          <view class="u-body-item-title u-line-2 item-left-wrap">
            <view class="item-name">
              {{item.name}} x {{item.number}}
            </view>
            <view v-if="item.status == 'used'" class="item-status-used u-flex">
              <view class="u-flex u-flex-2">{{item.used_number}}张使用完毕</view>
              <view class="u-flex u-light-color" @click="scrollToComment">
                去评论&nbsp;<u-icon name="chat"></u-icon>
              </view>
            </view>
            <view v-if="item.status == 'refund'" class="item-status-refund"> 该票已经退款</view>
            <u-collapse v-if="item.status =='notuse' || item.status =='using'">
              <u-collapse-item :title="'已使用 '+item.used_number + ' 张, 点击显示二维码'">
                <div style="height:200px;text-align:right">
                  <img :src="'https://help.xytschool.com/getQrcode?code='+item.code" style="height:200px;text-align:center" />
                </div>
              </u-collapse-item>
            </u-collapse>
          </view>
          <div class="u-flex item-right-wrap">
            <image :src="item.cover" mode="aspectFill"></image>
          </div>
        </view>
      </view>
      <!--foot-->
      <view class="" slot="foot">
        <navigator class="u-flex u-light-color" :url="'/pages/comment/index?goods_id=' + goodsId" hover-class="navigator-hover">
          <u-icon name="chat-fill" size="34" color="" :label="commentNumber + '评论'"></u-icon>
        </navigator>
      </view>
    </u-card>

    <u-card title="关注我们">
      <view slot='body'   class="u-flex">
        <image class="u-flex" style="width:80%;margin:0 auto" src="http://img.xytschool.com/_179%2C6166.jpg" mode="aspectFill"></image>
      </view>
    </u-card>
    <!--评论-->
    <u-card class="comment-wrap" title="评论">
      <view slot="body">
        <u-row gutter="0">
          <u-col span="3">
            <view style="margin-left:15px">环境评分</view>
          </u-col>
          <u-col span="8">
            <u-rate active-icon="heart-fill" inactive-icon="heart"></u-rate>
          </u-col>
        </u-row>
        <u-gap height="15"></u-gap>

        <u-row gutter="0">
          <u-col span="3">
            <view style="margin-left:15px">服务评分</view>
          </u-col>
          <u-col span="8">
            <u-rate active-icon="heart-fill" inactive-icon="heart"></u-rate>
          </u-col>
        </u-row>

        <u-gap height="15"></u-gap>
        <view class="u-flex ">
          <u-upload class="u-flex u-flex-1" ref="uUpload" :action="'uploadImg'" :auto-upload="false"></u-upload>
          <u-button @click="uploadImg" size="mini" type='success'>上传</u-button>
        </view>

        <u-gap height="15"></u-gap>
        <u-cell-group>
          <u-field v-model="commentContent" label="评论内容" placeholder="请输入您想要说的话" type="textarea" maxlength="128" field-style="{height:80px}">
          </u-field>
        </u-cell-group>

      </view>
    </u-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      commentContent: "",
      activity: [
        "寒雨连江夜入吴",
        "平明送客楚山孤",
        "洛阳亲友如相问",
        "一片冰心在玉壶"
      ],
      goodsId: 0,
      commentNumber: 1000,
      goodsName: "青要山套票",
      goodsCover:
        "https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg",
      subGoodsList: [
        {
          name: "青要山大门门票",
          number: 4,
          used_number: 0,
          status: "notuse",
          cover:"http://data.xytschool.com/storage/image/20200321/1584776698701187.png",
          code:"01300001309585136263538015274.jpg"
        },
        {
          name: "飞拉达攀岩门票(高级线)",
          number: 10,
          used_number: 10,
          status: "used",
          cover:
            "http://data.xytschool.com/storage/image/20200421/1587437753936796.png"
        },
        {
          name: "灵魂摆渡车",
          number: 1,
          used_number: 0,
          status: "refund",
          cover:
            "http://data.xytschool.com/storage/image/20200425/1587783910810036.png"
        }
      ]
    };
  },
  methods: {
    scrollToComment() {
      uni.pageScrollTo({
        scrollTop: 700,
        duration: 300
      });
    },
    uploadImg(){

    }
  }
};
</script>
