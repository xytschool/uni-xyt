import {get ,post} from '../utils/request'
const host = "/v1/site"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"

module.exports = {
    async  getNotifyList(){
        return get(host + '/getNotifyList')
    },
     async  getNotifyDetail(params){
        return get(host + '/getNotifyDetail',params)
    },
}
