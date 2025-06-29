import { createRouter, createWebHistory } from 'vue-router'
import ChatBotNovo from '../views/ChatBot.vue'
import NaoAutorizado from '@/views/NaoAutorizado.vue'
import HomeChat from '@/views/HomeChat.vue'
import { useAuthStore } from '@/stores/autenticacao'
import BaseDeConhecimento from '@/views/BaseDeConhecimento.vue'
import BaseDuvidas from '@/views/BaseDuvidas.vue'
import BaseFuncionarios from '@/views/BaseFuncionarios.vue'
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
      meta: { requiresAuth: true, roles: [1, 2] },
    },
    {
      path: '/basedeconhecimento',
      name: 'basedeconhecimento',
      component: BaseDeConhecimento,
      meta: { requiresAuth: true, roles: [1] },
    },
    {
      path: '/basededuvidas',
      name: 'basededuvidas',
      component: BaseDuvidas,
      meta: { requiresAuth: true, roles: [1] },
    },
    {
      path: '/basedefuncionarios',
      name: 'basedefuncionarios',
      component: BaseFuncionarios,
      meta: { requiresAuth: true, roles: [1] },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoardGraph,
      meta: { requiresAuth: true, roles: [1] },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const requiresAuth = to.meta.requiresAuth as boolean | undefined
  const allowedRoles = to.meta.roles as number[] | undefined

  if (requiresAuth && !auth.isLoggedIn) {
    // Não está logado, redireciona para home
    return next({ path: '/' })
  }

  if (allowedRoles && !allowedRoles.includes(auth.perfilId)) {
    return next({ path: '/naoautorizado' })
  }

  next()
})

export default router
