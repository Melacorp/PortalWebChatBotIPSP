import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expone el servidor a toda la red local
    port: 5173, // Puerto por defecto (puedes cambiarlo)
    strictPort: false, // Si el puerto está ocupado, usar el siguiente disponible
  },
  preview: {
    host: true, // También expone el preview a la red local
    port: 4173,
    strictPort: false,
  },
});
