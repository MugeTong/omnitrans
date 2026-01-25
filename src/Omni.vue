<script setup lang="ts">
import { clipboard } from "electron";
import { onMounted, onUnmounted } from "vue";
import { ResizeIcon, CopyIcon, CloseIcon } from "@/components/icons";

const omniText = defineModel("omniText", { type: String, default: "" });

const onWindowResize = async (event: MouseEvent) => {
  // listen to the mouse move and mouse up event to resize the window
  const initialX = event.clientX;
  const initialY = event.clientY;
  const [windowWidth, windowHeight] = await window.windowBridge.getOmniWindowSize();

  const onMouseMove = async (moveEvent: MouseEvent) => {
    const newWindowWidth = moveEvent.clientX - initialX + windowWidth;
    const newWindowHeight = moveEvent.clientY - initialY + windowHeight;
    window.windowBridge.resizeOmniWindow(newWindowWidth, newWindowHeight);
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

const onCloseWindow = () => {
  window.windowBridge.closeOmniWindow();
};

const onCopyResult = () => {
  // Copy the result to the clipboard and close the omni window
  navigator.clipboard.writeText(omniText.value);
  window.windowBridge.closeOmniWindow();
};

onMounted(() => {
  const unsubscribe = window.eventBridge.onDoubleCtrlC(async () => {
    //read text from the clipboard
    console.log("[omni] Detected double Ctrl+C");
    omniText.value = "Translating...";
    // Because the window may not get the focus immediately
    // It is necessary to get the clipboard from the main process
    const text = await window.systemBridge.readClipboard();
    console.log("[omni] Read text from clipboard:", text);
    omniText.value = await window.translationBridge.translate(text.trim());
  });

  onUnmounted(() => {
    unsubscribe();
  });
});
</script>

<template>
  <main>
    <!-- Resize Icon -->
    <resize-icon class="resize-icon" @mousedown="onWindowResize" />

    <!-- Title Bar -->
    <div class="title-bar">
      <img class="logo" src="/logo.svg" alt="Omnitrans Logo" />
      <div class="space" />
      <button class="close-btn" @click="onCloseWindow">
        <close-icon />
      </button>
    </div>

    <textarea class="omni-result" v-model="omniText" />

    <div class="option-bar">
      <button @click="onCopyResult"><copy-icon />复制</button>
      <div class="space" />
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100%;
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

.resize-icon {
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: se-resize;
  color: var(--color-text-lighter);
  -webkit-app-region: no-drag;
}

.title-bar,
.option-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.logo {
  height: 20px;
  width: 20px;
  user-select: none;
}

.space {
  flex: 1;
  height: 100%;
}

.close-btn {
  height: 24px;
  width: 24px;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  -webkit-app-region: no-drag;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    height: 16px;
    width: 16px;
    color: var(--color-text-lighter);
  }
}

textarea.omni-result {
  flex: 1;
  width: 100%;
  resize: none;
  padding: 8px 10px 0 10px;
  margin: 5px 0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  -webkit-app-region: no-drag;
}

.option-bar {
  height: 32px;
  width: 100%;
}

.option-bar button {
  height: 100%;
  padding: 5px 5px;
  text-wrap: nowrap;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  -webkit-app-region: no-drag;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 12px;
    width: 12px;
    margin-right: 5px;
  }
}
</style>
