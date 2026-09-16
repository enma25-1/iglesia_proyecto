import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: './', // Asegura que las rutas sean relativas
  plugins: [react()],
  build: {
    outDir: 'dist', // Directorio de salida
    assetsDir: 'assets', // Directorio para los archivos estáticos
  },
});