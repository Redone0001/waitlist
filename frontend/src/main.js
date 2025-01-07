const { app, BrowserWindow, Tray, Menu, nativeImage, contextBridge } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createTray() {
  // Ensure icon path is correct
  const icon = nativeImage.createFromPath(path.join(__dirname, '../public/favicon.ico')); 
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show(); // Show the window when clicked
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true; // Mark that the app is quitting
        app.quit(); // Quit the app when clicked
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('Beancursion Waitlist'); 

  // Toggle the visibility of the window when tray icon is clicked
  tray.on("click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    icon: path.join(__dirname, '../public/favicon@1x.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
	  preload: path.join(__dirname, 'preload.js')
    }
  });

  createTray();

  mainWindow.loadURL("https://waitlist.beancursion.org");
  mainWindow.removeMenu();

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide(); // Hide the window instead of quitting
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow(); // Create the main window when app is ready
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit(); // Quit app if no windows are left
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow(); // Recreate window if app is activated again
  }
});
