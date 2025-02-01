<script setup>

</script>

<template>
  <div class="title-bar drag-region">
    <img class="logo" src="/logo.svg" alt="Omnitrans Logo"/>
    <div class="title">Omnitrans</div>
    <div class="logo-minor"></div>
  </div>
</template>

<style scoped>
.title-bar {
  height: 35px;
  background-color: #181818;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #2b2b2b;
}

.logo, .logo-minor {
  height: 20px;
  width: 20px;
  margin: 0 10px;
}

.title {
  color: #9d9d9d;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  flex: 1;
}

.drag-region {
  /* allow the user to drag the window by dragging on this element */
  -webkit-app-region: drag;
  user-select: none;
}

.no-drag {
  /* prevent the user from dragging the window by dragging on this element */
  -webkit-app-region: no-drag;
}
</style>
