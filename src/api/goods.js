import {get, post} from '../utils/request'
import {baseUrl} from '../config'
//const host = "/v1/site"
const host = baseUrl + "/goods/14"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"

module.exports = {
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async getRecommendGoodsList() {
        return get(host + '/getRecommendGoodsList')
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async getTagRecommendGoodsList() {
        return get(host + '/getTagRecommendGoodsList')
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async getHotGoodsList() {
        return get(host + '/getHotGoodsList')
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async getGoodsList(params) {
        return get(host + '/getGoodsList',params)
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async getGoodsTags() {
        return get(host + '/getGoodsTags')
    },
    async getGoodsByTagId() {
        return get(host + '/getGoodsListByTagId')
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async getGoodsDetail(params) {
        return get(host + '/getGoodsDetail', params)
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
    async clearCart() {
        return post(host + '/clearCart')
    },
    async updateCartGoods(data) {
        return post(host + '/updateCartGoods', data)
    }
}
