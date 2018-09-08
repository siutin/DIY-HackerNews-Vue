import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const HACKER_NEWS_API_BASE_POINT = 'https://hacker-news.firebaseio.com/v0'
const types = { HW_NEW_STORES: 'HW_NEW_STORES' }

const state = {
  stores: {
  }
}

const getters = {
  getStores: state => state.stores
}
const mutations = {
  [types.HW_NEW_STORES] (state, payload) {
    fetch(`${HACKER_NEWS_API_BASE_POINT}/newstories.json`)
      .then(res => res.json())
      .then(data => new Promise((resolve, reject) =>
        Vue._.isArray(data) && !Vue._.isEmpty(data) ? resolve(data) : reject(new Error())
      ))
      .then(data => {
          Vue._.each(data, storeId => {
            Vue.set(state.stores, storeId, {})
          })
      })
  }
}
const actions = {
  syncHWNewStoreIDs ({ commit }) {
    commit(types.HW_NEW_STORES)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
