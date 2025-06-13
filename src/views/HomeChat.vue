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
const cargoCadastro = ref('')
const popUpMensagem = ref('')
const mostrarPopUp = ref(false)

// Erros cadastro
const nomeCadastroError = ref('')
const cpfCadastroError = ref('')
const emailCadastroError = ref('')
const senhaCadastroError = ref('')
const cargoCadastroError = ref('')

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

function realizarCadastro() {
    if (validarCadastro()) {
        mostrarTelaCadastro.value = false
        // Limpar campos 
        nomeCadastro.value = ''
        cpfCadastro.value = ''
        emailCadastro.value = ''
        senhaCadastro.value = ''
        cargoCadastro.value = ''
        enviarFeedback()
    }
}

function enviarFeedback() {
    popUpMensagem.value = 'Cadastro enviado com sucesso! Você receberá uma confirmação por E-mail após análise da gestão. ✨';
    mostrarPopUp.value = true
    setTimeout(() => {
        mostrarPopUp.value = false;
    }, 4000);
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

// Fluxo de recuperação de senha

const forgotStep = ref(1)
const forgotEmail = ref('')
const forgotCode = ref('')
const forgotCodeDigits = ref(['', '', '', ''])
const forgotPassword = ref('')
const forgotPasswordConfirm = ref('')
const forgotError = ref('')
const forgotSuccess = ref(false)

function enviarEmailRecuperacao() {
    forgotError.value = ''
    if (!forgotEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.value)) {
        forgotError.value = 'Por favor, digite um e-mail válido.'
        return
    }
    forgotStep.value = 2
    // aqui chamar API pra enviar o e-mail
}

function handleCodeInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement
    const value = input.value.replace(/\D/g, '').slice(0, 1) //Apenas 1 dígito numérico
    forgotCodeDigits.value[index] = value

    // Move para o próximo campo após cada dígito
    if (value && index < 3) {
        const nextInput = document.getElementById(`code-input-${index + 1}`) as HTMLInputElement
        nextInput?.focus()
    }
    forgotCode.value = forgotCodeDigits.value.join('')
}

function handleCodeBackspace(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !forgotCodeDigits.value[index] && index > 0) {
        const prevInput = document.getElementById(`code-input-${index - 1}`) as HTMLInputElement
        prevInput?.focus()
    }
}

function validarCodigo() {
    forgotError.value = ''
    if (!/^\d{4}$/.test(forgotCode.value)) {
        forgotError.value = 'Digite o código de 4 dígitos.'
        return
    }
    forgotStep.value = 3
    // Aqui inserir validação desenha pela API
}

function confirmarNovaSenha() {
    forgotError.value = ''
    if (forgotPassword.value.length < 4) {
        forgotError.value = 'A senha deve ter no mínimo 4 dígitos.'
        return
    }
    if (forgotPassword.value !== forgotPasswordConfirm.value) {
        forgotError.value = 'As senhas não são idênticas'
        return
    }
    forgotStep.value = 4
    forgotSuccess.value = true
    //Aqui chamar API para atualizar senha
}

function voltarParaLogin() {
    showForgot.value = false
    forgotStep.value = 1
    forgotEmail.value = ''
    forgotCode.value = ''
    forgotCodeDigits.value = ['', '', '', '']
    forgotPassword.value = ''
    forgotPasswordConfirm.value = ''
    forgotError.value = ''
    forgotSuccess.value = false
}
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
            <div class="bg-gray-50 rounded-2xl mx-6 pb-6 w-full max-w-md " @click.stop>
                <template v-if="!mostrarTelaCadastro">
                    <template v-if="!showForgot">
                        <div class="rounded-t-2xl bg-green-700 text-gray-50 text-center py-4 mb-6">
                            <h2 class="text-xl font-bold m-0">Login</h2>
                        </div>
                        <div class="px-6 sm:px-8">
                            <label for="login-email" class="block text-sm mb-1 font-bold text-green-700">E-mail</label>
                            <input id="login-email" type="email"
                                class="w-full border rounded px-3 py-2 mb-3 border-green-500" v-model="email" />
                            <span v-if="emailError" class="text-red-500 text-xs mb-2 block">{{ emailError }}</span>
                            <label for="login-senha" class="block text-sm mb-1 font-bold text-green-700">Senha</label>
                            <input id="login-senha" type="password"
                                class="w-full border rounded px-3 py-2 mb-3 border-green-500" v-model="senha" />
                            <span v-if="senhaError" class="text-red-500 text-xs mb-2 block">{{ senhaError }}</span>
                            <div class="flex items-center justify-between">
                                <button
                                    class="text-[0.9rem] px-4 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                                    @click="realizarLogin">Entrar</button>
                                <button class="hover:underline text-sm text-green-700" type="button"
                                    @click="mostrarTelaCadastro = true">
                                    Criar cadastro
                                </button>
                                <button class="hover:underline text-sm text-green-700" type="button"
                                    @click="showForgot = true">
                                    Esqueci minha senha
                                </button>
                            </div>
                        </div>
                    </template>
                    <!-- Recuperação de senha -->
                    <template v-else>
                        <div class=" text-sm">
                            <div class="rounded-t-2xl bg-green-700 text-gray-50 text-center py-4 mb-6">
                                <h2 class="text-xl font-bold m-0">Recuperação de senha</h2>
                            </div>
                            <div class="px-6 sm:px-8">
                                <template v-if="forgotStep === 1">
                                    <div class="flex flex-col items-center gap-3">

                                        <label class="block font-bold text-green-700 text-center">Por favor digite seu
                                            E-mail</label>
                                        <input type="email" v-model="forgotEmail" placeholder="Digite seu e-mail aqui"
                                            class="w-full max-w-xs border rounded px-3 py-2 border-green-500" />
                                        <span v-if="forgotError" class="text-red-500 text-xs text-center">{{ forgotError
                                            }}</span>
                                        <!-- Espaço extra antes do botão e frase -->
                                        <div class="w-full flex flex-col items-center mt-4">
                                            <button
                                                class="bg-green-700 text-white px-4 py-2 rounded font-bold hover:bg-green-800 mb-2"
                                                @click="enviarEmailRecuperacao">
                                                Enviar E-mail
                                            </button>
                                            <span class="block font-bold text-xs text-green-700 text-center mt-4">
                                                Um código de 4 dígitos será enviado para o seu e-mail cadastrado para
                                                que você possa recuperar sua senha.
                                            </span>
                                        </div>
                                        <button
                                            class="text-green-700 text-xs rounded hover:bg-green-50 transition-colors self-end"
                                            @click="voltarParaLogin" type="button">
                                            Voltar
                                        </button>
                                    </div>
                                </template>
                                <template v-else-if="forgotStep === 2">
                                    <label class="block text-sm mb-3 font-bold text-green-700">Digite o código de 4
                                        dígitos
                                        enviado
                                        para o seu e-mail</label>
                                    <div class="flex justify-center gap-2 mb-2">
                                        <input v-for="(digit, idx) in forgotCodeDigits" :key="idx"
                                            :id="`code-input-${idx}`" type="number" inputmode="numeric" maxlength="1"
                                            class="w-full border rounded px-3 py-2 mb-3 border-green-500"
                                            v-model="forgotCodeDigits[idx]" @input="handleCodeInput(idx, $event)"
                                            @keydown="handleCodeBackspace(idx, $event)" />
                                    </div>
                                    <span v-if="forgotError" class="text-red-500 text-xs mb-2 block">{{ forgotError
                                        }}</span>
                                    <div class="flex justify-center">
                                        <button
                                            class="bg-green-700 text-white px-4 py-2 rounded font-bold hover:bg-green-800"
                                            @click="validarCodigo">
                                            Validar código
                                        </button>
                                    </div>
                                </template>
                                <template v-else-if="forgotStep === 3">
                                    <label class="block text-sm mb-1 font-bold text-green-700">Digite sua nova senha
                                        (mínimo
                                        4
                                        dígitos):</label>
                                    <input type="password" v-model="forgotPassword"
                                        class="w-full border rounded px-3 py-2 mb-3 border-green-500" />
                                    <label class="block text-sm mb-1 font-bold text-green-700">Confirme sua
                                        senha:</label>
                                    <input type="password" v-model="forgotPasswordConfirm"
                                        class="w-full border rounded px-3 py-2 mb-3 border-green-500" />
                                    <span v-if="forgotError" class="text-red-500 text-xs mb-2 block">{{ forgotError
                                        }}</span>
                                    <div class="flex justify-center">
                                        <button
                                            class="bg-green-700 text-white px-4 py-2 rounded font-bold hover:bg-green-800"
                                            @click="confirmarNovaSenha">Confirmar
                                            senha</button>
                                    </div>
                                </template>
                                <template v-else-if="forgotStep === 4 && forgotSuccess">
                                    <div class="text-center">
                                        <p class="text-green-700 font-bold mb-4">Senha atualizada com sucesso! ✨</p>
                                        <button
                                            class="bg-green-700 text-white px-4 py-2 roundded font-bold hover:bg-green-800"
                                            @click="voltarParaLogin">Login</button>
                                    </div>

                                </template>
                                <div class="mt-4 text-center">
                                    <button class="hover:underline text-sm" @click="voltarParaLogin"
                                        style="color: #008d53"></button>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
                <!-- Modal Cadastro -->
                <template v-else>
                    <div class="rounded-t-2xl bg-green-700 text-gray-50 text-center py-4 mb-6">
                        <h2 class="text-xl font-bold m-0">Cadastro</h2>
                    </div>
                    <div class="px-6 sm:px-8">
                        <label for="cadastro-nome" class="block text-sm mb-1 font-bold text-green-700">Nome</label>
                        <input id="cadastro-nome" type="text"
                            class="w-full border rounded px-3 py-2 mb-3 border-green-500" v-model="nomeCadastro" />
                        <span v-if="nomeCadastroError" class="text-red-500 text-xs mb-2 block">{{ nomeCadastroError
                        }}</span>
                        <label class="block text-sm mb-1 font-bold text-green-700">CPF</label>
                        <input type="text" class="w-full border rounded px-3 py-2 mb-3 border-green-500"
                            v-model="cpfCadastro" />
                        <span v-if="cpfCadastroError" class="text-red-500 text-xs mb-2 block">{{ cpfCadastroError
                        }}</span>
                        <label class="block text-sm mb-1 font-bold text-green-700">E-mail</label>
                        <input type="email" class="w-full border rounded px-3 py-2 mb-3 border-green-500"
                            v-model="emailCadastro" />
                        <span v-if="emailCadastroError" class="text-red-500 text-xs mb-2 block">{{ emailCadastroError
                        }}</span>
                        <label class="block text-sm mb-1 font-bold text-green-700">Senha</label>
                        <input type="password" class="w-full border rounded px-3 py-2 mb-4 border-green-500"
                            v-model="senhaCadastro" />
                        <span v-if="senhaCadastroError" class="text-red-500 text-xs mb-2 block">{{ senhaCadastroError
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
                        <span v-if="cargoCadastroError" class="text-red-500 text-xs mb-2 block">{{ cargoCadastroError
                        }}</span>
                        <div class="flex justify-between">
                            <button
                                class="text-[0.9rem] px-4 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                                @click="realizarCadastro">Cadastrar</button>
                            <button class="hover:underline text-sm" @click="mostrarTelaCadastro = false"
                                style="color: #008d53">
                                Voltar
                            </button>
                        </div>
                    </div>
                </template>
                <!-- Pop up de cadastro enviado -->
                <div v-if="mostrarPopUp" class="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        class="bg-white border border-green-700 text-green-700 px-8 py-4 rounded-xl shadow-lg text-lg font-semibold">
                        {{ popUpMensagem }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>