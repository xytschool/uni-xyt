import {get, post} from '../utils/request'
import {baseUrl} from '../config'

//const host = "/v1/order"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"
const host = baseUrl + "/order/{$com_id}"
module.exports = {
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async getOrderList(status, last_id) {
        return get(host + '/getOrderList', {status, last_id})
    },
    /**
     *  goodsList 商品列表
     *  position  下单位置  product|cart
     * */

    async preOrder(data) {
        return post(host + '/preOrder', data)
        //return get('http://shop.laravelschool.xyt/jspay?com_id=14&openid=oNrV6w92st6gWbXxySDiohmC2KtM&order_no=123123123199&total=100')
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async placeOrder(data) {
        //return post(host + '/createOrder', data)
        return get('http://shop.laravelschool.xyt/jspay?com_id=14&openid=oNrV6w92st6gWbXxySDiohmC2KtM&order_no=123123123199&total=100')
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async rePay(data) {
        return post(host + '/rePay', data)
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async cancelOrder(data) {
        return post(host + '/cancelOrder', data)
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async refund(data) {
        return post(host + '/refund', data)
    },
    async queryOrder(orderNo) {
        return post(host + '/queryOrder', {order_no: orderNo})
    }
}
