import {
  getAddress,
  getUserAddressList,
  login,
  getUserInfo,
  tologin
} from '../../api/userapi'

const userMoudle = {
  namespaced: true,
  state: () => ({
    user: {},
    hasLogin: false,
    addressList: [],
    defaultAddress: {},

    addpeopleList: [],
    defaultAddPeople: {}
  }),
  mutations: {
    setUser(state, user) {
      console.log('setUser', user)
      state.user = user
      state.hasLogin = true
      uni.setStorage({
        //缓存用户登陆状态
        key: 'userInfo',
        data: user
      })
      uni.setStorage({
        //缓存用户登陆状态
        key: 'authToken',
        data: user.jws_token
      })
    },
    updateUser(state, user) {
      console.log('updateUser', user)
      state.user = user

      console.log('state.user', state.user)
      uni.setStorage({
        //缓存用户登陆状态
        key: 'userInfo',
        data: state.user
      })
      if (user.jws_token) {
        uni.setStorage({
          //缓存用户登陆状态
          key: 'authToken',
          data: user.jws_token
        })
      }
    },
    logout(state) {
      state.hasLogin = false
      state.user = {}
      uni.removeStorage({
        key: 'userInfo'
      })
      uni.removeStorage({
        key: 'authToken'
      })
    },
    setAddressList(state, list) {
      state.addressList = list
    },
    addAddress(state, address) {
      state.addressList.push(address)
    },
    updateAddress(state, address) {
      state.addressList.forEach((addr, index) => {
        if (addr.id == address.id) {
          //console.log(index)
          console.log(address)
          //this.$set(state.addressList,index,address)
          state.addressList[index] = address
          state.addressList.push({})
          state.addressList.pop()
          //state.addressList = Object.assign({},state.addressList)
        }
      })
    },

    setAddPeopleList(state, list) {
      state.addpeopleList = list
      console.log(state.addpeopleList, 'state.addpeopleLis')
    },
    addPeople(state, addpeople) {
      state.addpeopleList.push(addpeople)
    },
    delPeople(state, addpeople) {
      state.addpeopleList.forEach((item, index) => {
        if (item.id == state.addpeopleList[index].id) {
          state.addpeopleList.shift()
        } else {
          state.addpeopleList.pop()
        }
      })
      console.log(state.addpeopleList, 'state.addpeopleList')
    },

    setDefaultAddress(state, address) {
      state.defaultAddress = address
    },
    setDefaultAddPeople(state, address) {
      state.defaultAddPeople = address
    }
  },
  actions: {
    async login({ commit, dispatch, state }, data) {
      let res = await login(data)
      if (res.code == 200) {
        console.log(res.data, 'res.data')
        commit('setUser', res.data)
        return true
      } else {
        uni.showToast({
          title: '登录失败' + res.msg ? res.msg : '',
          icon: 'none'
        })
        return false
      }
    },
    checkLogin({ commit, dispatch, state }, com_id) {
      const that = this
      if (!state.hasLogin) {
        uni.showModal({
          content: '您还没有登录，去登录',
          success: async (e) => {
            if (e.confirm) {
              await tologin()
              setTimeout(async () => {
                let userInfoRes = await getUserInfo()
                if ((userInfoRes.code = 'success')) {
                  commit('updateUser', userInfoRes.data)
                  state.hasLogin = true
                }
              }, 1000)
            }
          }
        })
        return false
      }
      return true
    },
    logout({ commit, dispatch, state }) {
      commit('logout')
    },

    // async updateUserInfo({ commit, dispatch, state }) {

    // },
    async getAddress({ commit, dispatch, state }) {
      let userAddressListRes = await getAddress()
      if ((userAddressListRes.code = 200)) {
        let list = userAddressListRes.data
        console.log(5654567876567, list)
        // if (!list || list.length == 0) {
        //   uni.showToast({ title: '缺少使用人' })
        //   return false
        // }
        commit('setDefaultAddPeople', userAddressListRes.data)

        commit('setAddPeopleList', userAddressListRes.data)
        return true
      }
      return false
    },
    async getUserAddressList({ commit, dispatch, state }) {
      let userAddressListRes = await getUserAddressList()
      if ((userAddressListRes.code = 200)) {
        let list = userAddressListRes.data
        if (!list || list.length == 0) {
          uni.showToast({ title: '缺少收货地址' })
          return false
        }

        let flag = false
        list.forEach((address) => {
          if (address.checked) {
            commit('setDefaultAddress', address)
            console.log('defalutAddress=>', address)
            flag = true
          }
        })
        if (!flag) {
          commit('setDefaultAddress', list[0])
        }
        commit('setAddressList', userAddressListRes.data)
        return true
      }
      return false
    }
  },
  getters: {}
}

export default userMoudle
