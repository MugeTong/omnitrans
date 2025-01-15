<script setup>
import {nextTick, onMounted, ref, watch} from 'vue';

const ulDom = ref();
const splitterDom = ref();
const words = ref(['hello', 'world', 'This is a plain area to store words searched.',
  '|','你好', '世界', '这个区域用以存放查找过的单词']);

const handleWordsOverflow = () => {
  if (ulDom.value.scrollWidth > ulDom.value.clientWidth) {
    splitterDom.value.classList.add('overflow');
  } else {
    splitterDom.value.classList.remove('overflow');
  }
}

onMounted(() => {
  new ResizeObserver(() => {
    handleWordsOverflow();
  }).observe(ulDom.value);

  watch(words, async () => {
    await nextTick();
    handleWordsOverflow();
  });
});


const addWord = (word) => {
  words.value.push(word);
}

const deleteWordsHistory = () => {
  words.value = [];
}

const searchWord = (word) => {
  console.log(word);
}

</script>

<template>
  <!-- one container at the bottom to record words searched-->
  <div class="container">
    <ul ref="ulDom">
      <li v-for="word in words" :key="word">
        <button @click="searchWord(word)">{{ word }}</button>
      </li>
    </ul>
    <span class="splitter" ref="splitterDom"></span>
    <span class="del-btn">
      <button @click="deleteWordsHistory">清空记录</button>
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

.container ul {
  width: calc(100% - 80px);
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex: 1;
  overflow: auto;
  scroll-behavior: smooth;
}

.splitter {
  height: 100%;
  width: 5px;
  border-right: 1px solid #2b2b2b00;
}

.splitter.overflow {
  border-right: 1px solid #2b2b2b;
}

.container ul::-webkit-scrollbar {
  display: none;
}

.container ul li button {
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