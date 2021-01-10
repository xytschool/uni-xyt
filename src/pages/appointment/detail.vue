<style scoped lang="scss">
.notify-page {
  margin-left: 20px;
}
.tourist {
  border-bottom: 2px solid #2979ff;
  font-size: 20px;
  line-height: 40px;
}
.touristMain {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  height: 40px;
}
</style>
<template>
  <div class="notify-page">
    <div class="touristMain">
      <span class="tourist">预约信息</span>
    </div>

    <u-row gutter="16">
      <u-col span="3">
        <view class="bg-purple">姓名</view>
      </u-col>
      <u-col span="4">
        <view class="bg-purple-light">{{appointment.name}}</view>
      </u-col>
    </u-row>

    <u-row gutter="16">
      <u-col span="3">
        <view class="bg-purple">证件类型</view>
      </u-col>
      <u-col span="4">
        <view class="bg-purple-light">{{appointment.id_card_type}}</view>
      </u-col>
   </u-row>

    <u-row gutter="16">
      <u-col span="3">
        <view class="bg-purple">证件号</view>
      </u-col>
      <u-col span="4">
        <view class="bg-purple-light">{{appointment.id_card}}</view>
      </u-col>
    </u-row>


    <u-row gutter="16">
      <u-col span="3">
        <view class="bg-purple">电话号码</view>
      </u-col>
      <u-col span="4">
        <view class="bg-purple-light">{{appointment.phone}}</view>
      </u-col>
    </u-row>

    <u-row gutter="16">
      <u-col span="3">
        <view class="bg-purple">预约时间</view>
      </u-col>
      <u-col span="4">
        <view class="bg-purple-light">{{appointment.startAt}}</view>
      </u-col>
    </u-row>

    <u-row gutter="16">
      <u-col span="3">
        <view class="bg-purple">详细地址</view>
      </u-col>
      <u-col span="4">
        <view class="bg-purple-light">{{appointment.detailedAddress}}</view>
      </u-col>
    </u-row>

  </div>
</template>

<script>

export default {
  onLoad(params){
    this.appointment_id = parseInt(params.id)
    if(this.appointment_id > 0 ){
      //uni.showToast({title:"获取信息失败"})
      this.getDetail(this.appointment_id)
    }
    console.log(this.appointment)
  },
  data() {
    return {
      appointment_id: 0 ,
      appointment: {"id_card":"140223199208222773","id_card_type":"id","phone":"18618184632","name":"高位","goods_id":156,"startAt":"","detailedAddress":"永旺家园5区6楼201","addressData":{"username":"","mobile":"","addressPrefix":"北京市-市辖区-海淀区","address":"","area":"北京","default":false,"province_id":11,"city_id":11,"district_id":110108}
  },
  methods: {
    getDetail() {
      this.$api.order.getAppointmentDetail(this.appointment_id).then((data)=>{
        console.log('appointment_data', data)
        this.appointment = data
        //uni.showToast({title:"提交成功"})
      })
    },
  },
};
</script>
