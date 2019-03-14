import * as types from '../mutation-types'
import {setSessionItem} from "@/api/function.js"
export default {
    state: {
        routes:''
    },
    mutations: {
        [types.setRouter](state, to) {
            state.routes = to
            setSessionItem('routes',to)
        },
    },
    actions: {
       
    }
  }
  