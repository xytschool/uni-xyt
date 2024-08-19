import { get, post } from '../utils/request'
import { baseUrl } from '../config'
const host = baseUrl
module.exports = {
  async location() {
    return get(host + '/location/')
  }
}
