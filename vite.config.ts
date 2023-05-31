import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 自动导入vue中的hook， reactive ref等
import AutoImport from 'unplugin-auto-import/vite'
// Element
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), AutoImport({
    import: ['vue', 'vue-router'],
    dts: "src/auto-import.d.ts",
    resolvers: [ElementPlusResolver()],
  }),
    // Components({
    //   resolvers: [ElementPlusResolver()]
    // })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, './src')
    }
  },
  base: './',

})
