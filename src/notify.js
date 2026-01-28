#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Read payload from stdin
const payload = fs.readFileSync(0, "utf-8");

let data;
try {
  data = JSON.parse(payload);
} catch (e) {
  // Fail silently or log to debug
  process.exit(0);
}

// Only handle ToolPermission for now
if (data.notification_type !== "ToolPermission") {
  process.exit(0);
}

const message = data.message || "Gemini Agent requires attention";
const title = "Gemini CLI";

// Orchestration Logic
// 1. Try Terminal Native
// 2. Try OS Native (Fallback)

async function notify() {
  const terminalSuccess = await tryTerminalNotification(title, message);
  if (!terminalSuccess) {
    await tryOSNotification(title, message);
  }
}

// Supported terminals for OSC 9
const ALLOWLISTED_TERMINALS = [
  "ghostty",
  "iterm.app",
  "iterm2",
  "kitty",
  "vscode",
  "apple_terminal",
];

async function tryTerminalNotification(title, message) {
  const termProgram = (process.env.TERM_PROGRAM || "").toLowerCase();

  // Check if we are in an allowlisted terminal
  const isSupported = ALLOWLISTED_TERMINALS.some((term) =>
    termProgram.includes(term),
  );

  if (isSupported) {
    // OSC 9: \x1b]9;{message}\x07 (iTerm2 notification protocol)
    // We send it to stdout. The terminal emulator should intercept it.
    process.stdout.write(`\x1b]9;${message}\x07`);
    return true;
  }

  return false;
}

async function tryOSNotification(title, message) {
  const platform = process.platform;

  if (platform === "darwin") {
    return notifyMacOS(title, message);
  } else if (platform === "linux") {
    return notifyLinux(title, message);
  }

  return false;
}

function notifyMacOS(title, message) {
  return new Promise((resolve) => {
    // Check for osascript
    exec("which osascript", (err) => {
      if (err) return resolve(false);

      // Escape quotes for AppleScript
      const safeTitle = title.replace(/"/g, '\\"');
      const safeMessage = message.replace(/"/g, '\\"');

      const script = `display notification "${safeMessage}" with title "${safeTitle}"`;

      exec(`osascript -e '${script}'`, (err) => {
        if (err) resolve(false);
        else resolve(true);
      });
    });
  });
}

function notifyLinux(title, message) {
  return new Promise((resolve) => {
    // Check for notify-send
    exec("which notify-send", (err) => {
      if (err) return resolve(false);

      // Simple execution
      // Note: In a real shell script we'd be more careful with escaping,
      // but exec handles some of it if we are careful.
      // Ideally we'd use spawn but exec is shorter for this prototype.
      const safeTitle = title.replace(/"/g, '\\"');
      const safeMessage = message.replace(/"/g, '\\"');

      exec(`notify-send "${safeTitle}" "${safeMessage}"`, (err) => {
        if (err) resolve(false);
        else resolve(true);
      });
    });
  });
}

notify();
