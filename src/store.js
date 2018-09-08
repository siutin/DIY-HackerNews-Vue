import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const HACKER_NEWS_API_BASE_POINT = 'https://hacker-news.firebaseio.com/v0'
const types = { HW_NEW_STORES: 'HW_NEW_STORES' }

const state = {
  storeIds: [],
}

const getters = {
  getStoreIds: state => state.storeIds,
  getStores: state => state.stores
}
const mutations = {
  [types.HW_NEW_STORES] (state, payload) {
    const newstories = window.localStorage.getItem('newstories')
    if (newstories) {
      const data = JSON.parse(newstories)
      Vue._.each(data, storeId => {
        if (state.storeIds.indexOf(storeId) == -1) {
          Vue.set(state, 'storeIds', [...state.storeIds, storeId])
        }
      })
      if (typeof(payload) == 'function') {
        payload()
      }
    } else {
      console.log('fetch newstories')
      fetch(`${HACKER_NEWS_API_BASE_POINT}/newstories.json`)
        .then(res => res.json())
        .then(data => new Promise((resolve, reject) =>
          Vue._.isArray(data) && !Vue._.isEmpty(data) ? resolve(data) : reject(new Error())
        ))
        .then(data => {
          window.localStorage.setItem('newstories', JSON.stringify(data))
          Vue._.each(data, storeId => {
            if (state.storeIds.indexOf(storeId) == -1) {
              Vue.set(state, 'storeIds', [...state.storeIds, storeId])
            }
          })
          if (typeof(payload) == 'function') {
            payload()
          }
        }).catch(console.error)
    }

  }
}
const actions = {
  syncHWNewStoreIDs ({ commit }, payload) {
    commit(types.HW_NEW_STORES, payload)
  },
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
