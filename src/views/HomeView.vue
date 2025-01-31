<script setup>
import {onMounted, ref, watch} from 'vue';
import {useSearchHistoryStore} from '@/stores/search-history.js';

const historyStore = useSearchHistoryStore();
const typingText = defineModel('typingText', {type: String, default: ''});
const resultText = defineModel('resultText', {type: String, default: ''});
const leftArea = ref();

onMounted(() => {
  watch(() => historyStore.searchSign, async () => {
    typingText.value = historyStore.texts[0].value;
    try {
      resultText.value = await bridge.textTranslationApi(typingText.value);
    } catch (err) {
      resultText.value = '翻译失败，请稍后再试。';
    }
  });

  // detect the "Enter" key to invoke the search
  leftArea.value.addEventListener('keydown', e => {
    // users can press "Shift + Enter" to input a newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();  // prevent the newline
      e.target.blur();  // make the textarea lose the focus
      if (typingText.value.trim() === '') return;  // blank exclusion
      historyStore.addText(typingText.value);  // add the text to the history
      historyStore.invokeSearch();  // invoke the search
    }
  });

  // when the textarea loses focus, add text to the history and invoke search
  leftArea.value.addEventListener('blur', () => {
    if (typingText.value.trim() === '') return;  // blank exclusion
    historyStore.addText(typingText.value);
    historyStore.invokeSearch();
  });
});


</script>

<template>
  <div class="container">
    <div class="first-part">
      <textarea v-model="typingText" ref="leftArea"/>
    </div>
    <div class="splitter"/>
    <div class="second-part">
      <textarea v-model="resultText" readonly/>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.first-part, .second-part {
  height: 100%;
  width: 100%;
}

.first-part textarea:focus {
  border: 2px solid rgba(0, 120, 212, 1);
}

textarea {
  color: #eee;
  font-size: 36px;
  vertical-align: bottom;
  background-color: rgba(0, 0, 0, 0);
  height: 100%;
  width: 100%;
  resize: none;
  border: 2px solid rgba(0, 0, 0, 0);
  outline: none;
  padding: 0 10px 0 10px;
  cursor: default;
}

textarea::-webkit-scrollbar {
  width: 8px; /* scrollbar width */
}

textarea::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0); /* track color */
}

textarea::-webkit-scrollbar-thumb {
  background-color: #323232;
  border-radius: 4px;
}

textarea:hover::-webkit-scrollbar-thumb {
  background-color: #434343;
}

textarea::-webkit-scrollbar-thumb:hover {
  background-color: #4f4f4f;
}

.splitter {
  height: 100%;
  width: 1px;
  background-color: #2b2b2b;
}
</style>
