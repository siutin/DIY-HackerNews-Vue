import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLodash from 'vue-lodash'
import moment from 'moment'
import vueTouch from 'vue-touch'

Vue.use(VueLodash)
Vue.use(vueTouch)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
