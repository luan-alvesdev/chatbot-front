<script setup lang="ts">
import { ref, computed } from 'vue'

// Componentes de gráfico
import SolucoesChart from '@/components/charts/SolucoesChart.vue'
import DuvidasChart from '@/components/charts/DuvidasChart.vue'
import FuncionariosChart from '@/components/charts/FuncionariosChart.vue'

type Solucao = { id: number; titulo: string; descricao: string; palavrasChave: string; foiUtil: number; naoFoiUtil: number }
type Duvida = { id: number; descricao: string }
type Funcionario = { id: number; cargo: string; nome: string; cpf: string; email: string; senha: string }
type TableKey = 'solucoes' | 'duvidas' | 'funcionarios' | 'pendentes'

const opcoesTabela = [
  { value: 'solucoes', label: 'Soluções Base' },
  { value: 'funcionarios', label: 'Funcionários' },
  { value: 'duvidas', label: 'Dúvidas' },

]
//util
const dadosMock: Record<TableKey, Funcionario[] | Solucao[] | Duvida[]> = {
  pendentes: [
    { id: 1, cargo: 'Admin', nome: 'Carlos Silva', cpf: '123.456.789-00', email: 'carlos.silva@email.com', senha: '********' },
    { id: 2, cargo: 'Usuário', nome: 'Ana Paula Souza', cpf: '987.654.321-00', email: 'ana.souza@email.com', senha: '********' },
    { id: 3, cargo: 'Supervisor', nome: 'João Pedro Lima', cpf: '456.789.123-00', email: 'joao.lima@email.com', senha: '********' },
    { id: 4, cargo: 'Gerente', nome: 'Mariana Oliveira', cpf: '321.654.987-00', email: 'mariana.oliveira@email.com', senha: '********' }],
  solucoes: [
    {
      id: 1, titulo: 'Trocas e devoluções', descricao: `Conforme o Código de Defesa do Consumidor (CDC), o prazo para solicitar a troca ou devolução de um pedido feito online é de até 7 (sete) dias corridos a partir da data de entrega no endereço ou retirada do produto na loja.<br>
        Caso o pedido tenha sido retirado em loja, o cliente deve levar o produto a uma de nossas lojas para avaliação do produto, desde que esteja na embalagem original, com manual, todos os acessórios e sem sinais de uso.<br>
        <ul style="list-style-type: disc; padding-left: 1.5rem;">
          <li>Caso não tenha obtido suporte em loja, podemos abrir um chamado em E-commerce &gt; Cancelamentos.</li>
          <li>Caso o cliente tenha recebido em casa um produto diferente/avariado/incompleto, do que foi comprado, devemos abrir um chamado de E-commerce &gt; Entrega para verificarmos a possibilidade de troca.</li>
          <li>Caso o cliente tenha comprado o produto errado/diferente do qual ele possui interesse, devemos abrir um chamado para cancelamento deste pedido em E-commerce &gt; Cancelamentos.</li>
          <li>Após o cancelamento, o cliente pode realizar uma nova compra com o item correto.</li>
        </ul><br>
        <strong>ATENÇÃO:</strong> Para cancelamentos de pedidos pagos via boleto, é necessário informar os dados bancários do titular para o estorno.<br>
        Sempre especifique o número do pedido, o produto e quantidades em questão.`
      , palavrasChave: 'troca, devolução, cancelamento, CDC, pedido', foiUtil: 23, naoFoiUtil: 3
    },
    {
      id: 2, titulo: 'Formas de pagamento', descricao: `Formas de pagamento aceitas:<br>
        <ul style="list-style-type: disc; padding-left: 1.5rem;">
          <li>Cartão Quero-Quero Elo ou VerdeCard</li>
          <li>Fatura simplificada Quero-Quero (somente em loja física)</li>
          <li>Boleto bancário</li>
          <li>PIX</li>
          <li>Dinheiro (somente em loja física)</li>
          <li>Demais cartões das bandeiras Elo, MasterCard, Visa, Senff, Hipercard, American Express</li>
          <li>Cartão De Volta para Casa (em solidariedade às Enchentes atingidas no RS, em Maio de 2024)</li>
        </ul>
        No segmento de construção, a Quero-Quero é a única que aceita o financiamento através do <strong>BB Realize</strong>.<br><br>
        <strong>O que é isso?</strong><br>
        O BB Realize é uma linha de crédito (empréstimo) do Banco do Brasil.<br><br>
        <strong>Como funciona?</strong><br>
        O cliente faz a adesão do empréstimo direto pelo app do Banco do Brasil e da loja consegue utilizá-lo como pagamento de compra.`, palavrasChave: 'pagamento, cartão, boleto, pix, financiamento', foiUtil: 8, naoFoiUtil: 15
    },
    {
      id: 3, titulo: 'Programa palavra', descricao: `Caso a entrega atrase, garantimos o produto de graça ao cliente!<br>
        Neste projeto, indenizamos o cliente com o valor pago pelo produto, caso a entrega não seja efetuada até a data promessa constante na Nota Fiscal.<br>
        Há diversas regras para aptidão da indenização pelo Palavra, o regulamento está disponível no nosso site:<br>
        <a href="https://www.queroquero.com.br/palavra" target="_blank" style="color: #2563eb;">https://www.queroquero.com.br/palavra</a><br><br>
        <ul style="list-style-type: disc; padding-left: 1.5rem;">
          <li>Caso a compra tenha sido realizada no <strong>SITE</strong>, o cliente deve solicitar a análise da indenização pelo formulário, em:<br>
          <a href="https://painel.quero-quero.com.br/formulario_palavra" target="_blank" style="color: #2563eb;">https://painel.quero-quero.com.br/formulario_palavra</a></li>
          <li>Caso a compra tenha sido realizada em <strong>LOJA</strong>, o cliente pode solicitar a análise da indenização direto com a loja.</li>
        </ul><br>
        Após a solicitação, o retorno da análise ocorre em até 7 dias úteis.<br>
        O pagamento ocorrerá em depósito bancário ou, quando solicitado em loja, já há a opção de saque no caixa.<br>
        Em último caso, se o cliente não tiver obtido suporte nos meios acima, podemos abrir chamado para análise da solicitação.`, palavrasChave: 'indenização, entrega, promessa, palavra, atraso', foiUtil: 29, naoFoiUtil: 3
    },
    {
      id: 4, titulo: 'Identificação Positiva', descricao: `Para validação da titularidade quando houver suporte com compras realizadas na Quero-Quero, solicitamos as seguintes informações:<br><br>
        <ul style="list-style-type: disc; padding-left: 1.5rem;">
          <li>CPF</li>
          <li>Nome completo</li>
          <li>Forma de pagamento</li>
        </ul><br>
        Caso erre a forma de pagamento, podemos substituir pela data da compra.<br><br>
        Caso ocorra inconsistência, o cliente deve ser orientado a verificar as informações no site (para compras no site) ou na loja física.<br><br>
        Se identificarmos que estamos falando com terceiros (filhos, cônjuges, etc.), vamos solicitar que o titular entre em contato ou autorize o atendimento em linha.<br><br>
        Quando se tratar apenas de uma reclamação (experiências, fluxos operacionais, etc.), nós encaminhamos a reclamação via chamado, sem compartilhar informações sobre o cadastro/pedido do cliente. O retorno da reclamação será sempre feito ao telefone ou e-mail do titular da compra.`, palavrasChave: 'identificação, titularidade, cpf, segurança, validação', foiUtil: 12, naoFoiUtil: 2
    }],
  duvidas: [
    { id: 1, descricao: 'Como faço para confirmar minha identidade ao entrar em contato com o suporte?' },
    { id: 2, descricao: 'Onde posso registrar uma reclamação sobre um pedido que não foi entregue corretamente?' },
    { id: 3, descricao: 'Quais são os prazos e condições para solicitar a troca de um produto com defeito?' },
    { id: 4, descricao: 'Posso autorizar outra pessoa a falar com o suporte em meu nome?' },
    { id: 5, descricao: 'Como posso saber quais promoções possuem no momento?' },
    { id: 6, descricao: 'Quais são os benefícios de participar do Programa Palavra?' }

  ],
  funcionarios: [
    { id: 1, cargo: 'Admin', nome: 'Carlos Silva', cpf: '123.456.789-00', email: 'carlos.silva@email.com', senha: '********' },
    { id: 2, cargo: 'Admin', nome: 'Renata Lima', cpf: '987.654.321-11', email: 'renata.lima@email.com', senha: '*******' },
    { id: 3, cargo: 'Atendimento', nome: 'Marcos Souza', cpf: '456.789.123-22', email: 'marcos.souza@email.com', senha: '*******' },
    { id: 4, cargo: 'Atendimento', nome: 'Juliana Rocha', cpf: '321.654.987-33', email: 'juliana.rocha@email.com', senha: '******' },
    { id: 5, cargo: 'Atendimento', nome: 'Felipe Alves', cpf: '789.123.456-44', email: 'felipe.alves@email.com', senha: '*********' },
    { id: 6, cargo: 'Atendimento', nome: 'Aline Ferreira', cpf: '147.258.369-55', email: 'aline.ferreira@email.com', senha: '******' },
    { id: 7, cargo: 'Atendimento', nome: 'Bruno Martins', cpf: '369.258.147-66', email: 'bruno.martins@email.com', senha: '********' },
    { id: 8, cargo: 'Atendimento', nome: 'Patrícia Gomes', cpf: '258.147.369-77', email: 'patricia.gomes@email.com', senha: '*****' },
    { id: 9, cargo: 'Atendimento', nome: 'Thiago Melo', cpf: '741.852.963-88', email: 'thiago.melo@email.com', senha: '**********' },
    { id: 10, cargo: 'Atendimento', nome: 'Fernanda Costa', cpf: '963.852.741-99', email: 'fernanda.costa@email.com', senha: '******' },
    { id: 11, cargo: 'Atendimento', nome: 'Lucas Andrade', cpf: '654.321.987-00', email: 'lucas.andrade@email.com', senha: '*******' },
    { id: 12, cargo: 'Atendimento', nome: 'Vanessa Teixeira', cpf: '852.963.741-01', email: 'vanessa.teixeira@email.com', senha: '********' }
  ],

}
//tabela padrão selecionada
const tabelaSelecionada = ref<TableKey>('solucoes')
const filtroId = ref('')
//dados dashboard
const data = ref<Solucao[] | Duvida[] | Funcionario[]>(dadosMock['solucoes'] as Solucao[])
//criando valores reativos
const dadosFuncionariosComPendentes = computed(() => {
  // Adiciona uma flag "pendente" nos pendentes
  const pendentes = (dadosMock.pendentes as Funcionario[]).map(f => ({ ...f, pendente: true }))
  const funcionarios = (dadosMock.funcionarios as Funcionario[]).map(f => ({ ...f, pendente: false }))
  return [...pendentes, ...funcionarios]
})
const dadosSolucoes = computed(() => tabelaSelecionada.value === 'solucoes' ? data.value as Solucao[] : [])
const dadosduvidas = computed(() => tabelaSelecionada.value === 'duvidas' ? data.value as Duvida[] : [])


function trocarTabela(e: Event) {
  const value = (e.target as HTMLSelectElement).value as TableKey
  tabelaSelecionada.value = value
  if (value === 'solucoes') {
    data.value = [...dadosMock.solucoes] as Solucao[]
  } else if (value === 'duvidas') {
    data.value = [...dadosMock.duvidas] as Duvida[]
  } else if (value === 'funcionarios') {
    data.value = [...dadosMock.funcionarios] as Funcionario[]
  }
  filtroId.value = ''
}


</script>
<template>
  <div class="max-w-6xl mx-auto p-6 bg-gray-50 shadow rounded mt-28 mb-10">
    <div class="flex flex-col space-y-6">
      <h1 class="text-2xl font-bold text-green-700">Consulta de tabelas</h1>
      <div>
        <h2 class="text-lg font-semibold mb-3 text-green-700">Escolha a tabela:</h2>
        <select class="w-full border rounded px-3 py-2 mb-2" :value="tabelaSelecionada" @change="trocarTabela">
          <option v-for="opt in opcoesTabela" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
      <div>
        <h3 class="text-lg font-bold text-green-700 mb-3">Filtro</h3>
        <div class="flex gap-3">
          <input type="text" class="border rounded px-3 py-2 flex-1" placeholder="Pesquise aqui" v-model="filtroId" />
          <button class="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-500 font-medium">
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
        <FuncionariosChart v-if="tabelaSelecionada === 'funcionarios'" :data="dadosFuncionariosComPendentes" />
        <SolucoesChart v-else-if="tabelaSelecionada === 'solucoes'" :data="dadosSolucoes" />
        <DuvidasChart v-else-if="tabelaSelecionada === 'duvidas'" :data="dadosduvidas" />
      </div>
    </div>
  </div>
</template>