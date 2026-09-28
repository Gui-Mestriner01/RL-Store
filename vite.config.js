import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  // './' deixa os caminhos relativos: o site funciona tanto na raiz do domínio
  // quanto dentro de uma subpasta (ex.: seudominio.com/loja) sem recompilar.
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
