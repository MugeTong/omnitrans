<script setup>

</script>

<template>
  <div class="title-bar drag-region">
    <img class="logo" src="@/assets/logo.svg" alt="Omnitrans Logo"/>
    <div class="title">Omnitrans</div>
    <div class="state-bar">
      <button class="minimize no-drag">-</button>
      <button class="maximize no-drag">+</button>
      <button class="close no-drag">x</button>
    </div>
  </div>
</template>

<style scoped>
.title-bar {
  height: 36px;
  background-color: #1f1f1f;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: #2b2b2b;
}
.logo {
  height: 24px;
  width: 24px;
  margin: 0 10px;
}

.title {
  color: #9d9d9d;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  flex: 1;
}


.drag-region{
  /* allow the user to drag the window by dragging on this element */
  -webkit-app-region: drag;
}
.no-drag{
  /* prevent the user from dragging the window by dragging on this element */
  -webkit-app-region: no-drag;
}

</style>