import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: 'Daymark', // Substitua "nome-do-repositorio" pelo nome exato do repositório no GitHub
})