import * as types from '../mutation-types'
import {setCookie,setItem,setSessionItem} from "@/api/function.js"
export default {
    state: {
        routes:''
    },
    mutations: {
        [types.setRouter](state, to) {
            state.routes = to
            setItem('routes',to)
        },
    },
    actions: {
       
    }
  }
  