import {ipcMain} from "electron";
import axios from "axios";

class TranslateEngine {
    constructor(engineName) {
        this.engineName = engineName;
        this.engineMap = {
            fake: this.fakeTranslateApi,
            youdao: this.youdaoTranslateApi,
            baidu: this.baiduTranslateApi,
            bing: this.bingTranslateApi,
            google: this.googleTranslateApi,
            deepL: this.deepLTranslateApi
        }
        this.setEngineSource(this.engineName);
    }

    setEngineSource(engineName) {
        this.translateApi = this.engineMap[engineName];
    }

    async fakeTranslateApi(textValue, sl) {
        void sl;
        return "fake search result";
    }

    async youdaoTranslateApi(textValue, sl) {
        const sourceLanguage = sl === "zh-CN" ? "zh-CHS" : "en";
        const targetLanguage = sl === "zh-CN" ? "en" : "zh-CHS";
        try {
            const response = await axios.post(
                "https://aidemo.youdao.com/trans",
                new URLSearchParams({
                    q: textValue, from: sourceLanguage, to: targetLanguage
                }));
            const result = response.data["translation"][0];
            console.log(result);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async baiduTranslateApi(textValue, sl) {
        void sl;
        try {
            // for baidu translation, there is no need to provide the language
            const response = await axios.post(
                "https://fanyi.baidu.com/sug",
                new URLSearchParams({
                    'kw': textValue
                }));
            return response.data.data[0].v;
        } catch (err) {
            throw err;
        }
    }

    async bingTranslateApi(textValue, sl) {
    }

    async googleTranslateApi(textValue, sl) {
    }

    async deepLTranslateApi(textValue, sl) {
        const sourceLanguage = sl === "zh-CN" ? "ZH" : "EN";
        const targetLanguage = sl === "zh-CN" ? "EN" : "ZH";
    }

    async translate(textValue, sl) {
        return await this.translateApi(textValue, sl);
    }
}

async function languageDetectionApi(textValue) {
    try {
        const response = await axios.post(
            "https://fanyi.baidu.com/langdetect",
            new URLSearchParams({
                'query': textValue
            }));
        return response.data["lan"];
    } catch (err) {
        throw err;
    }
}

async function localLanguageDetectionApi(textValue) {
    let chineseCount = 0;
    let englishCount = 0;

    for (let char of textValue) {
        if (/[A-Za-z]/.test(char)) {
            englishCount++;
        } else if (/[\u4E00-\u9FA5\u3400-\u4DBF\u20000-\u2A6DF]/.test(char)) {
            chineseCount++;
        }
    }
    if (englishCount > chineseCount) return "en";
    return "zh-CN";
}

// In this repo, the simplified Chinese is "zh-CN" and the English is "en"
const translateEngine = new TranslateEngine("youdao");

export function setupTextTranslationHandler() {
    ipcMain.handle('on-translate-text', async (e, textValue) => {
        const languageFrom = await localLanguageDetectionApi(textValue);
        return await translateEngine.translate(textValue, languageFrom);
    });

    // ipcMain.handle('on-set-translation-engine', async (e, engineName) => {
    //     translateEngine.setEngineSource(engineName);
    // });
}
