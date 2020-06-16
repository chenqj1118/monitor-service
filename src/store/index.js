import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    leftNavIsCollapse: true // 左侧是否展开
  },
  actions: {},
  mutations: {
    setLeftNavIsCollapse (state, value) {
      state.leftNavIsCollapse = value
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
