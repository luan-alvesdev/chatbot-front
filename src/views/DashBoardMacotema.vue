<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Bar, Line } from 'vue-chartjs'
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

// Dados fake de macrotemas
const Duvidas = [
    { id: 1, macroTema: "Cartão" },
    { id: 2, macroTema: "SAC/Chamados" },
    { id: 3, macroTema: "E-commerce" }
]

// Macrotema selecionado
const macroTemaSelecionado = ref(Duvidas[0].macroTema)

// Agrupamento: dia ou mês
const agrupamento = ref('dia')

// Datas de início e fim (padrão: últimos 7 dias)
const hoje = new Date()
const seteDiasAtras = new Date()
seteDiasAtras.setDate(hoje.getDate() - 6)
function formatDate(date: Date) {
    return date.toISOString().slice(0, 10)
}
const dataInicio = ref(formatDate(seteDiasAtras))
const dataFim = ref(formatDate(hoje))

// Função para gerar labels de datas entre início e fim (diário)
function getDateRangeLabels(start: string, end: string, maxDays = 90) {
    const labels: string[] = []
    const current = new Date(start)
    const last = new Date(end)
    let count = 0
    while (current <= last && count < maxDays) {
        labels.push(current.toLocaleDateString())
        current.setDate(current.getDate() + 1)
        count++
    }
    return labels
}

// Função para gerar labels de meses entre início e fim (mensal)
function getMonthlyLabels(start: string, end: string, maxMonths = 24) {
    const labels: string[] = []
    const current = new Date(start)
    current.setDate(1)
    const last = new Date(end)
    last.setDate(1)
    let count = 0
    while (
        (current.getFullYear() < last.getFullYear() ||
            (current.getFullYear() === last.getFullYear() && current.getMonth() <= last.getMonth())) &&
        count < maxMonths
    ) {
        labels.push(`${String(current.getMonth() + 1).padStart(2, '0')}/${current.getFullYear()}`)
        current.setMonth(current.getMonth() + 1)
        count++
    }
    // Inclui o mês final se não passou do limite
    if (
        (current.getFullYear() === last.getFullYear() && current.getMonth() === last.getMonth()) &&
        count < maxMonths
    ) {
        labels.push(`${String(current.getMonth() + 1).padStart(2, '0')}/${current.getFullYear()}`)
    }
    return labels
}

// Computed para labels conforme agrupamento
const labelsPorPeriodo = computed(() => {
    if (!dataInicio.value || !dataFim.value || dataInicio.value > dataFim.value) return []
    if (agrupamento.value === 'dia') {
        return getDateRangeLabels(dataInicio.value, dataFim.value)
    } else {
        return getMonthlyLabels(dataInicio.value, dataFim.value)
    }
})

// Gera dados fake para cada label
function gerarDadosFake(labels: string[]) {
    return labels.map(() => Math.floor(Math.random() * 100))
}

// Dados do gráfico
const chartData = ref({
    labels: labelsPorPeriodo.value,
    datasets: [{
        label: 'Acessos',
        data: gerarDadosFake(labelsPorPeriodo.value),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        tension: 0.3
    }]
})

// Atualiza o gráfico ao mudar macrotema, datas ou agrupamento
watch([macroTemaSelecionado, dataInicio, dataFim, agrupamento, labelsPorPeriodo], () => {
    chartData.value = {
        labels: labelsPorPeriodo.value,
        datasets: [{
            label: `Acessos - ${macroTemaSelecionado.value}`,
            data: gerarDadosFake(labelsPorPeriodo.value),
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 2,
            tension: 0.3
        }]
    }
})

// Opções do gráfico
const chartOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
        title: { display: true, text: 'Acessos por período' }
    },
    scales: {
        y: { beginAtZero: true }
    }
}

// Tipo de gráfico selecionado
const tipoGrafico = ref('bar')
</script>

<template>
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mt-8">
        <h2 class="text-2xl font-bold mb-6 text-indigo-700 text-center">Dashboard de Macrotemas</h2>
        <div class="grid grid-cols-1 gap-3 mb-6">
            <!-- Linha 1: Macrotema sozinho -->
            <div class="md:col-span-2">
                <label class="font-bold text-gray-700 mr-2">Macrotema:</label>
                <select v-model="macroTemaSelecionado" class="border rounded px-3 py-2 w-full">
                    <option v-for="m in Duvidas" :key="m.id" :value="m.macroTema">{{ m.macroTema }}</option>
                </select>
            </div>
            <!-- Linha 2: De e Até lado a lado em telas grandes -->
            <div>
                <label class="font-bold text-gray-700 mr-2">De:</label>
                <input type="date" v-model="dataInicio" class="border rounded px-3 py-2 w-full" />
            </div>
            <div>
                <label class="font-bold text-gray-700 mr-2">Até:</label>
                <input type="date" v-model="dataFim" class="border rounded px-3 py-2 w-full" />
            </div>
            <!-- Linha 3: Dia/Mês -->
            <div class="md:col-span-2">
                <label class="font-bold text-gray-700 mr-2">Dia/Mês:</label>
                <select v-model="agrupamento" class="border rounded px-3 py-2 w-full max-w-xs">
                    <option value="dia">Dia</option>
                    <option value="mes">Mês</option>
                </select>
            </div>
            <!-- Linha 4: Gráfico (opcional, se quiser embaixo também) -->
            <div class="md:col-span-2">
                <label class="font-bold text-gray-700 mr-2">Gráfico:</label>
                <select v-model="tipoGrafico" class="border rounded px-3 py-2 w-full max-w-xs">
                    <option value="bar">Barra</option>
                    <option value="line">Linha</option>
                </select>
            </div>
        </div>
        <component :is="tipoGrafico === 'bar' ? Bar : Line" :data="chartData" :options="chartOptions" />
        <div v-if="labelsPorPeriodo.length === 0" class="text-center text-red-600 mt-4">
            Selecione um intervalo de datas válido.
        </div>
    </div>
</template>