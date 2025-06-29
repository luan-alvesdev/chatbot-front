<script setup lang="ts">
import { ref } from 'vue'
// import axios from 'axios';
// import { useRouter } from 'vue-router';
import LoginUsuario from '../components/LoginUsuario.vue'
import CadastroUsuario from '../components/CadastroUsuario.vue';
import RecuperacaoSenha from '../components/RecuperacaoSenha.vue';
// import CadastroUsuario from '../components/CadastroUsuario.vue'
// import RecuperacaoSenha from '../components/RecuperacaoSenha.vue'
// import { useAuthStore } from '../stores/autenticacao';

// const router = useRouter()
// const auth = useAuthStore()
const tela = ref<'login' | 'cadastro' | 'recuperar'>('login')

</script>
<template>

    <div class="min-h-screen flex bg-green-500">
        <!-- Lado esquerdo: fundo verde, só aparece em telas grandes -->
        <div class="hidden lg:flex flex-1 bg-green-700 items-center justify-center">
            <img src="../../public/Lojas_Quero-Quero_Monocromatica_Preta.png" alt="Logo da loja Quero-Quero"
                class="w-[60%] h-auto" />
        </div>
        <!-- Lado direito: login centralizado -->
        <div class="flex-1 flex flex-col items-center justify-center relative w-full">
            <!-- Logo só em telas pequenas -->
            <div class="block lg:hidden absolute top-14 left-1/2 -translate-x-1/2 z-10">
                <img src="../../public/Lojas_Quero-Quero_Monocromatica_Preta.png" alt="Logo da loja Quero-Quero"
                    class="w-80 h-auto" />
            </div>
            <!-- Modal Login -->
            <div class="bg-gray-50 rounded-2xl mx-6 pb-6 w-full max-w-md" @click.stop>
                <LoginUsuario v-if="tela === 'login'" @abrirCadastro="tela = 'cadastro'"
                    @abrirRecuperar="tela = 'recuperar'" />
                <CadastroUsuario v-if="tela === 'cadastro'" @voltar="tela = 'login'" />
                <RecuperacaoSenha v-if="tela === 'recuperar'" @voltar="tela = 'login'" />
            </div>
        </div>
    </div>
</template>