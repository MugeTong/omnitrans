import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import HistoryView from "../views/HistoryView.vue";
import WordbookView from "../views/WordbookView.vue";
import SettingsView from "../views/SettingsView.vue";

// If the application is opened via the file:// protocol (e.g., after Electron packaging),
// using hash mode can prevent history API navigation failures when there is no server support.
const useHash = typeof window !== "undefined" && window.location && window.location.protocol === "file:";

const router = createRouter({
  history: useHash ? createWebHashHistory() : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/history",
      name: "history",
      component: HistoryView,
    },
    {
      path: "/wordbook",
      name: "wordbook",
      component: WordbookView,
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
    },
  ],
});

export default router;
