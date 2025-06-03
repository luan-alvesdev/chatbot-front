<script setup lang="ts">
const props = defineProps<{ data: { id: number; status: string; titulo: string; tempo: string }[] }>()

// Função para converter "hh:mm" em minutos
function tempoParaMinutos(tempo: string) {
    const [h, m] = tempo.split(':').map(Number)
    return h * 60 + m
}

// Calcular média em minutos
const tempos = props.data.map(c => tempoParaMinutos(c.tempo))
const media = tempos.length ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length) : 0

// Converter média para "hh:mm"
function minutosParaTempo(minutos: number) {
    const h = Math.floor(minutos / 60)
    const m = minutos % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}
const mediaFormatada = minutosParaTempo(media)
</script>

<template>
    <h1 class="text-xl font-bold mb-2 text-green-500">Chamados</h1>

    <table class="min-w-full mt-4 border rounded text-center">
        <thead>
            <tr class="bg-gray-100">
                <th class="px-4 py-2 font-bold">ID</th>
                <th class="px-4 py-2 font-bold">Status</th>
                <th class="px-4 py-2 font-bold">Titulo</th>
                <th class="px-4 py-2 font-bold">Tempo de atendimento</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="c in data" :key="c.id" class="border-t">
                <td class="px-4 py-2">{{ c.id }}</td>
                <td class="px-4 py-2">{{ c.status }}</td>
                <td class="px-4 py-2">{{ c.titulo }}</td>
                <td class="px-4 py-2">{{ c.tempo }}</td>
            </tr>
        </tbody>
    </table>
    <h2 class="text-center text-xl font-bold mb-2 text-green-500 mt-8">
        Tempo médio de atendimento: <span class="text-black font-medium pl-2"> {{ mediaFormatada }}</span>
    </h2>
</template>