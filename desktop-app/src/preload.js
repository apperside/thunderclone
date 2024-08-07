const { contextBridge, ipcRenderer } = require('electron');
console.log('preload.js');  
contextBridge.exposeInMainWorld('electronAPI', {
  setPassword: (password) => ipcRenderer.send('set-password', password)
});
