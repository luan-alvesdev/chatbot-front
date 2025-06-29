import axios from 'axios'

export async function login({ email, senha }: { email: string; senha: string }) {
  return axios.post('http://localhost:3000/login', {
    email,
    senha,
  })
}
