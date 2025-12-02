import { contextBridge, ipcRenderer } from "electron";
console.log("preload");
contextBridge.exposeInMainWorld("electronAPI", {
  onTokenReceived: (callback: (token: string) => void) => {
    ipcRenderer.on("token-received", (event, token) => callback(token));
  },
  continueWithToken: () => ipcRenderer.invoke("continue-with-token"),
});
