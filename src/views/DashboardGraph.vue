<script setup lang="ts">

// type Solucao = { id: number; titulo: string; descricao: string; palavrasChave: string; foiUtil: number; naoFoiUtil: number }

// const solucoes = ref<Solucao[]>([
//     {
//         id: 1,
//         titulo: 'Trocas e devoluções',
//         descricao: `Conforme o Código de Defesa do Consumidor (CDC), o prazo para solicitar a troca ou devolução de um pedido feito online é de até 7 (sete) dias corridos a partir da data de entrega no endereço ou retirada do produto na loja.
//         Caso o pedido tenha sido retirado em loja, o cliente deve levar o produto a uma de nossas lojas para avaliação do produto, desde que esteja na embalagem original, com manual, todos os acessórios e sem sinais de uso.
        
//         - Caso não tenha obtido suporte em loja, podemos abrir um chamado em E-commerce > Cancelamentos.
//         - Caso o cliente tenha recebido em casa um produto diferente/avariado/incompleto, do que foi comprado, devemos abrir um chamado de E-commerce > Entrega para verificarmos a possibilidade de troca.
//         - Caso o cliente tenha comprado o produto errado/diferente do qual ele possui interesse, devemos abrir um chamado para cancelamento deste pedido em E-commerce > Cancelamentos.
//         - Após o cancelamento, o cliente pode realizar uma nova compra com o item correto.
        
//         ATENÇÃO: Para cancelamentos de pedidos pagos via boleto, é necessário informar os dados bancários do titular para o estorno.
//         Sempre especifique o número do pedido, o produto e quantidades em questão.`,
//         palavrasChave: 'troca, devolução, cancelamento, CDC, pedido',
//         foiUtil: 23,
//         naoFoiUtil: 3
//     },
//     {
//         id: 2,
//         titulo: 'Formas de pagamento',
//         descricao: `Formas de pagamento aceitas:
    
//         - Cartão Quero-Quero Elo ou VerdeCard
//         - Fatura simplificada Quero-Quero (somente em loja física)
//         - Boleto bancário
//         - PIX
//         - Dinheiro (somente em loja física)
//         - Demais cartões das bandeiras Elo, MasterCard, Visa, Senff, Hipercard, American Express
//         - Cartão De Volta para Casa (em solidariedade às Enchentes atingidas no RS, em Maio de 2024)

//         No segmento de construção, a Quero-Quero é a única que aceita o financiamento através do BB Realize.

//         O que é isso?
//         O BB Realize é uma linha de crédito (empréstimo) do Banco do Brasil.

//         Como funciona?
//         O cliente faz a adesão do empréstimo direto pelo app do Banco do Brasil e da loja consegue utilizá-lo como pagamento de compra.`,
//         palavrasChave: 'pagamento, cartão, boleto, pix, financiamento',
//         foiUtil: 8,
//         naoFoiUtil: 15
//     },
//     {
//         id: 3,
//         titulo: 'Programa palavra',
//         descricao: `Caso a entrega atrase, garantimos o produto de graça ao cliente!
//         Neste projeto, indenizamos o cliente com o valor pago pelo produto, caso a entrega não seja efetuada até a data promessa constante na Nota Fiscal.
//         Há diversas regras para aptidão da indenização pelo Palavra, o regulamento está disponível no nosso site:
//         https://www.queroquero.com.br/palavra

//         - Caso a compra tenha sido realizada no SITE, o cliente deve solicitar a análise da indenização pelo formulário, em:
//         https://painel.quero-quero.com.br/formulario_palavra
//         - Caso a compra tenha sido realizada em LOJA, o cliente pode solicitar a análise da indenização direto com a loja.

//         Após a solicitação, o retorno da análise ocorre em até 7 dias úteis.
//         O pagamento ocorrerá em depósito bancário ou, quando solicitado em loja, já há a opção de saque no caixa.
//         Em último caso, se o cliente não tiver obtido suporte nos meios acima, podemos abrir chamado para análise da solicitação.`,
//         palavrasChave: 'indenização, entrega, promessa, palavra, atraso',
//         foiUtil: 29,
//         naoFoiUtil: 3
//     },
//     {
//         id: 4,
//         titulo: 'Identificação Positiva',
//         descricao: `Para validação da titularidade quando houver suporte com compras realizadas na Quero-Quero, solicitamos as seguintes informações:

//         - CPF
//         - Nome completo
//         - Forma de pagamento

//         Caso erre a forma de pagamento, podemos substituir pela data da compra.

//         Caso ocorra inconsistência, o cliente deve ser orientado a verificar as informações no site (para compras no site) ou na loja física.

//         Se identificarmos que estamos falando com terceiros (filhos, cônjuges, etc.), vamos solicitar que o titular entre em contato ou autorize o atendimento em linha.

//         Quando se tratar apenas de uma reclamação (experiências, fluxos operacionais, etc.), nós encaminhamos a reclamação via chamado, sem compartilhar informações sobre o cadastro/pedido do cliente. O retorno da reclamação será sempre feito ao telefone ou e-mail do titular da compra.`,
//         palavrasChave: 'identificação, titularidade, cpf, segurança, validação',
//         foiUtil: 12,
//         naoFoiUtil: 2
//     }
// ])


// type Duvida = { id: number; titulo: string; descricao: string; palavrasChave: string }

// const duvidas = ref<Duvida[]>([
//     {
//         id: 1,
//         titulo: 'Confirmação de identidade',
//         descricao: 'Como faço para confirmar minha identidade ao entrar em contato com o suporte?',
//         palavrasChave: 'identidade, suporte, segurança, autenticação, atendimento'
//     },
//     {
//         id: 2,
//         titulo: 'Orientações sobre reclamação de pedido incorreto',
//         descricao: 'Onde posso registrar uma reclamação sobre um pedido que não foi entregue corretamente?',
//         palavrasChave: 'reclamação, pedido, entrega, erro, suporte'
//     },
//     {
//         id: 3,
//         titulo: 'Prazos e condições para troca de produto',
//         descricao: 'Quais são os prazos e condições para solicitar a troca de um produto com defeito?',
//         palavrasChave: 'troca, produto, defeito, prazos, condições'
//     },
//     {
//         id: 4,
//         titulo: 'Autorização de terceiros',
//         descricao: 'Posso autorizar outra pessoa a falar com o suporte em meu nome?',
//         palavrasChave: 'autorização, terceiros, suporte, atendimento, representante'
//     },
//     {
//         id: 5,
//         titulo: 'Consulta de promoções ativas',
//         descricao: 'Como posso saber quais promoções possuem no momento?',
//         palavrasChave: 'promoções, ofertas, descontos, atualizações, marketing'
//     },
//     {
//         id: 6,
//         titulo: 'Benefícios do Programa Palavra',
//         descricao: 'Quais são os benefícios de participar do Programa Palavra?',
//         palavrasChave: 'benefícios, programa, fidelidade, recompensas, vantagens'
//     }
// ])

</script>
<template>
<h1>DashBoard QQ-Tech</h1>
</template>