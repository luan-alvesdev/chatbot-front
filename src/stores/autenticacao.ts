import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const roles = ref('')

  function login() {
    roles.value = 'admin'
    isLoggedIn.value = true
  }

  function logout() {
    roles.value = ''
    isLoggedIn.value = false
  }
  return { isLoggedIn, login, logout, roles }
})
