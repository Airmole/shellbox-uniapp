import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import App from './App'
import cuCustom from '@/colorui/components/cu-custom.vue'


export function createApp() {
    const app = createSSRApp(App)
	app.use(Pinia.createPinia());
    app.component('cu-custom', cuCustom)
    return {
        app,
		Pinia
    }
}