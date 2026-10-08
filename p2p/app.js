document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const myIdDisplay = document.getElementById('my-id');
    const copyIdBtn = document.getElementById('copy-id-btn');
    const peerIdInput = document.getElementById('peer-id-input');
    const connectBtn = document.getElementById('connect-btn');
    const statusText = document.getElementById('connection-status');
    const connectionScreen = document.getElementById('connection-screen');
    const transferScreen = document.getElementById('transfer-screen');
    const connectedPeerIdDisplay = document.getElementById('connected-peer-id');
    const disconnectBtn = document.getElementById('disconnect-btn');
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const transferList = document.getElementById('transfer-list');

    let peer = null;
    let conn = null;
    let myId = '';

    const CHUNK_SIZE = 16384; // 16KB chunks for WebRTC

    // Generate random 5-digit ID
    function generateId() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }

    function initPeer() {
        myId = generateId();
        
        // Check if URL has ?peer= code
        const urlParams = new URLSearchParams(window.location.search);
        const autoConnectId = urlParams.get('peer');

        // Initialize PeerJS
        peer = new Peer(myId, {
            debug: 2
        });

        peer.on('open', (id) => {
            myIdDisplay.textContent = id;
            
            // Generate QR Code
            document.getElementById('qrcode').innerHTML = '';
            const connectUrl = window.location.href.split('?')[0] + '?peer=' + id;
            new QRCode(document.getElementById('qrcode'), {
                text: connectUrl,
                width: 160,
                height: 160,
                colorDark : "#0B0C10",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });

            if (autoConnectId) {
                peerIdInput.value = autoConnectId;
                connectToPeer(autoConnectId);
            }
        });

        peer.on('connection', (connection) => {
            if (conn && conn.open) {
                connection.close(); // Already connected
                return;
            }
            setupConnection(connection);
        });

        peer.on('error', (err) => {
            console.error(err);
            statusText.textContent = "Error: " + err.type;
            statusText.className = 'status-text text-error';
            
            if (err.type === 'peer-unavailable') {
                statusText.textContent = "Device ID not found!";
            }
        });
    }

    function connectToPeer(id) {
        if (!id) return;
        statusText.textContent = "Connecting...";
        statusText.className = 'status-text text-muted';
        const connection = peer.connect(id, { reliable: true });
        setupConnection(connection);
    }

    // Handle Connection
    function setupConnection(connection) {
        conn = connection;
        
        conn.on('open', () => {
            statusText.textContent = "Connected!";
            statusText.className = 'status-text text-success';
            
            // Switch UI
            setTimeout(() => {
                connectionScreen.classList.remove('active');
                transferScreen.classList.add('active');
                connectedPeerIdDisplay.textContent = conn.peer;
            }, 500);
        });

        conn.on('data', handleIncomingData);

        conn.on('close', () => {
            resetUI();
        });
    }

    function resetUI() {
        conn = null;
        transferScreen.classList.remove('active');
        connectionScreen.classList.add('active');
        statusText.textContent = "Ready to pair.";
        statusText.className = 'status-text text-muted';
        peerIdInput.value = '';
        transferList.innerHTML = '';
        
        // Remove query param if present
        const url = new URL(window.location);
        url.searchParams.delete('peer');
        window.history.replaceState({}, document.title, url);
    }

    // UI Events
    copyIdBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(myId);
        copyIdBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        setTimeout(() => {
            copyIdBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        }, 2000);
    });

    connectBtn.addEventListener('click', () => {
        connectToPeer(peerIdInput.value.trim());
    });

    peerIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') connectToPeer(peerIdInput.value.trim());
    });

    disconnectBtn.addEventListener('click', () => {
        if (conn) conn.close();
        resetUI();
    });

    // File Drag & Drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    dropzone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFiles(fileInput.files);
        }
    });

    // File Sending Logic
    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            sendFile(files[i]);
        }
    }

    function sendFile(file) {
        if (!conn || !conn.open) return;

        const fileId = Math.random().toString(36).substring(7);
        createTransferUI(fileId, file.name, file.size, 'Sending');

        conn.send({
            type: 'file-start',
            id: fileId,
            name: file.name,
            size: file.size,
            filetype: file.type
        });

        const reader = new FileReader();
        let offset = 0;

        reader.onload = (e) => {
            conn.send({
                type: 'file-chunk',
                id: fileId,
                data: e.target.result
            });
            
            offset += e.target.result.byteLength;
            updateTransferUI(fileId, offset / file.size);

            if (offset < file.size) {
                readSlice(offset);
            } else {
                conn.send({
                    type: 'file-end',
                    id: fileId
                });
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
        if (data.type === 'file-start') {
            incomingFiles[data.id] = {
                name: data.name,
                size: data.size,
                type: data.filetype,
                chunks: [],
                receivedSize: 0
            };
            createTransferUI(data.id, data.name, data.size, 'Receiving');
        } 
        else if (data.type === 'file-chunk') {
            const fileObj = incomingFiles[data.id];
            if (fileObj) {
                fileObj.chunks.push(data.data);
                fileObj.receivedSize += data.data.byteLength;
                updateTransferUI(data.id, fileObj.receivedSize / fileObj.size);
            }
        } 
        else if (data.type === 'file-end') {
            const fileObj = incomingFiles[data.id];
            if (fileObj) {
                const blob = new Blob(fileObj.chunks, { type: fileObj.type });
                downloadBlob(blob, fileObj.name);
                updateTransferUI(data.id, 1, 'Received');
                delete incomingFiles[data.id];
            }
        }
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    // Transfer UI Builder
    function createTransferUI(id, filename, size, statusLabel) {
        const sizeMb = (size / (1024 * 1024)).toFixed(2);
        
        const el = document.createElement('div');
        el.className = 'transfer-item';
        el.id = 'transfer-' + id;
        
        el.innerHTML = `
            <div class="file-info">
                <div class="file-meta">
                    <span class="file-name" title="${filename}">${filename}</span>
                    <span id="status-${id}" style="color: var(--cyan);">${statusLabel}</span>
                </div>
                <div class="progress-bar-bg">
                    <div id="progress-${id}" class="progress-bar-fill"></div>
                </div>
                <div class="file-meta">
                    <span id="size-${id}">0 / ${sizeMb} MB</span>
                    <span id="percent-${id}">0%</span>
                </div>
            </div>
        `;
        
        transferList.prepend(el);
    }

    function updateTransferUI(id, progress, finalStatus = null) {
        const progressEl = document.getElementById('progress-' + id);
        const percentEl = document.getElementById('percent-' + id);
        const statusEl = document.getElementById('status-' + id);
        
        if (progressEl) {
            const percent = Math.floor(progress * 100);
            progressEl.style.width = percent + '%';
            if (percentEl) percentEl.textContent = percent + '%';
            
            if (finalStatus && statusEl) {
                statusEl.textContent = finalStatus;
                statusEl.style.color = 'var(--emerald)';
                progressEl.style.background = 'var(--emerald)';
            }
        }
    }

    // Boot
    initPeer();
});
