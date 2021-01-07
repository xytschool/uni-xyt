import {get, post, ws} from '../utils/request'
import {getAuthToken, getClientID} from '../utils/utils'

import {baseUrl} from '../config'
//const host = "/v1/site"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"
const host = baseUrl + "/activity/{$com_id}"
//var ws = new WebSocket();

module.exports = {
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async getActivityList() {
        return get(host + '/getActivityList')
    },
    async getActivityDetail(params) {
        return get(host + '/getActivityDetail', params)
    },
    //
    async getCouponsByGoodsId(params) {
        return get(host + '/getCouponsByGoodsId', params)
    },
    async getCouponsByPosition(params) {
        return get(host + '/getCouponsByPosition', params)
    },
    async getUserCoupons(params) {
        return get(host + '/getUserCoupons', params)
    },
    async getCouponsByOrder(params) {
        return post(host + '/getCouponsByOrder', params)
    },
    async createUserCoupon(params) {
        return post(host + '/createUserCoupon', params)
    },
    async getActivityByGoodsId(params) {
        return get(host + '/getActivityByGoodsId', params)
    },
    async getUserAwards(last_id) {
        return get(host + '/getUserAwards',{last_id} )
    },
    async getUserAwardHistories(last_id) {
        return get(host + '/getUserAwardHistories', {last_id})
    },
}
