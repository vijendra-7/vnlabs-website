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
    const transferListHeader = document.getElementById('transfer-list-header');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const textInput = document.getElementById('text-input');
    const sendTextBtn = document.getElementById('send-text-btn');

    let peer = null;
    let conn = null;
    let myId = '';

    const CHUNK_SIZE = 16384; // 16KB chunks for WebRTC
    const completedFiles = {}; // Hold Blobs for manual download

    function generateId() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }

    function initPeer() {
        myId = generateId();
        
        const urlParams = new URLSearchParams(window.location.search);
        const autoConnectId = urlParams.get('peer');

        peer = new Peer(myId, { debug: 2 });

        peer.on('open', (id) => {
            myIdDisplay.textContent = id;
            
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
                connection.close(); 
                return;
            }
            setupConnection(connection);
        });

        peer.on('error', (err) => {
            console.error(err);
            statusText.textContent = "Error: " + err.type;
            statusText.className = 'status-text text-error';
            if (err.type === 'peer-unavailable') statusText.textContent = "Device ID not found!";
        });
    }

    function connectToPeer(id) {
        if (!id) return;
        statusText.textContent = "Connecting...";
        statusText.className = 'status-text text-muted';
        const connection = peer.connect(id, { reliable: true });
        setupConnection(connection);
    }

    function setupConnection(connection) {
        conn = connection;
        conn.on('open', () => {
            statusText.textContent = "Connected!";
            statusText.className = 'status-text text-success';
            setTimeout(() => {
                connectionScreen.classList.remove('active');
                transferScreen.classList.add('active');
                connectedPeerIdDisplay.textContent = conn.peer;
            }, 500);
        });

        conn.on('data', handleIncomingData);
        conn.on('close', resetUI);
    }

    function resetUI() {
        conn = null;
        transferScreen.classList.remove('active');
        connectionScreen.classList.add('active');
        statusText.textContent = "Ready to pair.";
        statusText.className = 'status-text text-muted';
        peerIdInput.value = '';
        transferList.innerHTML = '';
        transferListHeader.style.display = 'none';
        
        // Clear RAM
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
        navigator.clipboard.writeText(myId);
        copyIdBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        setTimeout(() => {
            copyIdBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        }, 2000);
    });

    connectBtn.addEventListener('click', () => connectToPeer(peerIdInput.value.trim()));
    peerIdInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') connectToPeer(peerIdInput.value.trim()); });
    disconnectBtn.addEventListener('click', () => { if (conn) conn.close(); resetUI(); });

    // Text Sharing
    sendTextBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (!text || !conn || !conn.open) return;
        
        const textId = Math.random().toString(36).substring(7);
        conn.send({ type: 'text', id: textId, data: text });
        
        createTextUI(textId, text, true);
        textInput.value = '';
    });

    // File Drag & Drop
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
    });
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) handleFiles(fileInput.files);
    });

    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            sendFile(files[i]);
        }
    }

    function sendFile(file) {
        if (!conn || !conn.open) return;

        const fileId = Math.random().toString(36).substring(7);
        createTransferUI(fileId, file.name, file.size, 'Sending', file.type);

        conn.send({
            type: 'file-start',
            id: fileId,
            name: file.name,
            size: file.size,
            filetype: file.type
        });

        const reader = new FileReader();
        let offset = 0;
        let startTime = Date.now();

        reader.onload = (e) => {
            conn.send({
                type: 'file-chunk',
                id: fileId,
                data: e.target.result
            });
            
            offset += e.target.result.byteLength;
            
            // Calculate Speed
            let elapsed = (Date.now() - startTime) / 1000;
            let speed = elapsed > 0.5 ? (offset / 1024 / 1024 / elapsed).toFixed(1) + ' MB/s' : 'Calculating...';

            updateTransferUI(fileId, offset / file.size, null, speed);

            if (offset < file.size) {
                readSlice(offset);
            } else {
                conn.send({ type: 'file-end', id: fileId });
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
                if (fileObj.type.startsWith('image/')) {
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
        Object.keys(completedFiles).forEach(id => {
            triggerDownload(id);
        });
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
            URL.revokeObjectURL(url); // Revoke the temporary link
            
            const statusEl = document.getElementById('status-' + id);
            if(statusEl) {
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
        
        el.innerHTML = `
            <div class="file-info">
                <div class="file-meta">
                    <span class="file-name">📋 ${isSender ? 'Sent Text' : 'Received Text'}</span>
                </div>
                <div class="text-content-display">${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            </div>
            <div class="item-actions">
                <button class="action-btn save" onclick="navigator.clipboard.writeText(\`${text.replace(/`/g, "\\`")}\`); this.innerHTML='Copied!';">Copy</button>
                <button class="action-btn clear" onclick="document.getElementById('transfer-${id}').remove()">Clear</button>
            </div>
        `;
        transferList.prepend(el);
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
                <div class="item-actions" id="actions-${id}" style="display: none;">
                    <!-- Action buttons injected here upon completion -->
                </div>
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
        const sizeEl = document.getElementById('size-' + id);
        
        if (progressEl) {
            const percent = Math.floor(progress * 100);
            progressEl.style.width = percent + '%';
            if (percentEl) percentEl.textContent = percent + '%';
            
            if (speed && speedEl) {
                speedEl.textContent = `(${speed})`;
            }
            
            if (finalStatus && statusEl) {
                statusEl.textContent = finalStatus;
                statusEl.style.color = 'var(--emerald)';
                progressEl.style.background = 'var(--emerald)';
                if (speedEl) speedEl.textContent = '';
                if (progressBg) progressBg.style.display = 'none'; // Hide progress bar on complete
                if (percentEl) percentEl.style.display = 'none';
            }

            if (showActions && actionsEl) {
                actionsEl.style.display = 'flex';
                
                // Inject Thumbnail if image
                const fileObj = completedFiles[id];
                if (fileObj && fileObj.url) {
                    const previewEl = document.getElementById('preview-' + id);
                    if (previewEl) {
                        previewEl.innerHTML = `<img src="${fileObj.url}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">`;
                    }
                }

                // Inject Manual Download / Clear Buttons
                actionsEl.innerHTML = `
                    <button class="action-btn save" id="btn-save-${id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Save
                    </button>
                    <button class="action-btn clear" id="btn-clear-${id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Clear
                    </button>
                `;

                document.getElementById('btn-save-' + id).addEventListener('click', () => {
                    triggerDownload(id);
                });

                document.getElementById('btn-clear-' + id).addEventListener('click', () => {
                    if (fileObj && fileObj.url) URL.revokeObjectURL(fileObj.url);
                    delete completedFiles[id];
                    document.getElementById('transfer-' + id).remove();
                    
                    if (transferList.children.length === 0) {
                        transferListHeader.style.display = 'none';
                    }
                });
            }
        }
    }

    initPeer();
});
