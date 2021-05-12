import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/Users'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    component: login
  }, {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }]
  }, {
    path: '/users',
    component: Users
  }]
})
// 挂载路由守卫
router.beforeEach((to, form, next) => {
  // 用户如果访问的是登录页面直接放行
  if (to.path === '/login') return next()
  // 取token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有登陆过的直接返回到登陆页面
  if (!tokenStr) return next('/login')
  next()
})
export default router
