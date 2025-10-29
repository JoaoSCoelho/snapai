import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

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

  setInterval(() => {
    win.webContents.send("ping", "ping");
  }, 1000);

  ipcMain.on("pong", (_, msg) => {
    console.log("Mensagem recebida do renderer:", msg);
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
