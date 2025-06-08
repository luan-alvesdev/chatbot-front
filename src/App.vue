<script setup lang="ts">
import { RouterView } from 'vue-router';
import MenuHamburguer from './components/MenuHamburguer.vue'
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar sempre visível em desktop, oculto em mobile -->
    <aside class="hidden md:flex flex-col w-64 bg-gray-50 shadow h-screen fixed left-0 top-0 z-40">
      <MenuHamburguer />
    </aside>
    <!-- Conteúdo principal -->
    <div class="flex-1 md:ml-64">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
