<!-- filepath: src/components/charts/SolucoesChartResumo.vue -->
<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PieController } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PieController)

const props = defineProps<{ data: { foiUtil: number; naoFoiUtil: number }[] }>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function renderChart() {
    if (!chartRef.value) return
    const totalUtil = props.data.reduce((sum, s) => sum + s.foiUtil, 0)
    const totalNaoUtil = props.data.reduce((sum, s) => sum + s.naoFoiUtil, 0)

    if (chartInstance) chartInstance.destroy()
    chartInstance = new Chart(chartRef.value, {
        type: 'pie',
        data: {
            labels: ['Foi útil', 'Não foi útil'],
            datasets: [{
                data: [totalUtil, totalNaoUtil],
                backgroundColor: ['#22c55e', '#ef4444'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    })
}

onMounted(renderChart)
watch(() => props.data, renderChart, { deep: true })
</script>

<template>
    <div class="w-full flex flex-col items-center mb-6" style="max-width: 15rem;">
        <h2 class="font-semibold text-green-700 mb-2">Gráfico geral de soluções</h2>
        <canvas ref="chartRef" width="50" height="50"></canvas>
    </div>
</template>