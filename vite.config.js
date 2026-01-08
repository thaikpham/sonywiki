import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Tăng giới hạn cảnh báo lên 1000kB (1MB) để tránh cảnh báo không cần thiết
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Cấu hình chia nhỏ file (Manual Chunks)
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Tách riêng Firebase ra khỏi vendor chunk chính vì nó khá nặng
            if (id.includes('firebase')) {
              return 'firebase';
            }
            // Tách riêng bộ icon Lucide
            if (id.includes('lucide-react')) {
              return 'lucide';
            }
            // Các thư viện còn lại (React, v.v.) gom vào vendor
            return 'vendor';
          }
        },
      },
    },
  },
})
