// Compile: g++ clipboardListener.cpp -o clipboardListener -luser32
#define UNICODE
#include <windows.h>
#include <winuser.h>
#include <iostream>
using namespace std;

// global variables for console handler and message window
#define WINDOW_CLASS_NAME L"OmnitransClipboardListener"
HWND hwnd;  // message window handle

// error checking macro
#define CHECK(expr, msg)          \
    if (!(expr)) {                \
        std::cerr << msg << ": "  \
                  << GetLastError() << std::endl; \
        return EXIT_FAILURE;      \
    }

BOOL WINAPI ConsoleHandler(const DWORD signal) {
    if (signal == CTRL_C_EVENT || signal == CTRL_CLOSE_EVENT) {
        RemoveClipboardFormatListener(hwnd);
        DestroyWindow(hwnd);
        UnregisterClass(WINDOW_CLASS_NAME, GetModuleHandle(nullptr));
        exit(0);
    }
    return TRUE;
}


// function handling window messages
LRESULT CALLBACK WindowProc(const HWND hwnd, const UINT uMsg, const WPARAM wParam, const LPARAM lParam) {
    if (uMsg == WM_CLIPBOARDUPDATE) {
        // handle clipboard update event
        cout << WM_CLIPBOARDUPDATE << endl;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}

int main() {
    try {
        // register message window class
        WNDCLASS wc = {};
        wc.lpfnWndProc = WindowProc;  // set window procedure
        wc.hInstance = GetModuleHandle(nullptr);  // get current module handle
        wc.lpszClassName = WINDOW_CLASS_NAME;  // set window class name
        RegisterClass(&wc);

        // create message-only window
        hwnd = CreateWindowEx(0, wc.lpszClassName, L"Clipboard Listener", 0, 0, 0, 0, 0,
                              HWND_MESSAGE, nullptr, wc.hInstance, nullptr);
        CHECK(hwnd, "Create message window failed");

        // add clipboard format listener
        CHECK(AddClipboardFormatListener(hwnd), "Failed to add clipboard format listener");
        // add console handler
        CHECK(SetConsoleCtrlHandler(ConsoleHandler, TRUE), "Failed to set console handler");

        // main message loop
        MSG msg;
        while (GetMessage(&msg, nullptr, 0, 0)) {
            TranslateMessage(&msg);
            DispatchMessage(&msg);  // dispatch message to window procedure
        }
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}
