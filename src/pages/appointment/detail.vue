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
        <view class="bg-purple-light Highlight">{{ appointment.username }}</view>
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
        <view class="bg-purple-light Highlight">{{ parseDate(appointment.start_at) }}
          <span style="vertical-align: middle; display: inline-block; width: 20px; text-align: center; font-weight: 500">-</span> {{ parseDate(appointment.end_at) }}</view>
      </u-col>
    </u-row>

    <u-row gutter="16" class="row">
      <u-col span="3">
        <view class="bg-purple">详细地址:</view>
      </u-col>
      <u-col span="9">
        <view class="bg-purple-light Highlight">{{ appointment.detail_address }}</view>
      </u-col>
    </u-row>
  </div>
</template>

<script>
import {parseDate} from "@/utils/date";

export default {
  onLoad(params) {
    console.log('params', params)
    this.appointment_id = parseInt(params.id);
    if (this.appointment_id > 0) {
      this.getDetail('id' ,this.appointment_id);
    }else {
      this.getDetail('code', params.code)
    }
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
        detail_address: "",
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
    parseDate(str){
      return parseDate(str)
    },
    parseIdCardTypeTitle(type) {
      if ((type = "id")) {
       return  "身份证";
      } else if ((type = "passport")) {
        return "护照";
      } else if ((type = "officers")) {
        return "军官证";
      }
    },
    getDetail(type ,id) {
      if(type == "code"){
        console.log('type ,id', type, id)
        this.$api.order.getAppointmentByCode(id).then((res) => {
          this.appointment = res.data;
        });
      }else {
        this.$api.order.getAppointmentDetail(id).then((res) => {
          this.appointment = res.data;
        });
      }
    },
    back() {
      this.$router.back(); //返回
    },
  },
};
</script>
