import {get, post} from '../utils/request'
//const host = "http://shop.laravelschool.xyt/shop-api"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"
//const host = "/dev/user"
const host = "http://m.xytschool.com/dev/user/16"
module.exports = {
    async sendLoginMessage(params) {
        return post(host + '/sendVerifyCodeSms', params)
    },
    async login(params) {
        return post(host + '/login', params)
    },
    async wxLogin(params) {
        return post(host + '/wxlogin', params)
    },
    async getUserInfo(params) {
        return get(host + '/getUserInfo', params)
    },
    async getUserMessage(params) {
        return get(host + '/getUserMessage', params)
    },

    async applyPartTimer(params) {
        return post(host + '/applyPartTimer', params)
    },
    async getApplyPartTimerStatus() {
        return get(host + '/getApplyPartTimerStatus')
    },

}
