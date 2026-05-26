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
  // Fail silently
  process.exit(0);
}

// Only handle ToolPermission for now
if (data.notification_type !== "ToolPermission") {
  process.exit(0);
}

const message = data.message || "Gemini Agent requires attention";
const title = "Gemini CLI";

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

  const isSupported = ALLOWLISTED_TERMINALS.some((term) =>
    termProgram.includes(term),
  );

  if (isSupported) {
    process.stdout.write(`\x1b]9;${message}\x07`);
    return true;
  }

  return false;
}

async function tryOSNotification(title, message) {
  const platform = process.platform;

  if (platform === "darwin") {
    return notifyMacOS(title, message);
  } else if (platform === "linux" || platform === "android") {
    // Try Termux first, then standard Linux
    const isTermux = await notifyTermux(title, message);
    if (isTermux) return true;
    return notifyLinux(title, message);
  }

  return false;
}

function notifyTermux(title, message) {
  return new Promise((resolve) => {
    exec("which termux-notification", (err) => {
      if (err) return resolve(false);

      const safeTitle = title.replace(/"/g, '\\"');
      const safeMessage = message.replace(/"/g, '\\"');

      exec(
        `termux-notification --title "${safeTitle}" --content "${safeMessage}"`,
        (err) => {
          if (err) resolve(false);
          else resolve(true);
        },
      );
    });
  });
}

function notifyMacOS(title, message) {
  return new Promise((resolve) => {
    exec("which osascript", (err) => {
      if (err) return resolve(false);

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
    exec("which notify-send", (err) => {
      if (err) return resolve(false);

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
