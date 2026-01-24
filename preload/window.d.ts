export {};

declare global {
  interface Window {
    // rustBridge is the bridge to communicate with Rust backend via ipc
    rustBridge: {
      listenDoubleCtrlC: (timeout: number) => Promise<void>;
    };

    // translationBridge is the bridge to communicate with translation via ipc
    translationBridge: {
      translate: (textValue: string) => Promise<string>;
    };

    // systemBridge is the bridge to communicate with system components via ipc
    systemBridge: {
      readClipboard: () => Promise<string>;
      getCursorScreenPoint: () => Promise<{ x: number; y: number }>;
    };

    // windowBridge is the bridge to communicate with app windows via ipc
    windowBridge: {
      showOmniWindow: () => Promise<void>;
      closeOmniWindow: () => Promise<void>;
      getOmniWindowSize: () => Promise<[number, number]>;
      resizeOmniWindow: (width: number, height: number) => Promise<void>;
    };

    // eventBridge is use to handle mesage from the main process without ipc
    // These functions are synchronous
    eventBridge: {
      onDoubleCtrlC: (callback: (...args: any[]) => void) => () => void;
      onEventTemplate: (callback: (...args: any[]) => void) => () => void;
    };
  }
}
