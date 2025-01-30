<script setup>
import TitleBar from '@/components/TitleBar.vue';

const startResize = async (event) => {
  const initialX = event.clientX;
  const initialY = event.clientY;
  await bridge.OmniWindowGetSizeApi();

  const onMouseMove = async (moveEvent) => {
    const deltaX = moveEvent.clientX - initialX;
    const deltaY = moveEvent.clientY - initialY;
    await bridge.OmniWindowResizeApi(deltaY, deltaX);
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
  <title-bar/>
  <svg class="resize-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
       @mousedown="startResize">
    <path
        d="m985.33333,986.8718l-189.33335,0l0,-189.94874l189.33335,0l0,189.94874m0,-379.89745l-189.33335,0l0,-189.94872l189.33335,0l0,189.94872m-378.66667,379.89745l-189.33333,0l0,-189.94874l189.33333,0l0,189.94874m0,-379.89745l-189.33333,0l0,-189.94872l189.33333,0l0,189.94872m-378.66667,379.89745l-189.33333,0l0,-189.94874l189.33333,0l0,189.94874m757.33335,-759.79491l-189.33335,0l0,-189.94872l189.33335,0l0,189.94872z"/>
  </svg>

</template>

<style scoped>
.resize-icon {
  cursor: se-resize;
}


</style>