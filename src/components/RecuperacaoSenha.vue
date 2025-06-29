<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['voltar'])

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

// Fluxo de recuperação de senha

const forgotStep = ref(1)
const forgotEmail = ref('')
const forgotCode = ref('')
const forgotCodeDigits = ref(['', '', '', ''])
const forgotPassword = ref('')
const forgotPasswordConfirm = ref('')
const forgotError = ref('')
const forgotSuccess = ref(false)

function voltarParaLogin() {
    // showForgot.value = false
    forgotStep.value = 1
    forgotEmail.value = ''
    forgotCode.value = ''
    forgotCodeDigits.value = ['', '', '', '']
    forgotPassword.value = ''
    forgotPasswordConfirm.value = ''
    forgotError.value = ''
    forgotSuccess.value = false
    emit('voltar')
}

</script>
<template>
    <div class=" text-sm">
        <div class="rounded-t-2xl bg-green-700 text-gray-50 text-center py-4 mb-6">
            <h2 class="text-xl font-bold m-0">Recuperação de senha</h2>
        </div>
        <div class="px-6 sm:px-8">
            <template v-if="forgotStep === 1">
                <div class="flex flex-col items-center gap-3">

                    <label class="block font-bold text-green-700 text-center">Por favor digite
                        seu
                        E-mail</label>
                    <input type="email" v-model="forgotEmail" placeholder="Digite seu e-mail aqui"
                        class="w-full max-w-xs border rounded px-3 py-2 border-green-500" />
                    <span v-if="forgotError" class="text-red-500 text-xs text-center">{{
                        forgotError
                        }}</span>
                    <!-- Espaço extra antes do botão e frase -->
                    <div class="w-full flex flex-col items-center mt-4">
                        <button class="bg-green-700 text-white px-4 py-2 rounded font-bold hover:bg-green-800 mb-2"
                            @click="enviarEmailRecuperacao">
                            Enviar E-mail
                        </button>
                        <span class="block font-bold text-xs text-green-700 text-center mt-4">
                            Um código de 4 dígitos será enviado para o seu e-mail cadastrado
                            para
                            que você possa recuperar sua senha.
                        </span>
                    </div>
                    <button class="text-green-700 text-xs rounded hover:bg-green-50 transition-colors self-end"
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
                    <input v-for="(digit, idx) in forgotCodeDigits" :key="idx" :id="`code-input-${idx}`" type="number"
                        inputmode="numeric" maxlength="1" class="w-full border rounded px-3 py-2 mb-3 border-green-500"
                        v-model="forgotCodeDigits[idx]" @input="handleCodeInput(idx, $event)"
                        @keydown="handleCodeBackspace(idx, $event)" />
                </div>
                <span v-if="forgotError" class="text-red-500 text-xs mb-2 block">{{ forgotError
                    }}</span>
                <div class="flex justify-center">
                    <button class="bg-green-700 text-white px-4 py-2 rounded font-bold hover:bg-green-800"
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
                    <button class="bg-green-700 text-white px-4 py-2 rounded font-bold hover:bg-green-800"
                        @click="confirmarNovaSenha">Confirmar
                        senha</button>
                </div>
            </template>
            <template v-else-if="forgotStep === 4 && forgotSuccess">
                <div class="text-center">
                    <p class="text-green-700 font-bold mb-4">Senha atualizada com sucesso! ✨</p>
                    <button class="bg-green-700 text-white px-4 py-2 roundded font-bold hover:bg-green-800"
                        @click="voltarParaLogin">Login</button>
                </div>

            </template>
            <div class="mt-4 text-center">
                <button class="hover:underline text-sm" @click="voltarParaLogin" style="color: #008d53"></button>
            </div>
        </div>
    </div>
</template>