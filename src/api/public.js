import {get ,post,ws} from '../utils/request'
import {getAuthToken, getClientID} from '../utils/utils'

import {baseUrl} from '../config'
//const host = "/v1/site"
//const host = "http://site.ideatest.top:8889/v1/site"
//const host = "http://localhost:8889/v1/site"
const host = baseUrl 

module.exports = {
  async getNotices() {
    return get(host + `/notices`)
  },
  async NoticesDetails(id) {
    return get(host + `/notices/${id}`)
}
}