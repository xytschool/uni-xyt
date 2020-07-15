import {get, post} from '../utils/request'
import {baseUrl} from '../config'
//const host = "http://shop.laravelschool.xyt/shop-api"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"
//const host = "/dev/user"
const host = baseUrl + "/user/14"
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
    async getUserDefaultAddress(params) {
        return get(host + '/getUserDefaultAddress', params)
    },
    async getUserAddressList(params) {
        return get(host + '/getUserAddressList', params)
    },
    async addAddress(params) {
        return post(host + '/createUserAddress', params)
    },
    async changeAddress(params) {
        return post(host + '/updateUserAddress', params)
    },
    async delAddress(params) {
        return post(host + '/delAddress', params)
    },
    async addUserCollection(type, target_id) {
        return post(host + '/addUserCollection', {type, target_id})
    },
    async delUserCollection(type, target_id) {
        return post(host + '/delUserCollection', {type, target_id})
    },
    async isCollect(type, target_id) {
        return post(host + '/isCollect', {type, target_id})
    },
    async getUserCollectionList() {
        return post(host + '/getUserCollectionList')
    },
    checkVerifyCode(params) {
        return post(host + '/getUserCollectionList')
    }
}
