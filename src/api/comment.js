import {get ,post} from '../utils/request'
import {baseUrl} from '../config'
//const host = "/v1/comment"
//const host = "http://comment.ideatest.top:8885/v1/comment"
//const host = "http://localhost:8885/v1/comment"
//const host = "http://m.xytschool.com/dev/comment/16"
const host = baseUrl+"/comment"
module.exports = {
    async  submitComment(data){
        return post(host + '/submitComment',data)
    },
    async getCommentList(params){
        return get(host + '/getCommentList' , params)
    },
    async getGoodsCommentNum(params){
        return get(host + '/getGoodsCommentNum' , params)
    },
    async getSubCommentList(params){
        return get(host + '/getSubCommentList' , params)
    },
    async upComment(params){
        return get(host + '/upComment' , params)
    }
}
