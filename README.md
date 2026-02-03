# Gemini Notifier

系统桌面通知扩展，用于 Gemini CLI 代理事件提醒。

## 功能
- 当 Gemini CLI 请求工具执行权限或有重要通知时，在桌面弹出提示。
- 支持 Windows (PowerShell), macOS (osascript) 和 Linux (notify-send)。
- 支持支持 OSC 9 协议的终端（如 VSCode, iTerm2 等）。

## 安装
1. 下载并解压本项目。
2. 在项目根目录下运行：
   ```powershell
   gemini install .
   ```
   *注意：如果 Windows 提示脚本运行受限，请使用：*
   ```powershell
   powershell -ExecutionPolicy Bypass -Command "gemini install ."
   ```

## 核心文件
- `gemini-extension.json`: 插件元数据。
- `hooks/hooks.json`: 定义了通知触发钩子。
- `src/notify.js`: 跨平台通知逻辑。