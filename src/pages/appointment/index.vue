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
      <span class="tourist">游客信息</span>
    </div>
    <u-form ref="uForm" :model="form">
      <u-form-item label="姓名" :label-width="160" prop="username" >
        <u-input v-model="form.username" placeholder="请输入您的姓名" />
      </u-form-item>

      <u-form-item label="证件类型" :label-width="160">
        <u-radio-group v-model="form.id_card_type" @change="methodChange">
          <u-radio
            v-for="(item, index) in methods"
            :key="index"
            :name="item.id"
          >
            {{ item.value }}
          </u-radio>
        </u-radio-group>
      </u-form-item>
      
      <u-form-item label="证件号" :label-width="160" prop="id_card">
        <u-input v-model="form.id_card" placeholder="请填写您的证件号码" />
      </u-form-item>
      <u-form-item label="电话号码" :label-width="160" prop="phone">
        <u-input v-model="form.phone" placeholder="请填写您的电话号码" />
      </u-form-item>

      <u-form-item label="预约日期" :label-width="160" prop="start_at">
        <view class="row b-b">
          <text class="input" @click="show = true">{{
              pickerParam.text || "点击选择"
            }}</text>
          <u-picker mode="time" v-model="show" :params="pickerParam" @confirm="timeChange"></u-picker>
        </view>
      </u-form-item>

      <u-form-item label="预约时间段" :label-width="160">
        <u-radio-group  @change="timeRangeChange">
          <u-radio
              v-for="(item, index) in timeRanges"
              :key="index"
              :name="item"
          >
            {{ item }}
          </u-radio>
        </u-radio-group>
      </u-form-item>

      <u-form-item label="现在住址" :label-width="160">
        <view class="row b-b">
          <text class="input" @click="showAddressPicker = true">{{
            addressData.addressPrefix || "点击选择"
          }}</text>
          <city-select
            v-model="showAddressPicker"
            @city-change="cityChange"
          ></city-select>
          <text class="yticon icon-shouhuodizhi"></text>
        </view>
      </u-form-item>
      <u-form-item :label-width="0" prop="tmpDetailedAddress">
        <u-input v-model="form.tmpDetailedAddress" placeholder="请输入详细地址" />
      </u-form-item>
      <u-button
        size="medium"
        type="primary"
        @click="submit"
        :custom-style="nextbtnStyle"
      >
        下一步
      </u-button>
    </u-form>
  </div>
</template>

<script>
import citySelect from "../address/u-city-select";
import { getUserInfo} from "../../utils/utils";
export default {
  components: {
    citySelect,
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  onLoad(params){
    this.goods_id = parseInt(params.goods_id)
    this.form.goods_id = this.goods_id
  },
  data() {
    return {
       show: false,
      rules: {
        username: [
          {
            required: true,
            message: "请输入姓名",
            trigger: ["change", "blur"],
          },
        ],
        id_card: [
          {
            required: true,
            message: "请输入证件号",
            trigger: ["change", "blur"],
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入电话号码",
            trigger: ["change", "blur"],
          },
        ],
        addressPrefix: [
          {
            required: true,
            message: "请选择地址",
            trigger: "change",
          },
        ],
        tmpDetailedAddress: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: ["change", "blur"],
          },
        ],
      },
      nextbtnStyle: {
        marginTop: "20px",
        width: "90%",
        borderRadius: "10px",
      },
      methods: [
        {
          id: "id",
          value: "身份证",
        },
        {
          id: "passport",
          value: "护照",
        },
        {
          id: "officers",
          value: "军官证",
        },
      ],
      timeRanges: [
        "08:00-10:00",
        "10:00-12:00",
        "12:00-14:00",
        "14:00-16:00",
      ],
      showAddressPicker: false,
      addressData: {
        username: "",
        mobile: "",
        addressPrefix: "",
        address: "",
        area: "北京",
        default: false,
        province_id: 0,
        city_id: 0,
        district_id: 0,
      },
      goods_id: 0,
      form: {
        time:"",
        id_card: "",
        id_card_type: "id",
        phone: "",
        username: "",
        goods_id: 0,
        start_at: "",
        end_at: "",
        detail_address: "", //详情地址
        addressData: '',
        tmpDetailedAddress: ''
      },
      timeRange: '',
      pickerParam: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
          second: false,
          text:""
				}
    };
  },

  methods: {
    cityChange(e) {
      //地址
      this.addressData.province_id = parseInt(e.province.value);
      this.addressData.city_id = parseInt(e.province.value);
      this.addressData.district_id = parseInt(e.area.value);
      this.addressData.addressPrefix =
        e.province.label + "-" + e.city.label + "-" + e.area.label;
      console.log("cityChange", e, this.addressData);
    },
    timeChange(e){
      //this.pickerParam.text=e.year+"-"+e.month+"-"+e.day+" "+e.hour+":00:00"
      this.pickerParam.text = e.year+"/"+e.month+"/"+e.day
      this.onTimechange()
    },
    timeRangeChange(timeRange){
      this.timeRange = timeRange
      this.onTimechange()
    },
    onTimechange(){
      var times = this.timeRange.split("-")
      if(this.pickerParam.text){
        var start_at = this.pickerParam.text +" " + times[0]+":00"
        this.form.start_at = new Date(start_at)
        var end_at = this.pickerParam.text +" " + times[1]+"00"
        this.form.end_at= new Date(end_at)
      }
    },
    methodChange(value) {
      //证件类型
      this.form.id_card = "";
    },
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          console.log("验证通过");
        } else {
          console.log("验证失败");
          return
        }
        
        this.form.addressData = this.addressData
        this.form.detail_address = this.addressData.addressPrefix + " " +this.form.tmpDetailedAddress

        var user = getUserInfo()
        if(user){
          this.$api.order.appointment(this.form).then((response)=>{
            if (response.code == 200){
              uni.showToast({title:"提交成功"})
              this.$u.route({
                url: 'pages/appointment/detail?&id=' + response.data.id,
              })
            }else {
              uni.showToast({title: response.msg, icon:"none" })
            }
          })
        }else {
         console.log('getAppointmentCode')
          this.$api.order.getAppointmentCode(this.form).then((response)=>{
            if (response.code == 200){
              uni.showToast({title:"提交成功"})
              this.$u.route({
                url: 'pages/appointment/detail?&code=' + response.data.code,
              })
            }else {
              uni.showToast({title: response.msg, icon:"none" })
            }
          })
        }
      });
    },
  },
};
</script>
