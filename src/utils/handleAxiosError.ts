// src/utils/handleAxiosError.ts
import { AxiosError } from 'axios'

export function handleAxiosError(error: unknown): string {
  // Verifica se o erro é do tipo AxiosError
  if (isAxiosError(error)) {
    if (!error.response) {
      // Erro de rede (timeout, servidor offline, etc.)
      return 'Problema ao conectar com o servidor. Tente novamente mais tarde.'
    }

    // Tenta extrair a mensagem da resposta. Fall back \/ é a mensagem que substitui a do back-end se não for encontrada.
    const msg = error.response.data?.error || 'Erro inesperado na requisição.'
    return msg
  }

  // Erro desconhecido
  return 'Ocorreu um erro inesperado.'
}

// Type guard para checar se o erro é AxiosError
function isAxiosError(error: unknown): error is AxiosError<{ error?: string }> {
  return (error as AxiosError).isAxiosError !== undefined
}
