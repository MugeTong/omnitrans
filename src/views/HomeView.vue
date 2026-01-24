<script setup>
import { onMounted, ref, watch } from "vue";
import SearchHistory from "@/components/SearchHistory.vue";
import { useSearchHistoryStore } from "@/stores/search-history.js";

const historyStore = useSearchHistoryStore();
const typingText = defineModel("typingText", { type: String, default: "" });
const resultText = defineModel("resultText", { type: String, default: "" });
const leftArea = ref();

onMounted(() => {
  watch(
    () => historyStore.searchSign,
    async () => {
      typingText.value = historyStore.texts[0].value;
      try {
        resultText.value = await window.translationBridge.translate(typingText.value);
      } catch (err) {
        resultText.value = "翻译失败，请稍后再试。" + err;
      }
    },
  );

  // detect the "Enter" key to invoke the search
  leftArea.value.addEventListener("keydown", (e) => {
    // users can press "Shift + Enter" to input a newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent the newline
      e.target.blur(); // make the textarea lose the focus
      if (typingText.value.trim() === "") return; // blank exclusion
      historyStore.addText(typingText.value); // add the text to the history
      historyStore.invokeSearch(); // invoke the search
    }
  });

  // when the textarea loses focus, add text to the history and invoke search
  leftArea.value.addEventListener("blur", () => {
    if (typingText.value.trim() === "") return; // blank exclusion
    historyStore.addText(typingText.value);
    historyStore.invokeSearch();
  });
});
</script>

<template>
  <div class="home-view">
    <div class="search-container">
      <div class="first-part">
        <textarea v-model="typingText" ref="leftArea" />
      </div>
      <div class="splitter" />
      <div class="second-part">
        <textarea v-model="resultText" readonly />
      </div>
    </div>
    <search-history />
  </div>
</template>

<style scoped>
.home-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.search-container {
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.first-part,
.second-part {
  height: 100%;
  width: 100%;
}

.first-part textarea:focus {
  border: 2px solid var(--color-accent);
}

textarea {
  font-size: 36px;
  vertical-align: bottom;
  height: 100%;
  width: 100%;
  resize: none;
  border: 2px solid rgba(0, 0, 0, 0);
  outline: none;
  padding: 0 10px 0 10px;
  cursor: default;
}

.splitter {
  height: 100%;
  width: 2px;
  background-color: var(--color-separator);
}
</style>
