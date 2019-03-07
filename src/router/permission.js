import router from './index'
import store from './../store'
import Cookies from 'js-cookie'
import url from '@/utils/url'
import ajax from '@/utils/ajax'

//登录授权相关

var user = {
  isLoggedin: () => {
    if (store.getters.token) {
      return true
    } else {
      if (Cookies.get('v_token')) {
        store.dispatch('SetToken', Cookies.get('v_token'))
        Cookies.remove('v_token')
        return true
      } else {
        return false
      }
    }
  }
}
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth === false) {
    next()
  } else {
    if (!user.isLoggedin()) {
      if (url.query().code) {
        let redirect_uri = Cookies.get('v_redirect_uri')
        ajax({
          url: '/visitor-manager/authorize/tokenId',
          method: 'get',
          params: {
            code: url.query().code,
            callback: redirect_uri
          }
        }).then(res => {
          Cookies.set('v_token', res)
          document.location.replace(document.location.pathname + '#' + to.path)
        })
      } else if (to.query.code) {
        let redirect_uri = Cookies.get('v_redirect_uri')
        ajax({
          url: '/visitor-manager/authorize/tokenId',
          method: 'get',
          params: {
            code: url.query().code,
            callback: redirect_uri
          }
        }).then(res => {
          Cookies.set('v_token', res)
          document.location.replace(document.location.pathname + '#' + to.path)
        })
      } else {
        Cookies.remove('v_redirect_uri')
        let redirect_uri = encodeURIComponent(document.location.href)
        Cookies.set('v_redirect_uri', redirect_uri)
        document.location.href = '/visitor-manager/authorize/code?callback=' + redirect_uri
      }
    } else {
      next()
    }
  }
})
