var host = ''
//var host = "https://mobile.xytschool.com"
var baseUrl = ''
import { getAuthToken, getClientID, getComId } from './utils'
import { baseUrlLogo } from '../config'
function request(method, url, query, is_raw) {
  var com_id = getComId()
  if (com_id) {
    url = url.replace('{$com_id}', com_id)
  }

  return new Promise((resolve, reject) => {
    var token = getAuthToken()

    var clientId = getClientID()

    var fullUrl = ''
    if (url.startsWith('http')) {
      fullUrl = url
    } else if (is_raw) {
      fullUrl = host + url
    } else {
      fullUrl = host + baseUrl + url
    }
    var header = {}
    if (token) {
      header = {
        'content-type': 'application/json', // 默认值
        Authorization: 'Bearer ' + token,
        ClientID: clientId
      }
    } else {
      header = {
        'content-type': 'application/json', // 默认值
        ClientID: clientId
      }
    }

    wx.request({
      url: fullUrl,
      data: query,
      method: method,
      header: header,
      success(res) {
        //console.log('request', res)
        if (res.statusCode == 200) {
          res = res.data
          if (res.code === 200 || res.code === 700 || res.code === 0) {
            resolve(res)
          } else {
            resolve(res)
          }
        } else if (res.statusCode == 401) {
          debugger
          uni.showModal({
            title: '当前未登录',
            content: '授权登陆',
            success: async function(res) {
              console.log('授权登陆', res)
              if (res.confirm) {
                await tologin()
                //#endif
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {

          resolve(res.data)
        }
      },
      fail(res) {
        uni.showToast({
          icon: 'none',
          title: '请求异常',
          duration: 3000
        })
        resolve(res)
      }
    })
  })
}

function tologin() {
  return new Promise((resolve, reject) => {
    uni.login({
      success: (res) => {
        wx.request({
          url: `${baseUrlLogo}/auth/wechatMiniAppLogin`,
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          dataType: 'JSON',
          data: {
            code: res.code
          },
          success: function(data) {
            console.log(data, 'data')
            uni.showToast({
              title: '登陆成功',
              icon: 'none',
              duration: 2000
            })

            wx.setStorage({
              key: 'token',
              data: JSON.parse(data.data).data.token
            })

            resolve(data)
          },
          fail(data) {
            uni.showToast({
              title: `失败${JSON.stringify(data)}`,
              icon: 'none',
              duration: 5000
            })
            reject(data)
          }
        })
      }
    })
  })
}

function get(url, query) {
  if (query == undefined) {
    query = {}
  }
  return request('GET', url, query)
}

function del(url, query) {
  if (query == undefined) {
    query = {}
  }
  return request('DELETE', url, query)
}
function put(url, query) {
  if (query == undefined) {
    query = {}
  }
  return request('PUT', url, query)
}
function rawGet(url, query) {
  if (query == undefined) {
    query = {}
  }
  return request('GET', url, query, true)
}

function post(url, query) {
  if (query == undefined) {
    query = {}
  }
  return request('POST', url, query)
}

function ws(url, query) {
  // if (query == undefined) {
  //     query = {}
  // }
  //
  // var token = getAuthToken()
  // var clientId = getClientID()
  //
  // var header = {}
  // if (token) {
  //     header = {
  //         'content-type': 'application/json',// 默认值
  //         'Authorization': 'Bearer ' + token,
  //         'ClientID': clientId
  //     }
  // } else {
  //     header = {
  //         'content-type': 'application/json',// 默认值
  //         'ClientID': clientId
  //     }
  // }
  return uni.connectSocket({
    url: url,
    data() {
      return query
    },
    complete: (e) => {
      console.log(e)
    }
    //protocols: ['protocol1'],
    //method: 'GET'
  })
}

module.exports = {
  baseUrl,
  request,
  rawGet,
  ws,
  get,
  post,
  del,
  put,
  tologin
}
