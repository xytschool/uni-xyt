import {placeOrder, preOrder} from "../../api/order";

const orderMoudle = {
    namespaced: true,
    state: () => ({
        tempOrder: {
            isOk: false,
            positions: 'goods',
            method: '',
            goodsList: [],
            coupons: [],
            score: 0,
            total: 0,
            real_total: 0,
            num: 0,
            discount: 0,
            express: 0,
            note: '',
            source: '小程序',
            pay_method: '微信',
            goods_type: 'goods',
        },
        tempAddress: {},
        payData: {}
    }),
    mutations: {
        createTempOrderByGoodsList(state, goodsList) {
            console.log('createTempOrderByGoodsList', goodsList)
            state.tempOrder.isOk = true
            state.tempOrder.goodsList = goodsList
        },
        createTempOrder(state, tempOrder) {
            state.tempOrder.isOk = true
            state.tempOrder = tempOrder
        },
        updateTempAddress(state, address) {
            state.tempAddress = address
        },
        setPayData(state, payData) {
            state.payData = payData
        },
        clearTempOrder(state) {
            state.tempOrder.isOk = false
        },
        changeNote(state, note) {
            state.tempOrder.note = note
        },
        updateCouponList(state, coupons) {
            state.tempOrder.coupons = coupons
        },
        buildOrder(state) {
            var goodsList = state.tempOrder.goodsList
            state.tempOrder.real_total = 0
            state.tempOrder.total = 0
            state.tempOrder.num = 0
            goodsList.forEach((item) => {
                state.tempOrder.real_total += item.real_price * item.num
                state.tempOrder.total += item.price * item.num
                state.tempOrder.num += item.num
            })
            let coupon_discount = 0
            state.tempOrder.coupons.forEach((c) => {
                console.log(c.id)
                coupon_discount += c.amount
            })
            state.tempOrder.real_total -= coupon_discount
            state.tempOrder.discount = state.tempOrder.total - state.tempOrder.real_total
        },
    },
    actions: {
        reset({commit, state}) {
            state.tempOrder = {
                isOk: false,
                positions: 'goods',
                method: '',
                goodsList: [],
                coupons: [],
                score: 0,
                total: 0,
                real_total: 0,
                num: 0,
                discount: 0,
                express: 0,
                note: '',
                source: '小程序',
                pay_method: '微信',
                goods_type: 'goods',
            }
        },
        updateCouponList({commit}, coupons) {
            commit('updateCouponList', coupons)
            commit('buildOrder')
        },
        async preOrderByGoodsList({commit, dispatch, state}, goodsList) {
            commit('createTempOrderByGoodsList', goodsList)
            commit('buildOrder')
            //await dispatch('preOrder', state.tempOrder)
        },
        // async addCoupon({commit, dispatch, state}, coupon) {
        //     commit('createTempOrderByGoodsList', goodsList)
        //     commit('buildOrder')
        //     //await dispatch('preOrder', state.tempOrder)
        // },
        async placePreOrder({state, commit}) {
            console.log('preOrder ->', state.tempOrder)
            if (state.tempOrder.goods_type == 'goods') {
                if (state.tempAddress.id) {
                    state.tempOrder.address_id = state.tempAddress.id
                    state.tempOrder.address = state.tempAddress
                } else {
                    uni.showToast({title: '请添加收货地址'})
                    return false
                }
            }

            let res = await preOrder(state.tempOrder)
            if (res.code == 200) {
                //uni.showToast({title: "下单成功:"})
                commit('setPayData', res.data)
                return res.data
            } else {
                uni.showToast({title: "预下单失败:" + res.msg})
                return false
            }
        },
        async placeOrder({state, commit}) {
            let res = await placeOrder(state.tempOrder)
            if (res.code == 200) {
                uni.showToast({title: "下单成功:"})
                commit('clearTempOrder', res.data)
                return true
            } else {
                uni.showToast({title: "下单失败:" + res.msg})
                return false
            }
        }
    },
    getters: {}
}

export default orderMoudle