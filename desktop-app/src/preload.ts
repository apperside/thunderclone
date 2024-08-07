import { contextBridge, ipcRenderer } from "electron";
console.log("preload");
contextBridge.exposeInMainWorld("electronAPI", {
  setPassword: (password: string) =>
    ipcRenderer.invoke("set-password", password),
});
