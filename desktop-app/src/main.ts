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
import cacheUtils from "./inMemoryCache";

let tray: Tray | null = null;
// let secretKey: string | null = null;

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

    ipcMain.handleOnce("set-password", async (event, password) => {
      logger.info("Password set event received");
      if (password) {
        resolve(password);
        // _password = password;
        win.close();
        return true;
      }
      return false;
    });

    win.on("closed", () => {
      logger.info("Password window closed");
      resolve("");
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
  logger.info("App ready event triggered");
  setupTray();
  try {
    const password = await promptForPassword();
    if (password) {
      cacheUtils.setPassword(password);
      logger.info("Starting service with secret key");
      utils.networking.startService(password);
    } else {
      logger.warn("No password provided");
    }
  } catch (error) {
    logger.error("Error during app initialization:", error);
  }
});

app.on("window-all-closed", () => {
  logger.info("All windows closed event triggered");
  if (process.platform !== "darwin") {
    // app.quit();
  }
});

app.on("will-quit", () => {
  logger.info("App will quit event triggered");
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error);
  dialog.showErrorBox("An error occurred", error.message);
});
