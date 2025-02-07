import './assets/main.css';

import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from '@/App.vue';
import router from '@/router';
import Notification from '@/components/Notification';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Notification);

app.mount('#app');

// This script listens for the theme event and toggles the dark class on the app element
const appDom = document.getElementById('app');
bridge.OnThemeChange((theme) => {
  console.log(`set theme to ${theme}`);
  appDom.classList.toggle('dark', theme === 'dark');
});
