<script setup lang="ts">
import { ref, computed } from 'vue'

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

// Array Duvidas conforme solicitado
const Duvidas: MacroTema[] = [
    {
        id: 1,
        macroTema: "Cartão",
        microTemas: [
            {
                id: 101,
                nome: "Bloqueios",
                descricao: "Cliente não entendeu por que meu cartão foi bloqueado. Onde consigo ver o motivo e como posso desbloqueá-lo?",
                palavrasChave: ["bloqueio", "cartão", "desbloqueio", "limite", "senha"],
                foiUtil: 0
            },
            {
                id: 102,
                nome: "Empréstimo Pessoal",
                descricao: "Cliente quer contratar um empréstimo pessoal, mas não ficou claro quais são os juros e se pode simular antes de confirmar.",
                palavrasChave: ["empréstimo", "pessoal", "juros", "simulação", "pagamento"],
                foiUtil: 0
            },
            {
                id: 103,
                nome: "Data Base",
                descricao: "Cliente não sabe exatamente o que é a data base do cartão e como ela afeta o vencimento ou fechamento da fatura.",
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
                descricao: "Cliente precisa abrir um chamado no SAC, mas não encontrou onde ou como fazer isso corretamente.",
                palavrasChave: ["chamado", "sac", "abrir", "atendimento", "protocolo"],
                foiUtil: 0
            },
            {
                id: 202,
                nome: "Acompanhamento de Chamado",
                descricao: "Cliente abriu um chamado, mas não sabe como acompanhar o status ou se já foi respondido.",
                palavrasChave: ["acompanhamento", "chamado", "status", "resposta", "prazo"],
                foiUtil: 0
            },
            {
                id: 203,
                nome: "Encerramento de Chamado",
                descricao: "Cliente relatou que o chamado foi encerrado sem ele entender o motivo ou se houve alguma solução.",
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
                descricao: "Cliente fez uma compra online e quer trocar, mas não sabe como iniciar o processo ou se ainda está no prazo.",
                palavrasChave: ["troca", "devolução", "cancelamento", "CDC", "pedido"],
                foiUtil: 0
            },
            {
                id: 302,
                nome: "Formas de pagamento",
                descricao: "Cliente tem dúvidas sobre quais formas de pagamento pode usar na loja online e se há diferença para a loja física.",
                palavrasChave: ["pagamento", "cartão", "boleto", "pix", "financiamento"],
                foiUtil: 0
            },
            {
                id: 303,
                nome: "Programa Palavra",
                descricao: "Cliente relata que entrega atrasou, mas não sabe se pode pedir a indenização do Programa Palavra nem como fazer isso.",
                palavrasChave: ["indenização", "entrega", "promessa", "palavra", "atraso"],
                foiUtil: 0
            },
            {
                id: 304,
                nome: "Identificação Positiva",
                descricao: "Cliente relata que durante a compra, pediram vários dados para confirmação. Isso é obrigatório? Como funciona esse processo?",
                palavrasChave: ["identificação", "titularidade", "cpf", "segurança", "validação"],
                foiUtil: 0
            }
        ]
    }
]

const filtro = ref('')

const tagColors = [
    'bg-red-200 text-red-800',
    'bg-green-200 text-green-800',
    'bg-blue-200 text-blue-800',
    'bg-yellow-200 text-yellow-800',
    'bg-purple-200 text-purple-800',
]

// Computed para filtrar microtemas por filtro
const macroTemasFiltrados = computed(() => {
    if (!filtro.value) return Duvidas
    const f = filtro.value.toLowerCase()
    return Duvidas
        .map(macro => ({
            ...macro,
            microTemas: macro.microTemas.filter(mt =>
                mt.nome.toLowerCase().includes(f) ||
                mt.descricao.toLowerCase().includes(f) ||
                mt.palavrasChave.some((p: string) => p.toLowerCase().includes(f))
            )
        }))
        .filter(macro => macro.microTemas.length > 0)
})

// Função para destacar filtro
function destacar(text: string) {
    if (!filtro.value) return text
    const escaped = filtro.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')
    return text.replace(regex, '<b>$1</b>')
}

// Controle de edição do macrotema
const editingMacroId = ref<number | null>(null)
const macroTemaEditado = ref('')
const popUpEdicaoMacro = ref(false)
const nomeEditadoMacro = ref('')

// Função para iniciar edição
function startEditMacroTema(macro: MacroTema) {
    editingMacroId.value = macro.id
    macroTemaEditado.value = macro.macroTema
}

// Função para salvar edição
function saveEditMacroTema(macro: MacroTema) {
    if (!macroTemaEditado.value.trim()) return
    macro.macroTema = macroTemaEditado.value
    nomeEditadoMacro.value = macroTemaEditado.value
    editingMacroId.value = null
    popUpEdicaoMacro.value = true
    setTimeout(() => {
        popUpEdicaoMacro.value = false
        nomeEditadoMacro.value = ''
    }, 2000)
}


// Popups para microtema
const editingId = ref<number | null>(null)
const editRow = ref<Omit<MicroTema, 'id' | 'foiUtil'>>({ nome: '', descricao: '', palavrasChave: [] })
const popUpEdicaoMicro = ref(false)
const popUpExclusaoMicro = ref(false)
const popUpIncluido = ref(false)
const nomeEditadoMicro = ref('')
const nomeExcluidoMicro = ref('')
const nomeIncluidoMicro = ref('')
const macroIncluido = ref('')
// Novo: macrotema selecionado para edição de microtema
const macroTemaSelecionadoParaEdicao = ref<number | null>(null)

// Editar microtema
function startEditMicro(row: MicroTema, macro: MacroTema) {
    editingId.value = row.id
    editRow.value = { nome: row.nome, descricao: row.descricao, palavrasChave: [...row.palavrasChave] }
    macroTemaSelecionadoParaEdicao.value = macro.id
}

function saveEditMicro(row: MicroTema, macro: MacroTema) {
    // Atualiza dados do microtema
    row.nome = editRow.value.nome
    row.descricao = editRow.value.descricao
    row.palavrasChave = Array.isArray(editRow.value.palavrasChave)
        ? editRow.value.palavrasChave
        : (editRow.value.palavrasChave as unknown as string).split(',').map((p: string) => p.trim())

    // Se mudou de macrotema, move o microtema para o novo macrotema
    if (macroTemaSelecionadoParaEdicao.value !== macro.id) {
        const novoMacro = Duvidas.find(m => m.id === macroTemaSelecionadoParaEdicao.value)
        if (novoMacro) {
            // Remove do macrotema atual
            const idx = macro.microTemas.findIndex(mt => mt.id === row.id)
            if (idx !== -1) {
                macro.microTemas.splice(idx, 1)
                // Adiciona ao novo macrotema
                novoMacro.microTemas.push(row)
            }
        }
    }

    editingId.value = null
    macroTemaSelecionadoParaEdicao.value = null
    nomeEditadoMicro.value = row.nome
    popUpEdicaoMicro.value = true
    setTimeout(() => {
        popUpEdicaoMicro.value = false
        nomeEditadoMicro.value = ''
    }, 2000)
}

// Excluir microtema
const showDeleteMicroPopup = ref<number | null>(null)
function askDeleteMicroTema(id: number) {
    showDeleteMicroPopup.value = id

}
function confirmDeleteMicroTema(macro: MacroTema, row: MicroTema) {
    const idx = macro.microTemas.findIndex(mt => mt.id === row.id)
    if (idx !== -1) {
        nomeExcluidoMicro.value = row.nome
        macro.microTemas.splice(idx, 1)
        popUpExclusaoMicro.value = true
        setTimeout(() => {
            popUpExclusaoMicro.value = false
            nomeExcluidoMicro.value = ''
        }, 2000)
    }
    showDeleteMicroPopup.value = null
}
function cancelDeleteMicroTema() {
    showDeleteMicroPopup.value = null
}

// Incluir microtema na biblioteca (remove do array e mostra popup)
function incluirNaBiblioteca(macro: MacroTema, row: MicroTema) {
    const idx = macro.microTemas.findIndex(mt => mt.id === row.id)
    if (idx !== -1) {
        nomeIncluidoMicro.value = row.nome
        macroIncluido.value = macro.macroTema
        macro.microTemas.splice(idx, 1)
        popUpIncluido.value = true
        setTimeout(() => {
            popUpIncluido.value = false
            nomeIncluidoMicro.value = ''
            macroIncluido.value = ''
        }, 2000)
    }
}

// ÀREA DE FORMULARIO PARA CRIAR NOVOS MACRO/MICROTEMAS
const showNovoMacroForm = ref(false)
const novoMacrotema = ref('')
const microtemasForm = ref([
    { nome: '', palavrasChave: '', descricao: '', arquivo: null }
])
const popUpNovoMacro = ref(false)

// Adiciona novo campo de microtema no formulário
function adicionarCampoMicrotema() {
    microtemasForm.value.push({ nome: '', palavrasChave: '', descricao: '', arquivo: null })
}

// Remove campos de microtema do formulário
function removerCampoMicrotema(idx: number) {
    if (microtemasForm.value.length > 1) microtemasForm.value.splice(idx, 1)
}

// Ao enviar, adiciona ao array (mock) e mostra popup
function enviarNovoMacrotema() {
    if (!novoMacrotema.value.trim() || microtemasForm.value.some(m => !m.nome.trim())) return

    // Adiciona ao array Duvidas (mock, só na tela)
    Duvidas.push({
        id: Math.max(...Duvidas.map(m => m.id)) + 1,
        macroTema: novoMacrotema.value,
        microTemas: microtemasForm.value.map((m, idx) => ({
            id: Date.now() + idx,
            nome: m.nome,
            descricao: m.descricao,
            palavrasChave: m.palavrasChave.split(',').map(p => p.trim()).filter(Boolean).slice(0, 5),
            foiUtil: 0
        }))
    })

    // Limpa formulário e mostra popup
    novoMacrotema.value = ''
    microtemasForm.value = [{ nome: '', palavrasChave: '', descricao: '', arquivo: null }]
    showNovoMacroForm.value = false
    popUpNovoMacro.value = true
    setTimeout(() => popUpNovoMacro.value = false, 2000)
}
</script>

<template>
    <div
        class="w-full max-w-screen-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-10 mt-8 mb-8 overflow-x-hidden">
        <h1 class="text-2xl font-extrabold mb-6 text-green-700 text-center tracking-tight">
            Assuntos não listados na Biblioteca de Conhecimento
        </h1>
        <!-- Filtro -->
        <div class="mb-6 flex gap-3">
            <input v-model="filtro" type="text" class="border rounded px-3 py-2 flex-1"
                placeholder="Digite aqui para pesquisar" />
        </div>
        <!-- Botão para abrir formulário -->
        <div class="mb-6 flex items-center">
            <button
                class="flex items-center gap-2 px-4 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                @click="showNovoMacroForm = !showNovoMacroForm">
                + Criar novo macrotema/microtema
            </button>
        </div>

        <!-- Formulário de novo macrotema/microtema -->
        <div v-if="showNovoMacroForm"
            class="mb-8 p-2 sm:p-6 border border-green-300 rounded-xl bg-green-50 shadow flex flex-col gap-4 max-w-full sm:max-w-2xl mx-auto overflow-x-auto">
            <div>
                <label class="block font-bold text-green-900 mb-1">Macrotema:</label>
                <input v-model="novoMacrotema" type="text" class="border rounded px-3 py-2 w-full" />
            </div>

            <div v-for="(m, idx) in microtemasForm" :key="idx"
                class="border-b border-green-200 pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
                <div class="flex items-center gap-2">
                    <label class="block font-bold text-green-900 mb-1">Microtema:</label>
                    <input v-model="m.nome" type="text" class="border rounded px-3 py-2 flex-1" />
                    <button type="button" class="text-green-700 font-bold px-2 py-1 hover:underline"
                        @click="adicionarCampoMicrotema" v-if="idx === microtemasForm.length - 1">
                        Adicionar + microtema
                    </button>
                    <button type="button" class="text-red-700 font-bold px-2 py-1 hover:underline"
                        @click="removerCampoMicrotema(idx)" v-if="microtemasForm.length > 1">
                        Remover
                    </button>
                </div>
                <div>
                    <label class="block font-bold text-green-900 mb-1">Palavras-chave (até 5, separadas por
                        vírgula):</label>
                    <input v-model="m.palavrasChave" type="text" class="border rounded px-3 py-2 w-full" />
                </div>
                <div>
                    <label class="block font-bold text-green-900 mb-1">Descrição:</label>
                    <input v-model="m.descricao" type="text" class="border rounded px-3 py-2 w-full" />
                </div>
            </div>
            <div>
                <label class="font-bold text-green-900 mb-1 text-sm md:text-right">
                    Gerar novo macrotema através de documento com IA QQ-Tech. 🤖
                </label>
                <input type="file" class="border rounded px-3 py-2 w-full" />
            </div>
            <div class="flex justify-end">
                <button class="px-6 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                    @click="enviarNovoMacrotema" :disabled="!novoMacrotema || microtemasForm.some(m => !m.nome)">
                    Enviar
                </button>
            </div>
        </div>

        <!-- Popups de microtema -->
        <div v-if="popUpEdicaoMicro"
            class="fixed top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-10 py-4 min-w-[350px] max-w-[90vw] rounded shadow-lg z-50 transition">
            "{{ nomeEditadoMicro }}" foi atualizado com sucesso.
        </div>
        <div v-if="popUpExclusaoMicro"
            class="fixed top-28 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-10 py-4 min-w-[350px] max-w-[90vw] rounded shadow-lg z-50 transition">
            "{{ nomeExcluidoMicro }}" foi apagado com sucesso.
        </div>
        <div v-if="popUpIncluido"
            class="fixed top-36 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-10 py-4 min-w-[350px] max-w-[90vw] rounded shadow-lg z-50 transition flex items-center gap-3">
            <span>🎉</span>
            Microtema "{{ nomeIncluidoMicro }}" adicionado no macrotema "{{ macroIncluido }}" com sucesso.
        </div>
        <!-- Popup de sucesso ao adicionar novo macro/microtema -->
        <div v-if="popUpNovoMacro"
            class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-10 py-4 min-w-[350px] max-w-[90vw] rounded shadow-lg z-50 transition">
            Adicionado com sucesso!
        </div>

        <!-- Macrotemas e microtemas -->
        <div v-for="macro in macroTemasFiltrados" :key="macro.id" class="mb-10">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <h2
                    class="text-xl font-bold text-green-900 border-b border-green-200 pb-2 break-words w-full md:w-auto">
                    <template v-if="editingMacroId === macro.id">
                        <input v-model="macroTemaEditado" class="border rounded px-2 py-1 w-full md:w-[300px]" />
                    </template>
                    <template v-else>
                        {{ macro.macroTema }}
                    </template>
                </h2>
                <div>
                    <button v-if="editingMacroId !== macro.id"
                        class="px-4 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800 w-full md:w-auto"
                        @click="startEditMacroTema(macro)">
                        Editar
                    </button>
                    <button v-else
                        class="px-4 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800 w-full md:w-auto"
                        @click="saveEditMacroTema(macro)">
                        Salvar
                    </button>

                </div>
            </div>
            <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                <div v-for="c in macro.microTemas" :key="c.id"
                    class="relative border-2 border-green-900 rounded-xl p-4 sm:p-6 bg-white shadow flex flex-col h-full transition hover:shadow-2xl min-w-0 break-words">
                    <!-- Macrotema -->
                    <div class="font-bold text-green-900 mb-2">
                        Macrotema:
                        <template v-if="editingId === c.id">
                            <select v-model="macroTemaSelecionadoParaEdicao" class="border rounded px-2 py-1 ml-2">
                                <option v-for="m in Duvidas" :key="m.id" :value="m.id">{{ m.macroTema }}</option>
                            </select>
                        </template>
                        <template v-else>
                            <span>{{ macro.macroTema }}</span>
                        </template>
                    </div>
                    <!-- Nome -->
                    <div class="font-bold text-green-900 mb-2">Microtema:
                        <template v-if="editingId === c.id">
                            <input v-model="editRow.nome" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            <span v-html="destacar(c.nome)"></span>
                        </template>
                    </div>
                    <!-- Palavras-chave -->
                    <div class="flex flex-wrap gap-2 mb-2">
                        <template v-if="editingId === c.id">
                            <input v-model="editRow.palavrasChave" class="border rounded px-2 py-1 w-full"
                                placeholder="Separe por vírgula" />
                        </template>
                        <template v-else>
                            <span v-for="(palavra, i) in c.palavrasChave" :key="palavra"
                                :class="['px-3 py-1 rounded-full text-xs font-semibold', tagColors[i % tagColors.length]]"
                                v-html="destacar(palavra)" />
                        </template>
                    </div>
                    <!-- Descrição -->
                    <div class="mb-2">
                        <span class="font-bold text-green-900">Descrição: </span>
                        <template v-if="editingId === c.id">
                            <textarea v-model="editRow.descricao" class="border rounded px-2 py-1 w-full"
                                rows="3"></textarea>
                        </template>
                        <template v-else>
                            <span v-html="destacar(c.descricao)"></span>
                        </template>
                    </div>
                    <!-- Botões -->
                    <div class="flex gap-2 mt-auto justify-end items-end pt-4">
                        <button
                            class="text-[0.9rem] px-3 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                            v-if="editingId !== c.id" @click="startEditMicro(c, macro)">
                            Editar
                        </button>
                        <button
                            class="text-[0.9rem] px-3 py-2 rounded bg-green-700 text-white font-bold hover:bg-green-800"
                            v-else @click="saveEditMicro(c, macro)">
                            Salvar
                        </button>
                        <button class="text-[0.9rem] px-3 py-2 rounded bg-red-700 text-white font-bold hover:bg-red-800"
                            @click="askDeleteMicroTema(c.id)">
                            Excluir
                        </button>
                        <button
                            class="text-[0.9rem] px-3 py-2 rounded bg-blue-700 text-white font-bold hover:bg-blue-800"
                            @click="incluirNaBiblioteca(macro, c)">
                            Incluir na biblioteca
                        </button>
                    </div>
                    <!-- Popup de confirmação de exclusão do microtema -->
                    <div v-if="showDeleteMicroPopup === c.id"
                        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-lg rounded-lg p-8 z-50 flex flex-col items-center">
                        <div class="text-lg font-bold text-red-700 mb-4 text-center">
                            Ao excluir esse microtema, todas as informações dele serão removidas.<br>Deseja continuar?
                        </div>
                        <div class="flex gap-4 mt-2">
                            <button class="px-6 py-2 rounded bg-red-700 text-white font-bold hover:bg-red-800"
                                @click="confirmDeleteMicroTema(macro, c)">
                                Sim
                            </button>
                            <button class="px-6 py-2 rounded bg-gray-300 text-gray-800 font-bold hover:bg-gray-400"
                                @click="cancelDeleteMicroTema">
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>