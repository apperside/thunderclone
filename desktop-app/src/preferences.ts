import { app, Tray, Menu, nativeImage, ipcMain } from 'electron';
// import Store from 'electron-store';
import * as path from 'path';
import * as net from 'net';
import { exec } from 'child_process';
import { WebSocketServer } from 'ws';
import { Notification } from 'electron';
import winston from 'winston';
import { BrowserWindow } from 'electron';
//@ts-ignore
import ElectronPreferences from 'electron-preferences';

function openPreferences() {
  // const preferencesWindow = new BrowserWindow({
  //   width: 400,
  //   height: 300,
  //   webPreferences: {
  //     nodeIntegration: true,
  //     contextIsolation: true,
  //   },
  // });
  // preferencesWindow.on('close', function (evt) {
  //   if (!isAppQuitting) {
  //     evt.preventDefault();
  //   }
  // });

  // preferencesWindow.loadFile('preferences.html');

  const preferences = new ElectronPreferences({
    config: {
      debounce: 150, // debounce preference save settings event; 0 to disable
    },

    // Override default preference BrowserWindow values
    browserWindowOverrides: {
      /* ... */
    },

    // Create an optional menu bar
    // menu: Menu.buildFromTemplate(/* ... */),

    // Provide a custom CSS file, relative to your appPath.
    css: 'preference-styles.css',

    // Preference file path. Where your preferences are saved (required)
    dataStore: path.join(app.getPath('userData'), 'preferences.json'),

    // Preference default values
    defaults: {
      about: {
        name: 'Albert',
      },
    },
    menu: Menu.buildFromTemplate([
      {
        label: 'Window',
        role: 'window',
        submenu: [
          {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close',
          },
        ],
      },
    ]),
    // Preference sections visible to the UI
    sections: [
      {
        id: 'about',
        label: 'About You',
        icon: 'single-01', // See the list of available icons below
        form: {
          groups: [
            {
              label: 'About You', // optional
              fields: [
                {
                  label: 'Name',
                  key: 'name',
                  type: 'text',
                  help: 'What is your name?',
                },
                // ...
              ],
            },
            // ...
          ],
        },
      },
      // ...
    ],
  });

  // Show the preferences window on demand.
  preferences.show();
}
const preferences = {
  openPreferences,
};
export default preferences;