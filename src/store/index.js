import Vue from 'vue'
import Vuex from 'vuex'
import order from './modules/order'
import user from './modules/user'
import goods from './modules/goods'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        company: {},
        comId: 0,
        source: '小程序',
        pay_method: '微信',
    },
    modules: {
        order,
        user,
        goods
    },
    mutations: {
    },
    actions: {

    }
})

export default store
