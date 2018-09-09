import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

const HACKER_NEWS_API_BASE_POINT = 'https://hacker-news.firebaseio.com/v0'
const types = { HW_NEW_STORES: 'HW_NEW_STORES', HW_GET_STORE: 'HW_GET_STORE', APP_SET_TITLE: 'APP_SET_TITLE' }

const state = {
  title: '',
  storeIds: [],
  stores: []
}

const getters = {
  getStoreIds: state => state.storeIds,
  getStores: state => state.stores,
  getTitle: state => state.title
}
const mutations = {
  [types.HW_NEW_STORES] (state, payload) {
    const newstories = window.localStorage.getItem(`${types.HW_NEW_STORES}`)

    const last_updated_at = window.localStorage.getItem(`${types.HW_NEW_STORES}#last_updated_at`)
    const useCache = moment().add(1, 'minutes').isAfter(moment(last_updated_at))
    console.log(`${types.HW_NEW_STORES} - useCache: ${useCache}`)

    if (newstories && useCache) {
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
          window.localStorage.setItem(`${types.HW_NEW_STORES}`, JSON.stringify(data))
          window.localStorage.setItem(`${types.HW_NEW_STORES}#last_updated_at`, moment().toISOString())

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

  },
  [types.HW_GET_STORE] (state, payload) {
    console.log(types.HW_GET_STORE)
    const { id, callback } = payload
    const store = window.localStorage.getItem(`store-${id}`)

    const last_updated_at = window.localStorage.getItem(`store-${id}#last_updated_at`)
    const useCache = moment().add(1, 'minutes').isAfter(moment(last_updated_at))
    console.log(`${types.HW_GET_STORE} - store-${id} - useCache: ${useCache}`)

    if (store && useCache) {
      if (typeof(callback) == 'function') {
        callback(JSON.parse(store))
      }
    } else {
      fetch(`${HACKER_NEWS_API_BASE_POINT}/item/${id}.json`)
        .then(res => res.json())
        .then(data => new Promise((resolve, reject) =>
         !Vue._.isEmpty(data) ? resolve(data) : reject(new Error('data is empty'))
        ))
        .then(data => {
          console.log(`state.stores last: ${JSON.stringify(_.last(state.stores))}`)
          Vue.set(state, 'stores', [...state.stores, data])
          window.localStorage.setItem(`store-${id}`, JSON.stringify(data))
          window.localStorage.setItem(`store-${id}#last_updated_at`, moment().toISOString())

          if (typeof(callback) == 'function') {
            callback(data)
          }
        }).catch(err => console.error(err.message))
    }
  },
  [types.APP_SET_TITLE] (state, payload) {
    console.log(types.APP_SET_TITLE)
    const { title } = payload
    state.title = title
  }
}
const actions = {
  syncHWNewStoreIDs ({ commit }, payload) {
    commit(types.HW_NEW_STORES, payload)
  },
  syncHWStore ({ commit }, payload) {
    console.log(payload);
    commit(types.HW_GET_STORE, payload)
  },
  setAppTitle ({ commit }, payload) {
    commit(types.APP_SET_TITLE, payload)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
