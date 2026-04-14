import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Esto permite usar funciones como 'describe', 'test' e 'expect' 
    // globalmente sin tener que importarlas en cada archivo de prueba
    globals: true,
    // Simula el DOM de un navegador para que React Testing Library funcione
    environment: 'jsdom',
    // Opcional: si creas un archivo de configuración inicial para los tests
    setupFiles: './src/setupTests.js',
  },
})