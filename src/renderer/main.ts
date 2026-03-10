
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import 'md-editor-v3/lib/style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
