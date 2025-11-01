import "tsconfig-paths/register";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { ElectronInterface } from "../src/api/ElectronInterface";

function createWindow() {
  const isDev = process.env.NODE_ENV === "development";

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // será gerado a partir do preload.ts
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../../out/index.html")}`;

  win.loadURL(startUrl);

  if (isDev) win.webContents.openDevTools();

  ElectronInterface.getInstance().init(win, ipcMain);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
