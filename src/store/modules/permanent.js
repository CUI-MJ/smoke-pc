import Permanent from '@/api/permanent'
export default {
  state: {
    list: null
  },
  mutations: {
    SET_PERMANENT_LIST: (state, data) => {
      state.list = data
    }
  },
  actions: {
    GetPermanentList({ commit }, data) {
      return new Promise((resolve, reject) => {
        Permanent.getPermanentList(data).then(res => {
          commit('SET_PERMANENT_LIST', res)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

