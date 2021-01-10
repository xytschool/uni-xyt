<style scoped lang="scss">

.tourist {
  border-bottom: 2px solid #2979ff;
  font-size: 20px;
  line-height: 40px;
}
.touristMain {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  height: 40px;
  padding-left: 20px;
  img {
    width: 20px;

    vertical-align: middle;
    margin-right: 10px;
  }
}
.row {
  line-height: 50px;
  border-bottom: 1px solid #ccc;
      padding-left: 20px;
}
.Highlight{
    color: #ea9460;
}

</style>
<template>
  <div class="notify-page">
    <div class="touristMain">
      <img src="/static/back.svg" alt="" @click="back" />
      <span class="tourist">预约信息</span>
    </div>

    <u-row gutter="16" class="row">
      <u-col span="3">
        <view class="bg-purple">姓名:</view>
      </u-col>
      <u-col span="4">
        <view class="bg-purple-light Highlight">{{ appointment.name }}</view>
      </u-col>
    </u-row>

    <u-row gutter="16" class="row">
      <u-col span="3">
        <view class="bg-purple">证件类型:</view>
      </u-col>
      <u-col span="9">
        <view class="bg-purple-light">{{
          parseIdCardTypeTitle(appointment.id_card_type)
        }}</view>
      </u-col>
    </u-row>

    <u-row gutter="16" class="row">
      <u-col span="3">
        <view class="bg-purple">证件号:</view>
      </u-col>
      <u-col span="9">
        <view class="bg-purple-light Highlight" >{{ appointment.id_card }}</view>
      </u-col>
    </u-row>

    <u-row gutter="16" class="row">
      <u-col span="3">
        <view class="bg-purple">电话号码:</view>
      </u-col>
      <u-col span="9">
        <view class="bg-purple-light Highlight">{{ appointment.phone }}</view>
      </u-col>
    </u-row>

    <u-row gutter="16" class="row">
      <u-col span="3">
        <view class="bg-purple">预约时间:</view>
      </u-col>
      <u-col span="9">
        <view class="bg-purple-light Highlight">{{ appointment.startAt }}</view>
      </u-col>
    </u-row>

    <u-row gutter="16" class="row">
      <u-col span="3">
        <view class="bg-purple">详细地址:</view>
      </u-col>
      <u-col span="9">
        <view class="bg-purple-light Highlight">{{ appointment.detailedAddress }}</view>
      </u-col>
    </u-row>
  </div>
</template>

<script>
export default {
  onLoad(params) {
    this.appointment_id = parseInt(params.id);
    if (this.appointment_id > 0) {
      //uni.showToast({title:"获取信息失败"})
      this.getDetail(this.appointment_id);
    }
    console.log(this.appointment);
  },
  data() {
    return {
      appointment_id: 0,
      appointment: {
        id_card: "140223199208222773",
        id_card_type: "id",
        phone: "18618184632",
        name: "高位",
        goods_id: 156,
        startAt: "",
        detailedAddress: "永旺家园5区6楼201",
        addressData: {
          username: "",
          mobile: "",
          addressPrefix: "北京市-市辖区-海淀区",
          address: "",
          area: "北京",
          default: false,
          province_id: 11,
          city_id: 11,
          district_id: 110108,
        },
      },
    };
  },
  methods: {
    parseIdCardTypeTitle(type) {
      
      if ((type = "id")) {
     
       return  "身份证";
      } else if ((type = "passport")) {
        return "护照";
      } else if ((type = "officers")) {
        return "军官证";
      }
    },
    getDetail() {
      this.$api.order.getAppointmentDetail(this.appointment_id).then((data) => {
        this.appointment = data;
      });
    },
    back() {
      this.$router.back(); //返回
    },
  },
};
</script>
