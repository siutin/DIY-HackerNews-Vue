import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/new' },
    {
      path: '/:name',
      name: 'scopes',
      component: Home
    },
    {
      path: '/store/:id',
      name: 'store',
      component: () => import(/* webpackChunkName: "store" */ './views/Store.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
