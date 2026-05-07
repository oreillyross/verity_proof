import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  listEntries: () => ipcRenderer.invoke('entries:list'),
  addEntry: (entry) => ipcRenderer.invoke('entries:add', entry)
});