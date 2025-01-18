<script setup>
import {onMounted, ref, watch} from "vue";
import {useWordsHistoryStore} from "@/stores/words-history.js";

const wordsStore = useWordsHistoryStore();
const typingWord = defineModel("typingWord");
const resultWord = defineModel("resultWord");
const leftArea = ref();


onMounted(() => {
  watch(() => wordsStore.searchSign, async () => {
    typingWord.value = wordsStore.words[0].value;
    resultWord.value = await bridge.wordSearchApi(typingWord.value);
  });

  leftArea.value.addEventListener('keydown', e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.target.blur();  // make the textarea lose the focus
      wordsStore.addWord(typingWord.value);
      wordsStore.invokeSearch();
    }
  });
});


</script>

<template>
  <div class="container">
    <div class="first-part">
      <textarea v-model="typingWord" ref="leftArea"/>
    </div>
    <div class="splitter"/>
    <div class="second-part">
      <textarea v-model="resultWord" readonly/>
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


textarea {
  color: #eee;
  font-size: 36px;
  vertical-align: bottom;
  background-color: rgba(0, 0, 0, 0);
  height: 100%;
  width: 100%;
  resize: none;
  border: none;
  outline: none;
  padding: 0 10px 0 10px;
  cursor: default;
}

textarea::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}

textarea::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0); /* 轨道颜色 */
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
