<script setup lang="ts">
import { computed, ref } from 'vue'

type Solucao = { id: number; titulo: string; descricao: string; palavrasChave: string; foiUtil: number; naoFoiUtil: number }

const solucoes = ref<Solucao[]>([
    {
        id: 1,
        titulo: 'Trocas e devoluções',
        descricao: `Conforme o Código de Defesa do Consumidor (CDC), o prazo para solicitar a troca ou devolução de um pedido feito online é de até 7 (sete) dias corridos a partir da data de entrega no endereço ou retirada do produto na loja.
        Caso o pedido tenha sido retirado em loja, o cliente deve levar o produto a uma de nossas lojas para avaliação do produto, desde que esteja na embalagem original, com manual, todos os acessórios e sem sinais de uso.
        
        - Caso não tenha obtido suporte em loja, podemos abrir um chamado em E-commerce > Cancelamentos.
        - Caso o cliente tenha recebido em casa um produto diferente/avariado/incompleto, do que foi comprado, devemos abrir um chamado de E-commerce > Entrega para verificarmos a possibilidade de troca.
        - Caso o cliente tenha comprado o produto errado/diferente do qual ele possui interesse, devemos abrir um chamado para cancelamento deste pedido em E-commerce > Cancelamentos.
        - Após o cancelamento, o cliente pode realizar uma nova compra com o item correto.
        
        ATENÇÃO: Para cancelamentos de pedidos pagos via boleto, é necessário informar os dados bancários do titular para o estorno.
        Sempre especifique o número do pedido, o produto e quantidades em questão.`,
        palavrasChave: 'troca, devolução, cancelamento, CDC, pedido',
        foiUtil: 23,
        naoFoiUtil: 3
    },
    {
        id: 2,
        titulo: 'Formas de pagamento',
        descricao: `Formas de pagamento aceitas:
    
        - Cartão Quero-Quero Elo ou VerdeCard
        - Fatura simplificada Quero-Quero (somente em loja física)
        - Boleto bancário
        - PIX
        - Dinheiro (somente em loja física)
        - Demais cartões das bandeiras Elo, MasterCard, Visa, Senff, Hipercard, American Express
        - Cartão De Volta para Casa (em solidariedade às Enchentes atingidas no RS, em Maio de 2024)

        No segmento de construção, a Quero-Quero é a única que aceita o financiamento através do BB Realize.

        O que é isso?
        O BB Realize é uma linha de crédito (empréstimo) do Banco do Brasil.

        Como funciona?
        O cliente faz a adesão do empréstimo direto pelo app do Banco do Brasil e da loja consegue utilizá-lo como pagamento de compra.`,
        palavrasChave: 'pagamento, cartão, boleto, pix, financiamento',
        foiUtil: 8,
        naoFoiUtil: 15
    },
    {
        id: 3,
        titulo: 'Programa palavra',
        descricao: `Caso a entrega atrase, garantimos o produto de graça ao cliente!
        Neste projeto, indenizamos o cliente com o valor pago pelo produto, caso a entrega não seja efetuada até a data promessa constante na Nota Fiscal.
        Há diversas regras para aptidão da indenização pelo Palavra, o regulamento está disponível no nosso site:
        https://www.queroquero.com.br/palavra

        - Caso a compra tenha sido realizada no SITE, o cliente deve solicitar a análise da indenização pelo formulário, em:
        https://painel.quero-quero.com.br/formulario_palavra
        - Caso a compra tenha sido realizada em LOJA, o cliente pode solicitar a análise da indenização direto com a loja.

        Após a solicitação, o retorno da análise ocorre em até 7 dias úteis.
        O pagamento ocorrerá em depósito bancário ou, quando solicitado em loja, já há a opção de saque no caixa.
        Em último caso, se o cliente não tiver obtido suporte nos meios acima, podemos abrir chamado para análise da solicitação.`,
        palavrasChave: 'indenização, entrega, promessa, palavra, atraso',
        foiUtil: 29,
        naoFoiUtil: 3
    },
    {
        id: 4,
        titulo: 'Identificação Positiva',
        descricao: `Para validação da titularidade quando houver suporte com compras realizadas na Quero-Quero, solicitamos as seguintes informações:

        - CPF
        - Nome completo
        - Forma de pagamento

        Caso erre a forma de pagamento, podemos substituir pela data da compra.

        Caso ocorra inconsistência, o cliente deve ser orientado a verificar as informações no site (para compras no site) ou na loja física.

        Se identificarmos que estamos falando com terceiros (filhos, cônjuges, etc.), vamos solicitar que o titular entre em contato ou autorize o atendimento em linha.

        Quando se tratar apenas de uma reclamação (experiências, fluxos operacionais, etc.), nós encaminhamos a reclamação via chamado, sem compartilhar informações sobre o cadastro/pedido do cliente. O retorno da reclamação será sempre feito ao telefone ou e-mail do titular da compra.`,
        palavrasChave: 'identificação, titularidade, cpf, segurança, validação',
        foiUtil: 12,
        naoFoiUtil: 2
    }
])

const mostrarForm = ref(false)

const novaSolucao = ref({
    titulo: '',
    descricao: '',
    palavrasChave: ''
})

function abrirFormulario() {
    mostrarForm.value = true
}

function enviarSolucao() {
    solucoes.value.push({
        id: solucoes.value.length + 1,
        titulo: novaSolucao.value.titulo,
        descricao: novaSolucao.value.descricao,
        palavrasChave: novaSolucao.value.palavrasChave,
        foiUtil: 0,
        naoFoiUtil: 0
    })
    novaSolucao.value = { titulo: '', descricao: '', palavrasChave: '' }
    mostrarForm.value = false
}

const filtro = ref('')

// Filtra por título, descrição ou palavras-chave
const solucoesFiltradas = computed(() =>
    solucoes.value.filter(s =>
        s.titulo.toLowerCase().includes(filtro.value.toLowerCase()) ||
        s.descricao.toLowerCase().includes(filtro.value.toLowerCase()) ||
        s.palavrasChave.toLowerCase().includes(filtro.value.toLowerCase())
    )
)
//
function destacar(text: string) {
    if (!filtro.value) return text
    // Escapa caracteres especiais do filtro para regex
    const escaped = filtro.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')
    return text.replace(regex, '<b>$1</b>')
}

const popUpEdicao = ref(false)
const popUpExclusao = ref(false)
const nomeEditado = ref('')
const nomeExcluido = ref('')

// Estado de edição por linha (id)
const editingId = ref<number | null>(null)
// Cópia dos dados editáveis temporários
const editRow = ref<Omit<Solucao, 'id'>>({ titulo: '', descricao: '', palavrasChave: '', foiUtil: 0, naoFoiUtil: 0 })



function startEdit(row: Solucao) {
    editingId.value = row.id
    editRow.value = { ...row }
}

function saveEdit(row: Solucao) {
    row.titulo = editRow.value.titulo
    row.descricao = editRow.value.descricao
    row.palavrasChave = editRow.value.palavrasChave
    row.foiUtil = editRow.value.foiUtil
    row.naoFoiUtil = editRow.value.naoFoiUtil
    editingId.value = null
    nomeEditado.value = row.titulo
    popUpEdicao.value = true
    setTimeout(() => {
        popUpEdicao.value = false
        nomeEditado.value = ''
    }, 2000)
}

function deleteRow(row: Solucao) {
    const idx = solucoes.value.findIndex(s => s.id === row.id)
    if (idx !== -1) {
        nomeExcluido.value = row.titulo
        solucoes.value.splice(idx, 1)
        popUpExclusao.value = true
        setTimeout(() => {
            popUpExclusao.value = false
            nomeExcluido.value = ''
        }, 2000)
    }
}

// Cores pré-definidas para as tags
const tagColors = [
    'bg-red-200 text-red-800',
    'bg-green-200 text-green-800',
    'bg-blue-200 text-blue-800',
    'bg-yellow-200 text-yellow-800',
    'bg-purple-200 text-purple-800',
]

</script>
<template>
    <h1 class="text-xl font-bold mb-6 text-green-700">Biblioteca de conhecimento</h1>
    <div class="flex justify-between items-center mb-4">
        <button v-if="!mostrarForm"
            class="bg-green-700 text-white px-4 py-2 rounded font-semibold hover:bg-green-800 transition"
            @click="abrirFormulario">
            Adicionar novo assunto
        </button>
    </div>

    <!-- Formulário para nova solução -->
    <div v-if="mostrarForm" class="mb-6 p-4 border rounded bg-gray-50">
        <div class="mb-3">
            <label class="block font-medium text-green-700 mb-1">Título:</label>
            <input v-model="novaSolucao.titulo" type="text" class="w-full border rounded px-3 py-2" />
        </div>
        <div class="mb-3">
            <label class="block font-medium text-green-700 mb-1">Descrição:</label>
            <input v-model="novaSolucao.descricao" type="text" class="w-full border rounded px-3 py-2" />
        </div>
        <div class="mb-3">
            <label class="block font-medium text-green-700 mb-1">Palavras-chave:</label>
            <input v-model="novaSolucao.palavrasChave" type="text" class="w-full border rounded px-3 py-2" />
        </div>
        <label class="block text-sm mb-1 font-bold text-green-700">Gerar nova solução através de
            documento com IA QQ-Tech. 🤖</label>
        <input type="file" accept="application/pdf" class="w-full border rounded px-3 py-2 mb-3 border-green-500" />
        <div class="flex gap-2">
            <button class="bg-green-700 text-white px-4 py-2 rounded font-semibold hover:bg-green-800 transition"
                @click="enviarSolucao">
                Enviar
            </button>
            <button class="bg-gray-300 text-green-900 px-4 py-2 rounded font-semibold hover:bg-gray-400 transition"
                @click="mostrarForm = false">
                Cancelar
            </button>
        </div>
    </div>

    <!-- Popups -->
    <div v-if="popUpEdicao"
        class="fixed top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded shadow-lg z-50 transition">
        "{{ nomeEditado }}" foi atualizada com sucesso.
    </div>
    <div v-if="popUpExclusao"
        class="fixed top-28 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded shadow-lg z-50 transition">
        "{{ nomeExcluido }}" foi apagada com sucesso.
    </div>

    <!-- Cards de conhecimento -->
    <div class="grid gap-2   grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        <div v-for="c in solucoesFiltradas" :key="c.id"
            class="relative border-2 border-green-900 rounded-xl p-6 bg-white shadow flex flex-col h-full">
            <!-- Título -->
            <div class="flex flex-col md:flex-row md:items-start mb-3">
                <div class="w-full md:w-40 font-bold text-green-900 md:text-left">Título:</div>
                <div class="flex-1 font-bold md:text-left">
                    <template v-if="editingId === c.id">
                        <input v-model="editRow.titulo" class="border rounded px-2 py-1 w-full" />
                    </template>
                    <template v-else>
                        <span class="font-bold" v-html="destacar(c.titulo)"></span>
                    </template>
                </div>
            </div>
            <!-- Palavras-chave -->
            <div class="flex flex-col md:flex-row md:items-start mb-3">
                <div class="w-full md:w-40 font-bold text-green-900 md:text-left mb-1">Palavras-chave:</div>
                <div class="flex-1 md:text-left">
                    <template v-if="editingId === c.id">
                        <textarea v-model="editRow.palavrasChave" class="border rounded px-2 py-1 w-full"
                            rows="3"></textarea>
                    </template>
                    <template v-else>
                        <div class="flex flex-wrap gap-2 md:justify-start">
                            <span v-for="(palavra, idx) in c.palavrasChave.split(',')" :key="palavra"
                                :class="['px-3 py-1 rounded-full text-xs font-semibold', tagColors[idx % tagColors.length]]"
                                v-html="destacar(palavra.trim())" />
                        </div>
                    </template>
                </div>
            </div>
            <!-- Descrição -->
            <div class="flex flex-col md:flex-row md:items-start">
                <div class="w-full md:w-40 font-bold text-green-900 md:text-left">Descrição:</div>
                <div class="flex-1 md:text-left">
                    <template v-if="editingId === c.id">
                        <textarea v-model="editRow.descricao" class="border rounded px-2 py-1 w-full"
                            rows="6"></textarea>
                    </template>
                    <template v-else>
                        <span v-html="destacar(c.descricao)"></span>
                    </template>
                </div>
            </div>
            <!-- Botões no canto inferior direito -->
            <div class="flex gap-2 mt-auto justify-end items-end pt-4">
                <button class="text-[0.9rem] px-3 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                    v-if="editingId !== c.id" @click="startEdit(c)">
                    Editar
                </button>
                <button class="text-[0.9rem] px-3 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                    v-else @click="saveEdit(c)">
                    Salvar
                </button>
                <button class="text-[0.9rem] px-3 py-2 rounded bg-red-700 text-white font-bold hover:bg-red-800"
                    @click="deleteRow(c)">
                    Apagar
                </button>
            </div>
        </div>
    </div>
</template>