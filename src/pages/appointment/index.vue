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
      <u-form-item label="姓名" :label-width="160" prop="name" >
        <u-input v-model="form.name" placeholder="请输入您的姓名" />
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
      <u-form-item label="预约时间" :label-width="160" prop="startAt">

        <view class="row b-b">
          <text class="input" @click="show = true">{{
            pickerParam.text || "点击选择"
          }}</text>
               <u-picker mode="time" v-model="show" :params="pickerParam" @confirm="time"></u-picker>
        </view>
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
      <u-form-item :label-width="0" prop="detailedAddress">
        <u-input v-model="form.detailedAddress" placeholder="请输入详细地址" />
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
        name: [
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
        detailedAddress: [
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
        name: "",
        goods_id: 0,
        startAt: "",
        detailedAddress: "", //详情地址
        addressData: ''
      },
      pickerParam: {
					year: true,
					month: true,
					day: true,
					hour: true,
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
    time(e){
      this.pickerParam.text=e.year+"-"+e.month+"-"+e.day+"-"+e.hour+"-00-00"
     
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
        this.$api.order.appointment(this.form).then(()=>{
          uni.showToast({title:"提交成功"})
        })
      });
    },
  },
};
</script>
