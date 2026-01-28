# Gemini Notifier Extension

A Gemini CLI extension that provides desktop system notifications when the agent requires attention (e.g., waiting for tool permissions).

## Features

- **Native Terminal Notifications**: Supports modern terminals (Ghostty, iTerm2, Kitty, VSCode) via OSC escape codes.
- **OS Fallback**: Falls back to system-level notifications (`osascript` on macOS, `notify-send` on Linux) if the terminal is not supported.
- **Zero Config**: Works out of the box with the Gemini CLI `Notification` hook.

## Supported Environments

### Terminals (Native Integration)
The extension attempts to send native terminal notifications (OSC 9) for the following:
- Ghostty
- iTerm2
- Kitty
- VS Code Terminal
- Apple Terminal

### Operating Systems (Fallback)
If the terminal is not detected or supported, the extension attempts to use OS utilities:

- **macOS**: Uses `osascript` (built-in).
- **Linux**: Uses `notify-send`.
  - **Requirement**: Ensure `libnotify-bin` (Debian/Ubuntu) or `libnotify` (Arch/Fedora) is installed.
  - Test with: `notify-send "Test" "Message"`

## Installation

This extension is typically installed via the Gemini CLI extensions manager.

```bash
gemini extensions install https://github.com/thoreinstein/gemini-notifier
# OR linked locally
gemini extensions link .
```

## How it Works

1. The extension registers a **Notification** hook with the Gemini CLI.
2. When the CLI emits a `ToolPermission` event (Agent waiting for user), the hook triggers.
3. The script (`src/notify.js`) checks your `TERM_PROGRAM` environment variable.
4. If a supported terminal is found, it sends an escape code to stdout.
5. If not, it attempts to spawn a system notification process (`osascript` or `notify-send`).
