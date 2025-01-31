<script setup>

const omniText = defineModel('omniText', {type: String, default: ''});

const startResize = async (event) => {
  // listen to the mouse move and mouse up event to resize the window
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

const closeWindow = () => {
  bridge.OmniWindowCloseApi();
};

const copyResult = () => {
  navigator.clipboard.writeText(omniText.value);
  closeWindow();
};

</script>

<template>
  <div class="container">
    <div class="title-bar">
      <img class="logo" src="/logo.svg" alt="Omnitrans Logo"/>
      <div class="space"/>
      <button class="close-btn" @click="closeWindow">
        <img src="/close.svg" alt="Close"/>
      </button>
    </div>
    <textarea class="omni-result" v-model="omniText"/>
    <div class="option-bar">
      <button @click="copyResult"><img src="/copy.svg" alt="copy">复制</button>
      <div class="space"/>
    </div>
  </div>
  <img class="resize-icon" src="/resize.svg" alt="Resize" draggable="false" @mousedown="startResize"/>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

.title-bar, .option-bar {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.logo {
  height: 32px;
  width: 32px;
}

.space {
  flex: 1;
  height: 100%;
}

.close-btn {
  height: 100%;
  width: 36px;
  border: none;
  border-radius: 5px;
  color: #0d0d0d;
  cursor: pointer;
  background-color: #00000000;
  -webkit-app-region: no-drag;
  display: flex;
  justify-content: center;
  align-items: center;


  img {
    height: 100%;
    width: 100%
  }
}

.close-btn:hover {
  background-color: #cccccc;
}

textarea.omni-result {
  flex: 1;
  width: 100%;
  resize: none;
  padding: 8px 10px 0 10px;
  margin: 5px 0;
  border-radius: 6px;
  border: 1px solid #cccccc;
  font-size: 16px;
  color: #0d0d0d;
  outline: none;
  -webkit-app-region: no-drag;
}

textarea::-webkit-scrollbar {
  width: 8px; /* scrollbar width */
}

textarea::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0); /* track color */
}

textarea::-webkit-scrollbar-thumb {
  background-color: #dddddd;
  border-radius: 4px;
}

textarea:hover::-webkit-scrollbar-thumb {
  background-color: #c8c8c8;
}

textarea::-webkit-scrollbar-thumb:hover {
  background-color: #929292;
}

.option-bar {
  height: 32px;
  width: 100%;
}

.option-bar button {
  background-color: #ffffff;
  height: 100%;
  margin: 5px 10px 0 0;
  padding: 5px 10px;
  text-wrap: nowrap;
  font-size: 16px;
  font-weight: bolder;
  border: 1px solid #cccccc;
  border-radius: 5px;
  color: #0d0d0d;
  cursor: pointer;
  -webkit-app-region: no-drag;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 80%;
    width: 80%;
    margin-right: 5px;
  }
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