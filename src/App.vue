<script setup lang="ts">
import { onMounted } from "vue";
import AppTitleBar from "@/components/AppTitleBar.vue";
import { Sidebar, SidebarTextItem } from "./components/sidebar";

onMounted(() => {
  // Listen for double Ctrl+C with a 400ms timeout
  window.rustBridge.listenDoubleCtrlC(400);
});
</script>

<template>
  <app-title-bar>
    <template #left>
      <sidebar>
        <sidebar-text-item name="workspace" routerName="home" />
        <sidebar-text-item name="history" routerName="history" />
        <sidebar-text-item name="wordbook" routerName="wordbook" />
        <sidebar-text-item name="settings" routerName="settings" />
      </sidebar>
    </template>
  </app-title-bar>
  <main>
    <div class="content-container">
      <router-view />
    </div>
  </main>
</template>

<style scoped>
main {
  position: relative;
  display: flex;
  width: 100%;
  /* Minus the title bar height */
  height: calc(100vh - 48px);
}

.content-container {
  position: relative;
  flex: 1;
  /* Ensure correct shrinking in flex layout */
  min-width: 0;
  background-color: var(--color-bg-content);
  overflow: hidden;
}
</style>
