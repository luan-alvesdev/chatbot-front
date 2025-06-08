import { createRouter, createWebHistory } from 'vue-router'
import ChatBotNovo from '../views/ChatBot.vue'
import DashBoard from '../views/DashBoard.vue'
import LoginUser from '@/views/LoginUser.vue'
import NaoAutorizado from '@/views/NaoAutorizado.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginUser,
    },
    {
      path: '/naoautorizado',
      name: 'naoautorizado',
      component: NaoAutorizado,
    },
    {
      //página inicial
      path: '/',
      name: 'chatbot',
      component: ChatBotNovo,
      meta: { requiresAuth: true, roles: ['admin', 'atendente'] },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoard,
      meta: { requiresAuth: true, roles: ['admin'] },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = 'aa'
  const user = { name: 'João', role: 'teste' }
  const userRole = user?.role

  const requiresAuth = to.meta.requiresAuth as boolean | undefined
  const allowedRoles = to.meta.roles as string[] | undefined

  if (requiresAuth && !token) {
    // Não está logado
    return next({ name: 'Login' })
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Papel não permitido
    return next({ name: 'Unauthorized' })
  }

  next()
})

export default router
