import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { saveEntry, loadEntries } from './store';

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(join(__dirname, '../../dist/index.html'));
  }
}

ipcMain.handle('entries:list', async () => loadEntries());
ipcMain.handle('entries:add', async (_event, entry) => saveEntry(entry));

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});