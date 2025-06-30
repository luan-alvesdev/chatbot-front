<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/autenticacao'
// import axios from 'axios'
import { login } from '../services/user/login'
import { handleAxiosError } from '../utils/handleAxiosError'

const emits = defineEmits(['abrirCadastro', 'abrirRecuperar'])
const router = useRouter()
const auth = useAuthStore()
// const showLogin = ref(false)
const email = ref('')
const senha = ref('')
const emailError = ref('')
const senhaError = ref('')
const servidorCadastroError = ref('')

function validarLogin() {
    emailError.value = ''
    senhaError.value = ''
    if (!email.value) emailError.value = 'Email é obrigatório.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) emailError.value = 'Insira um e-mail válido.'
    if (!senha.value) senhaError.value = 'Insira a senha.'
    return !emailError.value && !senhaError.value
}

async function realizarLogin() {
    if (!validarLogin()) return
    try {
        const response = await login({
            email: email.value,
            senha: senha.value,
        })
        // console.log('DADOS DO BACKEND:', response.data, response.data.aprovado)
        if (!response.data.aprovado) {
            emailError.value = 'Seu cadastro ainda não foi aprovado.';
            senhaError.value = '';
            return
        }
        if (response.data.token) {
            localStorage.setItem('token', response.data.token) // salvando jwt no localstorage
        }
        // Salva o perfil_id no store
        auth.login(Number(response.data.perfilId))
        router.push('/chatbot')
    } catch (error: unknown) {
        const msg = handleAxiosError(error)
        servidorCadastroError.value = msg
    }
}

</script>

<template>
    <form @submit.prevent="realizarLogin">
        <div class="rounded-t-2xl bg-green-700 text-gray-50 text-center py-4 mb-6">
            <h2 class="text-xl font-bold m-0">Login</h2>
        </div>
        <div class="px-6 sm:px-8">
            <label for="login-email" class="block text-sm mb-1 font-bold text-green-700">E-mail</label>
            <input id="login-email" type="email" class="w-full border rounded px-3 py-2 mb-3 border-green-500"
                autocomplete="username" v-model="email" />
            <span v-if="emailError" class="text-red-500 text-xs mb-2 block">{{ emailError
            }}</span>
            <label for="login-senha" class="block text-sm mb-1 font-bold text-green-700">Senha</label>
            <input id="login-senha" type="password" class="w-full border rounded px-3 py-2 mb-3 border-green-500"
                autocomplete="current-password" v-model="senha" />
            <span v-if="senhaError" class="text-red-500 text-xs mb-2 block">{{ senhaError
            }}</span>
            <span v-if="servidorCadastroError" class="text-red-500 text-xs mb-2 block">{{
                servidorCadastroError
                }}</span>
            <div class="flex items-center justify-between">
                <button class="text-[0.9rem] px-4 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                    @click="realizarLogin">Entrar</button>
                <button class="hover:underline text-sm text-green-700" type="button" @click="emits('abrirCadastro')">
                    Criar cadastro
                </button>
                <button class="hover:underline text-sm text-green-700" type="button" @click="emits('abrirRecuperar')">
                    Esqueci minha senha
                </button>
            </div>
        </div>
    </form>
</template>