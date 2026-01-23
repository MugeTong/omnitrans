<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import HomeView from '@/views/HomeView.vue';
import TitleBar from '@/components/TitleBar.vue';
import SearchHistory from '@/components/SearchHistory.vue';

onMounted(() => {
  // Listen for double Ctrl+C with a 400ms timeout
  window.rustBridge.listenDoubleCtrlC(400);
});
</script>

<template>
  <title-bar/>
  <home-view/>
  <search-history/>
</template>

<style scoped></style>
