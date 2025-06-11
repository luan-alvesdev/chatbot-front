<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/autenticacao'

const showSidebar = ref(false)

const router = useRouter()
const auth = useAuthStore()

const isDesktop = ref(window.innerWidth >= 1024)
function handleResize() {
  isDesktop.value = window.innerWidth >= 1024
}
onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))

function realizarLogout() {
  auth.logout()
  showSidebar.value = false
  router.push('/')
}
</script>

<template>
  <!-- Overlay para fechar ao clicar fora -->
  <div v-if="showSidebar && !isDesktop" class="fixed inset-0 bg-black bg-opacity-30 z-40" @click="showSidebar = false">
  </div>
  <!-- Botão hamburguer para mobile -->
  <button class="fixed top-4 left-4 z-50 lg:hidden bg-white rounded-full shadow p-2" @click="showSidebar = true"
    aria-label="Abrir menu">
    <svg class="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>

  <!-- Sidebar: sempre visível em desktop, drawer em mobile -->
  <transition name="fade">
    <aside
      class="fixed left-0 top-0 h-full w-64 bg-white border-r border-green-100 shadow-xl z-50 flex flex-col transition-transform duration-200"
      :class="{
        '-translate-x-full': !showSidebar && !isDesktop,
        'translate-x-0': showSidebar || isDesktop
      }" v-show="showSidebar || isDesktop">
      <!-- Fechar no mobile -->
      <button class="absolute top-4 right-4 text-2xl lg:hidden" @click="showSidebar = false"
        aria-label="Fechar menu">&times;</button>

      <!-- Logo -->
      <div class="flex flex-col items-center mt-8 mb-8">
        <a href="https://www.queroquero.com.br/" target="_blank" rel="noopener">
          <img src="/Logo_Lojas_Quero_Quero_3D.png" alt="Logo Lojas Quero-Quero" class="h-11 w-auto" />
        </a>
      </div>

      <!-- Botão login/sair -->
      <div class="flex flex-col px-4 mb-8">
        <button class="text-[0.9rem] px-10 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
          @click="realizarLogout">Sair</button>
      </div>

      <!-- Opções de menu -->
      <div class="flex flex-col gap-4 px-4">
        <!-- <router-link v-if="auth.roles == 'admin'" to="/dashboard"
          class="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-green-800 hover:bg-green-100 transition"
          active-class="underline text-green-900 bg-green-50">Dashboard</router-link> -->
        <router-link v-if="auth.roles == 'admin' || auth.roles == 'atendente'" to="/chatbot"
          class="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-green-800 hover:bg-green-100 transition"
          active-class="underline text-green-900 bg-green-50">Chatbot</router-link>
        <router-link v-if="auth.roles == 'admin'" to="/basedeconhecimento"
          class="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-green-800 hover:bg-green-100 transition"
          active-class="underline text-green-900 bg-green-50">Biblioteca de Conhecimento</router-link>
        <router-link v-if="auth.roles == 'admin'" to="/basededuvidas"
          class="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-green-800 hover:bg-green-100 transition"
          active-class="underline text-green-900 bg-green-50">Assuntos não listados</router-link>
        <router-link v-if="auth.roles == 'admin'" to="/basedefuncionarios"
          class="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-green-800 hover:bg-green-100 transition"
          active-class="underline text-green-900 bg-green-50">Funcionarios</router-link>
      </div>


    </aside>
  </transition>
</template>