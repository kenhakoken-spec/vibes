import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base: './' で相対パス出力 → GitHub Pages(サブパス) でも Vercel(ルート) でも動く
export default defineConfig({
  base: './',
  plugins: [react()],
})
