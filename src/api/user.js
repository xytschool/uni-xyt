import {get, post} from '../utils/request'
//const host = "http://shop.laravelschool.xyt/shop-api"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"
//const host = "/dev/user"
const host = "http://m.xytschool.com/dev/user/16"
module.exports = {
    async getNewClientID(params) {
        return post(host + '/getNewClientID', params)
    },
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
    async getCartGoodsList() {
        return get(host + '/getCartGoodsList')
    },
    async addCartGoods(data) {
        return post(host + '/addCartGoods', data)
    },
    async delCartGoods(data) {
        return post(host + '/delCartGoods', data)
    },
    async updateCartGoods(data) {
        return post(host + '/updateCartGoods', data)
    }
}
