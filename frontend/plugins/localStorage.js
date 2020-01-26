import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
      key: 'vuex',
      modules: ['auth']
    }).plugin(store)
  })
}
