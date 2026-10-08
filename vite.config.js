import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath, URL } from "node:url"
import { handleApi } from "./server/argos.mjs"
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "jeongdok-public-data",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!(await handleApi(req, res))) next()
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!(await handleApi(req, res))) next()
        })
      },
    },
  ],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
  build: { target: "es2020" },
})
