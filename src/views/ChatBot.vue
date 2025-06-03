<script setup lang="ts">
import { ArrowUp, ThumbsUp, ThumbsDown } from 'lucide-vue-next';
import { ref } from 'vue'


const options = [
  { value: 'pagamento', label: 'Informações sobre formas de pagamento' },
  { value: 'entrega', label: 'Entrega' },
  { value: 'garantia', label: 'Garantia estendida' },
  { value: 'troca', label: 'Troca fácil' },
  { value: 'assistencia', label: 'Assistência técnica' },
  { value: 'seguro', label: 'Seguro RFQ(roubo, furto ou quebra)' },
]

const selected = ref(options[0].value)
const question = ref('')
const messages = ref<{ tipo: string; categoria: string; texto: string }[]>([])
const showHelpfulQuestion = ref(false)

function handleSend() {
  if (!question.value.trim()) return
  messages.value.push(
    {
      tipo: 'user',
      categoria: selected.value,
      texto: question.value,
    },
    {
      tipo: 'bot',
      categoria: selected.value,
      texto: 'Obrigado pela sua pergunta! Em breve um atendente irá responder.',
    },
    {
      tipo: 'bot',
      categoria: selected.value,
      texto: 'Olá, como posso ajudar?',
    }
  )
  question.value = ''
  showHelpfulQuestion.value = true
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200">
    <div class="relative">
      <div class="absolute inset-0 translate-x-3 translate-y-3 bg-green-300 rounded-2xl blur-[2px] opacity-60 z-0">
      </div>
      <!-- Chatbot principal -->
      <div class="relative font-dm max-w-lg mx-auto mt-3 p-6 bg-white rounded-2xl shadow-2xl z-10">
        <div class="flex items-center mb-2 gap-3">
          <!-- Avatar -->
          <img src="/avatar_woman.png" alt="Avatar" class="h-12 w-12 rounded-full object-cover" />
          <div class="flex flex-col justify-center">
            <!-- Título -->
            <h1 class="text-2xl font-bold text-green-500">
              Atendimento Virtual QQTech
            </h1>
            <!-- Subtítulo -->
            <span class="text-sm text-green-500">Sua assistente digital E-commerce</span>
          </div>
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium text-green-500">
            Escolha o procedimento:
          </label>
          <select class="w-full border rounded px-3 py-2 text-green-500" v-model="selected">
            <option v-for="opt in options" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-2 mb-4">
          <label class="font-medium text-green-500" for="pergunta">
            Digite sua pergunta:
          </label>
          <input id="pergunta" type="text" class="border-2 rounded px-3 py-2 flex-1 font-normal"
            placeholder="Escreva aqui..." v-model="question" @keydown.enter="handleSend" />
          <button class="p-2 rounded-full bg-green-500 hover:bg-blue-600 text-white" @click="handleSend">
            <ArrowUp class="w-5 h-5" />
          </button>
        </div>
        <div class="bg-gray-100 rounded p-4 min-h-[120px] max-h-64 overflow-y-auto border">
          <template v-if="messages.length === 0">
            <div class="text-gray-500 text-center text-sm font-normal">
              <div class="mb-2 text-left">
                <span class="inline-block px-3 py-2 rounded bg-gray-300 text-gray-800 font-normal">
                  Olá, que bom ter você aqui! Sou sua assistente virtual da QQTech. Selecione um assunto
                  acima e envie sua dúvida para começarmos o atendimento. Vamos começar!
                </span>
              </div>

            </div>
          </template>
          <template v-else>
            <div v-for="(msg, idx) in messages" :key="idx"
              :class="['mb-2', msg.tipo === 'user' ? 'text-right' : 'text-left']">
              <span :class="[
                'inline-block px-3 py-2 rounded text-sm font-normal',
                msg.tipo === 'user' ? '' : ''
              ]" :style="msg.tipo === 'user'
                ? 'background:#20512e;color:#fff'
                : 'background:#22c55e;color:#fff'">
                {{ msg.texto }}
              </span>
              <!-- Mostra a pergunta de utilidade após a mensagem automática do bot -->
              <div
                v-if="showHelpfulQuestion && idx === messages.length - 1 && msg.tipo === 'bot' && msg.texto === 'Olá, como posso ajudar?'"
                class="mt-4">
                <div class="font-medium text-gray-700 mb-2">
                  Essa mensagem foi útil?
                </div>
                <div class="flex justify-center gap-4">
                  <button
                    class="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
                    type="button">
                    <ThumbsUp class="w-5 h-5" />
                    Sim
                  </button>
                  <button
                    class="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium"
                    type="button">
                    Não
                    <ThumbsDown class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>