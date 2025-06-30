<script setup lang="ts">
import { ref } from 'vue'
import { cadastrar } from '../services/user/cadastro';
import { handleAxiosError } from '../utils/handleAxiosError';

const emit = defineEmits(['voltar'])

// Cadastro
const nomeCadastro = ref('')
const cpfCadastro = ref('')
const emailCadastro = ref('')
const senhaCadastro = ref('')
const cargoCadastro = ref('')
const popUpMensagem = ref('')
const mostrarPopUp = ref(false)

// Erros cadastro
const nomeCadastroError = ref('')
const cpfCadastroError = ref('')
const emailCadastroError = ref('')
const senhaCadastroError = ref('')
const cargoCadastroError = ref('')
const servidorCadastroError = ref('')

function validarCadastro() {
    nomeCadastroError.value = ''
    cpfCadastroError.value = ''
    emailCadastroError.value = ''
    senhaCadastroError.value = ''
    cargoCadastroError.value = ''

    if (!nomeCadastro.value) nomeCadastroError.value = 'Nome é obrigatório.'
    if (!cpfCadastro.value) cpfCadastroError.value = 'CPF é obrigatório.'
    else if (!/^\d{11}$/.test(cpfCadastro.value)) cpfCadastroError.value = 'CPF deve ter 11 dígitos numéricos.'
    if (!emailCadastro.value) emailCadastroError.value = 'Email é obrigatório.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCadastro.value)) emailCadastroError.value = 'E-mail inválido.'
    if (!senhaCadastro.value) senhaCadastroError.value = 'Senha é obrigatória.'
    else if (senhaCadastro.value.length < 4) senhaCadastroError.value = 'Senha deve ter pelo menos 4 caracteres.'
    if (!cargoCadastro.value) cargoCadastroError.value = 'Selecione um cargo.'

    return !nomeCadastroError.value && !cpfCadastroError.value && !emailCadastroError.value && !senhaCadastroError.value && !cargoCadastroError.value
}

async function realizarCadastro() {
    if (validarCadastro()) {
        try {
            await cadastrar({
                nome: nomeCadastro.value,
                email: emailCadastro.value,
                senha: senhaCadastro.value,
                perfilId: cargoCadastro.value === 'admin' ? 1 : 2
            })
            // mostrarTelaCadastro.value = false
            // Limpar campos 
            nomeCadastro.value = ''
            cpfCadastro.value = ''
            emailCadastro.value = ''
            senhaCadastro.value = ''
            cargoCadastro.value = ''
            enviarFeedback()
        } catch (error: unknown) {
            const msg = handleAxiosError(error)
            servidorCadastroError.value = msg
        }
    }
}

function enviarFeedback() {
    popUpMensagem.value = 'Cadastro enviado com sucesso! Você receberá uma confirmação por e-mail após análise da gestão. ✨';
    mostrarPopUp.value = true
    setTimeout(() => {
        mostrarPopUp.value = false;
    }, 4000);
}

</script>

<template>
    <form>
        <div class="rounded-t-2xl bg-green-700 text-gray-50 text-center py-4 mb-6">
            <h2 class="text-xl font-bold m-0">Cadastro</h2>
        </div>
        <div class="px-6 sm:px-8">
            <label for="cadastro-nome" class="block text-sm mb-1 font-bold text-green-700">Nome</label>
            <input id="cadastro-nome" type="text" class="w-full border rounded px-3 py-2 mb-3 border-green-500"
                v-model="nomeCadastro" />
            <span v-if="nomeCadastroError" class="text-red-500 text-xs mb-2 block">{{ nomeCadastroError
                }}</span>
            <label class="block text-sm mb-1 font-bold text-green-700">CPF</label>
            <input type="text" class="w-full border rounded px-3 py-2 mb-3 border-green-500" v-model="cpfCadastro" />
            <span v-if="cpfCadastroError" class="text-red-500 text-xs mb-2 block">{{ cpfCadastroError
                }}</span>
            <label class="block text-sm mb-1 font-bold text-green-700">E-mail</label>
            <input type="email" class="w-full border rounded px-3 py-2 mb-3 border-green-500" v-model="emailCadastro" />
            <span v-if="emailCadastroError" class="text-red-500 text-xs mb-2 block">{{
                emailCadastroError
                }}</span>
            <label class="block text-sm mb-1 font-bold text-green-700">Senha</label>
            <input type="password" class="w-full border rounded px-3 py-2 mb-4 border-green-500"
                v-model="senhaCadastro" />
            <span v-if="senhaCadastroError" class="text-red-500 text-xs mb-2 block">{{
                senhaCadastroError
                }}</span>
            <label class="block text-sm mb-1 font-bold text-green-700">Cargo</label>
            <div class="flex gap-4 mb-3">
                <label class="flex items-center cursor-pointer">
                    <input type="radio" value="admin" v-model="cargoCadastro" class="mr-2" />
                    Administrador(a)
                </label>
                <label class="flex items-center cursor-pointer">
                    <input type="radio" value="atendente" v-model="cargoCadastro" class="mr-2" />
                    Atendimento
                </label>
            </div>
            <span v-if="cargoCadastroError" class="text-red-500 text-xs mb-2 block">{{
                cargoCadastroError
                }}</span>
            <div class="flex justify-between">
                <span v-if="servidorCadastroError" class="text-red-500 text-xs mb-2 block">{{
                    servidorCadastroError
                }}</span>
                <button type="button"
                    class="text-[0.9rem] px-4 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                    @click="realizarCadastro">Cadastrar</button>
                <button class="hover:underline text-sm" style="color: #008d53" @click="emit('voltar')">
                    <!-- @click="mostrarTelaCadastro = false"  -->
                    Voltar
                </button>
            </div>
        </div>
    </form>
    <!-- Pop up de cadastro enviado -->
    <div v-if="mostrarPopUp" class="fixed inset-0 flex items-center justify-center z-50">
        <div
            class="bg-white border border-green-700 text-green-700 px-8 py-4 rounded-xl shadow-lg text-lg font-semibold">
            {{ popUpMensagem }}
        </div>
    </div>
</template>