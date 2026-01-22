// This file is used to dynamically load the Rust-compiled node module in the Electron main process, no changes needed
import { app } from "electron";
import { createRequire } from "module";
import type * as NativeModule from "../out/rust/index";

// For different environments, load the dynamic link library path to ensure correct loading in both development and production
const dynamicModulePath = app.isPackaged ? "./rust/src-rust.node" : "../out/rust/src-rust.node";
const rust: typeof NativeModule = createRequire(import.meta.url)(dynamicModulePath);
export default rust;
