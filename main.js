import { createSSRApp } from 'vue'
import App from './App'
import cuCustom from '@/colorui/components/cu-custom.vue'

export function createApp() {
    const app = createSSRApp(App)
    app.component('cu-custom', cuCustom)
    return {
        app
    }
}