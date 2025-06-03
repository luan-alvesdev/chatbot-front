import { createRouter, createWebHistory } from 'vue-router'
import ChatBot from '../views/ChatBot.vue'
import DashBoard from '../views/DashBoard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      //página inicial
      path: '/',
      name: 'chatbot',
      component: ChatBot,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoard,
    },
  ],
})

export default router
