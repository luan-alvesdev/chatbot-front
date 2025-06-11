<script setup lang="ts">
import { ThumbsUp, ThumbsDown, ArrowUp } from 'lucide-vue-next';
import { computed, ref } from 'vue'

// dados mocados 
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


const popupMensagem = ref('')
const showPopup = ref(false)

function enviarFeedback(InfoAjudou: boolean) {
    if (InfoAjudou) {
        popupMensagem.value = 'Fico feliz em te ajudar com sua dúvida! 😊';
    } else {
        popupMensagem.value = 'Vou trabalhar para melhorar essa resposta. 💡';
    }
    showPopup.value = true;
    setTimeout(() => {
        showPopup.value = false;
    }, 1500);
}

const popupMensagemDuvida = ref('')
const duvidaUser = ref('')
const showPopupMensagemDuvida = ref(false)

function enviarDuvida(duvida: boolean) {
    if (duvida) {
        popupMensagemDuvida.value = 'Dúvida enviada para análise da gestão. 😊'
        duvidaUser.value = ''
    }
    showPopupMensagemDuvida.value = true
    setTimeout(() => {
        showPopupMensagemDuvida.value = false;
    }, 1500)
}

</script>

<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="relative">
            <div
                class="absolute inset-0 translate-x-3 translate-y-3 bg-green-300 rounded-2xl blur-[2px] opacity-60 z-0">
            </div>

            <!-- Pop up de feedback sobre informação da base de conhecimento -->
            <div class="relative font-dm max-w-lg mx-auto mt-3 p-6 bg-white rounded-2xl shadow-2xl z-10">
                <!-- Pop up -->
                <div v-if="showPopup" class="absolute w-full inset-0 flex items-center justify-center z-50">
                    <div
                        class="bg-white border border-green-700 text-green-700 px-8 py-4 rounded-xl shadow-lg text-lg font-semibold">
                        {{ popupMensagem }}
                    </div>
                </div>

                <!-- Pop up de dúvida enviada -->
                <div v-if="showPopupMensagemDuvida" class="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        class="bg-white border border-green-700 text-green-700 px-8 py-4 rounded-xl shadow-lg text-lg font-semibold">
                        {{ popupMensagemDuvida }}
                    </div>
                </div>

                <!-- Principal -->

                <div class="flex items-center mb-2 gap-3">
                    <img src="/avatar_woman.png" alt="Avatar" class="h-12 w-12 rounded-full object-cover" />
                    <div class="flex flex-col justify-center">
                        <h1 class="text-2xl font-bold text-green-700">
                            Atendimento com IA QQTech
                        </h1>
                        <span class="text-sm text-green-700">Assistente E-commerce</span>
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block mb-1 font-medium text-green-700">
                        Selecione um tema para obter mais informações:
                    </label>
                    <select class="w-full border rounded px-3 py-2 text-green-700" v-model="selectedId">
                        <option :value="null">Não encontrou? Envie aqui sua dúvida</option>
                        <option v-for="opt in solucoes" :key="opt.id" :value="opt.id">
                            {{ opt.titulo }}
                        </option>
                    </select>
                </div>

                <!-- Container de infos sobre o tema -->
                <div class="bg-gray-100 rounded px-2 pt-2 min-h-[120px] max-h-64 overflow-y-auto border">

                    <!-- Recebe dúvida não encontrada -->
                    <div v-if="selectedId === null" class="mt-3 mb-3">
                        <label class="block mb-4 font-medium text-green-700">Envie sua dúvida não encontrada na Base de
                            Conhecimento:</label>
                        <div class="flex gap-2">
                            <input type="text" class="w-full border rounded px-3 py-2"
                                placeholder="Digite sua dúvida aqui..." v-model="duvidaUser">
                            <button
                                class="p-3 rounded-full text-[0.9rem] bg-green-700 text-white font-bold hover:bg-green-800"
                                @click="enviarDuvida(true)">
                                <ArrowUp class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <template v-if="selected">
                        <div class="text-gray-500 text-center text-sm font-normal">
                            <div class="mb-2 text-left">
                                <h3 class="font-semibold">Informações sobre o tema:</h3>
                                <p v-html="selected.label"></p>
                            </div>
                        </div>
                    </template>

                    <!-- Coleta se a info foi util ou não -->
                    <div class="sticky bottom-0 bg-gray-100" v-if="selected">
                        <div class="font-medium text-gray-700 mb-2 mt-2 flex justify-end">
                            Foi útil?
                        </div>
                        <div class="flex justify-end gap-4">
                            <button
                                class="flex items-center gap-1 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 font-medium"
                                type="button" @click="enviarFeedback(true)">
                                <ThumbsUp class="w-5 h-5" />
                                Sim
                            </button>
                            <button
                                class="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium"
                                type="button" @click="enviarFeedback(false)">
                                Não
                                <ThumbsDown class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>