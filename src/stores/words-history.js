import {defineStore} from "pinia";
import {computed, ref} from "vue";

export const useWordsHistoryStore = defineStore('words-history', () => {
    const words = ref([]);
    const wordsCount = computed(() => words.value.length)
    const searchSign = ref(0);
    const Id = (i => () => i++)(0);

    function invokeSearch() {
        searchSign.value++;
    }

    function addWord(word) {
        if (wordsCount.value === 0 || words.value[0].value !== word) {
            words.value.unshift({id: Id(), value: word});
        }
    }

    function addWords(wordsArray) {
        wordsArray.forEach((word) => {
            addWord(word);
        });
    }

    function clearWords() {
        words.value = [];
    }

    addWords(['hello', 'world', 'This is a plain area to store words searched.', '|', '你好', '世界', '这个区域用以存放查找过的单词'].reverse());

    return {
        words,
        wordsCount,
        searchSign,
        invokeSearch,
        addWord,
        addWords,
        clearWords
    }
});