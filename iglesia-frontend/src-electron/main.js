const { app, BrowserWindow } = require("electron");
const path = require("path");
const net = require("net");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  // Determinar la URL a cargar (desarrollo o producción)
  const startUrl =
    process.env.ELECTRON_START_URL || `file://${path.join(__dirname, "../dist/index.html")}`;
  console.log("Loading URL:", startUrl);

  mainWindow.loadURL(startUrl);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Verificar si el servidor de desarrollo está corriendo
function isDevServerRunning(port, callback) {
  const client = new net.Socket();
  client
    .once("connect", () => {
      client.destroy();
      callback(true);
    })
    .once("error", () => {
      callback(false);
    })
    .connect(port, "localhost");
}

app.on("ready", () => {
  const devServerPort = 5173; // Puerto del servidor de desarrollo de Vite

  isDevServerRunning(devServerPort, (isRunning) => {
    if (isRunning) {
      process.env.ELECTRON_START_URL = `http://localhost:${devServerPort}`;
    } else {
      console.log("Dev server not running. Loading production build...");
    }
    createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});