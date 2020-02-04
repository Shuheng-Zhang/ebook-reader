const store = {
  state: {
    hotSearchOffsetY: 0,
    flapCardVisible: true
  },
  mutations: {
    'SET_HOT_SEARCH_OFFSETY': (state, hotSearchOffsetY) => {
      state.hotSearchOffsetY = hotSearchOffsetY
    },
    'SET_FLAP_CARD_VISIBLE': (state, flapCardVisible) => {
      state.flapCardVisible = flapCardVisible
    }
  }
}

export default store
