<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/autenticacao';

const auth = useAuthStore()
const showLogin = ref(false)
const email = ref('')
const senha = ref('')
const emailError = ref('')
const senhaError = ref('')
const showForgot = ref(false)

// Cadastro
const mostrarTelaCadastro = ref(false)
const nomeCadastro = ref('')
const cpfCadastro = ref('')
const emailCadastro = ref('')
const senhaCadastro = ref('')
const popUpMensagem = ref('')
const mostrarPopUp = ref(false)

// Erros cadastro
const nomeCadastroError = ref('')
const cpfCadastroError = ref('')
const emailCadastroError = ref('')
const senhaCadastroError = ref('')

function validarCadastro() {
    nomeCadastroError.value = ''
    cpfCadastroError.value = ''
    emailCadastroError.value = ''
    senhaCadastroError.value = ''

    if (!nomeCadastro.value) nomeCadastroError.value = 'Nome é obrigatório.'
    if (!cpfCadastro.value) cpfCadastroError.value = 'CPF é obrigatório.'
    else if (!/^\d{11}$/.test(cpfCadastro.value)) cpfCadastroError.value = 'CPF deve ter 11 dígitos numéricos.'
    if (!emailCadastro.value) emailCadastroError.value = 'Email é obrigatório.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCadastro.value)) emailCadastroError.value = 'E-mail inválido.'
    if (!senhaCadastro.value) senhaCadastroError.value = 'Senha é obrigatória.'
    else if (senhaCadastro.value.length < 4) senhaCadastroError.value = 'Senha deve ter pelo menos 4 caracteres.'

    return !nomeCadastroError.value && !cpfCadastroError.value && !emailCadastroError.value && !senhaCadastroError.value
}

function realizarCadastro() {
    if (validarCadastro()) {
        mostrarTelaCadastro.value = false
        // Limpar campos 
        nomeCadastro.value = ''
        cpfCadastro.value = ''
        emailCadastro.value = ''
        senhaCadastro.value = ''
        enviarFeedback()
    }
}

function enviarFeedback() {
    popUpMensagem.value = 'Cadastro enviado com sucesso! Aguarde confirmação do cadastro pela gestão. 😊';
    mostrarPopUp.value = true
    setTimeout(() => {
        mostrarPopUp.value = false;
    }, 3500);
}

function validarLogin() {
    emailError.value = ''
    senhaError.value = ''
    if (!email.value) emailError.value = 'Email é obrigatório.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) emailError.value = 'Insira um E-mail válido.'
    if (!senha.value) senhaError.value = 'Senha deve ter pelo menos 4 caracteres.'
    return !emailError.value && !senhaError.value
}

function realizarLogin() {
    if (validarLogin()) {
        auth.login()
        showLogin.value = false
    }
}

</script>

<template>

    <!-- Modal Login -->
    <div class="fixed inset-0 z-60 flex items-center justify-center bg-black/20 px-4">
        <!-- Pop up de dúvida enviada -->
        <div v-if="mostrarPopUp" class="fixed inset-0 flex items-center justify-center z-50">
            <div
                class="bg-white border border-green-700 text-green-700 px-8 py-4 rounded-xl shadow-lg text-lg font-semibold">
                {{ popUpMensagem }}
            </div>
        </div>
        <div class="bg-gray-50 rounded-2xl px-8 py-6 w-[480px]" @click.stop>
            <template v-if="!showForgot">
                <h2 class="text-lg font-bold mb-2 text-green-700">Login</h2>
                <label class="block text-sm mb-1 font-bold text-green-700">E-mail</label>
                <input type="email" class="w-full border rounded px-3 py-2 mb-3 border-green-500" v-model="email" />
                <span v-if="emailError" class="text-red-500 text-xs mb-2 block">{{ emailError }}</span>
                <label class="block text-sm mb-1 font-bold text-green-700">Senha</label>
                <input type="password" class="w-full border rounded px-3 py-2 mb-3 border-green-500" v-model="senha" />
                <span v-if="senhaError" class="text-red-500 text-xs mb-2 block">{{ senhaError }}</span>
                <div class="flex items-center justify-between">
                    <button class="text-[0.9rem] px-4 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                        @click="realizarLogin">Entrar</button>
                    <button class="hover:underline text-sm text-green-700" type="button"
                        @click="mostrarTelaCadastro = true">
                        Criar cadastro
                    </button>
                    <button class="hover:underline text-sm text-green-700" type="button" @click="showForgot = true">
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
    </div>

    <!-- Modal Cadastro -->
    <div class="fixed inset-0 z-60 flex items-center justify-center bg-black/20 px-4" v-if="mostrarTelaCadastro">
        <div class="bg-gray-50 rounded-2xl px-8 py-6 w-[480px] max-w-full relative" @click.stop>
            <h2 class="text-lg font-bold mb-4 text-green-700">Cadastro</h2>
            <label class="block text-sm mb-1 font-bold text-green-700">Nome</label>
            <input type="text" class="w-full border rounded px-3 py-2 mb-3 border-green-500" v-model="nomeCadastro" />
            <span v-if="nomeCadastroError" class="text-red-500 text-xs mb-2 block">{{ nomeCadastroError }}</span>
            <label class="block text-sm mb-1 font-bold text-green-700">CPF</label>
            <input type="text" class="w-full border rounded px-3 py-2 mb-3 border-green-500" v-model="cpfCadastro" />
            <span v-if="cpfCadastroError" class="text-red-500 text-xs mb-2 block">{{ cpfCadastroError }}</span>
            <label class="block text-sm mb-1 font-bold text-green-700">E-mail</label>
            <input type="email" class="w-full border rounded px-3 py-2 mb-3 border-green-500" v-model="emailCadastro" />
            <span v-if="emailCadastroError" class="text-red-500 text-xs mb-2 block">{{ emailCadastroError }}</span>
            <label class="block text-sm mb-1 font-bold text-green-700">Senha</label>
            <input type="password" class="w-full border rounded px-3 py-2 mb-4 border-green-500"
                v-model="senhaCadastro" />
            <span v-if="senhaCadastroError" class="text-red-500 text-xs mb-2 block">{{ senhaCadastroError }}</span>
            <div class="flex justify-between">
                <button class="text-[0.9rem] px-4 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                    @click="realizarCadastro">Cadastrar</button>
                <button class="hover:underline text-sm" @click="mostrarTelaCadastro = false" style="color: #008d53">
                    Voltar
                </button>
            </div>
        </div>
    </div>
</template>