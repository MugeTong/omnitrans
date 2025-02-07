import './assets/omni.css';

import {createApp} from 'vue';
import {createPinia} from 'pinia';
import Omni from '@/Omni.vue';

const app = createApp(Omni);

app.use(createPinia());

app.mount('#omni');

// This script listens for the theme event and toggles the dark class on the omni element
const omniDom = document.getElementById('omni');
bridge.OnThemeChange((theme) => {
  console.log(`set theme to ${theme}`);
  omniDom.classList.toggle('dark', theme === 'dark');
});
