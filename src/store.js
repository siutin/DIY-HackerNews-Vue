import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

const HACKER_NEWS_API_BASE_POINT = 'https://hacker-news.firebaseio.com/v0'
const types = {
  HW_NEW_STORES: 'HW_NEW_STORES',
  HW_GET_STORE: 'HW_GET_STORE',
  APP_SET_TITLE: 'APP_SET_TITLE',
  APP_SET_ACTIVE_SCOPE: 'APP_SET_ACTIVE_SCOPE'
}
const urls = {
  'new': 'newstories',
  'top': 'topstories',
  'best': 'beststories'
}
const scopeValues = ['new', 'top', 'best']

const state = {
  title: '',
  activeScopeIndex: 0,
  storeIds: {
    new: [],
    top: [],
    best: [],
  },
  stores: []
}

const getters = {
  getStoreIds: (state, getters) => state.storeIds[`${scopeValues[getters.getActiveScopeIndex]}`],
  getStores: state => state.stores,
  getTitle: state => state.title,
  getScopeValues: state => scopeValues,
  getActiveScope: (state, getters) => scopeValues[getters.getActiveScopeIndex],
  getActiveScopeIndex: state => state.activeScopeIndex
}

const getStores = (state, STORY_TYPE, name, callback) => {
  const hwStores = window.localStorage.getItem(STORY_TYPE)
  const lastUpdatedAt = window.localStorage.getItem(`${STORY_TYPE}#last_updated_at`)
  const useCache = moment().add(1, 'minutes').isAfter(moment(lastUpdatedAt))
  console.log(`${STORY_TYPE} - useCache: ${useCache} hwStores: ${(hwStores || []).length}`)

  if (hwStores && useCache) {
    const data = JSON.parse(hwStores)
    Vue._.each(data, storeId => {
      if (state.storeIds[name].indexOf(storeId) === -1) {
        Vue.set(state.storeIds, name, [...state.storeIds[name], storeId])
      }
    })
    if (typeof (callback) === 'function') {
      callback(data)
    }
  } else {
    console.log(`fetch hwStores -> ${urls[name]}`)
    fetch(`${HACKER_NEWS_API_BASE_POINT}/${urls[name]}.json`)
      .then(res => res.json())
      .then(data => new Promise((resolve, reject) =>
        Vue._.isArray(data) && !Vue._.isEmpty(data) ? resolve(data) : reject(new Error())
      ))
      .then(data => {
        window.localStorage.setItem(STORY_TYPE, JSON.stringify(data))
        window.localStorage.setItem(`${STORY_TYPE}#last_updated_at`, moment().toISOString())

        Vue._.each(data, storeId => {
          if (state.storeIds[name].indexOf(storeId) === -1) {
            Vue.set(state.storeIds, name, [...state.storeIds[name], storeId])
          }
        })
        if (typeof (callback) === 'function') {
          callback(data)
        }
      }).catch(console.error)
  }
}

const mutations = {
  [types.HW_NEW_STORES](state, {
    payload,
    getters
  }) {
    const {
      name,
      callback
    } = payload
    let nname = name || getters.getActiveScope
    getStores(state, `HW_${nname.toUpperCase()}`, nname, callback)
  },
  [types.HW_GET_STORE](state, payload) {
    const {
      id,
      callback
    } = payload
    const store = window.localStorage.getItem(`store-${id}`)

    const lastUpdatedAt = window.localStorage.getItem(`store-${id}#last_updated_at`)
    const useCache = moment().add(1, 'minutes').isAfter(moment(lastUpdatedAt))
    console.log(`${types.HW_GET_STORE} - store-${id} - useCache: ${useCache}`)

    if (store && useCache) {
      if (typeof (callback) === 'function') {
        callback(JSON.parse(store))
      }
    } else {
      console.log('fetch newstories')
      fetch(`${HACKER_NEWS_API_BASE_POINT}/item/${id}.json`)
        .then(res => res.json())
        .then(data => new Promise((resolve, reject) =>
          !Vue._.isEmpty(data) ? resolve(data) : reject(new Error('data is empty'))
        ))
        .then(data => {
          Vue.set(state, 'stores', [...state.stores, data])
          window.localStorage.setItem(`store-${id}`, JSON.stringify(data))
          window.localStorage.setItem(`store-${id}#last_updated_at`, moment().toISOString())

          if (typeof (callback) === 'function') {
            callback(data)
          }
        }).catch(err => console.error(err.message))
    }
  },
  [types.APP_SET_TITLE](state, payload) {
    console.log(types.APP_SET_TITLE)
    const {
      title
    } = payload
    state.title = title
  },
  [types.APP_SET_ACTIVE_SCOPE](state, payload) {
    console.log(types.APP_SET_ACTIVE_SCOPE)
    const {
      name
    } = payload
    if (name) {
      let index = scopeValues.indexOf(name)
      if (index != -1) {
        state.activeScopeIndex = index
      }
    }
  }
}
const actions = {
  syncHWNewStoreIDs({
    commit,
    getters
  }, payload) {
    commit(types.HW_NEW_STORES, {
      payload,
      getters
    })
  },
  syncHWStore({
    commit
  }, payload) {
    commit(types.HW_GET_STORE, payload)
  },
  setAppTitle({
    commit
  }, payload) {
    commit(types.APP_SET_TITLE, payload)
  },
  setActiveScope({
    commit
  }, payload) {
    commit(types.APP_SET_ACTIVE_SCOPE, payload)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})