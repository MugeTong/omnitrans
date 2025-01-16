import {defineStore} from "pinia";
import {ref} from "vue";

export const useWordsHistoryStore = defineStore('counter', () => {
    const words = ref(['hello', 'world', 'This is a plain area to store words searched.', '|', '你好', '世界', '这个区域用以存放查找过的单词']);
    const searchSign = ref(0);
    const typingWord = ref('');

    function invokeSearch() {
        searchSign.value++;
    }

    function addWord(word) {
        if (words.value[0] !== word) {
            words.value.unshift(word);
        }
    }

    function clearWords() {
        words.value = [];
    }

    return {
        words, searchSign, typingWord, invokeSearch, addWord, clearWords,
    }
});