import {defineStore} from 'pinia';
import {computed, ref} from 'vue';

export const useSearchHistoryStore = defineStore('search-history', () => {
  const texts = ref([]);
  const textsCount = computed(() => texts.value.length);
  const searchSign = ref(0);
  const Id = (i => () => i++)(0);

  function invokeSearch() {
    searchSign.value++;
  }

  function addText(textValue) {
    if (textsCount.value === 0 || texts.value[0].value !== textValue) {
      texts.value.unshift({id: Id(), value: textValue});
    }
  }

  function addTexts(textsArray) {
    textsArray.forEach((textValue) => {
      addText(textValue);
    });
  }

  function clearTexts() {
    texts.value = [];
  }

  addTexts([
    'hello',
    'world',
    'This is a plain area to store words searched.',
    '|',
    '你好',
    '世界',
    '这个区域用以存放查找过的单词'].reverse());

  return {
    texts,
    textsCount,
    searchSign,
    invokeSearch,
    addText,
    addTexts,
    clearTexts,
  };
});
