"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("tsconfig-paths/register");
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const ElectronInterface_1 = require("../src/api/ElectronInterface");
function createWindow() {
    const isDev = process.env.NODE_ENV === "development";
    const win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"), // será gerado a partir do preload.ts
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    const startUrl = isDev
        ? "http://localhost:3000"
        : `file://${path_1.default.join(__dirname, "../../out/index.html")}`;
    win.loadURL(startUrl);
    if (isDev)
        win.webContents.openDevTools();
    ElectronInterface_1.ElectronInterface.getInstance().init(win, electron_1.ipcMain);
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.app.on("activate", () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
