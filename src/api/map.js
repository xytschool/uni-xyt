import { get, post } from '../utils/request'
import { baseUrl } from '../config'
const host = baseUrl
module.exports = {
  // 获取坐标点列表接口:
  async getlocation() {
    return get(host + '/location/')
  },
  //上传坐标点接口:
  async postlocation(params) {
    return post(host + '/location/',params)
  },
  
}
