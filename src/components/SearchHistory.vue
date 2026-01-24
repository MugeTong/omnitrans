<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useSearchHistoryStore} from '@/stores/search-history';

const textDom = ref();
const isOverflow = ref(false);
const historyStore = useSearchHistoryStore();

function handleTextAreaOverflow() {
  // compare the screen width and full width to toggle splitter
  isOverflow.value = textDom.value.scrollWidth > textDom.value.clientWidth;
}

// submit the search event and add the text to the text array.
function handleSearchClick(textValue: string) {
  historyStore.addText(textValue);
  historyStore.invokeSearch();
}

onMounted(() => {
  // listen the word container's width to decide whether to show the splitter
  new ResizeObserver(() => {
    handleTextAreaOverflow();
  }).observe(textDom.value);
});

</script>

<template>
  <!-- one container at the bottom to record texts searched-->
  <div class="serach-history-container">
    <div class="history-content" ref="textDom">
      <!-- add after-leave event to ensure the splitter can show normally -->
      <transition-group
          name="fade"
          tag="ul"
          @after-leave="handleTextAreaOverflow"
          @after-enter="handleTextAreaOverflow">
        <li v-for="text in historyStore.texts" :key="`${text.id}`">
          <button @click="handleSearchClick(text.value)">
            {{ text.value }}
          </button>
        </li>
      </transition-group>
    </div>
    <div class="splitter" :class="{ 'overflow': isOverflow }"></div>
    <span class="del-btn">
      <button @click="historyStore.clearTexts">清空记录</button>
    </span>
  </div>
</template>

<style scoped>
.serach-history-container {
  padding: 5px 10px;
  width: 100%;
  display: flex;
  border-top: 1px solid var(--color-border);
}

.history-content {
  flex: 1;
  overflow-x: auto;
  scroll-behavior: smooth;
}

.history-content::-webkit-scrollbar {
  display: none;
}

.history-content ul {
  position: relative;
  list-style: none;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.history-content ul li button {
  height: 32px;
  margin-right: 10px;
  padding: 3px 10px;
  color: #ffe;
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
  width: 0;
  margin: 4px 0px 4px 4px;
  height: calc(100% - 8px);
  background-color: var(--color-separator);
  border-radius: 1px;
}

.splitter.overflow {
  width: 2px;
}

.del-btn {
  width: 80px;
  margin-left: 10px;
}

.del-btn button {
  width: 100%;
  height: 32px;
  padding: 5px 10px;
  border-radius: 16px;
}

.del-btn button:hover {
  color: #ffe;
  font-weight: bold;
  background-color: #ff5449;
}
</style>
