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
  width: 180rpx;
  flex: 0 0 120rpx;
  height: 180rpx;
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
  image{
    width: 60px;
    height: 60px;
  }
}
</style>
<template>
  <div class="">
    <u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
    <u-notice-bar :list="notifyTextList" @click="gotoNotify" duration="4000"
    mode="horizontal" :is-circular="false"  padding="20rpx" type="success" :no-list-hidden="false"></u-notice-bar>

    <u-card class="u-skeleton" :title="goods_name" :sub-title="parseDate(bay_at)" :thumb='goods_cover' title-size="38">
      <view class="" slot="body">
        <!--item-->
        <view v-for="item in subGoodsList" :key="item.id" class="u-body-item u-flex u-border-bottom u-col-between ">
          <view class="u-body-item-title u-line-2 item-left-wrap">
            <view class="item-name u-skeleton-rect">
              {{item.name}} x {{item.number}}张
            </view>
            <view v-if="item.status == 'used'" class="item-status-used u-flex">
              <view class="u-flex u-flex-2">{{item.used_number}}张使用完毕</view>
              <view class="u-flex u-light-color" @click="scrollToComment">
                去评论&nbsp;<u-icon name="chat"></u-icon>
              </view>
            </view>
            <view v-if="item.status == 'refund'" class="item-status-refund u-skeleton-rect"> 该票已经退款</view>
            <u-collapse v-if="item.status =='notuse' || item.status =='using'">
              <u-collapse-item :title="'已使用 '+item.used_number + ' 张, 点击显示二维码'">
                <div style="height:200px;text-align:right">
                  <img :src="'https://help.xytschool.com/getQrcode?code='+item.code" style="height:200px;text-align:center" />
                </div>
              </u-collapse-item>
            </u-collapse>
          </view>
          <div class="u-flex item-right-wrap">
            <image class="u-skeleton-fillet" :src="item.cover" mode="aspectFill"></image>
          </div>
        </view>
      </view>
      <!--foot-->
      <view class="" slot="foot">
        <navigator class="u-flex u-light-color" :url="'/pages/comment/index?goods_id=' + goods_id" hover-class="navigator-hover">
          <u-icon name="chat-fill" size="34" color="" :label="goodsCommentNum + '评论'"></u-icon>
        </navigator>
      </view>
    </u-card>

    <u-card title="关注我们">
      <view slot='body'>
        <image style="width:70%;margin:0 15%"
         :src="xcx_cover" mode="aspectFit"></image>
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
            <u-rate :current="5" @change="changeHealth" active-icon="heart-fill" inactive-icon="heart"></u-rate>
          </u-col>
        </u-row>
        <u-gap height="15"></u-gap>

        <u-row gutter="0">
          <u-col span="3">
            <view style="margin-left:15px">服务评分</view>
          </u-col>
          <u-col span="8">
            <u-rate :current="5"  @change="changeStaff" active-icon="heart-fill" inactive-icon="heart"></u-rate>
          </u-col>
        </u-row>

        <u-gap height="15"></u-gap>
        <u-row gutter="0">
          <u-col span="3">
            <view style="margin-left:15px">商品评分</view>
          </u-col>
          <u-col span="8">
            <u-rate :current="5"  @change="changeGoods" active-icon="heart-fill" inactive-icon="heart"></u-rate>
          </u-col>
        </u-row>

        <u-gap height="15"></u-gap>
        <view class="u-flex ">
          <u-upload class="u-flex u-flex-1" ref="uUpload" 
          :action="'/v1/file/uploadImage'" 
          :header="uploadHeader"
          :form-data="uploadFormData"
          @on-uploaded="onUploaded"
          :max-size="5 * 1024 * 1024" max-count="12"
          :auto-upload="true"></u-upload>
          <!-- <u-button @click="uploadImg" size="mini" type='success'>上传</u-button> -->
        </view>

        <u-gap height="15"></u-gap>
        <u-cell-group>
          <u-field v-model="comment.content" label="评论内容" placeholder="请输入您想要说的话" 
          type="textarea" maxlength="128">
          </u-field>
        </u-cell-group>

        <u-gap height="15"></u-gap>
        <u-button @click="submit_comment">提交评论</u-button>
      </view>
    </u-card>

  </div>
</template>

<script>
import {getTicketByCode} from "../../api/ticket"
import {getNotifyList} from "../../api/site"
import {submitComment, getGoodsCommentNum} from "../../api/comment"
import {getQueryParam} from "../../utils/utils"
import {parseDate} from "../../utils/date"
export default {
    data() {
    return {
      commentContent: "",
      activity: [
        "寒雨连江夜入吴",
        "平明送客楚山孤",
      ],
      notifyList:[],
      notifyTextList:[],
      loading: true,
      goods_id: 0,
      order_no:'',
      com_id: 0,
      comment_number: 0,
      goods_name: '加载失败',
      goods_cover:'http://img.xytschool.com/icon/ticket.png',
      bay_at: '',
      goodsCommentNum :0,
      xcx_cover: '',
      comment: {
        health: 5,
        goods: 5,
        staff :5,
        covers: [],
        content: '',
        com_id: 0,
        goods_id:0, 
        order_no: '',
        pid: 0 
      },
      uploadHeader:{},
      uploadFormData:{},
      goodsCover:"https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg",
      subGoodsList: [
        {
          id:'',
          name: "未加载到门票请刷新页面",
          number: 0,
          used_number: 0,
          status: "notuse",
          code:"01300001309585136263538015274.jpg"
        },
        {
          name: "",
          number: 0,
          used_number: 0,
          status: "used",
        }
       ]
    };
  },
  onLoad(options){
    var code = getQueryParam('code')
    console.log('code', code)
    this.getDetail(code)
  },
  methods: {
		parseDate(date){
			return parseDate(date)
		},
    changeHealth(v){
      this.comment.health =v
    },
    changeGoods(v){
      this.comment.goods =v
    },
    changeStaff(v){
      this.comment.staff =v 
    },
    scrollToComment() {
      uni.pageScrollTo({
        scrollTop: 700,
        duration: 300
      });
    },
    gotoNotify(i){
      var item = this.notifyList[i]
    	uni.navigateTo({
				url: '/pages/activity/detail?notify_id=' + item.id
			});
    },
    getDetail(code){
      getTicketByCode(code).then((response) => {
        this.loading = false
        if(response.code != 200) {
            this.subGoodsList = []
            uni.showToast({
               title: '加载失败,' + response.msg,
               duration: 2000
             })
            return
        }
        //console.log(response)
        this.subGoodsList = response.data.tickets
        this.com_id = response.data.com_id
        this.goods_id = response.data.goods_id
        this.goods_name = response.data.goods_name
        this.order_no = response.data.order_no
        this.order_status = response.data.order_status
        this.username = response.data.username
        this.goods_cover = response.data.goods_cover
        this.bay_at = response.data.bay_at
        this.comment.goods_id = this.goods_id
        this.comment.order_no = this.order_no
        this.comment.com_id = this.com_id 
        this.xcx_cover = response.data.xcx_cover
        getGoodsCommentNum({goods_id:this.goods_id}).then(res => {
          if(res.code == 200){
              this.goodsCommentNum = res.data.num 
          }
        })
        getNotifyList().then(res =>{
          console.log(res)
          if(res.code == 200){
            this.notifyList = res.data
            res.data.forEach((item)=>{
                this.notifyTextList.push(item.title)
            })
            console.log(this.notifyTextList)
          }
        })
      })
    },
    submit_comment(){
      //console.log('comment',this.comment) 
      if(this.comment.content.length < 6){
				uni.showToast({
  					  title: '请您输入6个以上的字符',
   					  duration: 2000
				});
				return
			}
      uni.showLoading()

      submitComment(this.comment).then(res =>{
          uni.hideLoading()
          if(res.code == 200) {
             uni.showToast({
               title: '评论成功',
               duration: 2000
             })
             this.comment.content = ''
             this.comment.staff =5
             this.comment.health =5
             this.comment.goods =5
            getGoodsCommentNum({goods_id:this.goods_id}).then(res => {
              if(res.code == 200){ this.goodsCommentNum = res.data.num  }
             })
          }else{
          uni.showToast({
               title: '评论失败' + res.msg,
               duration: 2000
             })
          }
       })
    },
    uploadImg(){
      this.$refs.uUpload.upload();
    },
    onUploaded(lists) {
      var covers = []
      lists.forEach(element => {
        var item = JSON.parse(element.response)
        covers.push(item.data.path)
      });
      console.log('covers', covers)
      this.comment.covers = covers
		}
  }
};
</script>
