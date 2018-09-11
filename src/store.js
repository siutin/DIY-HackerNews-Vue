import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import { captialize } from './utils.js'

Vue.use(Vuex)

const HACKER_NEWS_API_BASE_POINT = 'https://hacker-news.firebaseio.com/v0'
const types = {
  HW_NEW_STORIES: 'HW_NEW_STORIES',
  HW_GET_STORY: 'HW_GET_STORY',
  APP_SET_TITLE: 'APP_SET_TITLE',
  APP_SET_ACTIVE_SCOPE: 'APP_SET_ACTIVE_SCOPE',
  GET_STORY_SCREENSHOT: 'GET_STORY_SCREENSHOT'
}

const scopes = [
  { name: 'new', index: 0 },
  { name: 'top', index: 1 },
  { name: 'best', index: 2 }
]

const state = {
  title: '',
  activeScopeIndex: 0,
  storyIds: {
    new: [],
    top: [],
    best: []
  },
  stories: [],
  screenshots: []
}

const getScopeNameByIndex = index => (Vue._.find(scopes, ['index', index]) || {}).name
const getScopeIndexByName = name => (Vue._.find(scopes, ['name', name]) || {}).index

const getters = {
  getStoryIds: (state, getters) => state.storyIds[getters.getActiveScopeName],
  getStories: state => state.stories,
  getTitle: state => state.title,
  getActiveScopeName: state => getScopeNameByIndex(state.activeScopeIndex),
  getScopeTitles: () => scopes.map(scope => captialize(scope.name))
}

const getStories = (state, STORY_TYPE, name, callback) => {
  const hwStories = window.localStorage.getItem(STORY_TYPE)
  const lastUpdatedAt = window.localStorage.getItem(`${STORY_TYPE}#last_updated_at`)
  const useCache = moment().add(1, 'minutes').isAfter(moment(lastUpdatedAt))
  console.log(`${STORY_TYPE} - useCache: ${useCache} hwStories: ${(hwStories || []).length}`)

  if (hwStories && useCache) {
    const data = JSON.parse(hwStories)
    Vue._.each(data, storyId => {
      if (state.storyIds[name].indexOf(storyId) === -1) {
        Vue.set(state.storyIds, name, [...state.storyIds[name], storyId])
      }
    })
    if (typeof (callback) === 'function') {
      callback(data)
    }
  } else {
    console.log(`fetch hwStories -> ${name}`)
    fetch(`${HACKER_NEWS_API_BASE_POINT}/${name}stories.json`)
      .then(res => res.json())
      .then(data => new Promise((resolve, reject) =>
        Vue._.isArray(data) && !Vue._.isEmpty(data) ? resolve(data) : reject(new Error())
      ))
      .then(data => {
        window.localStorage.setItem(STORY_TYPE, JSON.stringify(data))
        window.localStorage.setItem(`${STORY_TYPE}#last_updated_at`, moment().toISOString())

        Vue._.each(data, storyId => {
          if (state.storyIds[name].indexOf(storyId) === -1) {
            Vue.set(state.storyIds, name, [...state.storyIds[name], storyId])
          }
        })
        if (typeof (callback) === 'function') {
          callback(data)
        }
      }).catch(console.error)
  }
}

const generateRunPageSpeedURL = (url) => `https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=${url}&screenshot=true`
const getScreenShot = (state, story, callback) => {
  console.log(`getScreenShot`)
  let id = story.id
  let url = story.url
  if (url) {
    let screenshot = Vue._.find(state.screenshots, [id, id])
    if (screenshot) {
      if (typeof (callback) === 'function') {
        callback(screenshot)
      }
    } else {
      fetch(generateRunPageSpeedURL(url))
        .then(res => res.json())
        .then(data => new Promise((resolve, reject) =>
          !Vue._.isEmpty(data) ? resolve(data) : reject(new Error('data is empty'))
        ))
        .then(data => {
          let screenshot = data['screenshot']
          Vue.set(state, 'screenshots', [...state.screenshots, screenshot])
          if (typeof (callback) === 'function') {
            callback(screenshot)
          }
        }).catch(err => console.error(err.message))
    }
  }
}

const mutations = {
  [types.HW_NEW_STORIES] (state, {
    payload,
    getters
  }) {
    const {
      name,
      callback
    } = payload
    let nname = name || getters.getActiveScopeName
    getStories(state, `HW_${nname.toUpperCase()}`, nname, callback)
  },
  [types.HW_GET_STORY] (state, payload) {
    const { id, callback } = payload
    const story = window.localStorage.getItem(`story-${id}`)

    const lastUpdatedAt = window.localStorage.getItem(`story-${id}#last_updated_at`)
    const useCache = moment().add(1, 'minutes').isAfter(moment(lastUpdatedAt))
    console.log(`${types.HW_GET_STORY} - story-${id} - useCache: ${useCache}`)

    if (story && useCache) {
      const data = JSON.parse(story)
      Vue.set(state, 'stories', [...state.stories, data])
      if (typeof (callback) === 'function') {
        callback(data)
      }
    } else {
      console.log('fetch newstories')
      fetch(`${HACKER_NEWS_API_BASE_POINT}/item/${id}.json`)
        .then(res => res.json())
        .then(data => new Promise((resolve, reject) =>
          !Vue._.isEmpty(data) ? resolve(data) : reject(new Error('data is empty'))
        ))
        .then(data => {
          Vue.set(state, 'stories', [...state.stories, data])
          window.localStorage.setItem(`story-${id}`, JSON.stringify(data))
          window.localStorage.setItem(`story-${id}#last_updated_at`, moment().toISOString())

          if (typeof (callback) === 'function') {
            callback(data)
          }
        }).catch(err => console.error(err.message))
    }
  },
  [types.APP_SET_TITLE] (state, payload) {
    console.log(types.APP_SET_TITLE)
    const { title } = payload
    state.title = title
  },
  [types.APP_SET_ACTIVE_SCOPE] (state, payload) {
    console.log(types.APP_SET_ACTIVE_SCOPE)
    const { name } = payload
    if (name) {
      let index = getScopeIndexByName(name)
      if (index !== -1) {
        state.activeScopeIndex = index
      }
    }
  },
  [types.GET_STORY_SCREENSHOT] (state, payload) {
    console.log(types.GET_STORY_SCREENSHOT)
    const { id, callback } = payload
    const story = Vue._.find(state.stories, ['id', id])
    getScreenShot(state, story, callback)
  }
}
const actions = {
  syncHWNewStoryIDs ({ commit, getters }, payload) {
    commit(types.HW_NEW_STORIES, { payload, getters })
  },
  syncHWStory ({ commit }, payload) {
    commit(types.HW_GET_STORY, payload)
  },
  setAppTitle ({ commit }, payload) {
    commit(types.APP_SET_TITLE, payload)
  },
  setActiveScope ({ commit }, payload) {
    commit(types.APP_SET_ACTIVE_SCOPE, payload)
  },
  getStoryScreenshot ({ commit }, payload) {
    commit(types.GET_STORY_SCREENSHOT, payload)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
