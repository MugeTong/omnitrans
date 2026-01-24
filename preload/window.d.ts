export {};

declare global {
  interface Window {
    // rustBridge is the bridge to communicate with Rust backend
    rustBridge: {
      listenDoubleCtrlC: (timeout: number) => Promise<void>;
    };

    // translationBridge is the bridge to communicate with translation ipc
    translationBridge: {
      translate: (textValue: string) => Promise<string>;
    };

    // clipboardBridge is the bridge to communicate with clipboard ipc
    clipboardBridge: {
      readClipboard: () => Promise<string>;
    };

    // windowBridge is the bridge to communicate with app windows
    windowBridge: {
      closeOmniWindow: () => Promise<void>;
    };

    // eventBridge is use to handle mesage from the main process
    eventBridge: {
      onDoubleCtrlC: (callback: (...args: any[]) => void) => () => void;
      onEventTemplate: (callback: (...args: any[]) => void) => () => void;
    };
  }
}
