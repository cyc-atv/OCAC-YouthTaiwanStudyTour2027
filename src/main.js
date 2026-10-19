import { ViteSSG } from 'vite-ssg/single-page'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import App from './App.vue'

export const createApp = ViteSSG(App, async () => {
    if (!import.meta.env.SSR) {
        await import('bootstrap/dist/js/bootstrap.bundle.min.js')
    }
})