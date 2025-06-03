<script setup lang="ts">
import { RouterView } from 'vue-router';
import MenuHamburguer from './components/MenuHamburguer.vue'
</script>

<template>
  <header>
    <MenuHamburguer />
  </header>
  <RouterView />
</template>

<style scoped></style>
