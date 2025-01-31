<script setup>

const startResize = async (event) => {
  const initialX = event.clientX;
  const initialY = event.clientY;
  bridge.OmniWindowGetSizeApi();

  const onMouseMove = async (moveEvent) => {
    const deltaX = moveEvent.clientX - initialX;
    const deltaY = moveEvent.clientY - initialY;
    bridge.OmniWindowResizeApi(deltaY, deltaX);
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};
</script>

<template>
  <div class="container">
    <div class="title-bar">
      <img class="logo" src="/logo.svg" alt="Omnitrans Logo"/>
    </div>
  </div>
  <img class="resize-icon" src="/resize.svg" alt="Resize" draggable="false" @mousedown="startResize"/>
</template>

<style scoped>
.container {
  display: flex;
  flex: 1;
  width: 100%;
  border: 1px solid #2b2b2b;
}

.title-bar {
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.logo {
  height: 20px;
  width: 20px;
  margin: 0 10px;
}

.resize-icon {
  position: absolute;
  left: calc(100% - 16px - 4px);
  top: calc(100% - 16px - 4px);
  padding-right: 16px;
  padding-bottom: 16px;
  cursor: se-resize;
  -webkit-app-region: no-drag;
}

</style>