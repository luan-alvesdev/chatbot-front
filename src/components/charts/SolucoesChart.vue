<script setup lang="ts">
import SolucoesChartBar from './SolucoesChartBar.vue'
defineProps<{ data: { id: number; titulo: string; utilizada: number }[] }>()
</script>
<template>
    <h1 class="text-xl font-bold mb-2 text-green-500">Soluções</h1>

    <table class="min-w-full mt-4 border rounded text-center">
        <thead>
            <tr class="bg-gray-100">
                <th class="px-4 py-2 font-bold">ID</th>
                <th class="px-4 py-2 font-bold">Tema</th>
                <th class="px-4 py-2 font-bold">Qt. Util.</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="c in data" :key="c.id" class="border-t">
                <td class="px-4 py-2">{{ c.id }}</td>
                <td class="px-4 py-2">{{ c.titulo }}</td>
                <td class="px-4 py-2">{{ c.utilizada }}</td>
            </tr>
        </tbody>
    </table>
    <SolucoesChartBar :data="data" class="mb-6 mt-6" />
</template>

<style scoped></style>