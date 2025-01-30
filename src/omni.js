import './assets/omni.css';

import {createApp} from 'vue';
import {createPinia} from 'pinia';
import Omni from '@/Omni.vue';

const app = createApp(Omni);

app.use(createPinia());

app.mount('#omni');