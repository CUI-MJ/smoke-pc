import Vuex from 'vuex'
import Vue from 'vue'
import app from './modules/app'
import route from './modules/route'
import getters from './getters'
import permanent from './modules/permanent'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    route,
    permanent
  },
  getters
})
export default store
