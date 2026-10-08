document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const myIdDisplay = document.getElementById('my-id');
    const copyIdBtn = document.getElementById('copy-id-btn');
    const peerIdInput = document.getElementById('peer-id-input');
    const connectBtn = document.getElementById('connect-btn');
    const btnSolo = document.getElementById('btn-solo');
    const statusText = document.getElementById('connection-status');
    const connectionScreen = document.getElementById('connection-screen');
    const canvasScreen = document.getElementById('canvas-screen');
    const connectedPeersContainer = document.getElementById('connected-peers-container');
    const disconnectBtn = document.getElementById('disconnect-btn');
    
    // Canvas Elements
    const canvas = document.getElementById('drawing-board');
    const ctx = canvas.getContext('2d', { alpha: false });
    const colorBtns = document.querySelectorAll('.color-btn');
    const brushSizeInput = document.getElementById('brush-size');
    const btnClear = document.getElementById('btn-clear');
    const btnUndo = document.getElementById('btn-undo');
    const btnRedo = document.getElementById('btn-redo');

    let peer = null;
    let connections = {}; 
    let myId = '';
    
    // Canvas State
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentColor = '#00E5FF';
    let currentSize = 4;
    
    // History State
    let historyStack = [];
    let redoStack = [];

    function saveState() {
        if (historyStack.length > 20) historyStack.shift(); // Limit history
        historyStack.push(canvas.toDataURL());
        redoStack = []; // Clear redo on new action
    }

    function restoreState(dataUrl) {
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = dataUrl;
    }

    function undo() {
        if (historyStack.length > 0) {
            redoStack.push(canvas.toDataURL());
            restoreState(historyStack.pop());
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            historyStack.push(canvas.toDataURL());
            restoreState(redoStack.pop());
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Background
        ctx.fillStyle = '#0B0C10';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    window.addEventListener('resize', () => {
        // Warning: resizing clears board currently
        resizeCanvas(); 
    });
    resizeCanvas();

    function generateId() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }

    function initPeer() {
        myId = generateId();
        
        peer = new Peer(myId, { debug: 2 });

        peer.on('open', (id) => {
            myIdDisplay.textContent = id;
        });

        peer.on('connection', (connection) => {
            setupConnection(connection);
        });
    }

    function connectToPeer(id) {
        if (!id || id === myId || connections[id]) return;
        statusText.textContent = "Connecting...";
        const connection = peer.connect(id, { reliable: true });
        setupConnection(connection);
    }

    function setupConnection(connection) {
        connection.on('open', () => {
            connections[connection.peer] = connection;
            updatePeersUI();
            enterCanvas();
        });

        connection.on('data', handleIncomingData);
        connection.on('close', () => {
            delete connections[connection.peer];
            updatePeersUI();
        });
    }
    
    function broadcast(data) {
        Object.values(connections).forEach(conn => {
            if (conn.open) conn.send(data);
        });
    }

    function updatePeersUI() {
        const peerIds = Object.keys(connections);
        connectedPeersContainer.innerHTML = '';
        peerIds.forEach(id => {
            const badge = document.createElement('span');
            badge.className = 'connected-badge';
            badge.textContent = id;
            connectedPeersContainer.appendChild(badge);
        });
    }

    function enterCanvas() {
        connectionScreen.classList.remove('active');
        canvasScreen.classList.add('active');
        // Hide mobile footer on canvas
        document.getElementById('mobile-footer').style.display = 'none';
        
        // Ensure canvas fills screen after display:block
        setTimeout(resizeCanvas, 100);
    }

    function exitCanvas() {
        Object.values(connections).forEach(c => c.close());
        connections = {};
        updatePeersUI();
        
        canvasScreen.classList.remove('active');
        connectionScreen.classList.add('active');
        document.getElementById('mobile-footer').style.display = 'block';
        resizeCanvas(); // clear board
    }

    // --- UI Listeners ---
    copyIdBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(myId);
        copyIdBtn.innerHTML = '✔';
        setTimeout(() => copyIdBtn.innerHTML = '📋', 2000);
    });

    connectBtn.addEventListener('click', () => connectToPeer(peerIdInput.value.trim()));
    peerIdInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') connectToPeer(peerIdInput.value.trim()); });
    btnSolo.addEventListener('click', enterCanvas);
    disconnectBtn.addEventListener('click', exitCanvas);

    // --- Drawing Logic ---
    
    function drawStroke(x0, y0, x1, y1, color, size) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();
    }
    
    function handleIncomingData(data) {
        if (data.type === 'draw') {
            drawStroke(data.x0, data.y0, data.x1, data.y1, data.color, data.size);
        } else if (data.type === 'start_stroke') {
            saveState(); // Save state before peer draws
        } else if (data.type === 'clear') {
            saveState();
            ctx.fillStyle = '#0B0C10';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (data.type === 'undo') {
            undo();
        } else if (data.type === 'redo') {
            redo();
        }
    }

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function startDrawing(e) {
        isDrawing = true;
        saveState();
        broadcast({ type: 'start_stroke' });
        
        const pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault(); // prevent scrolling on touch
        
        const pos = getPos(e);
        drawStroke(lastX, lastY, pos.x, pos.y, currentColor, currentSize);
        
        // Broadcast
        broadcast({
            type: 'draw',
            x0: lastX, y0: lastY,
            x1: pos.x, y1: pos.y,
            color: currentColor,
            size: currentSize
        });
        
        lastX = pos.x;
        lastY = pos.y;
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    // --- Tool Listeners ---
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentColor = btn.getAttribute('data-color');
        });
    });

    brushSizeInput.addEventListener('input', (e) => {
        currentSize = e.target.value;
    });

    btnUndo.addEventListener('click', () => {
        undo();
        broadcast({ type: 'undo' });
    });

    btnRedo.addEventListener('click', () => {
        redo();
        broadcast({ type: 'redo' });
    });

    btnClear.addEventListener('click', () => {
        saveState();
        ctx.fillStyle = '#0B0C10';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        broadcast({ type: 'clear' });
    });

    initPeer();
});
