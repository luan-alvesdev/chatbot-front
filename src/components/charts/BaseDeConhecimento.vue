<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Dados mockados
type MicroTema = {
    id: number
    nome: string
    descricao: string
    palavrasChave: string[]
    foiUtil: number
}
type MacroTema = {
    id: number
    macroTema: string
    microTemas: MicroTema[]
}

const baseConhecimento = ref<MacroTema[]>([
    {
        id: 1,
        macroTema: "Cartão",
        microTemas: [
            {
                id: 101,
                nome: "Bloqueios",
                descricao: "Informações relacionadas a bloqueios de cartão, como causas, prazos e desbloqueios.",
                palavrasChave: ["bloqueio", "cartão", "desbloqueio", "limite", "senha"],
                foiUtil: 0
            },
            {
                id: 102,
                nome: "Empréstimo Pessoal",
                descricao: "Condições, taxas e simulações de empréstimo pessoal via cartão.",
                palavrasChave: ["empréstimo", "pessoal", "juros", "simulação", "pagamento"],
                foiUtil: 0
            },
            {
                id: 103,
                nome: "Data Base",
                descricao: "Data base para cálculo de fatura, fechamento e vencimento do cartão.",
                palavrasChave: ["data", "vencimento", "fechamento", "cartão", "fatura"],
                foiUtil: 0
            }
        ]
    },
    {
        id: 2,
        macroTema: "SAC/Chamados",
        microTemas: [
            {
                id: 201,
                nome: "Abertura de Chamado",
                descricao: "Procedimentos para abrir um chamado no SAC para diversas finalidades.",
                palavrasChave: ["chamado", "sac", "abrir", "atendimento", "protocolo"],
                foiUtil: 0
            },
            {
                id: 202,
                nome: "Acompanhamento de Chamado",
                descricao: "Como verificar o andamento de um chamado já aberto pelo cliente.",
                palavrasChave: ["acompanhamento", "chamado", "status", "resposta", "prazo"],
                foiUtil: 0
            },
            {
                id: 203,
                nome: "Encerramento de Chamado",
                descricao: "Informações sobre prazos e motivos para encerramento de chamados.",
                palavrasChave: ["encerramento", "chamado", "sac", "resolvido", "atendimento"],
                foiUtil: 0
            }
        ]
    },
    {
        id: 3,
        macroTema: "E-commerce",
        microTemas: [
            {
                id: 301,
                nome: "Trocas e devoluções",
                descricao: `Conforme o Código de Defesa do Consumidor (CDC), o prazo para solicitar a troca ou devolução de um pedido feito online é de até 7 dias corridos a partir da data de entrega ou retirada. O cliente deve garantir que o produto esteja com todos os itens originais, sem sinais de uso. Em caso de erro ou avaria no produto, um chamado poderá ser aberto para E-commerce > Entrega ou Cancelamento.`,
                palavrasChave: ["troca", "devolução", "cancelamento", "CDC", "pedido"],
                foiUtil: 23
            },
            {
                id: 302,
                nome: "Formas de pagamento",
                descricao: `Aceitamos diversos métodos: cartões Elo, MasterCard, Visa, PIX, boleto, entre outros. Também há a opção de financiamento BB Realize diretamente pelo app do Banco do Brasil.`,
                palavrasChave: ["pagamento", "cartão", "boleto", "pix", "financiamento"],
                foiUtil: 8
            },
            {
                id: 303,
                nome: "Programa Palavra",
                descricao: `Caso a entrega atrase, o cliente é indenizado com o valor pago. A solicitação deve ser feita via site ou loja física, conforme o canal da compra. O prazo de análise é de até 7 dias úteis.`,
                palavrasChave: ["indenização", "entrega", "promessa", "palavra", "atraso"],
                foiUtil: 29
            },
            {
                id: 304,
                nome: "Identificação Positiva",
                descricao: `Para validar a titularidade, solicitamos CPF, nome completo e forma de pagamento. Se necessário, o titular pode autorizar outra pessoa ou realizar a solicitação diretamente.`,
                palavrasChave: ["identificação", "titularidade", "cpf", "segurança", "validação"],
                foiUtil: 12
            }
        ]
    }
])

const macroTemaSelecionado = ref<string>('')
const filtro = ref('')

// Edição
const editingId = ref<number | null>(null)
const editRow = ref<Omit<MicroTema, 'id' | 'foiUtil'>>({ nome: '', descricao: '', palavrasChave: [] })

// Popups
const popUpEdicao = ref(false)
const popUpExclusao = ref(false)
const nomeEditado = ref('')
const nomeExcluido = ref('')

// Cores pré-definidas para as tags
const tagColors = [
    'bg-red-200 text-red-800',
    'bg-green-200 text-green-800',
    'bg-blue-200 text-blue-800',
    'bg-yellow-200 text-yellow-800',
    'bg-purple-200 text-purple-800',
]

// Computed para microTemas filtrados
const microTemasFiltrados = computed(() => {
    if (!macroTemaSelecionado.value) return []
    const macro = baseConhecimento.value.find(m => m.macroTema === macroTemaSelecionado.value)
    if (!macro) return []
    if (!filtro.value) return macro.microTemas
    const f = filtro.value.toLowerCase()
    return macro.microTemas.filter(mt =>
        mt.nome.toLowerCase().includes(f) ||
        mt.descricao.toLowerCase().includes(f) ||
        mt.palavrasChave.some(p => p.toLowerCase().includes(f))
    )
})

// Função para destacar filtro
function destacar(text: string) {
    if (!filtro.value) return text
    const escaped = filtro.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')
    return text.replace(regex, '<b>$1</b>')
}


const editingMacroTema = ref(false)
const macroTemaEditado = ref('')

// Quando selecionar um macrotema, atualiza o campo de edição
watch(macroTemaSelecionado, (novo) => {
    macroTemaEditado.value = novo
    editingMacroTema.value = false
})

// Iniciar edição do macrotema
function startEditMacroTema() {
    editingMacroTema.value = true
    macroTemaEditado.value = macroTemaSelecionado.value
}

// Salvar edição do macrotema (apenas na tela)
function saveEditMacroTema() {
    if (!macroTemaEditado.value.trim()) return
    // Atualiza o nome no array baseConhecimento
    const macro = baseConhecimento.value.find(m => m.macroTema === macroTemaSelecionado.value)
    if (macro) {
        macro.macroTema = macroTemaEditado.value
        macroTemaSelecionado.value = macroTemaEditado.value
        nomeEditado.value = macroTemaEditado.value
        popUpEdicao.value = true
        setTimeout(() => {
            popUpEdicao.value = false
            nomeEditado.value = ''
        }, 2000)
    }
    editingMacroTema.value = false
}


// Editar microtema
function startEdit(row: MicroTema) {
    editingId.value = row.id
    editRow.value = { nome: row.nome, descricao: row.descricao, palavrasChave: [...row.palavrasChave] }
}

// deletar macrotema

const showDeleteMacroPopup = ref(false) // Popup perguntando para prosseguir com exclusão macrotema 
const popUpMacroExcluido = ref(false) // Popup confirmação de exclusão para macrotema 

function askDeleteMacroTema() {
    showDeleteMacroPopup.value = true
}

function confirmDeleteMacroTema() {
    const idx = baseConhecimento.value.findIndex(m => m.macroTema === macroTemaSelecionado.value)
    if (idx !== -1) {
        baseConhecimento.value.splice(idx, 1)
        macroTemaSelecionado.value = ''
        macroTemaEditado.value = ''
        popUpMacroExcluido.value = true
        setTimeout(() => {
            popUpMacroExcluido.value = false
        }, 2000)
    }
    showDeleteMacroPopup.value = false
}

function cancelDeleteMacroTema() {
    showDeleteMacroPopup.value = false
}

//editar microtema

function saveEdit(row: MicroTema) {
    row.nome = editRow.value.nome
    row.descricao = editRow.value.descricao
    row.palavrasChave = Array.isArray(editRow.value.palavrasChave)
        ? editRow.value.palavrasChave
        : (editRow.value.palavrasChave as unknown as string).split(',').map((p: string) => p.trim())
    editingId.value = null
    nomeEditado.value = row.nome
    popUpEdicao.value = true
    setTimeout(() => {
        popUpEdicao.value = false
        nomeEditado.value = ''
    }, 2000)
}

function deleteRow(row: MicroTema) {
    const macro = baseConhecimento.value.find(m => m.macroTema === macroTemaSelecionado.value)
    if (!macro) return
    const idx = macro.microTemas.findIndex(mt => mt.id === row.id)
    if (idx !== -1) {
        nomeExcluido.value = row.nome
        macro.microTemas.splice(idx, 1)
        popUpExclusao.value = true
        setTimeout(() => {
            popUpExclusao.value = false
            nomeExcluido.value = ''
        }, 2000)
    }
}

// Controle do formulário de adicionar microtema
const showAddMicrotemaForm = ref(false)
const novoMicrotema = ref({
    nome: '',
    palavrasChave: '',
    descricao: ''
})

// Gera um novo ID incremental para microtema
function getNextMicrotemaId() {
    const macro = baseConhecimento.value.find(m => m.macroTema === macroTemaSelecionado.value)
    if (!macro || macro.microTemas.length === 0) return 1
    return Math.max(...macro.microTemas.map(mt => mt.id)) + 1
}
const popUpNovoMicrotema = ref(false) // Popup confirmando adição de novo microtema

// Função para adicionar novo microtema

function adicionarNovoMicrotema() {
    const macro = baseConhecimento.value.find(m => m.macroTema === macroTemaSelecionado.value)
    if (!macro) return

    // Limita a 5 palavras-chave
    const palavras = novoMicrotema.value.palavrasChave
        .split(',')
        .map(p => p.trim())
        .filter(p => p)
        .slice(0, 5)

    macro.microTemas.push({
        id: getNextMicrotemaId(),
        nome: novoMicrotema.value.nome,
        descricao: novoMicrotema.value.descricao,
        palavrasChave: palavras,
        foiUtil: 0
    })

    // Limpa e fecha o formulário
    novoMicrotema.value = { nome: '', palavrasChave: '', descricao: '' }
    showAddMicrotemaForm.value = false

    // Mostra popup de sucesso
    popUpNovoMicrotema.value = true
    setTimeout(() => {
        popUpNovoMicrotema.value = false
    }, 2000)
}

</script>

<template>
    <div class="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-10 mt-8 mb-8">
        <h1 class="text-2xl font-extrabold mb-6 text-green-700 text-center tracking-tight">
            Biblioteca de conhecimento
        </h1>

        <!-- Select MacroTema -->
        <div class="mb-6 flex gap-3 items-center">
            <label for="macro-tema-select" class="font-bold text-green-900">Selecione macrotema:</label>
            <select id="macro-tema-select" v-model="macroTemaSelecionado"
                class="border rounded px-3 py-2 min-w-[200px]">
                <option value="">Selecione um macrotema</option>
                <option v-for="tema in baseConhecimento" :key="tema.id" :value="tema.macroTema">
                    {{ tema.macroTema }}
                </option>
            </select>
        </div>

        <!-- Nome do macrotema selecionado + editar -->
        <div v-if="macroTemaSelecionado" class="flex items-center justify-between mb-4">
            <div class="text-xl font-bold text-green-900">
                <template v-if="editingMacroTema">
                    <input v-model="macroTemaEditado" class="border rounded px-2 py-1 w-[300px]" />
                </template>
                <template v-else>
                    {{ macroTemaSelecionado }}
                </template>
            </div>
            <div class="flex gap-2">
                <button v-if="!editingMacroTema"
                    class="px-4 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                    @click="startEditMacroTema">
                    Editar
                </button>
                <button v-else class="px-4 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                    @click="saveEditMacroTema">
                    Salvar
                </button>
                <button class="px-4 py-2 rounded bg-red-700 text-white font-bold hover:bg-red-800"
                    @click="askDeleteMacroTema">
                    Excluir
                </button>
            </div>
        </div>
        <!-- Àrea de popups -->
        <!-- Popup perguntando sobre exclusão de macrotema -->
        <div v-if="showDeleteMacroPopup"
            class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-lg rounded-lg p-8 z-50 flex flex-col items-center">
            <div class="text-lg font-bold text-red-700 mb-4 text-center">
                Ao excluir esse macrotema, todas as informações de microtema contidas nele também serão
                excluídas.<br>Deseja
                continuar?
            </div>
            <div class="flex gap-4 mt-2">
                <button class="px-6 py-2 rounded bg-red-700 text-white font-bold hover:bg-red-800"
                    @click="confirmDeleteMacroTema">
                    Sim
                </button>
                <button class="px-6 py-2 rounded bg-gray-300 text-gray-800 font-bold hover:bg-gray-400"
                    @click="cancelDeleteMacroTema">
                    Não
                </button>
            </div>
        </div>

        <!-- Popups de atualização de nome de macrotema -->
        <div v-if="popUpEdicao"
            class="fixed top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-10 py-4 min-w-[350px] max-w-[90vw] rounded shadow-lg z-50 transition">
            "{{ nomeEditado }}" foi atualizado com sucesso.
        </div>
        <div v-if="popUpExclusao"
            class="fixed top-28 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-10 py-4 min-w-[350px] max-w-[90vw] rounded shadow-lg z-50 transition">
            "{{ nomeExcluido }}" foi apagado com sucesso.
        </div>

        <!-- Popup de macrotema excluído com sucesso -->
        <div v-if="popUpMacroExcluido"
            class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-10 py-4 min-w-[350px] max-w-[90vw] rounded shadow-lg z-50 transition">
            Tema excluído com sucesso.
        </div>

        <!-- Popup confirmando adição de novo microtema -->
        <div v-if="popUpNovoMicrotema"
            class="fixed top-36 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-10 py-4 min-w-[350px] max-w-[90vw] rounded shadow-lg z-50 transition">
            Novo microtema adicionado
        </div>

        <!-- Filtro -->
        <div class="mb-6 flex gap-3">
            <input v-model="filtro" type="text" class="border rounded px-3 py-2 flex-1"
                placeholder="Digite aqui para pesquisar" />
        </div>

        <!-- Botão de adicionar microtema -->
        <div class="mb-4 flex items-center">
            <button
                class="flex items-center gap-2 px-4 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                @click="showAddMicrotemaForm = !showAddMicrotemaForm" v-if="macroTemaSelecionado">
                <span class="text-xl font-bold">+</span>
                <span>Adicionar novo microtema</span>
            </button>
        </div>

        <div v-if="showAddMicrotemaForm && macroTemaSelecionado"
            class="mb-8 p-6 border border-green-300 rounded-xl bg-green-50 shadow flex flex-col gap-4 max-w-2xl mx-auto">
            <div>
                <label class="block font-bold text-green-900 mb-1">Microtema:</label>
                <input v-model="novoMicrotema.nome" type="text" class="border rounded px-3 py-2 w-full" />
            </div>
            <div>
                <label class="block font-bold text-green-900 mb-1">Palavras-chave (até 5, separadas por
                    vírgula):</label>
                <input v-model="novoMicrotema.palavrasChave" type="text" class="border rounded px-3 py-2 w-full" />
            </div>
            <div>
                <label class="block font-bold text-green-900 mb-1">Descrição:</label>
                <input v-model="novoMicrotema.descricao" type="text" class="border rounded px-3 py-2 w-full" />
            </div>
            <div class="flex flex-col md:flex-row md:items-center gap-4 justify-end">
                <button class="px-6 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                    @click="adicionarNovoMicrotema" :disabled="!novoMicrotema.nome || !novoMicrotema.descricao">
                    Adicionar novo microtema
                </button>
                <div class="flex flex-col">
                    <label class="font-bold text-green-900 mb-1 text-sm md:text-right">
                        Gerar novo microtema através de documento com IA QQ-Tech. 🤖
                    </label>
                    <input type="file" class="border rounded px-3 py-2 w-full" />
                </div>
            </div>
        </div>

        <!-- Cards de microTemas -->
        <div v-if="macroTemaSelecionado" class="grid gap-6">
            <div v-for="c in microTemasFiltrados" :key="c.id"
                class="relative border-2 border-green-900 rounded-xl p-6 bg-white shadow flex flex-col h-full transition hover:shadow-2xl">
                <!-- Nome -->
                <div class="flex flex-col md:flex-row md:items-start mb-3">
                    <div class="w-full md:w-40 font-bold text-green-900 md:text-left">Microtema:</div>
                    <div class="flex-1 font-bold md:text-left">
                        <template v-if="editingId === c.id">
                            <input v-model="editRow.nome" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            <span class="font-bold" v-html="destacar(c.nome)"></span>
                        </template>
                    </div>
                </div>
                <!-- Palavras-chave -->
                <div class="flex flex-col md:flex-row md:items-start mb-3">
                    <div class="w-full md:w-40 font-bold text-green-900 md:text-left mb-1">Palavras-chave:</div>
                    <div class="flex-1 md:text-left">
                        <template v-if="editingId === c.id">
                            <input v-model="editRow.palavrasChave" class="border rounded px-2 py-1 w-full"
                                placeholder="Separe por vírgula" />
                        </template>
                        <template v-else>
                            <div class="flex flex-wrap gap-2 md:justify-start">
                                <span v-for="(palavra, idx) in c.palavrasChave" :key="palavra"
                                    :class="['px-3 py-1 rounded-full text-xs font-semibold', tagColors[idx % tagColors.length]]"
                                    v-html="destacar(palavra)" />
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
                                rows="4"></textarea>
                        </template>
                        <template v-else>
                            <span v-html="destacar(c.descricao)"></span>
                        </template>
                    </div>
                </div>
                <!-- Botões -->
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
    </div>
</template>