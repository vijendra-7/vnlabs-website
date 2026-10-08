// VN Labs - Secure P2P File & Text Transfer

// UI Elements
const myIdDisplay = document.getElementById('my-id');
const copyIdBtn = document.getElementById('copy-id-btn');
const peerIdInput = document.getElementById('peer-id-input');
const connectBtn = document.getElementById('connect-btn');
const statusText = document.getElementById('connection-status');
const connectionScreen = document.getElementById('connection-screen');
const transferScreen = document.getElementById('transfer-screen');
const connectedPeersContainer = document.getElementById('connected-peers-container');
const disconnectBtn = document.getElementById('disconnect-btn');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const folderInput = document.getElementById('folder-input');
const transferList = document.getElementById('transfer-list');
const transferListHeader = document.getElementById('transfer-list-header');
const downloadAllBtn = document.getElementById('download-all-btn');
const textInput = document.getElementById('text-input');
const sendTextBtn = document.getElementById('send-text-btn');
const shareScreenBtn = document.getElementById('share-screen-btn');
const videoContainer = document.getElementById('video-container');
const remoteVideo = document.getElementById('remote-video');

let peer = null;
let connections = {}; // Multi-device support: peerId -> DataConnection
let calls = {};       // Media connections
let myId = '';
let myStream = null;

const CHUNK_SIZE = 16384; 
const completedFiles = {}; 

function generateId() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

function initPeer() {
    myId = generateId();
    const urlParams = new URLSearchParams(window.location.search);
    const autoConnectId = urlParams.get('peer');

    myIdDisplay.textContent = "Connecting...";

    try {
        peer = new Peer(myId, { debug: 1 });
    } catch (e) {
        console.error("PeerJS initialization error:", e);
        myIdDisplay.textContent = "Init Error";
        statusText.textContent = "Failed to start peer connection: " + e.message;
        return;
    }

    peer.on('open', (id) => {
        myId = id;
        myIdDisplay.textContent = id;
        const qrContainer = document.getElementById('qrcode');
        if (qrContainer) {
            qrContainer.innerHTML = '';
            const connectUrl = window.location.href.split('?')[0] + '?peer=' + id;
            if (typeof QRCode !== 'undefined') {
                new QRCode(qrContainer, {
                    text: connectUrl,
                    width: 160,
                    height: 160,
                    colorDark : "#0B0C10",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            }
        }

        if (autoConnectId) {
            peerIdInput.value = autoConnectId;
            connectToPeer(autoConnectId);
        }
    });

    // Handle incoming data connections
    peer.on('connection', (connection) => {
        setupConnection(connection);
    });

    // Handle incoming media calls (Screen share)
    peer.on('call', (call) => {
        call.answer(); // Answer without sending stream back automatically
        calls[call.peer] = call;
        call.on('stream', (remoteStream) => {
            videoContainer.style.display = 'block';
            remoteVideo.srcObject = remoteStream;
        });
        call.on('close', () => {
            videoContainer.style.display = 'none';
            remoteVideo.srcObject = null;
            delete calls[call.peer];
        });
    });

    peer.on('error', (err) => {
        console.error("Peer error:", err);
        statusText.className = 'status-text text-error';
        if (err.type === 'peer-unavailable') {
            statusText.textContent = "Device ID not found!";
        } else if (err.type === 'unavailable-id') {
            // Collision retry
            setTimeout(initPeer, 500);
        } else {
            statusText.textContent = "Error: " + (err.type || err.message || err);
            if (myIdDisplay.textContent === "Loading..." || myIdDisplay.textContent === "Connecting...") {
                myIdDisplay.textContent = "Failed to connect";
            }
        }
    });
}

function connectToPeer(id) {
    if (!id || id === myId || connections[id]) return;
    statusText.textContent = "Connecting to " + id + "...";
    statusText.className = 'status-text text-muted';
    const connection = peer.connect(id, { reliable: true });
    setupConnection(connection);
}

function setupConnection(connection) {
    connection.on('open', () => {
        connections[connection.peer] = connection;
        updatePeersUI();
        
        setTimeout(() => {
            connectionScreen.classList.remove('active');
            transferScreen.classList.add('active');
        }, 500);
    });

    connection.on('data', handleIncomingData);
    connection.on('close', () => {
        delete connections[connection.peer];
        updatePeersUI();
        if (Object.keys(connections).length === 0) resetUI();
    });
}

function updatePeersUI() {
    const peerIds = Object.keys(connections);
    connectedPeersContainer.innerHTML = '';
    peerIds.forEach(id => {
        const badge = document.createElement('span');
        badge.className = 'highlight';
        badge.textContent = id;
        badge.style.marginRight = '8px';
        connectedPeersContainer.appendChild(badge);
    });
    
    statusText.textContent = "Ready to pair.";
    statusText.className = 'status-text text-muted';
    peerIdInput.value = '';
}

function resetUI() {
    if (myStream) {
        myStream.getTracks().forEach(t => t.stop());
        myStream = null;
    }
    Object.values(calls).forEach(c => c.close());
    calls = {};
    
    transferScreen.classList.remove('active');
    connectionScreen.classList.add('active');
    transferList.innerHTML = '';
    transferListHeader.style.display = 'none';
    videoContainer.style.display = 'none';
    remoteVideo.srcObject = null;
    
    Object.keys(completedFiles).forEach(id => {
        if (completedFiles[id].url) URL.revokeObjectURL(completedFiles[id].url);
        delete completedFiles[id];
    });

    const url = new URL(window.location);
    url.searchParams.delete('peer');
    window.history.replaceState({}, document.title, url);
}

// UI Events
copyIdBtn.addEventListener('click', () => {
    if (!myId || myId === 'Loading...' || myId === 'Connecting...') return;
    navigator.clipboard.writeText(myId);
    copyIdBtn.innerHTML = '✔';
    setTimeout(() => { copyIdBtn.innerHTML = '📋'; }, 2000);
});

connectBtn.addEventListener('click', () => connectToPeer(peerIdInput.value.trim()));
peerIdInput.addEventListener('keypress', (e) => { 
    if (e.key === 'Enter') connectToPeer(peerIdInput.value.trim()); 
});

disconnectBtn.addEventListener('click', () => {
    Object.values(connections).forEach(c => c.close());
    connections = {};
    resetUI();
});

// Share Screen
shareScreenBtn.addEventListener('click', async () => {
    try {
        if (myStream) {
            myStream.getTracks().forEach(t => t.stop());
            myStream = null;
            shareScreenBtn.classList.remove('active-cast');
            Object.values(calls).forEach(c => c.close());
            calls = {};
            return;
        }

        myStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        shareScreenBtn.classList.add('active-cast');
        
        myStream.getVideoTracks()[0].onended = () => {
            myStream = null;
            shareScreenBtn.classList.remove('active-cast');
            Object.values(calls).forEach(c => c.close());
            calls = {};
        };

        // Call all peers
        Object.keys(connections).forEach(peerId => {
            const call = peer.call(peerId, myStream);
            calls[peerId] = call;
        });
        
    } catch (err) {
        console.error("Screen share error:", err);
    }
});

// Text Sharing
sendTextBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text || Object.keys(connections).length === 0) return;
    
    const textId = Math.random().toString(36).substring(7);
    broadcast({ type: 'text', id: textId, data: text });
    createTextUI(textId, text, true);
    textInput.value = '';
});

function broadcast(payload) {
    Object.values(connections).forEach(conn => {
        if (conn.open) conn.send(payload);
    });
}

// File Drag & Drop
dropzone.addEventListener('dragover', (e) => { 
    e.preventDefault(); 
    dropzone.classList.add('dragover'); 
});
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    
    const items = e.dataTransfer.items;
    if (items) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i].webkitGetAsEntry();
            if (item) traverseFileTree(item);
        }
    }
});

function traverseFileTree(item, path = '') {
    if (item.isFile) {
        item.file(file => {
            file.fullPath = path + file.name;
            sendFile(file);
        });
    } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(entries => {
            for (let i = 0; i < entries.length; i++) {
                traverseFileTree(entries[i], path + item.name + "/");
            }
        });
    }
}

// For manual button clicks
document.getElementById('btn-send-file').addEventListener('click', () => fileInput.click());
document.getElementById('btn-send-folder').addEventListener('click', () => folderInput.click());

fileInput.addEventListener('change', () => {
    Array.from(fileInput.files).forEach(f => sendFile(f));
});
folderInput.addEventListener('change', () => {
    Array.from(folderInput.files).forEach(f => {
        f.fullPath = f.webkitRelativePath;
        sendFile(f);
    });
});

function sendFile(file) {
    if (Object.keys(connections).length === 0) return;

    const fileId = Math.random().toString(36).substring(7);
    const fileName = file.fullPath || file.name;
    
    createTransferUI(fileId, fileName, file.size, 'Sending', file.type);

    broadcast({
        type: 'file-start',
        id: fileId,
        name: fileName,
        size: file.size,
        filetype: file.type
    });

    const reader = new FileReader();
    let offset = 0;
    let startTime = Date.now();

    reader.onload = (e) => {
        broadcast({
            type: 'file-chunk',
            id: fileId,
            data: e.target.result
        });
        
        offset += e.target.result.byteLength;
        
        let elapsed = (Date.now() - startTime) / 1000;
        let speed = elapsed > 0.5 ? (offset / 1024 / 1024 / elapsed).toFixed(1) + ' MB/s' : 'Calculating...';

        updateTransferUI(fileId, offset / file.size, null, speed);

        if (offset < file.size) {
            readSlice(offset);
        } else {
            broadcast({ type: 'file-end', id: fileId });
            updateTransferUI(fileId, 1, 'Sent');
        }
    };

    const readSlice = (o) => {
        const slice = file.slice(o, o + CHUNK_SIZE);
        reader.readAsArrayBuffer(slice);
    };

    readSlice(0);
}

// Receiving Logic
const incomingFiles = {};

function handleIncomingData(data) {
    if (data.type === 'text') {
        createTextUI(data.id, data.data, false);
        transferListHeader.style.display = 'flex';
    }
    else if (data.type === 'file-start') {
        transferListHeader.style.display = 'flex';
        incomingFiles[data.id] = {
            name: data.name,
            size: data.size,
            type: data.filetype,
            chunks: [],
            receivedSize: 0,
            startTime: Date.now()
        };
        createTransferUI(data.id, data.name, data.size, 'Receiving', data.filetype);
    } 
    else if (data.type === 'file-chunk') {
        const fileObj = incomingFiles[data.id];
        if (fileObj) {
            fileObj.chunks.push(data.data);
            fileObj.receivedSize += data.data.byteLength;
            
            let elapsed = (Date.now() - fileObj.startTime) / 1000;
            let speed = elapsed > 0.5 ? (fileObj.receivedSize / 1024 / 1024 / elapsed).toFixed(1) + ' MB/s' : 'Calculating...';
            
            updateTransferUI(data.id, fileObj.receivedSize / fileObj.size, null, speed);
        }
    } 
    else if (data.type === 'file-end') {
        const fileObj = incomingFiles[data.id];
        if (fileObj) {
            const blob = new Blob(fileObj.chunks, { type: fileObj.type });
            
            let objectUrl = null;
            if (fileObj.type && fileObj.type.startsWith('image/')) {
                objectUrl = URL.createObjectURL(blob);
            }
            
            completedFiles[data.id] = {
                blob: blob,
                name: fileObj.name,
                url: objectUrl
            };

            updateTransferUI(data.id, 1, 'Ready to Save', null, true);
            delete incomingFiles[data.id];
        }
    }
}

// Download All
downloadAllBtn.addEventListener('click', () => {
    Object.keys(completedFiles).forEach(id => triggerDownload(id));
});

function triggerDownload(id) {
    const file = completedFiles[id];
    if (!file) return;
    
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url); 
        const statusEl = document.getElementById('status-' + id);
        if (statusEl) {
            statusEl.textContent = "Saved";
            statusEl.style.color = "var(--text-muted)";
        }
    }, 100);
}

// UI Builders
function createTextUI(id, text, isSender) {
    const el = document.createElement('div');
    el.className = 'transfer-item text-item';
    el.id = 'transfer-' + id;
    
    const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    el.innerHTML = `
        <div class="file-info">
            <div class="file-meta">
                <span class="file-name">📋 ${isSender ? 'Sent Text' : 'Received Text'}</span>
            </div>
            <div class="text-content-display">${safeText}</div>
        </div>
        <div class="item-actions">
            <button class="action-btn save" id="btn-copy-${id}">Copy</button>
            <button class="action-btn clear" id="btn-clear-txt-${id}">Clear</button>
        </div>
    `;
    transferList.prepend(el);

    const copyBtn = document.getElementById('btn-copy-' + id);
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(text);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
        });
    }
    const clearBtn = document.getElementById('btn-clear-txt-' + id);
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            el.remove();
        });
    }
}

function createTransferUI(id, filename, size, statusLabel, filetype) {
    const sizeMb = (size / (1024 * 1024)).toFixed(2);
    
    const el = document.createElement('div');
    el.className = 'transfer-item';
    el.id = 'transfer-' + id;
    
    let previewHtml = '';
    if (filetype && filetype.startsWith('image/')) {
        previewHtml = `<div class="file-preview" id="preview-${id}"></div>`;
    }
    
    el.innerHTML = `
        ${previewHtml}
        <div class="file-info">
            <div class="file-meta">
                <span class="file-name" title="${filename}">${filename}</span>
                <span id="status-${id}" style="color: var(--cyan);">${statusLabel}</span>
            </div>
            <div class="progress-bar-bg" id="progress-bg-${id}">
                <div id="progress-${id}" class="progress-bar-fill"></div>
            </div>
            <div class="file-meta">
                <span><span id="size-${id}">0</span> / ${sizeMb} MB <span id="speed-${id}"></span></span>
                <span id="percent-${id}">0%</span>
            </div>
            <div class="item-actions" id="actions-${id}" style="display: none;"></div>
        </div>
    `;
    
    transferList.prepend(el);
}

function updateTransferUI(id, progress, finalStatus = null, speed = null, showActions = false) {
    const progressEl = document.getElementById('progress-' + id);
    const progressBg = document.getElementById('progress-bg-' + id);
    const percentEl = document.getElementById('percent-' + id);
    const statusEl = document.getElementById('status-' + id);
    const speedEl = document.getElementById('speed-' + id);
    const actionsEl = document.getElementById('actions-' + id);
    
    if (progressEl) {
        const percent = Math.floor(progress * 100);
        progressEl.style.width = percent + '%';
        if (percentEl) percentEl.textContent = percent + '%';
        if (speed && speedEl) speedEl.textContent = '(' + speed + ')';
        
        if (finalStatus && statusEl) {
            statusEl.textContent = finalStatus;
            statusEl.style.color = 'var(--emerald)';
            progressEl.style.background = 'var(--emerald)';
            if (speedEl) speedEl.textContent = '';
            if (progressBg) progressBg.style.display = 'none'; 
            if (percentEl) percentEl.style.display = 'none';
        }

        if (showActions && actionsEl) {
            actionsEl.style.display = 'flex';
            const fileObj = completedFiles[id];
            if (fileObj && fileObj.url) {
                const previewEl = document.getElementById('preview-' + id);
                if (previewEl) {
                    previewEl.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = fileObj.url;
                    img.style.cssText = 'width:100%; height:100%; object-fit:cover; border-radius:8px;';
                    previewEl.appendChild(img);
                }
            }

            actionsEl.innerHTML = `
                <button class="action-btn save" id="btn-save-${id}">Save</button>
                <button class="action-btn clear" id="btn-clear-${id}">Clear</button>
            `;

            document.getElementById('btn-save-' + id).addEventListener('click', () => triggerDownload(id));
            document.getElementById('btn-clear-' + id).addEventListener('click', () => {
                if (fileObj && fileObj.url) URL.revokeObjectURL(fileObj.url);
                delete completedFiles[id];
                document.getElementById('transfer-' + id).remove();
                if (transferList.children.length === 0) transferListHeader.style.display = 'none';
            });
        }
    }
}

// Startup lifecycle
function startApp() {
    if (typeof Peer !== 'undefined') {
        initPeer();
    } else {
        let attempts = 0;
        const timer = setInterval(() => {
            attempts++;
            if (typeof Peer !== 'undefined') {
                clearInterval(timer);
                initPeer();
            } else if (attempts > 30) {
                clearInterval(timer);
                myIdDisplay.textContent = "Offline / Error";
                statusText.textContent = "Failed to load PeerJS library. Please check your internet connection.";
            }
        }, 100);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
