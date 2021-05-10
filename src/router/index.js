import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import Home from '../components/Home'

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
    component: Home
  }]
})

export default router
