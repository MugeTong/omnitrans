use lazy_static::lazy_static;
use napi::threadsafe_function::{ThreadsafeFunction, ThreadsafeFunctionCallMode};
use napi_derive::napi;
use rdev::{Event, EventType, Key, listen};
use std::sync::Mutex;
use std::thread;
use std::time::{Duration, Instant};
use std::sync::atomic::{AtomicBool, Ordering};

lazy_static! {
    static ref LAST_PRESS_TIME: Mutex<Option<Instant>> = Mutex::new(None);
    static ref IS_CTRL_DOWN: Mutex<bool> = Mutex::new(false);
    static ref IS_LISTENING: AtomicBool = AtomicBool::new(false);
}

#[napi]
pub fn listen_double_ctrl_c(timeout: u32, callback: ThreadsafeFunction<()>) {
    // 如果已经启动过，直接返回。swap 方法会返回之前的值，如果之前是 true，说明已经启动了。
    if IS_LISTENING.swap(true, Ordering::Relaxed) {
        println!("⚠️ 监听线程已在运行，本次调用被忽略");
        return;
    }

    thread::spawn(move || {
        let listener_callback = move |event: Event| match event.event_type {
            EventType::KeyPress(Key::ControlLeft) | EventType::KeyPress(Key::ControlRight) => {
                *IS_CTRL_DOWN.lock().unwrap() = true;
            }
            EventType::KeyRelease(Key::ControlLeft) | EventType::KeyRelease(Key::ControlRight) => {
                *IS_CTRL_DOWN.lock().unwrap() = false;
            }
            EventType::KeyPress(Key::KeyC) => {
                let is_ctrl = *IS_CTRL_DOWN.lock().unwrap();
                if is_ctrl {
                    check_double_click(timeout, &callback);
                }
            }
            _ => {}
        };

        if let Err(error) = listen(listener_callback) {
            println!("监听错误: {:?}", error);
        }
    });
}

fn check_double_click(timeout: u32, tsfn: &ThreadsafeFunction<()>) {
    let mut last_time = LAST_PRESS_TIME.lock().unwrap();
    let now = Instant::now();
    if let Some(prev) = *last_time {
        if now.duration_since(prev) < Duration::from_millis(timeout as u64) {
            tsfn.call(Ok(()), ThreadsafeFunctionCallMode::Blocking);
            *last_time = None;
            return;
        }
    }
    *last_time = Some(now);
}
