<script setup lang="ts">
defineProps<{ data: { id: number; nome: string; email: string }[] }>()
</script>
<template>
    <div class="w-full">
        <h1 class="text-xl font-bold mb-2 text-green-500">Clientes</h1>
        <table class="w-full border rounded text-center">
            <thead>
                <tr class="bg-gray-100">
                    <th class="px-4 py-2 font-bold">ID</th>
                    <th class="px-4 py-2 font-bold">Nome</th>
                    <th class="px-4 py-2 font-bold">Email</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="c in data" :key="c.id" class="border-t">
                    <td class="px-4 py-2">{{ c.id }}</td>
                    <td class="px-4 py-2">{{ c.nome }}</td>
                    <td class="px-4 py-2">{{ c.email }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style scoped></style>
