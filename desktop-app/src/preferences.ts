import { app, Menu } from "electron";
// import Store from 'electron-store';
import * as path from "path";
//@ts-ignore
import ElectronPreferences from "electron-preferences";
export const preferencesPanel = new ElectronPreferences({
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
  css: "preference-styles.css",

  // Preference file path. Where your preferences are saved (required)
  dataStore: path.join(app.getPath("userData"), "preferences.json"),

  // Preference default values
  defaults: {
    about: {
      name: "Albert",
    },
  },
  menu: Menu.buildFromTemplate([
    {
      label: "Window",
      role: "window",
      submenu: [
        {
          label: "Close",
          accelerator: "CmdOrCtrl+W",
          role: "close",
        },
      ],
    },
  ]),
  // Preference sections visible to the UI
  sections: [
    {
      id: "about",
      label: "About You",
      icon: "single-01", // See the list of available icons below
      form: {
        groups: [
          {
            label: "About You", // optional
            fields: [
              {
                label: "Name",
                key: "name",
                type: "text",
                help: "What is your name?",
              },
              // ...
            ],
          },
          // ...
        ],
      },
    },
    {
      id: "cloning",
      label: "Cloning Settings",
      icon: "folder-15",
      form: {
        groups: [
          {
            label: "Repository Clone Directory",
            fields: [
              {
                label: "Clone Directory",
                key: "cloneDirectory",
                type: "directory",
                help: "Select the directory where repositories will be cloned",
              },
            ],
          },
        ],
      },
    },
  ],
});
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

  // Show the preferences window on demand.
  preferencesPanel.show();
}
const preferences = {
  preferencesPanel,
  openPreferences,
};
export default preferences;
