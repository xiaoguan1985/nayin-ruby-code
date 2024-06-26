import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/Index/IndexCommon'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }
  ]
})
