<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ data: { id: number; descricao: string }[] }>()

type Duvida = { id: number; descricao: string }

// Estado de edição por linha (id)
const editingId = ref<number | null>(null)
// Cópia dos dados editáveis temporários
const editRow = ref<Omit<Duvida, 'id'>>({ descricao: '' })

function startEdit(row: Duvida) {
    editingId.value = row.id
    editRow.value = { ...row }
}
function saveEdit(row: Duvida) {
    // Atualiza os dados mockados (apenas local, não persiste)
    row.descricao = editRow.value.descricao
    editingId.value = null
}

function aprovar() {
    // enviar para lista de funcionarios
}
function deleteRow() {
    // deletar
}
</script>

<template>
    <h1 class="text-xl font-bold mb-2 text-green-700">Duvidas</h1>
    <div class="overflow-x-auto">
        <table class="min-w-full mt-4 border rounded text-center">
            <thead>
                <tr class="bg-gray-100">
                    <th class="px-4 py-2 font-bold">Descrição</th>
                    <th class="px-4 py-2 font-bold">Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="c in props.data" :key="c.id" class="border-t">
                    <td class="px-4 py-2">
                        <template v-if="editingId === c.id">
                            <textarea v-model="editRow.descricao" class="border px-2 py-1 w-full" rows="2" />
                        </template>
                        <template v-else>
                            {{ c.descricao }}
                        </template>
                    </td>
                    <td class="px-2 py-2 border-x flex items-center justify-center gap-1">
                        <button @click="aprovar()" title="Aprovar">
                            <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Aprovar"
                                class="w-6 h-6 inline" />
                        </button>
                        <button v-if="editingId !== c.id" @click="startEdit(c)">
                            <img src="https://cdn-icons-png.flaticon.com/512/84/84380.png" alt="Editar"
                                class="w-6 h-6 inline" />
                        </button>
                        <button v-else @click="saveEdit(c)">
                            <img src="https://cdn-icons-png.flaticon.com/512/11251/11251859.png" alt="Salvar"
                                class="w-6 h-6 inline" style="filter: hue-rotate(120deg);" />
                        </button>
                        <button @click="deleteRow()">
                            <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Apagar"
                                class="w-6 h-6 inline" />
                        </button>
                    </td>
                </tr>
            </tbody>

        </table>
    </div>
</template>