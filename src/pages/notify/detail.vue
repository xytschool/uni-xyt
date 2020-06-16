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
    <view class="title">{{notify.title}}</view>
    <view class="date">{{parseDate(notify.created_at)}}</view>
    <view slot="body">
         <rich-text :nodes="notify.body"></rich-text>
    </view>
  </div>
</template>

<script>
import {getNotifyDetail} from "../../api/site"
import {parseDate} from "../../utils/date"
export default {
    data() {
    return {
      loading: true,
      com_id:0,
      notify:{
        id:0,
        title:'',
        created_at:'',
        body:'',
        cover:''
      }
    };
  },
  onLoad(params){
    this.notify_id = params.notify_id
    this.getDetail()
  },
  methods: {
		parseDate(date){
			return parseDate(date)
		},
    getDetail(){
      getNotifyDetail({ id: this.notify_id}).then((response) => {
        console.log(response)
        if(response.code == 200) {
          this.notify = response.data
        }
      })
    }
  }
};
</script>
