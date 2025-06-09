import { createRouter, createWebHistory } from 'vue-router'
import ChatBotNovo from '../views/ChatBot.vue'
import DashBoard from '../views/DashBoard.vue'
import NaoAutorizado from '@/views/NaoAutorizado.vue'
import HomeChat from '@/views/HomeChat.vue'
import { useAuthStore } from '@/stores/autenticacao'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeChat,
    },
    {
      path: '/naoautorizado',
      name: 'naoautorizado',
      component: NaoAutorizado,
    },
    {
      //página inicial
      path: '/chatbot',
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
  // const user = { name: 'João', role: 'teste' }
  // const userRole = user?.role

  const auth = useAuthStore()
  const requiresAuth = to.meta.requiresAuth as boolean | undefined
  const allowedRoles = to.meta.roles as string[] | undefined

  if (requiresAuth && !auth.isLoggedIn) {
    // Não está logado, redireciona para home
    return next({ path: '/' })
  }

  if (allowedRoles && !allowedRoles.includes(auth.roles)) {
    // Papel não permitido
    return next({ path: '/chatbot' })
  }

  if (requiresAuth && !token) {
    // Não está logado
    return next({ name: 'Login' })
  }

  next()
})

export default router
