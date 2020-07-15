<style scoped lang="scss">
.notify-page {
  .title{
    text-align: center;
    font-size: 24px;
    margin: 15px;
  }
  .date{
    margin: 10px;
  }
  img{
    width: 100%;
  }   
}
</style>
<template>
  <div class="notify-page">
     <u-form >
    	<u-form-item label="姓名" :label-width="160">
			<u-input v-model="form.name" />
	  	</u-form-item>
        <u-form-item label="联系电话" :label-width="160">
			<u-input v-model="form.phone" />
	  	</u-form-item>
        <u-form-item label="收款方式" :label-width="160">
             <u-radio-group v-model="form.method" @change="methodChange">
			  <u-radio v-for="(item, index) in methods" :key="index" :name="item">
			  	{{item}}
			  </u-radio>
		    </u-radio-group>
        </u-form-item>
        <u-form-item v-show="form.method == '银行卡'" label="银行" :label-width="160" >
             <u-radio-group v-model="form.account" @change="methodChange">
			  <u-radio v-for="(item, index) in banks" :key="index" :name="item">
			  	{{item}}
			  </u-radio>
		    </u-radio-group>
        </u-form-item>

        <u-form-item label="账号" :label-width="160">
		       <u-input v-model="form.account"/>
	      </u-form-item>
        <u-button size="medium" type="primary" @click="submit">提交申请</u-button>
     </u-form> 
  </div>
</template>

<script>
//import {applyPartTimer, getApplyPartTimerStatus } from "../../api/user"
import {parseDate} from "../../utils/date"
import {setAuthToken} from "../../utils/utils"
export default {
    data() {
    return {
      methods: [
       '微信','支付宝','银行卡'
      ],
      banks:[
          '光大银行','招商银行','工商银行','中国银行','建设银行','农业银行','邮政银行' ,'北京银行','浦发银行',
      ],
      loading: true,
      com_id:0,
      errs:{
        phone: '',
      },  
      form:{
        phone:'',
        name:'',
        method:'',
        account:''
      } 
    };
  },
  onLoad(params){
    var token = params.token
    if(token){
      console.log('t', token)
      setAuthToken(token) 
    }

    this.getDetail()
  },
  methods: {
		parseDate(date){
			return parseDate(date)
    },
    methodChange(value){
      console.log('value', value)
    },
    submit(){
      console.log(this.form) 
      uni.showLoading({
        title: '加载中'
      });
      this.$api.user.applyPartTimer(this.form).then(res => {
        uni.hideLoading();
        if(res.code == 200){
          uni.showToast({
            title: '提交成功',
            duration: 2000
          }); 
        }else{
          uni.showToast({
            title: res.msg,
            duration: 2000
          });
        }
      })
    },
    getDetail(){
      this.$api.user.getApplyPartTimerStatus({}).then((response) => {
        console.log(response)
        if(response.code == 200) {
          this.notify = response.data
        }
      })
    }
  }
};
</script>
