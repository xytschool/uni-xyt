import Vue from 'vue'
import Vuex from 'vuex'
import order from './modules/order'
import user from './modules/user'
import goods from './modules/goods'
import company from './modules/company'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {},
    modules: {
        order,
        user,
        goods,
        company
    },
    mutations: {
    },
    actions: {

    }
})

export default store
