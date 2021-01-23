// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vant from 'vant'
import 'vant/lib/index.css'

Vue.config.productionTip = false
Vue.prototype.ajaxVue = axios
// Vue.prototype.requestUrl ='http://weixin.landa.com.cn:9001/nameplatesystem'
Vue.prototype.requestUrl ='http://172.75.200.106:8010/nameplatesystem'

Vue.use(element)
Vue.use(vant)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
