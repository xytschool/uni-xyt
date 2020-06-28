import {get ,post} from '../utils/request'
const host = "/v1/site"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"

module.exports = {
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async  getOrderList(){
        return get(host + '/getOrderList')
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async  preOrder(){
        return post(host + '/preOrder')
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async  createOrder(){
        return post(host + '/createOrder')
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async  rePay(){
        return post(host + '/rePay')
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async  cancelOrder(){
        return post(host + '/cancelOrder')
    },
    /**
     *   [{icon: '' , title: '' , link: ''}]
     * */
    async  refund(){
        return post(host + '/refund')
    },
}
