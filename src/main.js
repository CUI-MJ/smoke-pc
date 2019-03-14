// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
// import './router/permission'
import store from './store'
import * as filters from './filters'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'
import {
  getSessionItem
} from '@/api/function.js'
import '@/api/vue-axios'
import _ from 'lodash'

Vue.prototype._ = _
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(ElementUI)



Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 全局路由守卫
router.beforeEach((to, from, next) => {
  const nextRoute = ['/','parkList','regional', 'device', 'record','permanentImport'];
  const isLogin = getSessionItem('isLogin') ? Boolean(getSessionItem('isLogin')) : false;
  if(to.name === 'login') {  //如果是登录页，则跳过验证
    next()  //必不可少
    return  //以下的代码不执行
  }
  if(to.name == 'permanentImport'){
     console.log(JSON.parse(getSessionItem('routes')))
  }
  if (!to.matched || to.matched.length === 0) {
    store.commit('removeLogin')
    next({
      replace: true,
      name: 'login'
    });
    return
  }
  if(nextRoute.indexOf(to.name) >= 0 && isLogin) {
    if (getSessionItem('routes')) {
      store.commit('setRouter', JSON.parse(getSessionItem('routes')))
    } else {
      store.commit('setRouter', curtail(router.options.routes))
    }
    next()
  } else {  //其他的无需登陆的页面不做验证
    store.commit('removeLogin')
    next({ name : 'login'}) 
  }
});

//删除第一个元素 返回剩下数组
export function curtail(arr) {
  var m = arr.slice(0);
  m.splice(0, 1);
  return m;
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
