import "./assets/omni.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import Omni from "./Omni.vue";

const omni = createApp(Omni);

omni.use(createPinia());

omni.mount("#omni");
