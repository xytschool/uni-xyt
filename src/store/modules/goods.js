import {getGoodsList, getGoodsTags} from "../../api/goods";

// initial state
const state = () => ({
    allGoods: [],
    goodsList: [],
    goodsTags: [],
    tagGoodsMap: {},
})

// getters
const getters = {}

// actions
const actions = {
    async getAllGoods({commit}) {
        let res = await getGoodsList({limit:100})
        if (res.code == 'success') {
            commit('setAllGoods', res.data)
        }
    },
    async getGoodsTags({commit,}) {
        let tagsRes = await getGoodsTags()
        if (tagsRes.code == 'success') {
            commit('setGoodsTags', tagsRes.data)
        }
    },
    async getGoodsByTagId({commit}, tagId) {
        let res = await this.getGoodsByTagId(tagId)
        if (res.code == 'success') {

        }
    }
}

// mutations
const mutations = {
    setGoodsTags(state, goodsTags) {
        state.goodsTags = goodsTags
    },
    setAllGoods(state, allGoods) {
        state.allGoods = allGoods
    },
    setTagGoodsByTagId(state, {goodsTags, tagId}) {
        state.tagGoodsMap[tagId] = goodsTags
    },
    setProducts(state, products) {
        state.all = products
    },
    decrementProductInventory(state, {id}) {
        const product = state.all.find(product => product.id === id)
        product.inventory--
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}