import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  send: (channel: string, data?: any, id?: string) =>
    ipcRenderer.send(channel, id, data),
  on: (channel: string, func: (...args: any[]) => void) => {
    const subscription = (_: any, ...args: any[]) => func(...args);
    ipcRenderer.on(channel, subscription);
    return () => ipcRenderer.removeListener(channel, subscription);
  },
  offAll: (channel: string) => ipcRenderer.removeAllListeners(channel),
});
