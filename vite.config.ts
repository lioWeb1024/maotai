import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'
import { createHtmlPlugin } from 'vite-plugin-html'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd())
    const lifecycle = process.env.npm_lifecycle_event

    return {
        plugins: [
            vue(),
            vueDevTools(),
            Components({
                resolvers: [AntDesignVueResolver({ importStyle: false, resolveIcons: true })],
            }),
            createHtmlPlugin({
                inject: {
                    data: {
                        ...env,
                    },
                },
            }),
            lifecycle === 'report' &&
                (visualizer({ open: true, filename: './dist/stats.html' }) as any),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            open: true,
            proxy: {
                '/Agent': {
                    target: env.VITE_API,
                    changeOrigin: true,
                },
            },
            cors: true,
        },
        build: {
            minify: 'terser',
            target: 'es2015',
            assetsInlineLimit: 0,
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log'],
                },
            },
            manifest: true,
            reportCompressedSize: false,
            rollupOptions: {
                output: {
                    sourcemap: false,
                    chunkFileNames: `static/js/[name]-[hash].js`,
                    entryFileNames: `static/js/[name]-[hash].js`,
                    assetFileNames: `static/[ext]/[name]-[hash].[ext]`,
                    manualChunks(id): string | undefined {
                        const regs = /(axios|crypto-js|dayjs|pinia|vue-clipboard3|vue-router)/i
                        if (id.includes('node_modules')) {
                            const names = id.toString().split('node_modules/')[1].split('/')[0]
                            if (regs.test(names)) {
                                return names.toString()
                            }
                        }
                        if (/(.scss)/.test(id)) {
                            return 'styles'
                        }
                        return undefined
                    },
                },
            },
        },
    }
})
