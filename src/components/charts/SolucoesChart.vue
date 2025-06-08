<script setup lang="ts">
import { ref } from 'vue'
import SolucoesChartsGraph from './SolucoesChartsGraph.vue'

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
    // Aqui adicionar à lista
    // Limpa o formulário e fecha
    novaSolucao.value = { titulo: '', descricao: '', palavrasChave: '' }
    mostrarForm.value = false
}

type Solucao = { id: number; titulo: string; descricao: string; palavrasChave: string; foiUtil: number; naoFoiUtil: number }

const props = defineProps<{ data: Solucao[] }>()

// Estado de edição por linha (id)
const editingId = ref<number | null>(null)
// Cópia dos dados editáveis temporários
const editRow = ref<Omit<Solucao, 'id'>>({ titulo: '', descricao: '', palavrasChave: '', foiUtil: 0, naoFoiUtil: 0 })

function startEdit(row: Solucao) {
    editingId.value = row.id
    editRow.value = { ...row }
}
function saveEdit(row: Solucao) {
    // Atualiza os dados mockados (apenas local, não persiste)
    row.titulo = editRow.value.titulo
    row.descricao = editRow.value.descricao
    row.palavrasChave = editRow.value.palavrasChave
    row.foiUtil = editRow.value.foiUtil
    row.naoFoiUtil = editRow.value.naoFoiUtil
    editingId.value = null
}
// function deleteRow(row: Solucao) {
//     emit('delete', row.id)
// }
</script>
<template>
    <h1 class="text-xl font-bold mb-6 text-green-700">Soluções</h1>
    <div class="flex justify-between items-center lg:mx-10 mb-4">
        <button class="bg-green-700 text-white px-4 py-2 rounded font-semibold hover:bg-green-800 transition"
            @click="abrirFormulario">
            Adicionar solução
        </button>
        <SolucoesChartsGraph :data="props.data" />
    </div>
    <!-- Formulário para nova solução -->
    <div v-if="mostrarForm" class="mb-6 p-4 border rounded bg-gray-50">
        <div class="mb-3">
            <label class="block font-medium text-green-700 mb-1">Tema:</label>
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
        <button class="bg-green-700 text-white px-4 py-2 rounded font-semibold hover:bg-green-800 transition"
            @click="enviarSolucao">
            Enviar
        </button>
    </div>
    <div class="overflow-x-auto">
        <table class="min-w-full mt-4 border rounded text-center">
            <thead>
                <tr class="bg-gray-100 border-4 border-green-900">
                    <th class="px-6 py-2 font-bold"></th>
                    <th class="px-6 py-2 font-bold">Tema</th>
                    <th class="px-6 py-2 font-bold">Descrição</th>
                    <th class="px-6 py-2 font-bold">Palavras-chave</th>
                    <th class="px-6 py-2 font-bold">Foi útil</th>
                    <th class="px-6 py-2 font-bold">Não foi útil</th>
                    <th class="px-6 py-2 font-bold">Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="c in props.data" :key="c.id" class="border-t-4 border-green-900">
                    <td class="px-6 py-2 border-x border-green-900"></td>
                    <td class="px-6 py-2 font-medium border-x border-green-900">
                        <template v-if="editingId === c.id">
                            <input v-model="editRow.titulo" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            {{ c.titulo }}
                        </template>
                    </td>
                    <td class="px-6 text-left py-2 border-x border-green-900">
                        <template v-if="editingId === c.id">
                            <textarea v-model="editRow.descricao" class="border rounded px-2 py-1 w-full"
                                rows="2"></textarea>
                        </template>
                        <template v-else>
                            <span v-html="c.descricao"></span>
                        </template>
                    </td>
                    <td class="px-6 text-left py-2 border-x border-green-900">
                        <template v-if="editingId === c.id">
                            <textarea v-model="editRow.palavrasChave" class="border rounded px-2 py-1 w-full"
                                rows="2"></textarea>
                        </template>
                        <template v-else>
                            <span v-html="c.palavrasChave"></span>
                        </template>
                    </td>
                    <td class="px-6 py-2 border-x border-green-900">
                        {{ c.foiUtil }}
                    </td>
                    <td class="px-6 py-2 border-x border-green-900">
                        {{ c.naoFoiUtil }}
                    </td>
                    <td class="px-2 py-2 border-x border-green-900">
                        <button v-if="editingId !== c.id" @click="startEdit(c)">
                            <img src="https://cdn-icons-png.flaticon.com/512/84/84380.png" alt="Editar"
                                class="w-6 h-6 inline" />
                        </button>
                        <button v-else @click="saveEdit(c)">
                            <img src="https://cdn-icons-png.flaticon.com/512/11251/11251859.png" alt="Salvar"
                                class="w-6 h-6 inline" style="filter: hue-rotate(120deg);" />
                        </button>
                        <button class="ml-2">
                            <!-- inserir função para deletar aqui -->
                            <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Apagar"
                                class="w-6 h-6 inline" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>