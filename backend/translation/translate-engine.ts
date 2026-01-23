import axios from "axios";

// In this repo, the simplified Chinese is "zh-CN" and the English is "en"

class TranslateEngine {
  engineName: string;
  engineMap: { [key: string]: (textValue: string, sl: string) => Promise<string> };
  translateApi: (textValue: string, sl: string) => Promise<string>;

  constructor(engineName: string) {
    this.engineName = engineName;
    this.engineMap = {
      fake: this.fakeTranslateApi,
      youdao: this.youdaoTranslateApi,
      baidu: this.baiduTranslateApi,
      bing: this.bingTranslateApi,
      google: this.googleTranslateApi,
      deepL: this.deepLTranslateApi,
    };
    this.translateApi = this.engineMap[engineName];
  }

  async fakeTranslateApi(textValue: string, sl: string) {
    return "fake search result";
  }

  async youdaoTranslateApi(textValue: string, sl: string) {
    const [sourceLanguage, targetLanguage] = sl === "zh-CN" ? ["zh-CHS", "en"] : ["en", "zh-CHS"];
    const response = await axios.post(
      "https://aidemo.youdao.com/trans",
      new URLSearchParams({
        q: textValue,
        from: sourceLanguage,
        to: targetLanguage,
      }),
    );
    const result = response.data.translation?.[0];
    if (result) {
      return result;
    } else {
      const errorCode = response.data.errorCode;
      console.error("[translate] Error in accessing youdao api", response.data);
      if (errorCode === 103) {
        return "内容过长，请尝试分段翻译。";
      } else if (errorCode === 411) {
        return "请求频率过快，请稍后再试。";
      } else if (errorCode === 113) {
        return "未在剪切板中找到有效文本。";
      }
      return response.data.msg || "Translation failed";
    }
  }

  async baiduTranslateApi(textValue: string, sl: string) {
    void sl;
    try {
      // for baidu translation, there is no need to provide the language
      const response = await axios.post(
        "https://fanyi.baidu.com/sug",
        new URLSearchParams({
          kw: textValue,
        }),
      );
      return response.data.data[0].v;
    } catch (err) {
      throw err;
    }
  }

  async bingTranslateApi(textValue: string, sl: string) {
    return "bing translation not implemented yet";
  }

  async googleTranslateApi(textValue: string, sl: string) {
    return "google translation not implemented yet";
  }

  async deepLTranslateApi(textValue: string, sl: string) {
    const sourceLanguage = sl === "zh-CN" ? "ZH" : "EN";
    const targetLanguage = sl === "zh-CN" ? "EN" : "ZH";
    return `DeepL translation from ${sourceLanguage} to ${targetLanguage} not implemented yet`;
  }

  async translate(textValue: string, sl: string) {
    return await this.translateApi(textValue, sl);
  }
}

async function languageDetectionApi(textValue: string) {
  try {
    const response = await axios.post(
      "https://fanyi.baidu.com/langdetect",
      new URLSearchParams({
        query: textValue,
      }),
    );
    return response.data["lan"];
  } catch (err) {
    throw err;
  }
}

async function localLanguageDetectionApi(textValue: string) {
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

export {TranslateEngine, languageDetectionApi, localLanguageDetectionApi};
