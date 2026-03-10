declare module 'electron' {
  export const app: Electron.App;
  export const BrowserWindow: typeof Electron.BrowserWindow;
  export const ipcMain: Electron.IpcMain;
  export const contextBridge: typeof Electron.contextBridge;
  export const ipcRenderer: Electron.IpcRenderer;
}
