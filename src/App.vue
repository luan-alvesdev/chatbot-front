<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import MenuHamburguer from './components/MenuHamburguer.vue'
import { useAuthStore } from './stores/autenticacao';
import { watch } from 'vue';


const auth = useAuthStore()
const router = useRouter()

watch(
  () => auth.isLoggedIn,
  (loggedIn) => {
    if (loggedIn) {
      router.push('/dashboard')
    }
  }
)

</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar sempre visível em desktop, oculto em mobile -->
    <MenuHamburguer v-if="auth.isLoggedIn" />
    <!-- Conteúdo principal -->
    <div :class="['flex-1 px-6', auth.isLoggedIn ? 'md:ml-64' : '']">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
