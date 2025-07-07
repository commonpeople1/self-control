// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'


export function createApp() {
  const app = createSSRApp(App)

  return {
    app
  }
}
// #endif