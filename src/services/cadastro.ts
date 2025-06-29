import axios from 'axios'

export async function cadastrar({
  nome,
  email,
  senha,
  perfilId,
}: {
  nome: string
  email: string
  senha: string
  perfilId: number
}) {
  return axios.post('http://localhost:3000/cadastrar', {
    nome,
    email,
    senha,
    perfilId,
    aprovado: false,
  })
}
