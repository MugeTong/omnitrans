import { ipcMain } from "electron";
import { TranslateEngine, languageDetectionApi, localLanguageDetectionApi } from "./translate-engine";


const translateEngine = new TranslateEngine("youdao");

function registerTranslationIpcHandlers(mainWindow: Electron.BrowserWindow, omniWindow: Electron.BrowserWindow) {
  ipcMain.handle("translation:translate", async (event, textValue: string) => {
    console.log("[translate IPC] Received text for translation:", textValue);
    const languageFrom = await localLanguageDetectionApi(textValue);
    const result = await translateEngine.translate(textValue, languageFrom);
    console.log("[translate IPC] Translation result:", result);
    return result;
  });

  ipcMain.handle("translation:detectLanguage", async (event, textValue: string) => {
    return await localLanguageDetectionApi(textValue);
  });
}

export { registerTranslationIpcHandlers };
