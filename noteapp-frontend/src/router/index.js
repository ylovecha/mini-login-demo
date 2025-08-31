import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
//import Notes from '../views/Notestest.vue';
import Home from '../views/Home.vue';


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  { 
    path: '/home', 
    name:'Home',
    component: Home, 
    props: true,
    meta: { requiresAuth: true } // <- 这里加上
  },
  /*
  { 
    path: '/add-note', 
    component: AddNote, 
    props: true,
    meta: { requiresAuth: true } // <- 需要登录才能访问
  },*/
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫 - 检查登录状态
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const isAuthenticated = !!token
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')  // 需要登录的页面没有 token -> 跳登录页
  } else {
    next()     // 其他情况直接放行
  }
})

export default router 