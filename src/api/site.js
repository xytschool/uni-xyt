import {get ,post,ws} from '../utils/request'
import {getAuthToken, getClientID} from '../utils/utils'

import {baseUrl} from '../config'
//const host = "/v1/site"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"
const host = baseUrl + "/site/{$com_id}"
//var ws = new WebSocket();

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
    async  getActivityList(){
        return get(host + '/getActivityList')
    },
    async  getActivityDetail(params){
        return get(host + '/getActivityDetail',params)
    },
    async applyPartTimer(params){
        return get(host + '/getNotifyDetail',params)
    },
    async message(params){
        return get(host + '/getNotifyDetail',params)
    },
    async getWxConfig(params){
        return get(host + '/getWxConfig', params)
    },
    async getCompany(){
        return get(host + '/getCompany')
    }
}
