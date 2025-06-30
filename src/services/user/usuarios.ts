import axios from 'axios'

export async function getUsuarios() {
  console.log('chamou getUsuarios')
  const token = localStorage.getItem('token')
  const response = await axios.get('http://localhost:3000/usuarios', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
