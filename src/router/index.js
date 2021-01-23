import Vue from 'vue'
import Router from 'vue-router'
import addRercode from '../components/AddRercode'
import layout from '../components/Layout'
import apply from '../components/ApplyList'
import deleteCode from '../components/Delete'

Vue.use(Router)
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/addRercode',
      name: 'addRercode',
      component: addRercode
    }, {
      path: '/layout',
      name: 'layout',
      component: layout
    }, {
      path: '/applyList',
      name: 'apply',
      component: apply
    },{
      path: '/delete',
      name: 'deleteCode',
      component: deleteCode
    }
  ],
  mode: 'history'
})
