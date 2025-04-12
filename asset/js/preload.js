const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

    getPlaylist: (folderPath) => ipcRenderer.invoke('getPlaylist', folderPath),
    openChannelWindow: (channelName) => ipcRenderer.send('openChannelWindow', channelName),
    onChannelNameReceive: (callback) => ipcRenderer.on('channelName', (event, channelName) => callback(channelName))
});

