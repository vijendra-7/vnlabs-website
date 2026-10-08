// QuickVault - Phone ↔ PC Instant Clipboard Bridge

const liveText = document.getElementById('live-text');
const roomPinInput = document.getElementById('room-pin-input');
const btnJoinRoom = document.getElementById('btn-join-room');
const btnRandomRoom = document.getElementById('btn-random-room');
const btnShowQr = document.getElementById('btn-show-qr');
const btnCloseQr = document.getElementById('btn-close-qr');
const qrModal = document.getElementById('qr-modal');
const roomQrCode = document.getElementById('room-qrcode');
const syncStatusDot = document.getElementById('sync-status-dot');
const syncStatusText = document.getElementById('sync-status-text');
const peerCountBadge = document.getElementById('peer-count-badge');
const btnCopyLive = document.getElementById('btn-copy-live');
const btnOpenLink = document.getElementById('btn-open-link');
const btnSaveClip = document.getElementById('btn-save-clip');
const btnClearLive = document.getElementById('btn-clear-live');
const clipsList = document.getElementById('clips-list');
const btnClearHistory = document.getElementById('btn-clear-history');

let peer = null;
let activeConnections = {};
let currentPin = '';
let myPeerId = '';
let isTypingRemote = false;

// Initialize from URL or LocalStorage
function init() {
    loadSavedClips();
    
    const params = new URLSearchParams(window.location.search);
    const pinFromUrl = params.get('pin');
    
    if (pinFromUrl && pinFromUrl.trim().length >= 4) {
        currentPin = pinFromUrl.trim().toUpperCase();
        roomPinInput.value = currentPin;
    } else {
        const lastPin = localStorage.getItem('vn_vault_last_pin');
        if (lastPin) {
            currentPin = lastPin;
            roomPinInput.value = currentPin;
        } else {
            generateRandomPin();
        }
    }

    joinRoom(currentPin);
    checkLinkPresence(liveText.value);
}

function generateRandomPin() {
    currentPin = Math.floor(1000 + Math.random() * 9000).toString();
    roomPinInput.value = currentPin;
}

function updateUrlPin(pin) {
    const url = new URL(window.location);
    url.searchParams.set('pin', pin);
    window.history.replaceState({}, '', url);
    localStorage.setItem('vn_vault_last_pin', pin);
}

// PeerJS Connection Architecture
function joinRoom(pin) {
    if (!pin) return;
    currentPin = pin;
    updateUrlPin(pin);

    // Close any previous peer
    if (peer) {
        peer.destroy();
        activeConnections = {};
        updateConnectionUI();
    }

    // Generate random client ID for this tab/device
    const clientNonce = Math.floor(1000 + Math.random() * 9000);
    myPeerId = `vnvault-${pin}-${clientNonce}`;

    syncStatusText.textContent = "Connecting...";
    syncStatusDot.className = "status-dot";

    try {
        peer = new Peer(myPeerId, { debug: 1 });
    } catch (e) {
        syncStatusText.textContent = "Init Error";
        return;
    }

    peer.on('open', (id) => {
        syncStatusText.textContent = `Room ${pin}`;
        syncStatusDot.className = "status-dot connected";

        // Try discovery by scanning common nonces or connecting to host beacon
        discoverPeersInRoom(pin);
    });

    peer.on('connection', (conn) => {
        setupConnection(conn);
    });

    peer.on('error', (err) => {
        console.warn("Peer error:", err);
    });
}

function setupConnection(conn) {
    conn.on('open', () => {
        activeConnections[conn.peer] = conn;
        updateConnectionUI();

        // Send current text to newly connected peer if we have any
        if (liveText.value.trim().length > 0) {
            conn.send({ type: 'sync-full', text: liveText.value });
        }
    });

    conn.on('data', (data) => {
        if (data.type === 'sync-text' || data.type === 'sync-full') {
            isTypingRemote = true;
            liveText.value = data.text;
            checkLinkPresence(data.text);
            isTypingRemote = false;
        }
    });

    conn.on('close', () => {
        delete activeConnections[conn.peer];
        updateConnectionUI();
    });
}

function discoverPeersInRoom(pin) {
    // Attempt connecting to host peer or beacon
    const hostId = `vnvault-${pin}-host`;
    if (myPeerId !== hostId) {
        const hostConn = peer.connect(hostId);
        setupConnection(hostConn);
    }
}

function updateConnectionUI() {
    const count = Object.keys(activeConnections).length;
    peerCountBadge.textContent = `Devices linked: ${count}`;
    if (count > 0) {
        syncStatusDot.className = "status-dot connected";
        syncStatusText.textContent = `Synced (${count} online)`;
    } else {
        syncStatusText.textContent = `Room ${currentPin} (Ready)`;
    }
}

// Live Text Syncing
let broadcastTimeout = null;
liveText.addEventListener('input', () => {
    if (isTypingRemote) return;
    
    checkLinkPresence(liveText.value);

    // Debounce broadcast
    clearTimeout(broadcastTimeout);
    broadcastTimeout = setTimeout(() => {
        broadcastData({ type: 'sync-text', text: liveText.value });
    }, 100);
});

function broadcastData(data) {
    Object.values(activeConnections).forEach(conn => {
        if (conn.open) {
            conn.send(data);
        }
    });
}

function checkLinkPresence(text) {
    const trimmed = text.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        btnOpenLink.style.display = 'inline-flex';
        btnOpenLink.onclick = () => window.open(trimmed, '_blank');
    } else {
        btnOpenLink.style.display = 'none';
    }
}

// Action Buttons
btnCopyLive.addEventListener('click', () => {
    if (!liveText.value) return;
    navigator.clipboard.writeText(liveText.value);
    const originalText = btnCopyLive.innerHTML;
    btnCopyLive.innerHTML = "✔ Copied!";
    setTimeout(() => { btnCopyLive.innerHTML = originalText; }, 1800);
});

btnClearLive.addEventListener('click', () => {
    liveText.value = '';
    checkLinkPresence('');
    broadcastData({ type: 'sync-text', text: '' });
});

btnJoinRoom.addEventListener('click', () => {
    const pin = roomPinInput.value.trim().toUpperCase();
    if (pin.length >= 2) {
        joinRoom(pin);
    }
});

roomPinInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const pin = roomPinInput.value.trim().toUpperCase();
        if (pin.length >= 2) joinRoom(pin);
    }
});

btnRandomRoom.addEventListener('click', () => {
    generateRandomPin();
    joinRoom(currentPin);
});

// QR Code Modal
btnShowQr.addEventListener('click', () => {
    const fullUrl = window.location.href.split('?')[0] + '?pin=' + currentPin;
    roomQrCode.innerHTML = '';
    if (typeof QRCode !== 'undefined') {
        new QRCode(roomQrCode, {
            text: fullUrl,
            width: 180,
            height: 180,
            colorDark: "#0B0C10",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    qrModal.style.display = 'flex';
});

btnCloseQr.addEventListener('click', () => {
    qrModal.style.display = 'none';
});

qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) qrModal.style.display = 'none';
});

// Snippets Storage
btnSaveClip.addEventListener('click', () => {
    const text = liveText.value.trim();
    if (!text) return;

    let clips = getClips();
    // Add to beginning
    clips.unshift({
        id: Date.now(),
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    // Keep max 20
    clips = clips.slice(0, 20);
    localStorage.setItem('vn_vault_clips', JSON.stringify(clips));
    renderClips();

    const originalText = btnSaveClip.innerHTML;
    btnSaveClip.innerHTML = "✔ Saved";
    setTimeout(() => { btnSaveClip.innerHTML = originalText; }, 1500);
});

function getClips() {
    try {
        return JSON.parse(localStorage.getItem('vn_vault_clips')) || [];
    } catch {
        return [];
    }
}

function loadSavedClips() {
    renderClips();
}

function renderClips() {
    const clips = getClips();
    clipsList.innerHTML = '';

    if (clips.length === 0) {
        clipsList.innerHTML = '<div class="empty-state">No saved notes yet. Click "Save Note" to pin useful text.</div>';
        return;
    }

    clips.forEach(clip => {
        const item = document.createElement('div');
        item.className = 'clip-item';
        
        const preview = clip.text.length > 120 ? clip.text.substring(0, 120) + '...' : clip.text;
        
        item.innerHTML = `
            <div class="clip-content" title="${clip.text.replace(/"/g, '&quot;')}">${escapeHtml(preview)}</div>
            <div class="clip-actions">
                <button class="icon-btn" title="Paste into editor" data-action="paste">✏️</button>
                <button class="icon-btn" title="Copy" data-action="copy">📋</button>
                <button class="icon-btn" title="Delete" data-action="delete">✕</button>
            </div>
        `;

        item.querySelector('[data-action="paste"]').addEventListener('click', () => {
            liveText.value = clip.text;
            checkLinkPresence(clip.text);
            broadcastData({ type: 'sync-text', text: clip.text });
        });

        item.querySelector('[data-action="copy"]').addEventListener('click', function() {
            navigator.clipboard.writeText(clip.text);
            this.textContent = '✔';
            setTimeout(() => { this.textContent = '📋'; }, 1500);
        });

        item.querySelector('[data-action="delete"]').addEventListener('click', () => {
            const updated = getClips().filter(c => c.id !== clip.id);
            localStorage.setItem('vn_vault_clips', JSON.stringify(updated));
            renderClips();
        });

        clipsList.appendChild(item);
    });
}

btnClearHistory.addEventListener('click', () => {
    if (confirm("Clear all saved notes?")) {
        localStorage.removeItem('vn_vault_clips');
        renderClips();
    }
});

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
