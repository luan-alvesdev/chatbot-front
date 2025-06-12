<script setup lang="ts">
import { computed, ref } from 'vue'

type Funcionario = {
    id: number
    cargo: string
    nome: string
    cpf: string
    email: string
    senha: string
    // senha: string
    pendente?: boolean
}

const funcionarios = ref<Funcionario[]>([
    { id: 1, cargo: 'Admin', nome: 'Carlos Rafael', cpf: '12345678900', email: 'carlos.rafael@email.com', senha: '********' },
    { id: 2, cargo: 'Admin', nome: 'Renata Lima', cpf: '98765432111', email: 'renata.lima@email.com', senha: '*******' },
    { id: 3, cargo: 'Atendimento', nome: 'Marcos Souza', cpf: '45678912322', email: 'marcos.souza@email.com', senha: '*******' },
    { id: 4, cargo: 'Atendimento', nome: 'Juliana Rocha', cpf: '32165498733', email: 'juliana.rocha@email.com', senha: '******' },
    { id: 5, cargo: 'Atendimento', nome: 'Felipe Alves', cpf: '78912345644', email: 'felipe.alves@email.com', senha: '*********' },
    { id: 6, cargo: 'Atendimento', nome: 'Aline Ferreira', cpf: '14725836955', email: 'aline.ferreira@email.com', senha: '******' },
    { id: 7, cargo: 'Atendimento', nome: 'Bruno Martins', cpf: '36925814766', email: 'bruno.martins@email.com', senha: '********' },
    { id: 8, cargo: 'Atendimento', nome: 'Patrícia Gomes', cpf: '25814736977', email: 'patricia.gomes@email.com', senha: '*****' },
    { id: 9, cargo: 'Atendimento', nome: 'Thiago Melo', cpf: '74185296388', email: 'thiago.melo@email.com', senha: '**********' },
    { id: 10, cargo: 'Atendimento', nome: 'Fernanda Costa', cpf: '96385274199', email: 'fernanda.costa@email.com', senha: '******' },
    { id: 11, cargo: 'Atendimento', nome: 'Lucas Andrade', cpf: '65432198700', email: 'lucas.andrade@email.com', senha: '*******' },
    { id: 12, cargo: 'Atendimento', nome: 'Vanessa Teixeira', cpf: '85296374101', email: 'vanessa.teixeira@email.com', senha: '********' }
])

const pendentes = ref<Funcionario[]>([
    { id: 1, cargo: 'Admin', nome: 'Mariana Oliveira', cpf: '12345678900', email: 'carlos.silva@email.com', senha: '********' },
    { id: 2, cargo: 'Atendimento', nome: 'Ana Paula Souza', cpf: '98765432100', email: 'ana.souza@email.com', senha: '********' },
    { id: 3, cargo: 'Atendimento', nome: 'João Pedro Lima', cpf: '45678912300', email: 'joao.lima@email.com', senha: '********' },
    { id: 4, cargo: 'Atendimento', nome: 'Carlos Silva', cpf: '32165498700', email: 'mariana.oliveira@email.com', senha: '********' }])

//criando valores reativos
const dadosFuncionariosComPendentes = computed(() => [
    // Une os arrays de pendentes e funcionarios
    ...pendentes.value.map(f => ({ ...f, pendente: true })),
    ...funcionarios.value.map(f => ({ ...f, pendente: false }))
])

const editingId = ref<number | null>(null)
const editRow = ref<Omit<Funcionario, 'id' | 'pendente'>>({
    cargo: '',
    nome: '',
    cpf: '',
    email: '',
    senha: ''
})

//popup aprovação
const popUpAprovacao = ref(false)
const nomeAprovado = ref('')

function aprovarFuncionario(id: number) {
    const idx = pendentes.value.findIndex(f => f.id === id)
    if (idx !== -1) {
        const aprovado = pendentes.value[idx]
        nomeAprovado.value = aprovado.nome
        // Remove dos pendentes e adiciona aos funcionários
        funcionarios.value.push({ ...aprovado })
        pendentes.value.splice(idx, 1)
        // Exibe pop-up
        popUpAprovacao.value = true
        setTimeout(() => {
            popUpAprovacao.value = false
            nomeAprovado.value = ''
        }, 2000)
    }
}

// popup remoção
const popUpRemocao = ref(false)
const nomeRemovido = ref('')

function removerFuncionario(id: number, pendente: boolean) {
    let nome = ''
    if (pendente) {
        const idx = pendentes.value.findIndex(f => f.id === id)
        if (idx !== -1) {
            nome = pendentes.value[idx].nome
            pendentes.value.splice(idx, 1)
        }
    } else {
        const idx = funcionarios.value.findIndex(f => f.id === id)
        if (idx !== -1) {
            nome = funcionarios.value[idx].nome
            funcionarios.value.splice(idx, 1)
        }
    }
    if (nome) {
        nomeRemovido.value = nome
        popUpRemocao.value = true
        setTimeout(() => {
            popUpRemocao.value = false
            nomeRemovido.value = ''
        }, 2000)
    }
}

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

// ...existing code...
const popUpEdicao = ref(false)

function saveEdit(row: Funcionario) {
    // Atualiza o funcionário no array local
    const idx = funcionarios.value.findIndex(f => f.id === row.id)
    if (idx !== -1) {
        funcionarios.value[idx] = {
            ...funcionarios.value[idx],
            ...editRow.value
        }
    }
    editingId.value = null
    // Exibe pop-up de edição salva
    popUpEdicao.value = true
    setTimeout(() => {
        popUpEdicao.value = false
    }, 2000)
}

</script>
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
        <div class="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-10 relative">
            <!-- Pop-ups -->
            <div class="space-y-2 z-50">
                <div v-if="popUpEdicao"
                    class="fixed top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-16 py-4 min-w-[400px] max-w-[90vw] rounded shadow-lg z-50 transition">
                    Edição salva com sucesso.
                </div>
                <div v-if="popUpAprovacao"
                    class="fixed top-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-16 py-4 min-w-[400px] max-w-[90vw] rounded shadow-lg z-50 transition">
                    {{ nomeAprovado }} foi aprovado(a) com sucesso.
                </div>
                <div v-if="popUpRemocao"
                    class="fixed top-40 left-1/2 -translate-x-1/2 bg-red-600 text-white px-16 py-4 min-w-[400px] max-w-[90vw] rounded shadow-lg z-50 transition">
                    {{ nomeRemovido }} foi removido(a) com sucesso.
                </div>
            </div>

            <h1 class="text-2xl font-extrabold mb-6 text-green-700 text-center tracking-tight">Funcionários</h1>
            <!-- tabelas modo desktop -->
            <div class="overflow-x-auto hidden md:block">
                <table class="min-w-full mt-4 border rounded text-center">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="px-4 py-2 font-bold">ID</th>
                            <th class="px-4 py-2 font-bold">Cargo</th>
                            <th class="px-4 py-2 font-bold">Nome</th>
                            <th class="px-4 py-2 font-bold">CPF</th>
                            <th class="px-4 py-2 font-bold">E-mail</th>
                            <!-- <th class="px-4 py-2 font-bold">Senha</th> -->
                            <th class="px-4 py-2 font-bold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in dadosFuncionariosComPendentes" :key="c.id"
                            :class="['border-t', c.pendente ? 'bg-red-100' : '']">
                            <td class="px-4 py-2">{{ c.id }}</td>
                            <td class="px-4 py-2">
                                <template v-if="editingId === c.id && !c.pendente">
                                    <select v-model="editRow.cargo" class="border rounded px-2 py-1 w-full">
                                        <option value="Admin">Admin</option>
                                        <option value="Atendimento">Atendente</option>
                                    </select>
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
                            <td class="px-4 py-2 flex items-center justify-center gap-2">
                                <template v-if="c.pendente">
                                    <button @click="aprovarFuncionario(c.id)" title="Aprovar">
                                        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Aprovar"
                                            class="w-6 h-6" />
                                    </button>

                                    <button @click="removerFuncionario(c.id, c.pendente)" title="Reprovar">
                                        <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
                                            alt="Reprovar" class="w-6 h-6" />
                                    </button>

                                </template>
                                <template v-else>
                                    <button v-if="editingId !== c.id" @click="startEdit(c)" title="Editar">
                                        <img src="https://cdn-icons-png.flaticon.com/512/84/84380.png" alt="Editar"
                                            class="w-6 h-6 inline" />
                                    </button>
                                    <button v-else @click="saveEdit(c)" title="Salvar">
                                        <img src="https://cdn-icons-png.flaticon.com/512/11251/11251859.png"
                                            alt="Salvar" class="w-6 h-6 inline" />
                                    </button>
                                    <!-- Ícone de X para remover funcionário não pendente -->
                                    <button @click="removerFuncionario(c.id, c.pendente)" title="Remover" class="ml-2">
                                        <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" alt="Remover"
                                            class="w-6 h-6" />
                                    </button>

                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- tabelas modo responsivo  -->
            <div class="grid gap-4 md:hidden">
                <div v-for="c in dadosFuncionariosComPendentes" :key="c.id"
                    :class="['border-2 rounded-xl p-4 bg-white shadow flex flex-col gap-2', c.pendente ? 'border-red-400 bg-red-50' : 'border-green-900']">
                    <div>
                        <span class="font-bold text-green-900">ID:</span> {{ c.id }}
                    </div>
                    <div>
                        <span class="font-bold text-green-900">Cargo:</span>
                        <template v-if="editingId === c.id && !c.pendente">
                            <select v-model="editRow.cargo" class="border rounded px-2 py-1 w-full">
                                <option value="Admin">Admin</option>
                                <option value="Atendimento">Atendente</option>
                            </select>
                        </template>
                        <template v-else>
                            {{ c.cargo }}
                        </template>
                    </div>
                    <div>
                        <span class="font-bold text-green-900">Nome:</span>
                        <template v-if="editingId === c.id && !c.pendente">
                            <input v-model="editRow.nome" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            {{ c.nome }}
                        </template>
                    </div>
                    <div>
                        <span class="font-bold text-green-900">CPF:</span>
                        <template v-if="editingId === c.id && !c.pendente">
                            <input v-model="editRow.cpf" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            {{ c.cpf }}
                        </template>
                    </div>
                    <div>
                        <span class="font-bold text-green-900">E-mail:</span>
                        <template v-if="editingId === c.id && !c.pendente">
                            <input v-model="editRow.email" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            {{ c.email }}
                        </template>
                    </div>
                    <div class="flex gap-2 mt-2">
                        <template v-if="c.pendente">
                            <button @click="aprovarFuncionario(c.id)" title="Aprovar">
                                <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Aprovar"
                                    class="w-6 h-6" />
                            </button>
                            <button @click="removerFuncionario(c.id, c.pendente)" title="Reprovar">
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
                            <button @click="removerFuncionario(c.id, c.pendente)" title="Remover" class="ml-2">
                                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" alt="Remover"
                                    class="w-6 h-6" />
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (min-width: 768px) {
    .popups-space {
        margin-top: 2.5rem;
    }
}
</style>