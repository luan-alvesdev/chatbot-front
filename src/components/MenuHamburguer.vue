<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/autenticacao'

import { ref } from 'vue'

//Menu responsivo
const showModal = ref(false)
const showForgot = ref(false)

// Estados para menu mobile
const showMobileMenu = ref(false)
const showMobileLogin = ref(false)


//navegação/autenticação
const router = useRouter()
const auth = useAuthStore()

function realizarLogin() {
  if (validarLogin()) {
    auth.login()
    showModal.value = false
    router.push('/dashboard')
  }
}

function realizarLoginMobile() {
  if (validarLogin()) {
    auth.login()
    showMobileLogin.value = false // Fecha o modal mobile
    showMobileMenu.value = false  // (opcional) Fecha o menu mobile
    router.push('/dashboard')
  }
}

function realizarLogout() {
  auth.logout()
  router.push('/')
}

//validação Login
const email = ref('')
const senha = ref('')
const emailError = ref('')
const senhaError = ref('')

function validarLogin() {
  emailError.value = ''
  senhaError.value = ''

  //Validação email
  if (!email.value) {
    emailError.value = 'E-mail é obrigatório'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'E-mail inválido'
  }

  if (!senha.value) {
    senhaError.value = 'Senha é obrigatória'
  } else if (senha.value.length < 4) {
    senhaError.value = 'Senha deve ter pelo menos 4 caracteres'
  }
  return !emailError.value && !senhaError.value
}

</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow px-2 py-3">
    <div class="max-w-6xl mx-auto flex items-center justify-between px-4">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="https://www.queroquero.com.br/" target="_blank" rel="noopener">
          <img src="/Logo_Lojas_Quero_Quero_3D.png" alt="Logo Lojas Quero-Quero" class="h-11 w-auto" />
        </a>
      </div>
      <!-- Desktop Login -->
      <div class="hidden md:block relative">
        <button
          class="text-[0.9rem] px-4 py-2 rounded hover:bg-green-50 font-bold border-2 text-green-500 border-green-500"
          @click="showModal = !showModal" v-if="!auth.isLoggedIn">
          Login
        </button>
        <button
          class="text-[0.9rem] px-4 py-2 rounded hover:bg-green-50 font-bold border-2 text-green-500 border-green-500"
          v-else @click="realizarLogout">Sair</button> <!-- Sair aqui-->
        <transition name="fade">
          <div v-if="showModal">
            <!-- Backdrop para fechar ao clicar fora -->
            <div class="fixed inset-0 z-20" style="background: rgba(0,0,0,0.15);"
              @click="showModal = false; showForgot = false"></div>
            <!-- Modal -->
            <div class="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-lg px-8 py-4 z-30" @click.stop>
              <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                @click="showModal = false; showForgot = false">
                &times;
              </button>
              <template v-if="!showForgot">
                <h2 class="text-lg font-bold mb-2 text-green-500">Login</h2>
                <label class="block text-sm mb-1 font-bold text-green-500">E-mail</label>
                <input type="email"
                  class="w-full border rounded px-3 py-2 mb-3 border-green-500 focus:border-green-700 focus:ring-green-700 focus:ring-1"
                  v-model="email" />
                <span v-if="emailError" class="text-red-500 text-xs mb-2 block">{{ emailError }}</span>
                <label class="block text-sm mb-1 font-bold text-green-500">Senha</label>
                <input type="password"
                  class="w-full border rounded px-3 py-2 mb-3 border-green-500 focus:border-green-700 focus:ring-green-700 focus:ring-1"
                  v-model="senha" />
                <span v-if="senhaError" class="text-red-500 text-xs mb-2 block">{{ senhaError }}</span>
                <div class="flex items-center justify-between">
                  <button
                    class="text-[0.9rem] px-4 py-2 rounded hover:bg-green-50 font-bold border-2 text-green-500 border-green-500"
                    @click="realizarLogin">
                    Entrar
                  </button>
                  <!-- <button
                    class="text-[0.9rem] px-4 py-2 rounded hover:bg-green-50 font-bold border-2 text-green-500 border-green-500"
                    v-if="!auth.isLoggedIn" @click="realizarLogin">Sair</button> -->
                  <!-- Sair aqui-->
                  <button class="hover:underline text-sm text-green-500" type="button" @click="showForgot = true">
                    Esqueci minha senha
                  </button>
                </div>
              </template>
              <!-- Definição de senha -->
              <template v-else>
                <div class="text-center py-6">
                  <p class="text-gray-700 mb-4 font-medium">
                    Para redefinir a senha entre em contato com o seu gerente.
                  </p>
                  <button class="hover:underline text-sm" @click="showForgot = false" style="color: #008d53">
                    Voltar
                  </button>
                </div>
              </template>
            </div>
          </div>
        </transition>
      </div>
      <!-- Botão Hamburguer Mobile -->
      <div class="md:hidden">
        <button @click="showMobileMenu = !showMobileMenu" aria-label="Abrir menu">
          <svg class="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
    <!-- Menu Mobile -->
    <transition name="fade">
      <div v-if="showMobileMenu" class="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-40">
        <div class="p-4">
          <button class="w-full text-left text-[0.9rem] px-4 py-2 rounded hover:bg-green-50 font-bold border-2 mb-2"
            style="color: #008d53; border-color: #008d53" @click="showMobileLogin = !showMobileLogin">
            Login
          </button>
          <transition name="fade">
            <div v-if="showMobileLogin" class="mt-2 bg-white rounded shadow-lg p-4 relative">
              <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                @click="showMobileLogin = false; showForgot = false">
                &times;
              </button>
              <template v-if="!showForgot">
                <h2 class="text-lg font-bold mb-4" style="color: #008d53">Login</h2> <!-- Toggle aqui -->
                <label class="block text-sm mb-1 font-bold" style="color: #008d53">E-mail</label>
                <input type="email" class="w-full border rounded px-3 py-2 mb-3" style="border-color: #008d53"
                  v-model="email" />
                <span v-if="emailError" class="text-red-500 text-xs mb-2 block">{{ emailError }}</span>
                <label class="block text-sm mb-1 font-bold" style="color: #008d53">Senha</label>
                <input type="password" class="w-full border rounded px-3 py-2 mb-3" style="border-color: #008d53"
                  v-model="senha" />
                <span v-if="senhaError" class="text-red-500 text-xs mb-2 block">{{ senhaError }}</span>
                <div class="flex items-center justify-between">
                  <button class="text-[0.9rem] px-4 py-2 rounded hover:bg-green-50 font-bold border-2"
                    style="border-color: #008d53; color: #008d53" @click="realizarLoginMobile">
                    Entrar
                  </button>
                  <button class="hover:underline text-sm" type="button" style="color: #008d53"
                    @click="showForgot = true">
                    Esqueci minha senha
                  </button>
                </div>
              </template>
              <template v-else>
                <div class="text-center py-6">
                  <p class="text-gray-700 mb-4 font-medium">
                    Para redefinir a senha entre em contato com o seu gerente.
                  </p>
                  <button class="hover:underline text-sm" @click="showForgot = false" style="color: #008d53">
                    Voltar
                  </button>
                </div>
              </template>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </nav>
</template>
