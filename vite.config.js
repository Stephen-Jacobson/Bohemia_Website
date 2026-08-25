import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this repo at /Bohemia_Website/, so assets need that
// prefix. Cloudflare Pages serves it from the domain root ("/"). The
// GitHub Actions workflow sets GITHUB_PAGES=true only when building for
// Pages; Cloudflare's build leaves it unset, so it falls back to "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/Bohemia_Website/' : '/',
})