<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/autenticacao'

const showSidebar = ref(false)
const showLogin = ref(false)
const showForgot = ref(false)

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const senha = ref('')
const emailError = ref('')
const senhaError = ref('')

const isDesktop = ref(window.innerWidth >= 768)
function handleResize() {
  isDesktop.value = window.innerWidth >= 768
}
onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))

function validarLogin() {
  emailError.value = ''
  senhaError.value = ''
  if (!email.value) emailError.value = 'E-mail é obrigatório'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) emailError.value = 'E-mail inválido'
  if (!senha.value) senhaError.value = 'Senha é obrigatória'
  else if (senha.value.length < 4) senhaError.value = 'Senha deve ter pelo menos 4 caracteres'
  return !emailError.value && !senhaError.value
}

function realizarLogin() {
  if (validarLogin()) {
    auth.login()
    showLogin.value = false
    showSidebar.value = false
    router.push('/dashboard')
  }
}

function realizarLogout() {
  auth.logout()
  showSidebar.value = false
  router.push('/')
}
</script>

<template>
  <!-- Botão hamburguer para mobile -->
  <button class="fixed top-4 left-4 z-50 md:hidden bg-white rounded-full shadow p-2" @click="showSidebar = true"
    aria-label="Abrir menu">
    <svg class="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>

  <!-- Sidebar: sempre visível em desktop, drawer em mobile -->
  <transition name="fade">
    <aside v-show="showSidebar || isDesktop" class="fixed left-0 top-0 h-full w-64 bg-gray-50 shadow-lg z-50 flex flex-col
           transition-transform duration-200
           -translate-x-full md:translate-x-0 md:flex" :class="{ 'translate-x-0': showSidebar }">
      <!-- Fechar no mobile -->
      <button class="absolute top-4 right-4 text-2xl md:hidden" @click="showSidebar = false"
        aria-label="Fechar menu">&times;</button>

      <!-- Logo -->
      <div class="flex flex-col items-center mt-8 mb-4">
        <a href="https://www.queroquero.com.br/" target="_blank" rel="noopener">
          <img src="/Logo_Lojas_Quero_Quero_3D.png" alt="Logo Lojas Quero-Quero" class="h-11 w-auto" />
        </a>
      </div>

      <!-- Botão login/sair -->
      <div class="flex flex-col items-center mb-8">
        <button v-if="!auth.isLoggedIn"
          class="text-[0.9rem] px-4 py-2 rounded hover:bg-green-50 font-bold border-2 text-green-700 border-green-500"
          @click="showLogin = true">Login</button>
        <button v-else
          class="text-[0.9rem] px-4 py-2 rounded hover:bg-green-50 font-bold border-2 text-green-700 border-green-500"
          @click="realizarLogout">Sair</button>
      </div>

      <!-- Suas opções de menu -->
      <div class="flex flex-col gap-4 px-6">
        <router-link v-if="auth.roles == 'admin' || auth.roles == 'atendente'" to="/chatbot"
          class="text-green-700 font-bold hover:underline" active-class="underline">Chatbot</router-link>
        <router-link v-if="auth.roles == 'admin'" to="/dashboard" class="text-green-700 font-bold hover:underline"
          active-class="underline">Dashboard</router-link>
      </div>

      <!-- Modal Login -->
      <transition name="fade">
        <div v-if="showLogin" class="fixed inset-0 z-60 flex items-center justify-center bg-black/20">
          <div class="bg-gray-50 rounded-2xl shadow-lg px-8 py-6 w-96 relative" @click.stop>
            <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              @click="showLogin = false; showForgot = false">&times;</button>
            <template v-if="!showForgot">
              <h2 class="text-lg font-bold mb-2 text-green-700">Login</h2>
              <label class="block text-sm mb-1 font-bold text-green-700">E-mail</label>
              <input type="email" class="w-full border rounded px-3 py-2 mb-3 border-green-500" v-model="email" />
              <span v-if="emailError" class="text-red-500 text-xs mb-2 block">{{ emailError }}</span>
              <label class="block text-sm mb-1 font-bold text-green-700">Senha</label>
              <input type="password" class="w-full border rounded px-3 py-2 mb-3 border-green-500" v-model="senha" />
              <span v-if="senhaError" class="text-red-500 text-xs mb-2 block">{{ senhaError }}</span>
              <div class="flex items-center justify-between">
                <button
                  class="text-[0.9rem] px-4 py-2 rounded hover:bg-green-50 font-bold border-2 text-green-700 border-green-500"
                  @click="realizarLogin">Entrar</button>
                <button class="hover:underline text-sm text-green-700" type="button" @click="showForgot = true">Esqueci
                  minha senha</button>
              </div>
            </template>
            <template v-else>
              <div class="text-center py-6">
                <p class="text-gray-700 mb-4 font-medium">Para redefinir a senha entre em contato com o seu gerente.</p>
                <button class="hover:underline text-sm" @click="showForgot = false"
                  style="color: #008d53">Voltar</button>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </aside>
  </transition>
</template>