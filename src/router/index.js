import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/pages/index'
import Child from '@/components/pages/child'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: Index
    },
    {
      path: '/child/:serverName?/:dataKey',
      name: 'child',
      component: Child
    }
  ]
})
