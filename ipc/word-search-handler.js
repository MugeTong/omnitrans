import {ipcMain} from "electron";
import axios from "axios";

const searchApis = {
    fake: fakeSearchApi,
    youdao: youdaoSearchApi,
    baidu: baiduSearchApi
}

async function languageDetectionApi(wordValue) {
    try {
        const response = await axios.post(
            "https://fanyi.baidu.com/langdetect",
            new URLSearchParams({
                'query': wordValue
            }));
        return response.data["lan"];
    } catch (err) {
        throw err;
    }
}

async function fakeSearchApi(wordValue, language) {
    return wordValue;
}

async function youdaoSearchApi(wordValue, language) {
    try {
        const response = await axios.post(
            "https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4",
            new URLSearchParams({
                'q': wordValue, 'le': 'en', 'client': 'web', 'keyfrom': 'webdict'
            }));
        const dicts = response.data["meta"]["dicts"];
        if (dicts.includes("fanyi")) {
            // if the "fanyi" part is available, the word may be one sentence
            return response.data["fanyi"]["tran"];
        } else {
            console.log(response.data);
            // use baiduApi to search word
            return await baiduSearchApi(wordValue, language);
        }
    } catch (err) {
        throw err;
    }
}

async function baiduSearchApi(wordValue, language) {
    try {
        // for baidu translation, there is no need to provide the language
        const response = await axios.post(
            "https://fanyi.baidu.com/sug",
            new URLSearchParams({
                'kw': wordValue
            }));
        return response.data.data[0].v;
    } catch (err) {
        throw err;
    }
}


export function setupWordSearchHandler() {
    ipcMain.handle('on-search-word', async (e, wordValue) => {
        // const language = await languageDetectionApi(wordValue);
        return await searchApis.youdao(wordValue);
    })
}
