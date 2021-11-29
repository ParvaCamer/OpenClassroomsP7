import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBicaraRK7wIvEUpXJ0XptenscyvULmMDM',
    libraries: 'places',
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
