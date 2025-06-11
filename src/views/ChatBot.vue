<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

const solucoes = [
    {

        id: 1, titulo: 'Trocas e devoluções', label: `Conforme o Código de Defesa do Consumidor (CDC), o prazo para solicitar a troca ou devolução de um pedido feito online é de até 7 (sete) dias corridos a partir da data de entrega no endereço ou retirada do produto na loja.<br>
            Caso o pedido tenha sido retirado em loja, o cliente deve levar o produto a uma de nossas lojas para avaliação do produto, desde que esteja na embalagem original, com manual, todos os acessórios e sem sinais de uso.<br>
            <ul style="list-style-type: disc; padding-left: 1.5rem;">
            <li>Caso não tenha obtido suporte em loja, podemos abrir um chamado em E-commerce &gt; Cancelamentos.</li>
            <li>Caso o cliente tenha recebido em casa um produto diferente/avariado/incompleto, do que foi comprado, devemos abrir um chamado de E-commerce &gt; Entrega para verificarmos a possibilidade de troca.</li>
            <li>Caso o cliente tenha comprado o produto errado/diferente do qual ele possui interesse, devemos abrir um chamado para cancelamento deste pedido em E-commerce &gt; Cancelamentos.</li>
            <li>Após o cancelamento, o cliente pode realizar uma nova compra com o item correto.</li>
            </ul><br>
            <strong>ATENÇÃO:</strong> Para cancelamentos de pedidos pagos via boleto, é necessário informar os dados bancários do titular para o estorno.<br>
            Sempre especifique o número do pedido, o produto e quantidades em questão.`
        , foiUtil: 23, naoFoiUtil: 3
    },
    {
        id: 2, titulo: 'Formas de pagamento', label: `Formas de pagamento aceitas:<br>
            <ul style="list-style-type: disc; padding-left: 1.5rem;">
            <li>Cartão Quero-Quero Elo ou VerdeCard</li>
            <li>Fatura simplificada Quero-Quero (somente em loja física)</li>
            <li>Boleto bancário</li>
            <li>PIX</li>
            <li>Dinheiro (somente em loja física)</li>
            <li>Demais cartões das bandeiras Elo, MasterCard, Visa, Senff, Hipercard, American Express</li>
            <li>Cartão De Volta para Casa (em solidariedade às Enchentes atingidas no RS, em Maio de 2024)</li>
            </ul>
            No segmento de construção, a Quero-Quero é a única que aceita o financiamento através do <strong>BB Realize</strong>.<br><br>
            <strong>O que é isso?</strong><br>
            O BB Realize é uma linha de crédito (empréstimo) do Banco do Brasil.<br><br>
            <strong>Como funciona?</strong><br>
            O cliente faz a adesão do empréstimo direto pelo app do Banco do Brasil e da loja consegue utilizá-lo como pagamento de compra.`, foiUtil: 8, naoFoiUtil: 15
    },
    {
        id: 3, titulo: 'Programa palavra', label: `Caso a entrega atrase, garantimos o produto de graça ao cliente!<br>
            Neste projeto, indenizamos o cliente com o valor pago pelo produto, caso a entrega não seja efetuada até a data promessa constante na Nota Fiscal.<br>
            Há diversas regras para aptidão da indenização pelo Palavra, o regulamento está disponível no nosso site:<br>
            <a href="https://www.queroquero.com.br/palavra" target="_blank" style="color: #2563eb;">https://www.queroquero.com.br/palavra</a><br><br>
            <ul style="list-style-type: disc; padding-left: 1.5rem;">
            <li>Caso a compra tenha sido realizada no <strong>SITE</strong>, o cliente deve solicitar a análise da indenização pelo formulário, em:<br>
            <a href="https://painel.quero-quero.com.br/formulario_palavra" target="_blank" style="color: #2563eb;">https://painel.quero-quero.com.br/formulario_palavra</a></li>
            <li>Caso a compra tenha sido realizada em <strong>LOJA</strong>, o cliente pode solicitar a análise da indenização direto com a loja.</li>
            </ul><br>
            Após a solicitação, o retorno da análise ocorre em até 7 dias úteis.<br>
            O pagamento ocorrerá em depósito bancário ou, quando solicitado em loja, já há a opção de saque no caixa.<br>
            Em último caso, se o cliente não tiver obtido suporte nos meios acima, podemos abrir chamado para análise da solicitação.`, foiUtil: 29, naoFoiUtil: 3
    },
    {
        id: 4, titulo: 'Identificação Positiva', label: `Para validação da titularidade quando houver suporte com compras realizadas na Quero-Quero, solicitamos as seguintes informações:<br><br>
            <ul style="list-style-type: disc; padding-left: 1.5rem;">
            <li>CPF</li>
            <li>Nome completo</li>
            <li>Forma de pagamento</li>
            </ul><br>
            Caso erre a forma de pagamento, podemos substituir pela data da compra.<br><br>
            Caso ocorra inconsistência, o cliente deve ser orientado a verificar as informações no site (para compras no site) ou na loja física.<br><br>
            Se identificarmos que estamos falando com terceiros (filhos, cônjuges, etc.), vamos solicitar que o titular entre em contato ou autorize o atendimento em linha.<br><br>
            Quando se tratar apenas de uma reclamação (experiências, fluxos operacionais, etc.), nós encaminhamos a reclamação via chamado, sem compartilhar informações sobre o cadastro/pedido do cliente. O retorno da reclamação será sempre feito ao telefone ou e-mail do titular da compra.`, foiUtil: 12, naoFoiUtil: 2
    }]
const selectedId = ref<number | null>(null)
const selected = computed(() => solucoes.find(s => s.id === selectedId.value) || null)

type ChatMsg = { from: 'bot' | 'user', text: string, type?: string }
const chat = ref<ChatMsg[]>([])
const userInput = ref('')
const step = ref<'init' | 'waitingUser' | 'showInfo' | 'feedback' | 'notFoundConfirm' | 'end'>('init')
const lastUserQuestion = ref('')

function startChat() {
    chat.value = []
    if (selected.value) {
        chat.value.push({
            from: 'bot',
            text: `Olá, tudo bem? Sou <span class="font-bold">IA da QQ-Tech</span> 👩‍💻, você escolheu o tema <span class="font-bold"> ${selected.value.titulo}</span>. Faça uma pergunta relacionada ao tema para consultar na Base de Conhecimento.`
        })
        step.value = 'waitingUser'
        userInput.value = ''
        scrollToBottom()
    }
}

function sendUserQuestion() {
    if (!userInput.value.trim()) return
    chat.value.push({ from: 'user', text: userInput.value })
    lastUserQuestion.value = userInput.value
    userInput.value = ''
    nextTick(() => {
        chat.value.push({ from: 'bot', text: selected.value?.label || '' })
        step.value = 'feedback'
        scrollToBottom()
    })
}

function feedback(wasUseful: boolean) {
    if (wasUseful) {
        chat.value.push({ from: 'bot', text: 'Fico feliz em te ajudar com sua dúvida! 😊 <br> Atendimento encerrado.' })
        step.value = 'end'
    } else {
        chat.value.push({
            from: 'bot',
            text: `Deseja enviar o assunto "<span class='font-bold'>${lastUserQuestion.value}</span>" para base de respostas não encontradas? 💡`,
            type: 'notFoundConfirm'
        })
        step.value = 'notFoundConfirm'
        scrollToBottom()
    }
}

function notFoundConfirm(send: boolean) {
    if (send) {
        chat.value.push({ from: 'bot', text: 'Assunto enviado com sucesso para base de respostas não encontradas para análise da gestão.' })
    } else {
        chat.value.push({ from: 'bot', text: 'Combinado! Você pode consultar também em outros temas nas opções acima. Atendimento encerrado. 😊' })
    }
    step.value = 'end'
    scrollToBottom()
}

function scrollToBottom() {
    nextTick(() => {
        const el = document.getElementById('chat-scroll')
        if (el) el.scrollTop = el.scrollHeight
    })
}

watch(selectedId, () => {
    if (selectedId.value) startChat()
    else chat.value = []
})
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-green-50">
        <div class="w-full max-w-xl mx-auto">
            <div class="mb-4">
                <label class="block mb-1 font-medium text-green-700">
                    Escolha um tema para consulta na IA QQ-Tech
                </label>
                <select class="w-full border rounded px-3 py-2 text-green-700" v-model="selectedId">
                    <option :value="null">Escolha um tema</option>
                    <option v-for="opt in solucoes" :key="opt.id" :value="opt.id">
                        {{ opt.titulo }}
                    </option>
                </select>
            </div>
            <div class="bg-white rounded-2xl shadow-lg p-4 h-[500px] flex flex-col">
                <div id="chat-scroll" class="flex-1 overflow-y-auto space-y-4 pr-2">
                    <div v-for="(msg, idx) in chat" :key="idx" class="flex"
                        :class="msg.from === 'bot' ? 'justify-start' : 'justify-end'">
                        <div :class="[
                            'max-w-[80%] px-4 py-2 rounded-xl',
                            msg.from === 'bot'
                                ? 'bg-green-100 text-green-900 rounded-bl-none'
                                : 'bg-green-700 text-white rounded-br-none'
                        ]">
                            <template v-if="msg.type === 'notFoundConfirm'">
                                <span v-html="msg.text"></span>
                                <div class="flex gap-2 mt-2 justify-center">
                                    <button
                                        class="px-4 py-1 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                                        @click="notFoundConfirm(true)">Sim</button>
                                    <button
                                        class="px-4 py-1 rounded bg-gray-300 text-green-700 font-bold hover:bg-gray-400"
                                        @click="notFoundConfirm(false)">Não</button>
                                </div>
                            </template>
                            <template v-else>
                                <span v-html="msg.text"></span>
                            </template>
                        </div>
                    </div>
                    <!-- Botões de feedback "Foi útil?" -->
                    <div v-if="step === 'feedback'" class="flex gap-2 mt-2 justify-center">
                        <span class="font-medium self-center">Foi útil?</span>
                        <button class="px-4 py-1 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                            @click="feedback(true)">Sim</button>
                        <button class="px-4 py-1 rounded bg-red-600 text-white font-bold hover:bg-red-700"
                            @click="feedback(false)">Não</button>
                    </div>
                </div>
                <div v-if="step === 'waitingUser'" class="mt-4 flex gap-2">
                    <input v-model="userInput" @keyup.enter="sendUserQuestion" type="text"
                        class="flex-1 border rounded px-3 py-2" placeholder="Digite sua pergunta..." />
                    <button class="px-4 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                        @click="sendUserQuestion">
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>