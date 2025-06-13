<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

// dados mocados
const baseConhecimento = ref([
    {
        id: 1,
        macroTema: "Cartão",
        microTemas: [
            { id: 101, nome: "Bloqueios", descricao: "Informações relacionadas a bloqueios de cartão, como causas, prazos e desbloqueios." },
            { id: 102, nome: "Empréstimo Pessoal", descricao: "Não encontrei nenhuma informação sobre sua dúvida." },
            { id: 103, nome: "Data Base", descricao: "Data base para cálculo de fatura, fechamento e vencimento do cartão." }
        ]
    },
    {
        id: 2,
        macroTema: "SAC/Chamados",
        microTemas: [
            { id: 201, nome: "Abertura de Chamado", descricao: "Procedimentos para abrir um chamado no SAC para diversas finalidades." },
            { id: 202, nome: "Acompanhamento de Chamado", descricao: "Como verificar o andamento de um chamado já aberto pelo cliente." },
            { id: 203, nome: "Encerramento de Chamado", descricao: "Informações sobre prazos e motivos para encerramento de chamados." }
        ]
    },
    {
        id: 3,
        macroTema: "E-commerce",
        microTemas: [
            { id: 301, nome: "Trocas e devoluções", descricao: "Conforme o Código de Defesa do Consumidor (CDC), o prazo para solicitar a troca ou devolução de um pedido feito online é de até 7 dias corridos a partir da data de entrega ou retirada. O cliente deve garantir que o produto esteja com todos os itens originais, sem sinais de uso. Em caso de erro ou avaria no produto, um chamado poderá ser aberto para E-commerce > Entrega ou Cancelamento." },
            { id: 302, nome: "Formas de pagamento", descricao: "Aceitamos diversos métodos: cartões Elo, MasterCard, Visa, PIX, boleto, entre outros. Também há a opção de financiamento BB Realize diretamente pelo app do Banco do Brasil." },
            { id: 303, nome: "Programa Palavra", descricao: "Caso a entrega atrase, o cliente é indenizado com o valor pago. A solicitação deve ser feita via site ou loja física, conforme o canal da compra. O prazo de análise é de até 7 dias úteis." },
            { id: 304, nome: "Identificação Positiva", descricao: "Para validar a titularidade, solicitamos CPF, nome completo e forma de pagamento. Se necessário, o titular pode autorizar outra pessoa ou realizar a solicitação diretamente." }
        ]
    }
])
const macrotemaSelecionado = ref('')
const microtemaSelecionado = ref('')
const mensagens = ref<{ texto: string, autor: 'bot' | 'user', isDescricao?: boolean }[]>([])
const novaMensagem = ref('')
const feedbacks = ref<{ index: number, util: boolean }[]>([])

const microtemasDisponiveis = computed(() => {
    const macro = baseConhecimento.value.find(m => m.macroTema === macrotemaSelecionado.value)
    return macro ? macro.microTemas : []
})

const microtemaObjSelecionado = computed(() => {
    return microtemasDisponiveis.value.find(m => m.nome === microtemaSelecionado.value)
})

const mostrarChat = computed(() => macrotemaSelecionado.value && microtemaSelecionado.value)

function iniciarChat() {
    mensagens.value = [
        {
            texto: `Olá, tudo bem? Sou IA da QQ-Tech 👩‍💻, você escolheu o microtema <span class="font-bold">${microtemaSelecionado.value}</span> do macrotema <span class="font-bold">${macrotemaSelecionado.value}</span>. Faça uma pergunta relacionada ao assunto para consultar na Biblioteca do Conhecimento.`,
            autor: 'bot'
        }
    ]
    novaMensagem.value = ''
    feedbacks.value = []
    nextTick(() => {
        const chatDiv = document.getElementById('chat-mensagens')
        if (chatDiv) chatDiv.scrollTop = chatDiv.scrollHeight
    })
}

function enviarMensagem() {
    if (!novaMensagem.value.trim()) return
    mensagens.value.push({ texto: novaMensagem.value, autor: 'user' })
    setTimeout(() => {
        if (microtemaObjSelecionado.value) {
            mensagens.value.push({
                texto: microtemaObjSelecionado.value.descricao,
                autor: 'bot',
                isDescricao: true
            })
        }
        nextTick(() => {
            const chatDiv = document.getElementById('chat-mensagens')
            if (chatDiv) chatDiv.scrollTop = chatDiv.scrollHeight
        })
    }, 600)
    novaMensagem.value = ''
}

function reiniciarChat() {
    macrotemaSelecionado.value = ''
    microtemaSelecionado.value = ''
    mensagens.value = []
    novaMensagem.value = ''
    feedbacks.value = []
}

function marcarUtil(index: number) {
    const idx = feedbacks.value.findIndex(f => f.index === index)
    if (idx === -1) {
        feedbacks.value.push({ index, util: true })
    } else {
        feedbacks.value.splice(idx, 1)
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-4 flex flex-col">
            <!-- Ícone de voltar -->
            <button v-if="mostrarChat && mensagens.length > 0" @click="reiniciarChat"
                class="mb-4 flex items-center text-green-700 hover:text-green-900 font-bold w-fit"
                title="Voltar para seleção">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
            </button>
            <!-- Selects -->
            <div v-if="!mostrarChat || mensagens.length === 0">
                <div class="mb-4">
                    <label class="block mb-1"><span class="font-bold">Escolha um macrotema para consulta na IA
                            QQ-Tech:</span></label>
                    <select v-model="macrotemaSelecionado" class="border rounded px-3 py-2 w-full">
                        <option value="" disabled>Selecione...</option>
                        <option v-for="m in baseConhecimento" :key="m.id" :value="m.macroTema">{{ m.macroTema }}
                        </option>
                    </select>
                </div>
                <div v-if="macrotemaSelecionado" class="mb-4">
                    <label class="block mb-1"><span class="font-bold">Escolha um microtema:</span></label>
                    <select v-model="microtemaSelecionado" class="border rounded px-3 py-2 w-full">
                        <option value="" disabled>Selecione...</option>
                        <option v-for="m in microtemasDisponiveis" :key="m.id" :value="m.nome">{{ m.nome }}</option>
                    </select>
                </div>
                <div v-if="macrotemaSelecionado && microtemaSelecionado && mensagens.length === 0" class="mb-4">
                    <button @click="iniciarChat"
                        class="bg-green-700 text-white px-4 py-2 rounded font-bold hover:bg-green-800 w-full">
                        Iniciar Chat
                    </button>
                </div>
            </div>
            <!-- Chat -->
            <div v-if="mostrarChat && mensagens.length > 0" class="flex flex-col h-[400px]">
                <div id="chat-mensagens" class="flex-1 overflow-y-auto mb-4 flex flex-col gap-2 pr-2">
                    <div v-for="(msg, idx) in mensagens" :key="idx" class="flex"
                        :class="msg.autor === 'bot' ? 'justify-start' : 'justify-end'">
                        <div v-if="msg.autor === 'bot'"
                            class="bg-green-100 text-green-900 px-4 py-2 rounded-lg max-w-xs flex flex-col">
                            <span v-html="msg.texto"></span>
                            <!-- Botão "Foi útil?" discreto, pequeno e abaixo da mensagem -->
                            <button v-if="msg.isDescricao && idx === mensagens.length - 1" @click="marcarUtil(idx)"
                                class="self-end mt-2 px-2 py-1 rounded text-xs font-semibold transition-colors"
                                :class="feedbacks.find(f => f.index === idx) ? 'bg-green-200 text-green-700' : 'bg-green-700 text-white hover:bg-green-800'"
                                :aria-pressed="!!feedbacks.find(f => f.index === idx)" title="Marcar como útil">
                                Foi útil?
                            </button>
                        </div>
                        <div v-else class="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg max-w-xs">
                            {{ msg.texto }}
                        </div>
                    </div>
                </div>
                <form @submit.prevent="enviarMensagem" class="flex gap-2">
                    <input v-model="novaMensagem" type="text" class="border rounded px-3 py-2 flex-1"
                        placeholder="Digite sua mensagem..." autocomplete="off" />
                    <button type="submit"
                        class="bg-green-700 text-white px-4 py-2 rounded font-bold hover:bg-green-800">
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>