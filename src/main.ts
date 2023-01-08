import { createApp } from 'vue';
import { Quasar } from 'quasar';

import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/material-icons/material-icons.css';

import 'quasar/dist/quasar.css';

import './style.scss';

import App from './App.vue';

const app = createApp(App);

app.use(Quasar);
app.mount('#app');
