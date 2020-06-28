import {get, post} from '../utils/request'

//const host = "/v1/site"
const host = "http://m.xytschool.com/dev/goods/14"
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
    async getGoodsList() {
        return get(host + '/getGoodsList')
    },

}
