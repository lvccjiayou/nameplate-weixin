// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import wx from 'weixin-jsapi'

Vue.config.productionTip = false
Vue.prototype.ajaxVue = axios
Vue.prototype.wx = wx
// Vue.prototype.requestUrl ='http://weixin.landa.com.cn:9001/nameplatesystem'
Vue.prototype.requestUrl ='http://localhost:8080'
Vue.use(element)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
