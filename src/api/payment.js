import { get, post } from '../utils/request'
import { baseUrl } from '../config'

//const host = "/v1/order"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"
const host = baseUrl + '/pay'
module.exports = {
  async prePayment(data) {
    return post(host + '/preorder', data)
  },
  async refund(data) {
    return post(host + '/refund', data)
  },
}
