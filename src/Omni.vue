<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import { onMounted, onUnmounted } from "vue";


onMounted(() => {
    const unsubscribe = window.api.onOmniShow(() => {
        console.log("Omni window is shown");
    });
    // Clean up the listener when the component is unmounted
    onUnmounted(() => {
        unsubscribe();
    });
});
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
        This is the Omni Window
    </div>
  </header>
</template>

<style scoped>
</style>
