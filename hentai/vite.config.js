/*
 * @Author: imali
 * @Date: 2021-11-04 13:42:08
 * @LastEditTime: 2022-08-24 16:45:30
 * @LastEditors: imali
 * @Description:
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import vueJsx from '@vitejs/plugin-vue2-jsx'
import viteCompression from 'vite-plugin-compression'
import legacy from '@vitejs/plugin-legacy'
import AsyncCatch from 'vite-plugin-async-catch'
import WindiCSS from 'vite-plugin-windicss'
import VitePluginVue2Suffix from 'vite-plugin-vue2-suffix'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
import { createHtmlPlugin } from 'vite-plugin-html'
import progress from 'vite-plugin-progress'
import path from 'path-browserify'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': '/src',
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    css: {
      devSourcemap: mode === 'development',
      preprocessorOptions: {
        scss: {
          additionalData: `$--${JSON.stringify(require('./public/theme.json'))
            .replaceAll(/("|{|})/g, '')
            .replaceAll(/,/g, ';$--')};`,
        },
      },
    },
    server: {
      host: '0.0.0.0',
      open: true,
      cors: true,
      proxy: {
        '/strategy': {
          // target: 'http://192.168.0.106:5015',
          target: 'http://47.96.109.226:6017',
          changeOrigin: true,
        },
        '/neet': {
          // target: 'http://192.168.0.106:6016',
          target: 'http://47.96.109.226:6017',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      VitePluginVue2Suffix(),
      createHtmlPlugin({
        minify: true,
        entry: '/src/main.js',
        template: 'public/index.html',
        inject: {
          data: {
            title: require('./src/settings').default.title,
          },
        },
      }),
      WindiCSS(),
      legacy({
        targets: ['ie >= 9', 'chrome >= 49'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
      AsyncCatch({
        catchCode: `console.error(e)`,
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        mockPath: 'src/mock',
        localEnabled: mode === 'mock',
      }),
      chunkSplitPlugin({
        strategy: 'single-vendor',
        customSplitting: {
          'single-vendor': ['tslib'],
        },
      }),
      viteCompression({
        filter: (file) => file.match(/\.(js|mjs|json|css|html)$/i) && !file.endsWith('index.html'),
      }),
      progress(),
    ],
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
  }
})
