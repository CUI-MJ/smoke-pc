import * as types from '../mutation-types'
import {setSessionItem,removeSessionItem,delCookie,removeItem} from "@/api/function.js"
import {setTenantId, getTenantId} from '@/utils/auth'
export default {
  state: {
    loading: false,
    isLogin: false,
    userInfo:'',
    parkName:'',
    tenantId:getTenantId(),
    userType:'',
  },
  mutations: {
    [types.setLogin](state,id) {
      state.isLogin = id
      setSessionItem('isLogin', id)
    },
    [types.removeLogin](state) {
      state.isLogin = false
      removeSessionItem('isLogin')
      delCookie('token')
      removeSessionItem('routes')
      removeSessionItem('userType')
    },
    [types.setTenantId](state,id) {
      state.tenantId = id
      setSessionItem('tenantId', id)
    },
    [types.setType](state,id) {
      state.userType = id
      setSessionItem('userType', id)
    },
	  SET_USERINFO:(state,data)=>{
      state.userInfo = data;
    }
  },
  actions: {
    SetUserInfo({ commit }, data) {
      commit('SET_USERINFO', data);
    }
  }
}
