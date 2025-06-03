<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const props = defineProps<{
  data: { id: number; titulo: string; utilizada: number }[]
}>()

const chartData = {
  labels: props.data.map(s => s.titulo),
  datasets: [
    {
      label: 'Quantidade utilizada',
      backgroundColor: [
        '#22c55e', '#16a34a', '#4ade80', '#bbf7d0', '#15803d', '#86efac'
      ],
      data: props.data.map(s => s.utilizada),
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'bottom' as const },
    title: { display: true, text: 'Gráfico de soluções mais utilizadas' }
  }
}
</script>

<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>