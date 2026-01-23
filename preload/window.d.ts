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

    // localBridge is the bridge to access local APIs without ipc
    // localBridge: {
    // };

    // eventBridge is use to handle mesage from the main process
    eventBridge: {
      // onOmniShow: (callback: (...args: any[]) => void) => () => void;
      onDoubleCtrlC: (callback: () => void) => () => void;
    };
  }
}
