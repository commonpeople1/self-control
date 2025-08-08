// #ifdef VUE3
import { createSSRApp } from 'vue';
import App from './App.vue';
import { initTabBarI18n } from './utils/tabBarI18n.js';

export function createApp() {
  const app = createSSRApp(App);

  return {
    app,
  };
}
// #endif
