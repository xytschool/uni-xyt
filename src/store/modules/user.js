import {getUserAddressList, login} from "../../api/userapi";

const userMoudle = {
    namespaced: true,
    state: () => ({
        user: {},
        hasLogin: false,
        addressList: [],
        defaultAddress: {}
    }),
    mutations: {
        setUser(state, user) {
            state.user = user
            state.hasLogin = true
            uni.setStorage({//缓存用户登陆状态
                key: 'userInfo',
                data: user
            })
        },
        logout(state) {
            state.hasLogin = false;
            state.user = {};
            uni.removeStorage({
                key: 'userInfo'
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
        setDefaultAddress(state, address) {
            state.defaultAddress = address
        },
    },
    actions: {
        login({commit, dispatch, state}, data) {
            let res = login(data)
            if (res.code == 200) {
                console.log('login', res)
            }else {

            }
        },
        logout({commit, dispatch, state}) {
            commit('logout')
        },
        async getUserAddressList({commit, dispatch, state}) {
            // if (state.addressList.length >= 0) {
            //     return
            // }
            let userAddressListRes = await getUserAddressList()
            if (userAddressListRes.code = 200) {
                let list = userAddressListRes.data
                if (!list || list.length == 0) {
                    uni.showToast({title: '缺少收货地址'})
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
            //commit('buildOrder')
            //await dispatch('preOrder', state.tempOrder)
        },

    },
    getters: {}
}

export default userMoudle