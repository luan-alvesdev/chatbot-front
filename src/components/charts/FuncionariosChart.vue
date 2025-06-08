<script setup lang="ts">
import { ref } from 'vue'

type Funcionario = {
    id: number
    cargo: string
    nome: string
    cpf: string
    email: string
    senha: string
    pendente?: boolean
}

defineProps<{ data: Funcionario[] }>()
const emit = defineEmits<{
    (e: 'aprovar', id: number): void
    (e: 'reprovar', id: number): void
    (e: 'update', funcionario: Funcionario): void
}>()

const editingId = ref<number | null>(null)
const editRow = ref<Omit<Funcionario, 'id' | 'pendente'>>({
    cargo: '',
    nome: '',
    cpf: '',
    email: '',
    senha: ''
})

function startEdit(row: Funcionario) {
    editingId.value = row.id
    editRow.value = {
        cargo: row.cargo,
        nome: row.nome,
        cpf: row.cpf,
        email: row.email,
        senha: row.senha
    }
}
function saveEdit(row: Funcionario) {
    emit('update', { ...row, ...editRow.value })
    editingId.value = null
}
</script>
<template>
    <h1 class="text-xl font-bold mb-2 text-green-700">Funcionários</h1>
    <div class="overflow-x-auto">
        <table class="min-w-full mt-4 border rounded text-center">
            <thead>
                <tr class="bg-gray-100">
                    <th class="px-4 py-2 font-bold">ID</th>
                    <th class="px-4 py-2 font-bold">Cargo</th>
                    <th class="px-4 py-2 font-bold">Nome</th>
                    <th class="px-4 py-2 font-bold">CPF</th>
                    <th class="px-4 py-2 font-bold">E-mail</th>
                    <th class="px-4 py-2 font-bold">Senha</th>
                    <th class="px-4 py-2 font-bold">Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="c in data" :key="c.id" :class="['border-t', c.pendente ? 'bg-red-100' : '']">
                    <td class="px-4 py-2">{{ c.id }}</td>
                    <td class="px-4 py-2">
                        <template v-if="editingId === c.id && !c.pendente">
                            <input v-model="editRow.cargo" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            {{ c.cargo }}
                        </template>
                    </td>
                    <td class="px-4 py-2">
                        <template v-if="editingId === c.id && !c.pendente">
                            <input v-model="editRow.nome" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            {{ c.nome }}
                        </template>
                    </td>
                    <td class="px-4 py-2">
                        <template v-if="editingId === c.id && !c.pendente">
                            <input v-model="editRow.cpf" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            {{ c.cpf }}
                        </template>
                    </td>
                    <td class="px-4 py-2">
                        <template v-if="editingId === c.id && !c.pendente">
                            <input v-model="editRow.email" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            {{ c.email }}
                        </template>
                    </td>
                    <td class="px-4 py-2">
                        <template v-if="editingId === c.id && !c.pendente">
                            <input v-model="editRow.senha" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            {{ c.senha }}
                        </template>
                    </td>
                    <td class="px-4 py-2 flex items-center justify-center gap-2">
                        <template v-if="c.pendente">
                            <button @click="emit('aprovar', c.id)" title="Aprovar">
                                <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Aprovar"
                                    class="w-6 h-6" />
                            </button>
                            <button @click="emit('reprovar', c.id)" title="Reprovar">
                                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" alt="Reprovar"
                                    class="w-6 h-6" />
                            </button>
                        </template>
                        <template v-else>
                            <button v-if="editingId !== c.id" @click="startEdit(c)" title="Editar">
                                <img src="https://cdn-icons-png.flaticon.com/512/84/84380.png" alt="Editar"
                                    class="w-6 h-6 inline" />
                            </button>
                            <button v-else @click="saveEdit(c)" title="Salvar">
                                <img src="https://cdn-icons-png.flaticon.com/512/11251/11251859.png" alt="Salvar"
                                    class="w-6 h-6 inline" />
                            </button>
                            <!-- Ícone de X para remover funcionário não pendente -->
                            <button @click="emit('reprovar', c.id)" title="Remover" class="ml-2">
                                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" alt="Remover"
                                    class="w-6 h-6" />
                            </button>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped></style>