<script setup lang="ts">
import { ref, computed } from 'vue'

// Componentes de gráfico
import ClientesChart from '@/components/charts/ClientesChart.vue'
import SolucoesChart from '@/components/charts/SolucoesChart.vue'
import InteracoesChart from '@/components/charts/InteracoesChart.vue'
import ChamadosChart from '@/components/charts/ChamadosChart.vue'
import FuncionariosChart from '@/components/charts/FuncionariosChart.vue'

type Cliente = { id: number; nome: string; email: string }
type Solucao = { id: number; titulo: string; utilizada: number }
type Interacao = { id: number; usuario: string; status: string }
type Chamado = { id: number; status: string; titulo: string; tempo: string }
type Funcionario = { id: number; nome: string; cargo: string }

type TableKey = 'clientes' | 'solucoes' | 'interacoes' | 'chamados' | 'funcionarios'

const opcoesTabela = [
  { value: 'clientes', label: 'Clientes' },
  { value: 'solucoes', label: 'Soluções Base' },
  { value: 'interacoes', label: 'Interações' },
  { value: 'chamados', label: 'Chamados' },
  { value: 'funcionarios', label: 'Funcionários' },
]
//util
const dadosMock: Record<TableKey, Cliente[] | Solucao[] | Interacao[] | Chamado[] | Funcionario[]> = {
  clientes: [{ id: 1, nome: 'Empresa X', email: 'x@empresa.com' }],
  solucoes: [{ id: 11, titulo: 'Troca e devoluções', utilizada: 17 },
  { id: 12, titulo: 'Entregas', utilizada: 23 },
  { id: 13, titulo: 'Formas de pagamento', utilizada: 8 },
  { id: 14, titulo: 'Programa palavra', utilizada: 29 },
  { id: 15, titulo: 'Identificação Positiva', utilizada: 12 }],
  interacoes: [{ id: 100, usuario: 'João', status: 'Fechado' }],
  chamados: [
    { id: 1000, status: 'Aberto', titulo: 'Identificação Positiva', tempo: '00:42' },
    { id: 1001, status: 'Fechado', titulo: 'Reclamação', tempo: '00:30' },
    { id: 1002, status: 'Fechado', titulo: 'Troca e devolução', tempo: '00:55' },
    { id: 1003, status: 'Aberto', titulo: 'Identificação Positiva', tempo: '00:20' },
    { id: 1004, status: 'Fechado', titulo: 'Programa Palavra', tempo: '01:05' },
    { id: 1005, status: 'Fechado', titulo: 'Programa Palavra', tempo: '00:38' }
  ],
  funcionarios: [{ id: 10000, nome: 'João', cargo: 'Administrador(a)' }],
}
//tabela padrão selecionada
const tabelaSelecionada = ref<TableKey>('solucoes')
const filtroId = ref('')
//dados dashboard
const data = ref<Cliente[] | Solucao[] | Interacao[] | Chamado[] | Funcionario[]>(dadosMock['solucoes'] as Cliente[])
//criando valores reativos
const dadosClientes = computed(() => tabelaSelecionada.value === 'clientes' ? data.value as Cliente[] : [])
const dadosSolucoes = computed(() => tabelaSelecionada.value === 'solucoes' ? data.value as Solucao[] : [])
const dadosInteracoes = computed(() => tabelaSelecionada.value === 'interacoes' ? data.value as Interacao[] : [])
const dadosChamados = computed(() => tabelaSelecionada.value === 'chamados' ? data.value as Chamado[] : [])
const dadosFuncionarios = computed(() => tabelaSelecionada.value === 'funcionarios' ? data.value as Funcionario[] : [])

function trocarTabela(e: Event) {
  const value = (e.target as HTMLSelectElement).value as TableKey
  tabelaSelecionada.value = value
  data.value = [...dadosMock[value]]
  filtroId.value = ''
}

function filtrar() {
  if (!filtroId.value) {
    data.value = [...dadosMock[tabelaSelecionada.value]]
    return
  }
  switch (tabelaSelecionada.value) {
    case 'clientes':
      data.value = (dadosMock.clientes as Cliente[]).filter(
        (item) => String(item.id) === filtroId.value
      )
      break
    case 'solucoes':
      data.value = (dadosMock.solucoes as Solucao[]).filter(
        (item) => String(item.id) === filtroId.value
      )
      break
    case 'interacoes':
      data.value = (dadosMock.interacoes as Interacao[]).filter(
        (item) => String(item.id) === filtroId.value
      )
      break
    case 'chamados':
      data.value = (dadosMock.chamados as Chamado[]).filter(
        (item) => String(item.id) === filtroId.value
      )
      break
    case 'funcionarios':
      data.value = (dadosMock.funcionarios as Funcionario[]).filter(
        (item) => String(item.id) === filtroId.value
      )
      break
  }
}
</script>
<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-28">
    <div class="flex flex-col space-y-6">
      <h1 class="text-2xl font-bold text-green-500">Consulta de Tabelas</h1>
      <div>
        <h2 class="text-lg font-semibold mb-3 text-green-500">Escolha a tabela</h2>
        <select class="w-full border rounded px-3 py-2 mb-2" :value="tabelaSelecionada" @change="trocarTabela">
          <option v-for="opt in opcoesTabela" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
      <div>
        <h3 class="text-lg font-bold text-green-500 mb-3">Filtro por ID</h3>
        <div class="flex gap-3">
          <input type="text" class="border rounded px-3 py-2 flex-1" placeholder="Digite o ID" v-model="filtroId" />
          <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium" @click="filtrar">
            Consultar
          </button>
        </div>
      </div>
      <div>
        <template v-if="!data || data.length === 0">
          <div class="text-gray-500 mt-4">Nenhum dado encontrado.</div>
        </template>
      </div>
      <div>
        <ClientesChart v-if="tabelaSelecionada === 'clientes'" :data="dadosClientes" />
        <SolucoesChart v-else-if="tabelaSelecionada === 'solucoes'" :data="dadosSolucoes" />
        <InteracoesChart v-else-if="tabelaSelecionada === 'interacoes'" :data="dadosInteracoes" />
        <ChamadosChart v-else-if="tabelaSelecionada === 'chamados'" :data="dadosChamados" />
        <FuncionariosChart v-else-if="tabelaSelecionada === 'funcionarios'" :data="dadosFuncionarios" />
      </div>
    </div>
  </div>
</template>