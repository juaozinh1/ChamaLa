import axios from 'axios'

// Defina VITE_API_URL no .env (veja .env.example).
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? 'http://localhost:8080'}/api/v1`,
  timeout: 15000,
})
