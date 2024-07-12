import { app, Menu, nativeImage, Tray } from 'electron';
import * as path from 'path';

import utils from './utils';

let tray: Tray | null = null;

function setupTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'icon.png'));
  console.log('app ready', icon, app.getPath('appData'));
  tray = new Tray(icon); // Make sure to have an icon.png in the same directory
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Start Service', click: utils.networking.startService },
    { label: 'Stop Service', click: utils.networking.stopService },
    // { label: 'Preferences', click: preferences.openPreferences },
    { label: 'Quit', click: () => app.quit() },
  ]);
  tray.setToolTip('Service Status: Stopped');
  tray.setContextMenu(contextMenu);
}

app.on('ready', () => {
  setupTray();
  utils.networking.startService();
});
