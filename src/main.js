// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
import store from './vuex/store'
import './vuex/rem'
import './style/base.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import Calendar from 'vue-mobile-calendar'
import $ from 'jquery'

Vue.use(Calendar)
Vue.config.productionTip = false
//Vue.prototype.$ajax = axios
Vue.use(VueAwesomeSwiper)
Vue.filter('myimg', function (value) {
 	return 'http://192.168.2.223' + value
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
