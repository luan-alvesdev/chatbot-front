<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { getUsuarios } from '../services/user/usuarios'
import { excluirUsuario } from '../services/user/remover'
import axios from 'axios'

type Funcionario = {
    usuarioId: number
    perfil: {
        nomePerfil: string
        perfilId: number
    }
    nome: string
    // cpf?: string
    email: string
    senha: string
    aprovado?: boolean
}

const funcionarios = ref<Funcionario[]>([])
const naoAprovados = ref<Funcionario[]>([])

// Responsividade: windowWidth
const windowWidth = ref(window.innerWidth)
function handleResize() {
    windowWidth.value = window.innerWidth
}
onMounted(() => {
    window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

onMounted(async () => {
    const usuarios = await getUsuarios()
    console.log(usuarios) // Adicione esta linha
    funcionarios.value = usuarios.filter((u: Funcionario) => u.aprovado)
    naoAprovados.value = usuarios.filter((u: Funcionario) => !u.aprovado)
})

const dadosFuncionariosComPendentes = computed(() => [
    ...naoAprovados.value.map(f => ({ ...f, pendente: true })),
    ...funcionarios.value.map(f => ({ ...f, pendente: false }))
])

function cargoFromPerfil(perfilId: string | number) {
    return perfilId == 1 ? 'Admin' : 'Atendente'
}

// Edição
const editingId = ref<number | null>(null)
const editRow = ref<Omit<Funcionario, 'usuarioId' | 'pendente'>>({
    perfil: {
        nomePerfil: '',
        perfilId: 2
    },
    nome: '',
    // cpf: '',
    email: '',
    senha: ''
})

function startEdit(row: Funcionario) {
    editingId.value = row.usuarioId
    editRow.value = {
        perfil: {
            nomePerfil: row.perfil.nomePerfil,
            perfilId: row.perfil.perfilId
        },
        nome: row.nome,
        // cpf: row.cpf ?? '',
        email: row.email,
        senha: row.senha
    }
}

const popUpEdicao = ref(false)
async function saveEdit(row: Funcionario) {
    try {
        const token = localStorage.getItem('token')
        // Envia os dados editados para o backend
        await axios.patch(
            `http://localhost:3000/editar/${row.usuarioId}`,
            {
                nome: editRow.value.nome,
                email: editRow.value.email,
                // cpf: editRow.value.cpf, // descomente se usar CPF
                perfilId: editRow.value.perfil.perfilId
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        // Atualiza no front-end
        const idx = funcionarios.value.findIndex(f => f.usuarioId === row.usuarioId)
        if (idx !== -1) {
            funcionarios.value[idx] = {
                ...funcionarios.value[idx],
                ...editRow.value
            }
        } else {
            // Se for pendente
            const idxPend = naoAprovados.value.findIndex(f => f.usuarioId === row.usuarioId)
            if (idxPend !== -1) {
                naoAprovados.value[idxPend] = {
                    ...naoAprovados.value[idxPend],
                    ...editRow.value
                }
            }
        }
        editingId.value = null
        popUpEdicao.value = true
        setTimeout(() => {
            popUpEdicao.value = false
        }, 2000)
    } catch {
        alert('Erro ao salvar edição no servidor.')   /// implementar aqui os erros que vem do back, erro do servidor, implementar também um util para diminuir repetição de código
    }
}

// Aprovação

async function carregarUsuarios() {
    const usuarios = await getUsuarios()
    funcionarios.value = usuarios.filter((u: Funcionario) => u.aprovado)
    naoAprovados.value = usuarios.filter((u: Funcionario) => !u.aprovado)
}

const popUpAprovacao = ref(false)
const nomeAprovado = ref('')
async function aprovarFuncionario(usuarioId: number) {
    try {
        const token = localStorage.getItem("token"); // ou de onde você armazena o JWT
        await axios.patch(
            `http://localhost:3000/editar/${usuarioId}`,
            { aprovado: true },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const aprovado = naoAprovados.value.find(f => f.usuarioId === usuarioId)
        nomeAprovado.value = aprovado ? aprovado.nome : ''
        popUpAprovacao.value = true
        setTimeout(() => {
            popUpAprovacao.value = false
        }, 2000)
        await carregarUsuarios() // Atualiza a lista sem recarregar a página
    } catch {
        alert("Erro ao aprovar usuário.")   /// depois alterar para o erro que vem do back-end
    }
}

// Remoção
const popUpRemocao = ref(false)
const nomeRemovido = ref('')
async function removerFuncionario(usuarioId: number, pendente: boolean) {
    let nome = ''
    try {
        await excluirUsuario(usuarioId)
        if (pendente) {
            const idx = naoAprovados.value.findIndex(f => f.usuarioId === usuarioId)
            if (idx !== -1) {
                nome = naoAprovados.value[idx].nome
                naoAprovados.value.splice(idx, 1)
            }
        } else {
            const idx = funcionarios.value.findIndex(f => f.usuarioId === usuarioId)
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
    } catch {
        alert('Erro ao remover funcionário no servidor.')  //implementar aqui retorno do erro direto do servidor utils de erro
    }
}

</script>
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
        <div class="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-10 relative">
            <!-- Pop-ups -->
            <div class="space-y-2 z-50">
                <div v-if="popUpEdicao"
                    class="fixed top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-16 py-4 min-w-[300px] max-w-[90vw] rounded shadow-lg z-50 transition">
                    Edição salva com sucesso.
                </div>
                <div v-if="popUpAprovacao"
                    class="fixed top-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-16 py-4 min-w-[300px] max-w-[90vw] rounded shadow-lg z-50 transition">
                    {{ nomeAprovado }} foi aprovado(a) com sucesso.
                </div>
                <div v-if="popUpRemocao"
                    class="fixed top-40 left-1/2 -translate-x-1/2 bg-red-600 text-white px-16 py-4 min-w-[300px] max-w-[90vw] rounded shadow-lg z-50 transition">
                    {{ nomeRemovido }} foi removido(a) com sucesso.
                </div>
            </div>

            <h1 class="text-2xl font-extrabold mb-6 text-green-700 text-center tracking-tight">Funcionários</h1>
            <!-- Tabela Desktop -->
            <div class="overflow-x-auto hidden md:block">
                <table class="min-w-full mt-4 border rounded text-center">
                    <thead>
                        <tr class="bg-gray-100">
                            <!-- <th class="px-4 py-2 font-bold">ID</th> -->
                            <th class="px-4 py-2 font-bold">Cargo</th>
                            <th class="px-4 py-2 font-bold">Nome</th>
                            <!-- <th class="px-4 py-2 font-bold">CPF</th> -->
                            <th class="px-4 py-2 font-bold">E-mail</th>
                            <th class="px-4 py-2 font-bold">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="c in dadosFuncionariosComPendentes" :key="c.usuarioId"
                            :class="['border-t', c.pendente ? 'bg-red-100' : '']">
                            <!-- <td class="px-4 py-2">{{ c.usuarioId }}</td> -->
                            <td class="px-4 py-2">
                                <template v-if="editingId === c.usuarioId && !c.pendente">
                                    <select v-model="editRow.perfil.perfilId" class="border rounded px-2 py-1 w-full">
                                        <option :value="1">Admin</option>
                                        <option :value="2">Atendente</option>
                                    </select>
                                </template>
                                <template v-else>
                                    {{ cargoFromPerfil(c.perfil.perfilId) }}
                                </template>
                            </td>
                            <td class="px-4 py-2">
                                <template v-if="editingId === c.usuarioId && !c.pendente">
                                    <input v-model="editRow.nome" class="border rounded px-2 py-1 w-full" />
                                </template>
                                <template v-else>
                                    {{ c.nome }}
                                </template>
                            </td>
                            <!-- <td class="px-4 py-2">
                                <template v-if="editingId === c.usuarioId && !c.pendente">
                                    <input v-model="editRow.cpf" class="border rounded px-2 py-1 w-full" />
                                </template>
                                <template v-else>
                                    {{ c.cpf }}
                                </template>
                            </td> -->
                            <td class="px-4 py-2">
                                <template v-if="editingId === c.usuarioId && !c.pendente">
                                    <input v-model="editRow.email" class="border rounded px-2 py-1 w-full" />
                                </template>
                                <template v-else>
                                    {{ c.email }}
                                </template>
                            </td>
                            <td class="px-4 py-2 flex items-center justify-center gap-2">
                                <template v-if="c.pendente">
                                    <button @click="aprovarFuncionario(c.usuarioId)" title="Aprovar">
                                        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Aprovar"
                                            class="w-6 h-6" />
                                    </button>
                                    <button @click="removerFuncionario(c.usuarioId, c.pendente)" title="Reprovar">
                                        <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
                                            alt="Reprovar" class="w-6 h-6" />
                                    </button>
                                </template>
                                <template v-else>
                                    <button v-if="editingId !== c.usuarioId" @click="startEdit(c)" title="Editar">
                                        <img src="https://cdn-icons-png.flaticon.com/512/84/84380.png" alt="Editar"
                                            class="w-6 h-6 inline" />
                                    </button>
                                    <button v-else @click="saveEdit(c)" title="Salvar">
                                        <img src="https://cdn-icons-png.flaticon.com/512/11251/11251859.png"
                                            alt="Salvar" class="w-6 h-6 inline" />
                                    </button>
                                    <button @click="removerFuncionario(c.usuarioId, c.pendente)" title="Remover"
                                        class="ml-2">
                                        <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" alt="Remover"
                                            class="w-6 h-6" />
                                    </button>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Tabela Responsiva Mobile -->
            <div class="grid gap-4 md:hidden">
                <div v-for="c in dadosFuncionariosComPendentes" :key="c.usuarioId"
                    :class="['border-2 rounded-xl p-4 bg-white shadow flex flex-col gap-2', c.pendente ? 'border-red-400 bg-red-50' : 'border-green-900']">
                    <!-- <div>
                        <span class="font-bold text-green-900">ID:</span> {{ c.usuarioId }}
                    </div> -->
                    <div>
                        <span class="font-bold text-green-900">Cargo:</span>
                        <template v-if="editingId === c.usuarioId && !c.pendente">
                            <select v-model="editRow.perfil.perfilId" class="border rounded px-2 py-1 w-full">
                                <option :value="1">Admin</option>
                                <option :value="2">Atendente</option>
                            </select>
                        </template>
                        <template v-else>
                            {{ cargoFromPerfil(c.perfil.perfilId) }}
                        </template>
                    </div>
                    <div>
                        <span class="font-bold text-green-900">Nome:</span>
                        <template v-if="editingId === c.usuarioId && !c.pendente">
                            <input v-model="editRow.nome" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            {{ c.nome }}
                        </template>
                    </div>
                    <!-- <div>
                        <span class="font-bold text-green-900">CPF:</span>
                        <template v-if="editingId === c.usuarioId && !c.pendente">
                            <input v-model="editRow.cpf" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            {{ c.cpf }}
                        </template>
                    </div> -->
                    <div>
                        <span class="font-bold text-green-900">E-mail:</span>
                        <template v-if="editingId === c.usuarioId && !c.pendente">
                            <input v-model="editRow.email" class="border rounded px-2 py-1 w-full" />
                        </template>
                        <template v-else>
                            {{ c.email }}
                        </template>
                    </div>
                    <div class="flex gap-2 mt-2">
                        <template v-if="c.pendente">
                            <button @click="aprovarFuncionario(c.usuarioId)" title="Aprovar">
                                <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Aprovar"
                                    class="w-6 h-6" />
                            </button>
                            <button @click="removerFuncionario(c.usuarioId, c.pendente)" title="Reprovar">
                                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" alt="Reprovar"
                                    class="w-6 h-6" />
                            </button>
                        </template>
                        <template v-else>
                            <button v-if="editingId !== c.usuarioId" @click="startEdit(c)" title="Editar">
                                <img src="https://cdn-icons-png.flaticon.com/512/84/84380.png" alt="Editar"
                                    class="w-6 h-6 inline" />
                            </button>
                            <button v-else @click="saveEdit(c)" title="Salvar">
                                <img src="https://cdn-icons-png.flaticon.com/512/11251/11251859.png" alt="Salvar"
                                    class="w-6 h-6 inline" />
                            </button>
                            <button @click="removerFuncionario(c.usuarioId, c.pendente)" title="Remover" class="ml-2">
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