<script setup>
import {onMounted, ref} from 'vue';
import {useWordsHistoryStore} from "@/stores/words-history.js";

const wordsDivDom = ref();
const splitterDom = ref();
const wordsStore = useWordsHistoryStore();

function handleWordsOverflow() {
  // compare the screen width and full width to toggle splitter
  const isOverflow = wordsDivDom.value.scrollWidth > wordsDivDom.value.clientWidth;
  splitterDom.value.classList.toggle('overflow', isOverflow);
}

// submit the search event and add the words to the word array.
function handleSearchClick(word) {
  wordsStore.addWord(word);
  wordsStore.invokeSearch();
}

onMounted(() => {
  // listen the word container's width to decide whether to show the splitter
  new ResizeObserver(() => {
    handleWordsOverflow();
  }).observe(wordsDivDom.value);
});

</script>

<template>
  <!-- one container at the bottom to record words searched-->
  <div class="container">
    <div ref="wordsDivDom">
      <!-- add after-leave event to ensure the splitter can show normally -->
      <transition-group
          name="fade"
          tag="ul"
          @after-leave="handleWordsOverflow"
          @after-enter="handleWordsOverflow">
        <li v-for="word in wordsStore.words" :key="`${word.id}`">
          <button @click="handleSearchClick(word.value)">
            {{ word.value }}
          </button>
        </li>
      </transition-group>
    </div>
    <span class="splitter" ref="splitterDom"></span>
    <span class="del-btn">
      <button @click="wordsStore.clearWords">清空记录</button>
    </span>
  </div>
</template>

<style scoped>
.container {
  padding: 5px 10px;
  width: 100%;
  display: flex;
  border-top: 1px solid #2b2b2b;
}

.container div {
  flex: 1;
  overflow-x: auto;
  scroll-behavior: smooth;
}

.container div::-webkit-scrollbar {
  display: none;
}

.container div ul {
  position: relative;
  list-style: none;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.container div ul li button {
  height: 32px;
  color: #fff;
  margin-right: 10px;
  padding: 3px 10px;
  background-color: #0078d4;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  text-wrap: nowrap;
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure the leaving dom can be deleted from the context,
 * so that the moving animation can be calculated correctly.
 */
.fade-leave-active {
  position: absolute;
}

.splitter {
  height: 100%;
  width: 5px;
  border-right: 1px solid #2b2b2b00;
}

.splitter.overflow {
  border-right: 1px solid #2b2b2b;
}

.del-btn {
  width: 80px;
  margin-left: 10px;
}

.del-btn button {
  width: 100%;
  height: 32px;
  padding: 5px 10px;
  background-color: rgba(55, 55, 55, 0);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  border: 1px solid #2b2b2b;
  cursor: pointer;
  transition: all 0.3s;
}

.del-btn button:hover {
  color: #ffe;
  font-weight: bold;
  background-color: #ff5449;
}

</style>