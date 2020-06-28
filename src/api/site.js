import {get ,post} from '../utils/request'
//const host = "/v1/site"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"
const host = "http://m.xytschool.com/dev/site/14"
module.exports = {
   /**
    *   [{src: '' , background: '' , link: ''}]
    * */
    async  getBannerList(){
        return get(host + '/getBannerList')
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async  getNavList(){
        return get(host + '/getNavList')
    },

    async  getNotifyList(){
        return get(host + '/getNotifyList')
    },
    async  getNotifyDetail(params){
        return get(host + '/getNotifyDetail',params)
    },
    async applyPartTimer(){
        return get(host + '/getNotifyDetail',params)
    }
}
