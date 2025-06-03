<script setup lang="ts">
defineProps<{ data: { id: number; nome: string; cargo: string }[] }>()
</script>
<template>
    <h1 class="text-xl font-bold mb-2 text-green-500">Funcionários</h1>
    <!-- <pre>{{ data }}</pre> -->
    <table class="min-w-full mt-4 border rounded text-center">
        <thead>
            <tr class="bg-gray-100">
                <th class="px-4 py-2 font-bold">ID</th>
                <th class="px-4 py-2 font-bold">Nome</th>
                <th class="px-4 py-2 font-bold">Cargo</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="c in data" :key="c.id" class="border-t">
                <td class="px-4 py-2">{{ c.id }}</td>
                <td class="px-4 py-2">{{ c.nome }}</td>
                <td class="px-4 py-2">{{ c.cargo }}</td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped></style>