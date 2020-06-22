import {get ,post} from '../utils/request'
const host = "http://shop.laravelschool.xyt/shop-api"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"

module.exports = {
    async applyPartTimer(params){
        return post(host + '/applyPartTimer',params)
    },
    async getApplyPartTimerStatus(){
        return get(host + '/getApplyPartTimerStatus')
    }
}
