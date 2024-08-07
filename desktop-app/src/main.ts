import {
  app,
  Menu,
  nativeImage,
  Tray,
  dialog,
  BrowserWindow,
  ipcMain,
} from "electron";
import * as path from "path";

import utils from "./utils";
import preferences from "./preferences";
import logger from "./logger";

let tray: Tray | null = null;
let secretKey: string | null = null;

function promptForPassword() {
  return new Promise<string>((resolve) => {
    const win = new BrowserWindow({
      frame: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    win.loadFile("src/password.html");
    
    ipcMain.once("set-password", (event, password) => {
      if (password) {
        resolve(password);
      } else {
        app.quit();
      }
      win.close();
    });

    win.on("closed", () => {
      if (!secretKey) {
        app.quit();
      }
    });
  });
}

function setupTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, "icon.png"));
  console.log("app ready", icon, app.getPath("appData"));
  tray = new Tray(icon); // Make sure to have an icon.png in the same directory
  const contextMenu = Menu.buildFromTemplate([
    { label: "Start Service", click: utils.networking.startService },
    { label: "Stop Service", click: utils.networking.stopService },
    { label: "Preferences", click: preferences.openPreferences },
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.setToolTip("Service Status: Stopped");
  tray.setContextMenu(contextMenu);
}

app.on("ready", async () => {
  secretKey = await promptForPassword();
  setupTray();
  utils.networking.startService(secretKey);
});
