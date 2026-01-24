<script setup lang="ts">
</script>

<template>
  <div class="sidebar-container">
    <div class="sidebar-inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  position: sticky;
  top: 0;
  z-index: 999;
  width: auto;
  height: 48px;
  border-radius: 0;
  background-color: color-mix(in srgb, var(--color-bg-base), transparent 20%);
}

.sidebar-inner {
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
}
</style>
