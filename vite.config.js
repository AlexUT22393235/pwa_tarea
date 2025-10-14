import { defineConfig } from 'vite'
import basicSsl from "@vitejs/plugin-basic-ssl"
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
        tailwindcss(),
        basicSsl({
      /** name of certification */
      name: 'test',
      /** custom trust domains */
      domains: ['*.todo.com'],})
        
  ],
  
  
})
