"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electron", {
    send: (channel, data, id) => electron_1.ipcRenderer.send(channel, id, data),
    on: (channel, func) => {
        const subscription = (_, ...args) => func(...args);
        electron_1.ipcRenderer.on(channel, subscription);
        return () => electron_1.ipcRenderer.removeListener(channel, subscription);
    },
    offAll: (channel) => electron_1.ipcRenderer.removeAllListeners(channel),
});
