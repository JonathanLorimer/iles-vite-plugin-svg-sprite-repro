import { defineConfig } from 'iles'
import createSvgSpritePlugin from 'vite-plugin-svg-sprite';

export default defineConfig({
  vite: {
    plugins: [
      createSvgSpritePlugin({
        symbolId: 'icon-[name]-[hash]',
      }),
    ],
    // build: {
    //   rollupOptions: {
    //     external: ["vue/server-renderer"]
    //   }
    // }
  },
})
