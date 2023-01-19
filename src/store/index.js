import { createStore } from 'vuex'

export default createStore({
  state: {
    accessTokenState:null
  },
  getters: {
    getAccessTokenState (state) {
      return state.accessTokenState
    }
  },
  mutations: {
    UPDATE_ACCESS_TOKEN (state, payload) {
      state.accessTokenState = payload
    }
  },
  actions: {
    updateAccessToken (context, payload) {
      context.commit('UPDATE_ACCESS_TOKEN', payload)
    }
  }
})
