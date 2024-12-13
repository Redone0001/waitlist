const { contextBridge } = require('electron');

// Expose a variable to the renderer process
contextBridge.exposeInMainWorld('IN_DESKTOP_ENV', true);
