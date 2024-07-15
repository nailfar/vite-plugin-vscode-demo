import { createApp } from 'vue';
import App from './App.vue';
import 'virtual:uno.css'
import '@vscode/codicons/dist/codicon.css'


// import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
const app = createApp(App)
app.mount('#app');
// app.use(ArcoVue);
