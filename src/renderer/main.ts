
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import 'md-editor-v3/lib/style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', message, source, lineno, colno, error);
};

window.onunhandledrejection = (event) => {
  console.error('Unhandled promise rejection:', event.reason);
};

console.log('Vue app mounting...');
console.log('window.electronAPI:', window.electronAPI);

app.mount('#app');

console.log('Vue app mounted');
