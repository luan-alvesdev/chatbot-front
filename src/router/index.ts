import { createRouter, createWebHistory } from 'vue-router'
import ChatBotNovo from '../views/ChatBot.vue'
import NaoAutorizado from '@/views/NaoAutorizado.vue'
import HomeChat from '@/views/HomeChat.vue'
import { useAuthStore } from '@/stores/autenticacao'
import BaseDeConhecimento from '@/components/charts/BaseDeConhecimento.vue'
import BaseDuvidas from '@/components/charts/BaseDuvidas.vue'
import BaseFuncionarios from '@/components/charts/BaseFuncionarios.vue'
import DashBoardGraph from '@/views/DashBoardGraph.vue'

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
      path: '/basedeconhecimento',
      name: 'basedeconhecimento',
      component: BaseDeConhecimento,
      meta: { requiresAuth: true, roles: ['admin'] },
    },
    {
      path: '/basededuvidas',
      name: 'basededuvidas',
      component: BaseDuvidas,
      meta: { requiresAuth: true, roles: ['admin'] },
    },
    {
      path: '/basedefuncionarios',
      name: 'basedefuncionarios',
      component: BaseFuncionarios,
      meta: { requiresAuth: true, roles: ['admin'] },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoardGraph,
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
