import {getCompany} from "../../api/site";

// initial state
const state = () => ({
    company: null,
})

// getters
const getters = {}

// actions
const actions = {
    async getCompany({commit,state}) {
        if(state.company){
           return state.company
        }

        let res = await getCompany()
        if (res.code == 200) {
            commit('setCompany', res.data)

        }
    }
}

// mutations
const mutations = {
    setCompany(state, company) {
        console.log('setCompany', company)
        state.company = company
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}