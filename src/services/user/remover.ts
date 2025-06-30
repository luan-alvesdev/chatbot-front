import axios from 'axios'

export async function excluirUsuario(id: number) {
  const token = localStorage.getItem('token')
  return axios.delete(`http://localhost:3000/excluir/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
