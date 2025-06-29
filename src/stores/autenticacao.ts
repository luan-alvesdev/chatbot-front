import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const perfilId = ref<number | null>(null) // 1 = admin, 2 = atendente

  function login(perfil: number) {
    perfilId.value = perfil
    isLoggedIn.value = true
  }

  function logout() {
    perfilId.value = null
    isLoggedIn.value = false
  }
  return { isLoggedIn, login, logout, perfilId }
})
