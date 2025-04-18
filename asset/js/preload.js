const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

    getCategories: (folderPath) => ipcRenderer.invoke('getCategories', folderPath),
    getCountries: (folderPath) => ipcRenderer.invoke('getCountries', folderPath),
    sendChannelData: (channelName, folder) => ipcRenderer.send('channel-data', channelName, folder),
    onChannelNameReceive: (callback) => ipcRenderer.on('channelName', (event, channelName) => callback(channelName))
});

