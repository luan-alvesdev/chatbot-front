<script setup lang="ts">
import { computed, ref } from 'vue'

type Duvida = { id: number; titulo: string; descricao: string; palavrasChave: string }

const duvidas = ref<Duvida[]>([
    {
        id: 1,
        titulo: 'Confirmação de identidade',
        descricao: 'Como faço para confirmar minha identidade ao entrar em contato com o suporte?',
        palavrasChave: 'identidade, suporte, segurança, autenticação, atendimento'
    },
    {
        id: 2,
        titulo: 'Orientações sobre reclamação de pedido incorreto',
        descricao: 'Onde posso registrar uma reclamação sobre um pedido que não foi entregue corretamente?',
        palavrasChave: 'reclamação, pedido, entrega, erro, suporte'
    },
    {
        id: 3,
        titulo: 'Prazos e condições para troca de produto',
        descricao: 'Quais são os prazos e condições para solicitar a troca de um produto com defeito?',
        palavrasChave: 'troca, produto, defeito, prazos, condições'
    },
    {
        id: 4,
        titulo: 'Autorização de terceiros',
        descricao: 'Posso autorizar outra pessoa a falar com o suporte em meu nome?',
        palavrasChave: 'autorização, terceiros, suporte, atendimento, representante'
    },
    {
        id: 5,
        titulo: 'Consulta de promoções ativas',
        descricao: 'Como posso saber quais promoções possuem no momento?',
        palavrasChave: 'promoções, ofertas, descontos, atualizações, marketing'
    },
    {
        id: 6,
        titulo: 'Benefícios do Programa Palavra',
        descricao: 'Quais são os benefícios de participar do Programa Palavra?',
        palavrasChave: 'benefícios, programa, fidelidade, recompensas, vantagens'
    }
])


const editingId = ref<number | null>(null)
const editRow = ref<Omit<Duvida, 'id'>>({ titulo: '', descricao: '', palavrasChave: '' })

function startEdit(row: Duvida) {
    editingId.value = row.id
    editRow.value = { ...row }
}

const popUpEdicao = ref(false)
function saveEdit(row: Duvida) {
    row.titulo = editRow.value.titulo
    row.descricao = editRow.value.descricao
    row.palavrasChave = editRow.value.palavrasChave
    editingId.value = null
    popUpEdicao.value = true
    setTimeout(() => {
        popUpEdicao.value = false
    }, 2000)
}

const popUpAprovacao = ref(false)
const nomeAprovado = ref('')

function aprovar(row: Duvida) {
    const idx = duvidas.value.findIndex(d => d.id === row.id)
    if (idx !== -1) {
        nomeAprovado.value = row.titulo
        duvidas.value.splice(idx, 1)
        popUpAprovacao.value = true
        setTimeout(() => {
            popUpAprovacao.value = false
            nomeAprovado.value = ''
        }, 4000)
    }
}

const popUpExclusao = ref(false)
const nomeExcluido = ref('')
function deleteRow(row: Duvida) {
    const idx = duvidas.value.findIndex(d => d.id === row.id)
    if (idx !== -1) {
        nomeExcluido.value = row.titulo
        duvidas.value.splice(idx, 1)
        popUpExclusao.value = true
        setTimeout(() => {
            popUpExclusao.value = false
            nomeExcluido.value = ''
        }, 1500)
    }
}


// Filtro e destaque
const filtro = ref('')
function destacar(text: string) {
    if (!filtro.value) return text
    const escaped = filtro.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')
    return text.replace(regex, '<b>$1</b>')
}
const duvidasFiltradas = computed(() =>
    duvidas.value.filter(d =>
        d.titulo.toLowerCase().includes(filtro.value.toLowerCase()) ||
        d.descricao.toLowerCase().includes(filtro.value.toLowerCase()) ||
        d.palavrasChave.toLowerCase().includes(filtro.value.toLowerCase())
    )
)

const tagColors = [
    'bg-red-200 text-red-800',
    'bg-green-200 text-green-800',
    'bg-blue-200 text-blue-800',
    'bg-yellow-200 text-yellow-800',
    'bg-purple-200 text-purple-800',
]
</script>

<template>
    <div
        class="w-full max-w-screen-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-10 mt-8 mb-8 px-2 sm:px-4">
        <!-- Título centralizado -->
        <h1 class="text-2xl font-extrabold mb-6 text-green-700 text-center tracking-tight">Assuntos não listados</h1>
        <!-- Filtro -->
        <div class="mb-6 flex gap-3">
            <input v-model="filtro" type="text" class="border rounded px-3 py-2 flex-1"
                placeholder="Digite aqui para pesquisar" />
        </div>
        <!-- Grid de dúvidas -->
        <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            <div v-for="c in duvidasFiltradas" :key="c.id"
                class="relative border-2 border-green-900 rounded-xl p-6 bg-white shadow flex flex-col h-full transition hover:shadow-2xl">
                <!-- Tema -->
                <div class="flex items-start mb-3">
                    <div class="w-40 font-bold text-green-900">Tema:</div>
                    <div class="flex-1 font-bold">
                        <template v-if="editingId === c.id">
                            <input v-model="editRow.titulo" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            <span class="font-bold" v-html="destacar(c.titulo)"></span>
                        </template>
                    </div>
                </div>
                <!-- Palavras-chave -->
                <div class="flex items-start mb-3">
                    <div class="w-40 font-bold text-green-900">Palavras-chave:</div>
                    <div class="flex-1">
                        <template v-if="editingId === c.id">
                            <textarea v-model="editRow.palavrasChave" class="border rounded px-2 py-1 w-full"
                                rows="2"></textarea>
                        </template>
                        <template v-else>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="(palavra, idx) in c.palavrasChave.split(',')" :key="palavra"
                                    :class="['px-3 py-1 rounded-full text-xs font-semibold', tagColors[idx % tagColors.length]]"
                                    v-html="destacar(palavra.trim())" />
                            </div>
                        </template>
                    </div>
                </div>
                <!-- Descrição -->
                <div class="flex items-start">
                    <div class="w-40 font-bold text-green-900">Descrição:</div>
                    <div class="flex-1">
                        <template v-if="editingId === c.id">
                            <textarea v-model="editRow.descricao" class="border rounded px-2 py-1 w-full"
                                rows="2"></textarea>
                        </template>
                        <template v-else>
                            <span v-html="destacar(c.descricao)"></span>
                        </template>
                    </div>
                </div>
                <!-- Botões de ação lado direito -->
                <div class="flex gap-2 justify-end pt-4">
                    <button class="text-[0.9rem] px-3 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                        @click="aprovar(c)">
                        Aprovar
                    </button>
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
        <!-- Popups -->
        <div v-if="popUpAprovacao"
            class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 transition">
            Novo assunto adicionado na biblioteca do conhecimento. 💡
        </div>
        <div v-if="popUpExclusao"
            class="fixed top-28 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded shadow-lg z-50 transition">
            Assunto apagado com sucesso.
        </div>
        <div v-if="popUpEdicao"
            class="fixed top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded shadow-lg z-50 transition">
            Assunto atualizado com sucesso.
        </div>
    </div>
</template>